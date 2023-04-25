import useRelayerApproval, {
  RelayerType,
} from '@/composables/approvals/useRelayerApproval';
import useRelayerApprovalTx from '@/composables/approvals/useRelayerApprovalTx';
import useNumbers from '@/composables/useNumbers';
import {
  fiatValueOf,
  isDeep,
  tokenTreeNodes,
} from '@/composables/usePoolHelpers';
import { useTxState } from '@/composables/useTxState';
import {
  HIGH_PRICE_IMPACT,
  REKT_PRICE_IMPACT,
} from '@/constants/poolLiquidity';
import QUERY_KEYS from '@/constants/queryKeys';
import symbolKeys from '@/constants/symbol.keys';
import { hasFetchedPoolsForSor } from '@/lib/balancer.sdk';
import { bnSum, bnum, removeAddress } from '@/lib/utils';
import { safeInject } from '@/providers/inject';
import { useTokens } from '@/providers/tokens.provider';
import { JoinPoolService } from '@/services/balancer/pools/joins/join-pool.service';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { TokenInfoMap } from '@/types/TokenList';
import { TransactionActionInfo } from '@/types/transactions';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { captureException } from '@sentry/browser';
import debounce from 'debounce-promise';
import {
  computed,
  InjectionKey,
  onBeforeMount,
  onMounted,
  provide,
  reactive,
  readonly,
  Ref,
  ref,
  watch,
} from 'vue';
import { useUserSettings } from '../user-settings.provider';
import { useQuery } from '@tanstack/vue-query';
import useTokenApprovalActions from '@/composables/approvals/useTokenApprovalActions';
import { useApp } from '@/composables/useApp';
import { throwQueryError } from '@/lib/utils/queries';

/**
 * TYPES
 */
export type AmountIn = {
  address: string;
  value: string;
  valid: boolean;
};

/**
 *
 * Handles pool joining state and transaction execution.
 */
export const joinPoolProvider = (
  pool: Ref<Pool>,
  queryJoinDebounceMillis = 1000
) => {
  /**
   * STATE
   */
  const isMounted = ref(false);
  const amountsIn = ref<AmountIn[]>([]);
  const bptOut = ref<string>('0');
  const priceImpact = ref<number>(0);
  const highPriceImpactAccepted = ref<boolean>(false);
  const txError = ref<string>('');
  const approvalActions = ref<TransactionActionInfo[]>([]);
  const isSingleAssetJoin = ref<boolean>(false);

  const debounceQueryJoin = debounce(queryJoin, queryJoinDebounceMillis);

  const queryEnabled = computed(
    (): boolean => isMounted.value && !txInProgress.value
  );
  const queryJoinQuery = useQuery<
    Awaited<ReturnType<typeof debounceQueryJoin>>,
    Error
  >(
    QUERY_KEYS.Pools.Joins.QueryJoin(
      // If amountsIn change we should call queryJoin to get expected output.
      amountsIn,
      // If the global pool fetching for the SOR changes it's been set to true. In
      // this case we should re-trigger queryJoin to fetch the expected output for
      // any existing input.
      hasFetchedPoolsForSor,
      isSingleAssetJoin
    ),
    debounceQueryJoin,
    reactive({ enabled: queryEnabled, refetchOnWindowFocus: false })
  );

  /**
   * SERVICES
   */
  const joinPoolService = new JoinPoolService(pool);

  /**
   * COMPOSABLES
   */
  const { getTokens, injectTokens, priceFor } = useTokens();
  const { toFiat } = useNumbers();
  const { slippageBsp } = useUserSettings();
  const { getSigner } = useWeb3();
  const { transactionDeadline } = useApp();
  const { txState, txInProgress, resetTxState } = useTxState();
  const relayerApproval = useRelayerApprovalTx(RelayerType.BATCH);
  const { relayerSignature, relayerApprovalAction } = useRelayerApproval(
    RelayerType.BATCH
  );

  /**
   * COMPUTED
   */
  const isDeepPool = computed((): boolean => isDeep(pool.value));

  // All tokens in the pool token tree that can be used in join functions.
  const joinTokens = computed((): string[] => {
    let addresses: string[] = [];

    addresses = isDeepPool.value
      ? tokenTreeNodes(pool.value.tokens)
      : pool.value.tokensList;

    return removeAddress(pool.value.address, addresses);
  });

  // Token meta data for amountsIn tokens.
  const tokensIn = computed((): TokenInfoMap => {
    return getTokens(amountsIn.value.map(a => a.address));
  });

  // High price impact if value greater than 1%.
  const highPriceImpact = computed((): boolean => {
    return bnum(priceImpact.value).isGreaterThanOrEqualTo(HIGH_PRICE_IMPACT);
  });

  // rekt price impact if value greater than 20%.
  const rektPriceImpact = computed((): boolean => {
    return bnum(priceImpact.value).isGreaterThanOrEqualTo(REKT_PRICE_IMPACT);
  });

  // If price impact is high (> 1%), user has checked acceptance checkbox.
  const hasAcceptedHighPriceImpact = computed((): boolean =>
    highPriceImpact.value ? highPriceImpactAccepted.value : true
  );

  // Checks if all amountsIn are valid inputs.
  const hasValidInputs = computed(
    (): boolean =>
      amountsIn.value.every(amountIn => amountIn.valid === true) &&
      hasAcceptedHighPriceImpact.value
  );

  // Checks if amountsIn has any values > 0.
  const hasAmountsIn = computed(() =>
    amountsIn.value.some(amountIn => bnum(amountIn.value).gt(0))
  );

  // amountsIn with value greater than 0.
  const amountsInWithValue = computed((): AmountIn[] =>
    amountsIn.value.filter(amountIn => bnum(amountIn.value).gt(0))
  );

  // If we don't have price for an amountIn that has a value greater than 0.
  const missingPricesIn = computed(
    (): boolean =>
      !amountsInWithValue.value.every(amountIn =>
        bnum(priceFor(amountIn.address)).gt(0)
      )
  );

  // Calculates total fiat value in for all amountsIn with Coingecko prices.
  const fiatValueIn = computed((): string => {
    const fiatValuesIn = amountsIn.value.map(amountIn =>
      toFiat(amountIn.value || 0, amountIn.address)
    );
    return bnSum(fiatValuesIn).toString();
  });

  // Calculates estimated fiatValueOut using pool's totalLiquity.
  // Could be inaccurate if total liquidity has come from subgraph.
  const fiatValueOut = computed((): string =>
    fiatValueOf(pool.value, bptOut.value)
  );

  const shouldSignRelayer = computed(
    (): boolean =>
      isDeepPool.value &&
      !isSingleAssetJoin.value &&
      // Check if Batch Relayer is either approved, or signed
      !(relayerApproval.isUnlocked.value || relayerSignature.value)
  );

  const tokensToApprove = computed(() => {
    return amountsIn.value.map(amountIn => amountIn.address);
  });
  const amountsToApprove = computed(() => {
    return amountsIn.value.map(amountIn => amountIn.value);
  });
  const { getTokenApprovalActions } = useTokenApprovalActions(
    tokensToApprove,
    amountsToApprove
  );

  const isLoadingQuery = computed(
    (): boolean => queryJoinQuery.isFetching.value
  );

  const queryError = computed(
    (): string | undefined => queryJoinQuery.error.value?.message
  );

  /**
   * METHODS
   */

  /**
   * Sets full amountsIn state.
   *
   * @param {AmountIn[]} _amountsIn - Array of amounts in: token address, value
   * & input validity.
   */
  function setAmountsIn(_amountsIn: AmountIn[]) {
    amountsIn.value = _amountsIn;
  }

  /**
   * Adds amountsIn with no value for array of token addresses.
   *
   * @param {string[]} tokensIn - Array of token addresses.
   */
  function addTokensIn(tokensIn: string[]) {
    tokensIn.forEach(address =>
      amountsIn.value.push({ address, value: '', valid: true })
    );
  }

  /**
   * Resets all amounts in amountsIn state to have no value.
   */
  function resetAmounts() {
    amountsIn.value.forEach((_, i) => {
      amountsIn.value[i].value = '';
    });
  }

  /**
   * Resets previous joinQuery results
   */
  function resetQueryJoinState() {
    bptOut.value = '0';
    priceImpact.value = 0;
    queryJoinQuery.remove();
  }

  // Updates the approval actions like relayer approval and token approvals.
  function setApprovalActions() {
    const tokenApprovalActions = getTokenApprovalActions();
    approvalActions.value = shouldSignRelayer.value
      ? [relayerApprovalAction.value, ...tokenApprovalActions]
      : tokenApprovalActions;
  }

  /**
   * Simulate join transaction to get expected output and calculate price impact.
   */
  async function queryJoin() {
    // If form is empty or inputs are not valid, clear the price impact and
    // return early
    if (!hasAmountsIn.value) {
      priceImpact.value = 0;
      return null;
    }

    try {
      joinPoolService.setJoinHandler(isSingleAssetJoin.value);
      setApprovalActions();

      const output = await joinPoolService.queryJoin({
        amountsIn: amountsInWithValue.value,
        tokensIn: tokensIn.value,
        signer: getSigner(),
        slippageBsp: slippageBsp.value,
        relayerSignature: relayerSignature.value,
        approvalActions: approvalActions.value,
        transactionDeadline: transactionDeadline.value,
      });

      bptOut.value = output.bptOut;
      priceImpact.value = output.priceImpact;

      return output;
    } catch (error) {
      captureException(error);
      throwQueryError('Failed to construct join.', error);
    }
  }

  /**
   * Executes join transaction.
   */
  async function join(): Promise<TransactionResponse> {
    try {
      txError.value = '';
      joinPoolService.setJoinHandler(isSingleAssetJoin.value);
      setApprovalActions();

      return joinPoolService.join({
        amountsIn: amountsInWithValue.value,
        tokensIn: tokensIn.value,
        signer: getSigner(),
        slippageBsp: slippageBsp.value,
        relayerSignature: relayerSignature.value,
        approvalActions: approvalActions.value,
        transactionDeadline: transactionDeadline.value,
      });
    } catch (error) {
      txError.value = (error as Error).message;
      throw new Error('Failed to submit join transaction.', { cause: error });
    }
  }

  function setIsSingleAssetJoin(value: boolean) {
    isSingleAssetJoin.value = value;
  }

  /**
   * WATCHERS
   */

  // If singleAssetJoin is toggled we need to reset previous query state. queryJoin
  // will be re-triggered by the amountsIn state change. We also need to call
  // setJoinHandler on the joinPoolService to update the join handler.
  watch(isSingleAssetJoin, newVal => {
    resetQueryJoinState();
    joinPoolService.setJoinHandler(newVal);
  });

  /**
   * LIFECYCLE
   */
  onBeforeMount(() => {
    // Ensure prices are fetched for token tree. When pool architecture is
    // refactoted probably won't be required.
    injectTokens(joinTokens.value);
  });

  onMounted(() => (isMounted.value = true));

  return {
    // State
    amountsIn,
    highPriceImpactAccepted,
    txState,
    pool: readonly(pool),
    isSingleAssetJoin: readonly(isSingleAssetJoin),
    bptOut: readonly(bptOut),
    priceImpact: readonly(priceImpact),
    txError: readonly(txError),

    //  Computed
    isLoadingQuery,
    queryError,
    joinTokens,
    highPriceImpact,
    rektPriceImpact,
    hasAcceptedHighPriceImpact,
    hasValidInputs,
    hasAmountsIn,
    fiatValueIn,
    fiatValueOut,
    txInProgress,
    approvalActions,
    missingPricesIn,

    // Methods
    setAmountsIn,
    addTokensIn,
    resetAmounts,
    join,
    resetTxState,
    setIsSingleAssetJoin,

    // queries
    queryJoinQuery,
  };
};

export type JoinPoolProviderResponse = ReturnType<typeof joinPoolProvider>;
export const JoinPoolProviderSymbol: InjectionKey<JoinPoolProviderResponse> =
  Symbol(symbolKeys.Providers.JoinPool);

export function provideJoinPool(pool: Ref<Pool>) {
  const joinPoolResponse = isDeep(pool.value) ? joinPoolProvider(pool) : {};
  provide(JoinPoolProviderSymbol, joinPoolResponse);
  return joinPoolResponse;
}

export const useJoinPool = (): JoinPoolProviderResponse => {
  return safeInject(JoinPoolProviderSymbol);
};
