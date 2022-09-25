<template>
  <div>
    <div noPad class="relative mb-2 overflow-auto">
      <div class="my-0.5 mx-2 flex justify-between">
        <div class="summary">Minimum Received</div>
        <div class="summary-stat">{{ summary.totalWithSlippage }}</div>
      </div>
      <div class="my-0.5 mx-2 flex justify-between">
        <div class="summary">Price Impact</div>
        <div class="slippage">
          {{ fNum2(trading.sor.priceImpact.value, FNumFormats.percent) }}
        </div>
      </div>
      <div class="my-0.5 mx-2 flex justify-between">
        <div class="summary">Liquidity Provider Fee</div>
        <div class="summary-stat">{{ summary.tradeFees }}</div>
      </div>
      <div class="my-0.5 mx-2 flex justify-between">
        <div class="summary">Routed Via</div>
        <div class="routed">Standard AMM</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUnits } from '@ethersproject/units';
import { mapValues } from 'lodash';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TradeRoute from '@/components/cards/TradeCard/TradeRoute.vue';
import { TradeQuote } from '@/composables/trade/types';
import useRelayerApproval, {
  Relayer,
} from '@/composables/trade/useRelayerApproval';
import useTokenApproval from '@/composables/trade/useTokenApproval';
import { UseTrading } from '@/composables/trade/useTrading';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import useUserSettings from '@/composables/useUserSettings';
import { FiatCurrency } from '@/constants/currency';
import { bnum } from '@/lib/utils';
import { isStETH } from '@/lib/utils/balancer/lido';
import { getWrapAction, WrapType } from '@/lib/utils/balancer/wrapper';
import useWeb3 from '@/services/web3/useWeb3';

const PRICE_UPDATE_THRESHOLD = 0.02;

export default defineComponent({
  components: {
    TradeRoute,
  },
  props: {
    trading: {
      type: Object as PropType<UseTrading>,
      required: true,
    },
  },
  emits: ['trade', 'close'],
  setup(props, { emit }) {
    // COMPOSABLES
    const { t } = useI18n();
    const { fNum2, toFiat } = useNumbers();
    const { tokens, approvalRequired } = useTokens();
    const { blockNumber } = useWeb3();
    const { slippage } = useUserSettings();

    // state
    const lastQuote = ref<TradeQuote | null>(
      props.trading.isWrapUnwrapTrade.value ? null : props.trading.getQuote()
    );
    const priceUpdated = ref(false);
    const priceUpdateAccepted = ref(false);

    // DATA
    const showSummaryInFiat = ref(false);

    // COMPUTED
    const slippageRatePercent = computed(() =>
      fNum2(slippage.value, FNumFormats.percent)
    );

    const addressIn = computed(() => props.trading.tokenIn.value.address);

    const tokenInFiatValue = computed(() =>
      fNum2(
        toFiat(
          props.trading.tokenInAmountInput.value,
          props.trading.tokenIn.value.address
        ),
        FNumFormats.fiat
      )
    );

    const tokenOutFiatValue = computed(() =>
      fNum2(
        toFiat(
          props.trading.tokenOutAmountInput.value,
          props.trading.tokenOut.value.address
        ),
        FNumFormats.fiat
      )
    );

    const showTradeRoute = computed(() => props.trading.isBalancerTrade.value);

    const zeroFee = computed(() =>
      showSummaryInFiat.value ? fNum2('0', FNumFormats.fiat) : '0.0 ETH'
    );

    const summary = computed(() => {
      const summaryItems = {
        amountBeforeFees: '',
        tradeFees: '',
        totalWithoutSlippage: '',
        totalWithSlippage: '',
        slippage: '',
      };

      const exactIn = props.trading.exactIn.value;

      const tokenIn = props.trading.tokenIn.value;
      const tokenOut = props.trading.tokenOut.value;

      const tokenInAmountInput = props.trading.tokenInAmountInput.value;
      const tokenOutAmountInput = props.trading.tokenOutAmountInput.value;

      if (props.trading.isWrapUnwrapTrade.value) {
        summaryItems.amountBeforeFees = tokenInAmountInput;
        summaryItems.tradeFees = '0';
        summaryItems.totalWithoutSlippage = tokenInAmountInput;
        summaryItems.totalWithSlippage = tokenInAmountInput;
        summaryItems.totalWithSlippage = '0';
      } else {
        const quote = props.trading.getQuote();

        if (exactIn) {
          summaryItems.amountBeforeFees = tokenOutAmountInput;
          summaryItems.tradeFees = formatUnits(
            quote.feeAmountOutToken,
            tokenOut.decimals
          );
          summaryItems.totalWithoutSlippage = bnum(
            summaryItems.amountBeforeFees
          )
            .minus(summaryItems.tradeFees)
            .toString();
          summaryItems.totalWithSlippage = formatUnits(
            quote.minimumOutAmount,
            tokenOut.decimals
          );
        } else {
          summaryItems.amountBeforeFees = tokenInAmountInput;
          summaryItems.tradeFees = formatUnits(
            quote.feeAmountInToken,
            tokenIn.decimals
          );
          summaryItems.totalWithoutSlippage = bnum(
            summaryItems.amountBeforeFees
          )
            .plus(summaryItems.tradeFees)
            .toString();
          summaryItems.totalWithSlippage = formatUnits(
            quote.maximumInAmount,
            tokenIn.decimals
          );
        }
        summaryItems.slippage = (
          Number(summaryItems.totalWithSlippage) /
          Number(summaryItems.totalWithoutSlippage)
        )
          .toFixed(2)
          .toString();
      }

      if (showSummaryInFiat.value) {
        return mapValues(
          summaryItems,
          itemValue =>
            `${fNum2(
              toFiat(itemValue, exactIn ? tokenOut.address : tokenIn.address),
              FNumFormats.fiat
            )}`
        );
      } else {
        return mapValues(
          summaryItems,
          itemValue =>
            `${fNum2(itemValue, FNumFormats.token)} ${
              exactIn || props.trading.isWrapUnwrapTrade.value
                ? tokenOut.symbol
                : tokenIn.symbol
            }`
        );
      }
    });

    const labels = computed(() => {
      if (props.trading.isWrap.value) {
        return {
          modalTitle: t('previewWrap', [props.trading.tokenIn.value.symbol]),
          confirmTrade: t('confirmWrap', [props.trading.tokenIn.value.symbol]),
          tradeSummary: {
            title: t('tradeSummary.wrap.title'),
            tradeFees: t('tradeSummary.wrap.tradeFees'),
            totalBeforeFees: t('tradeSummary.wrap.totalBeforeFees'),
            totalAfterFees: t('tradeSummary.wrap.totalAfterFees'),
            totalWithSlippage: t('tradeSummary.wrap.totalWithSlippage', [
              props.trading.tokenIn.value.symbol,
            ]),
          },
        };
      } else if (props.trading.isUnwrap.value) {
        return {
          modalTitle: t('previewUnwrap', [props.trading.tokenOut.value.symbol]),
          confirmTrade: t('confirmUnwrap', [
            props.trading.tokenOut.value.symbol,
          ]),
          tradeSummary: {
            title: t('tradeSummary.unwrap.title'),
            tradeFees: t('tradeSummary.unwrap.tradeFees'),
            totalBeforeFees: t('tradeSummary.unwrap.totalBeforeFees'),
            totalAfterFees: t('tradeSummary.unwrap.totalAfterFees'),
            totalWithSlippage: t('tradeSummary.unwrap.totalWithSlippage', [
              props.trading.tokenOut.value.symbol,
            ]),
          },
        };
      } else if (props.trading.exactIn.value) {
        return {
          modalTitle: t('previewTrade'),
          confirmTrade: t('confirmTrade'),
          tradeSummary: {
            title: t('tradeSummary.exactIn.title', [
              props.trading.tokenIn.value.symbol,
            ]),
            tradeFees: t('tradeSummary.exactIn.tradeFees'),
            totalBeforeFees: t('tradeSummary.exactIn.totalBeforeFees'),
            totalAfterFees: t('tradeSummary.exactIn.totalAfterFees'),
            totalWithSlippage: t('tradeSummary.exactIn.totalWithSlippage', [
              slippageRatePercent.value,
            ]),
          },
        };
      }
      // exact out
      return {
        modalTitle: t('previewTrade'),
        confirmTrade: t('confirmTrade'),
        tradeSummary: {
          title: t('tradeSummary.exactOut.title', [
            props.trading.tokenOut.value.symbol,
          ]),
          tradeFees: t('tradeSummary.exactOut.tradeFees'),
          totalBeforeFees: t('tradeSummary.exactOut.totalBeforeFees'),
          totalAfterFees: t('tradeSummary.exactOut.totalAfterFees'),
          totalWithSlippage: t('tradeSummary.exactOut.totalWithSlippage', [
            slippageRatePercent.value,
          ]),
        },
      };
    });

    const tokenApproval = useTokenApproval(
      addressIn,
      props.trading.tokenInAmountInput,
      tokens
    );

    const gnosisRelayerApproval = useRelayerApproval(
      Relayer.GNOSIS,
      props.trading.isGnosisTrade
    );

    const wrapType = computed(() =>
      getWrapAction(
        props.trading.tokenIn.value.address,
        props.trading.tokenOut.value.address
      )
    );

    const isStETHTrade = computed(
      () =>
        isStETH(addressIn.value, props.trading.tokenOut.value.address) &&
        wrapType.value === WrapType.NonWrap
    );

    const lidoRelayerApproval = useRelayerApproval(Relayer.LIDO, isStETHTrade);

    const requiresTokenApproval = computed(() => {
      if (props.trading.isWrap.value && !props.trading.isEthTrade.value) {
        return approvalRequired(
          props.trading.tokenIn.value.address,
          props.trading.tokenInAmountInput.value,
          props.trading.tokenOut.value.address
        );
      } else if (props.trading.requiresTokenApproval.value) {
        return !tokenApproval.isUnlockedV2.value;
      }
      return false;
    });

    const requiresGnosisRelayerApproval = computed(
      () =>
        props.trading.isGnosisTrade.value &&
        props.trading.requiresTokenApproval.value &&
        !gnosisRelayerApproval.isUnlocked.value
    );

    const requiresLidoRelayerApproval = computed(
      () =>
        props.trading.isBalancerTrade.value &&
        !lidoRelayerApproval.isUnlocked.value
    );

    const showTokenApprovalStep = computed(
      () =>
        requiresTokenApproval.value ||
        tokenApproval.approved.value ||
        tokenApproval.approving.value
    );

    const showGnosisRelayerApprovalStep = computed(
      () =>
        requiresGnosisRelayerApproval.value ||
        gnosisRelayerApproval.init.value ||
        gnosisRelayerApproval.approved.value ||
        gnosisRelayerApproval.approving.value
    );

    const showLidoRelayerApprovalStep = computed(
      () =>
        requiresLidoRelayerApproval.value ||
        lidoRelayerApproval.init.value ||
        lidoRelayerApproval.approved.value ||
        lidoRelayerApproval.approving.value
    );

    const totalRequiredTransactions = computed(() => {
      let txCount = 1; // trade
      if (showTokenApprovalStep.value) {
        txCount++;
      }

      if (showGnosisRelayerApprovalStep.value) {
        txCount++;
      } else if (showLidoRelayerApprovalStep.value) {
        txCount++;
      }

      return txCount;
    });

    const activeTransactionType = computed<
      | 'gnosisRelayerApproval'
      | 'lidoRelayerApproval'
      | 'tokenApproval'
      | 'trade'
    >(() => {
      if (requiresGnosisRelayerApproval.value) {
        return 'gnosisRelayerApproval';
      }
      if (requiresLidoRelayerApproval.value) {
        return 'lidoRelayerApproval';
      }
      if (requiresTokenApproval.value) {
        return 'tokenApproval';
      }
      return 'trade';
    });

    const requiresApproval = computed(
      () =>
        requiresGnosisRelayerApproval.value ||
        requiresLidoRelayerApproval.value ||
        requiresTokenApproval.value
    );

    const showPriceUpdateError = computed(
      () =>
        !requiresApproval.value &&
        priceUpdated.value &&
        !priceUpdateAccepted.value
    );

    const tradeDisabled = computed(
      () => requiresApproval.value || showPriceUpdateError.value
    );

    // METHODS
    function trade() {
      emit('trade');
    }

    function onClose() {
      emit('close');
    }

    function cofirmPriceUpdate() {
      priceUpdated.value = false;
      priceUpdateAccepted.value = true;
      lastQuote.value = props.trading.getQuote();
    }

    function handlePriceUpdate() {
      if (lastQuote.value != null) {
        const newQuote = props.trading.getQuote();

        /**
         * The bignumber returned via the quotes for some reason throw underflow
         * errors when attempting to use the gt function with the threshold value.
         * For that reason, the price difference has to be cast to our bignumber type.
         */
        if (props.trading.exactIn.value) {
          const priceDiff = lastQuote.value.minimumOutAmount
            .sub(newQuote.minimumOutAmount)
            .abs()
            .div(lastQuote.value.minimumOutAmount);

          priceUpdated.value = bnum(priceDiff.toString()).gt(
            PRICE_UPDATE_THRESHOLD
          );
        } else {
          const priceDiff = lastQuote.value.maximumInAmount
            .sub(newQuote.maximumInAmount)
            .abs()
            .div(lastQuote.value.maximumInAmount);

          priceUpdated.value = bnum(priceDiff.toString()).gt(
            PRICE_UPDATE_THRESHOLD
          );
        }

        if (priceUpdated.value) {
          priceUpdateAccepted.value = false;
        }
      }
    }

    async function approveToken(): Promise<void> {
      if (props.trading.isWrap.value && !props.trading.isEthTrade.value) {
        // If we're wrapping a token other than native ETH
        // we need to approve the underlying on the wrapper
        await tokenApproval.approveSpender(
          props.trading.tokenOut.value.address
        );
      } else {
        await tokenApproval.approveV2();
      }
    }

    // WATCHERS
    watch(blockNumber, () => {
      handlePriceUpdate();
    });
    console.log(summary);
    return {
      // constants
      FiatCurrency,
      FNumFormats,

      // methods
      fNum2,
      onClose,
      trade,
      cofirmPriceUpdate,

      // computed
      tokenInFiatValue,
      tokenOutFiatValue,
      summary,
      showSummaryInFiat,
      slippageRatePercent,
      showTradeRoute,
      labels,
      zeroFee,
      priceUpdated,
      tradeDisabled,
      showPriceUpdateError,
      totalRequiredTransactions,
      requiresApproval,
      gnosisRelayerApproval,
      lidoRelayerApproval,
      tokenApproval,
      requiresTokenApproval,
      requiresGnosisRelayerApproval,
      requiresLidoRelayerApproval,
      approveToken,
      showTokenApprovalStep,
      showGnosisRelayerApprovalStep,
      showLidoRelayerApprovalStep,
      activeTransactionType,

      // consants
      PRICE_UPDATE_THRESHOLD,
    };
  },
});
</script>
<style scoped>
.arrow-down {
  @apply absolute right-0 mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white
    dark:border-gray-800 dark:bg-gray-800;

  transform: translateY(-50%);
}

.summary-item-row {
  @apply mb-1 flex justify-between;
}

.step {
  @apply relative flex h-7 w-7 items-center justify-center rounded-full border
    border-gray-100 text-purple-500 dark:border-gray-700;
}

.step-seperator {
  @apply h-px w-6 bg-gray-200 dark:bg-gray-700;
}

.step-active {
  @apply border-purple-500 dark:border-purple-500;
}

.step-approved {
  @apply border-green-500 dark:border-green-500;
}

.summary {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #b9babb;
}

.summary-stat {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #ffffff;
}

.slippage {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #20b961;
}

.routed {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #f2994a;
}
</style>
