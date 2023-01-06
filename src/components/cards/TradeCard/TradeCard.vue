<template>
  <BalCard
    noPad
    noBorder
    class="card-container relative"
    :shadow="tradeCardShadow"
  >
    <template #header >
      <div class="header mb-[12px] flex w-full items-center justify-between" >
        <h4 class="title ml-[18px] mt-[14px]" >{{ title }}</h4>
        <TradeSettingsPopover
          :context="TradeSettingsContext.trade"
          :isGasless="trading.tradeGasless.value"
        />
      </div>
    </template>
    <div>
      <TradePair
        v-model:tokenInAmount="tokenInAmount"
        v-model:tokenInAddress="tokenInAddress"
        v-model:tokenOutAmount="tokenOutAmount"
        v-model:tokenOutAddress="tokenOutAddress"
        v-model:exactIn="exactIn"
        :tradeLoading="
          trading.isBalancerTrade.value ? trading.isLoading.value : false
        "
        :effectivePriceMessage="trading.effectivePriceMessage"
        class="mb-[12px]"
        @amount-change="trading.handleAmountChange"
      />
      <BalAlert
        v-if="error"
        class="mb-[12px]"
        type="error"
        size="sm"
        :title="error.header"
        :description="error.body"
        :actionLabel="error.label"
        block
        @action-click="handleErrorButtonClick"
      />
      <BalAlert
        v-else-if="warning"
        class="mb-[12px]"
        type="warning"
        size="sm"
        :title="warning.header"
        :description="warning.body"
        block
      />
      <div class="mx-[12px] mb-[12px]">
      <BalBtn
        v-if="trading.isLoading.value"
        loading
        disabled
        :loadingLabel="
          trading.isGnosisTrade.value ? $t('loadingBestPrice') : $t('loading')
        "
        class="font-semibold"
        block
      />
      <button
        v-else-if="tokenInAmount == 0 && tokenOutAmount == 0 && account"
        :disabled="true"
        class="amount-button font-semibold"
      >
        Enter an amount
      </button>
      <button
        v-else-if="account"
        :disabled="false"
        @click="handlePreviewButton"
        class="swap-button text-[16px] font-semibold"
      >
        Swap
      </button>
      <button
        v-else
        class="connect-wallet font-semibold"
        @click="startConnectWithInjectedProvider"
      >
        Connect Wallet
      </button>
      </div>

      <div
        v-if="
          tokenInAddress &&
          tokenOutAddress &&
          tokenInAmount > 0 &&
          tokenOutAmount > 0
        "
        class="stats"
      >
        
        <div class="p-[16px]">
          <TradePreviewModalGP
            :trading="trading"
            @trade="trade"
            @close="handlePreviewModalClose"
          />
          <div  />
          <div class=""><div class="mx-[8px] my-[22px] border"></div></div>
          <TradeRoute
            :addressIn="trading.tokenIn.value.address"
            :amountIn="trading.tokenInAmountInput.value"
            :addressOut="trading.tokenOut.value.address"
            :amountOut="trading.tokenOutAmountInput.value"
            :pools="trading.sor.pools.value"
            :sorReturn="trading.sor.sorReturn.value"
            class=""
          />
        </div>
      </div>
    </div>
  </BalCard>
  <teleport to="#modal">
    <ConfirmSwapModal
      v-if="modalTradePreviewIsOpen"
      :trading="trading"
      @trade="trade"
      @close="handlePreviewModalClose"
    />
  </teleport>
</template>

<script lang="ts">
import { getAddress, isAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import TradePreviewModalGP from '@/components/modals/TradePreviewModalGP.vue';
import TradeSettingsPopover, {
  TradeSettingsContext,
} from '@/components/popovers/TradeSettingsPopover.vue';
import { useTradeState } from '@/composables/trade/useTradeState';
import useTrading from '@/composables/trade/useTrading';
import useValidation, {
  TradeValidation,
} from '@/composables/trade/useValidation';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { TOKENS } from '@/constants/tokens';
import { lsGet } from '@/lib/utils';
import { WrapType } from '@/lib/utils/balancer/wrapper';
import { isRequired } from '@/lib/utils/validations';
import { ApiErrorCodes } from '@/services/gnosis/errors/OperatorError';
import useWeb3 from '@/services/web3/useWeb3';

import TradePair from './TradePair.vue';
import TradeRoute from './TradeRoute.vue';

import ConfirmSwapModal from './ConfirmSwapModal.vue';

export default defineComponent({
  components: {
    TradePair,
    TradePreviewModalGP,
    TradeRoute,
    TradeSettingsPopover,
    ConfirmSwapModal,
  },

  setup() {
    // COMPOSABLES
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();
    const { bp } = useBreakpoints();
    const { fNum2 } = useNumbers();
    const { appNetworkConfig } = useWeb3();
    const { nativeAsset } = useTokens();
    const { account, startConnectWithInjectedProvider } = useWeb3();
    const {
      tokenInAddress,
      tokenOutAddress,
      tokenInAmount,
      tokenOutAmount,
      setTokenInAddress,
      setTokenOutAddress,
      setInitialized,
    } = useTradeState();
    // DATA
    const exactIn = ref(true);
    const modalTradePreviewIsOpen = ref(false);
    const dismissedErrors = ref({
      highPriceImpact: false,
    });
    const alwaysShowRoutes = lsGet('alwaysShowRoutes', false);
    const tradeCardShadow = computed(() => {
      switch (bp.value) {
        case 'xs':
          return 'none';
        case 'sm':
          return 'lg';
        default:
          return 'xl';
      }
    });
    const trading = useTrading(
      exactIn,
      tokenInAddress,
      tokenInAmount,
      tokenOutAddress,
      tokenOutAmount
    );
    console.log(trading);

    // COMPUTED
    const { errorMessage } = useValidation(
      tokenInAddress,
      tokenInAmount,
      tokenOutAddress,
      tokenOutAmount
    );
    const isHighPriceImpact = computed(
      () =>
        trading.sor.validationErrors.value.highPriceImpact &&
        !dismissedErrors.value.highPriceImpact
    );
    const tradeDisabled = computed(() => {
      const hasValidationError = errorMessage.value !== TradeValidation.VALID;
      const hasGnosisErrors =
        trading.isGnosisTrade.value && trading.gnosis.hasValidationError.value;
      const hasBalancerErrors =
        trading.isBalancerTrade.value && isHighPriceImpact.value;
      return hasValidationError || hasGnosisErrors || hasBalancerErrors;
    });
    const title = computed(() => {
      if (trading.wrapType.value === WrapType.Wrap) {
        return `${t('wrap')} ${trading.tokenIn.value.symbol}`;
      }
      if (trading.wrapType.value === WrapType.Unwrap) {
        return `${t('unwrap')} ${trading.tokenOut.value.symbol}`;
      }
      return t('Swap');
    });
    const error = computed(() => {
      console.log(tokenInAddress.value);
      if (
        (tokenInAddress.value == '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d' ||
          tokenOutAddress.value ==
            '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d' ||
          tokenInAddress.value ==
            '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30' ||
          tokenOutAddress.value ==
            '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30') &&
        !(
          (tokenInAddress.value ==
            '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d' ||
            tokenInAddress.value ==
              '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6') &&
          (tokenOutAddress.value ==
            '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d' ||
            tokenOutAddress.value ==
              '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6')
        ) &&
        !(
          (tokenInAddress.value ==
            '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30' ||
            tokenInAddress.value ==
              '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465') &&
          (tokenOutAddress.value ==
            '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30' ||
            tokenOutAddress.value ==
              '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465')
        )
      ) {
        return {
          header: 'Your tokens are not wrapped!',
          body: 'You need to wrap your NEAR/STNEAR to pNEAR/pSTNEAR!',
        };
      } else if (trading.isBalancerTrade.value && !trading.isLoading.value) {
        if (errorMessage.value === TradeValidation.NO_LIQUIDITY) {
          return {
            header: t('insufficientLiquidity'),
            body: t('insufficientLiquidityDetailed'),
          };
        }
      }
      if (trading.isGnosisTrade.value) {
        if (trading.gnosis.validationError.value != null) {
          const validationError = trading.gnosis.validationError.value;
          if (validationError === ApiErrorCodes.SellAmountDoesNotCoverFee) {
            return {
              header: t('gnosisErrors.lowAmount.header'),
              body: t('gnosisErrors.lowAmount.body'),
            };
          } else if (validationError === ApiErrorCodes.PriceExceedsBalance) {
            return {
              header: t('gnosisErrors.lowBalance.header', [
                trading.tokenIn.value.symbol,
              ]),
              body: t('gnosisErrors.lowBalance.body', [
                trading.tokenIn.value.symbol,
                fNum2(
                  formatUnits(
                    trading.getQuote().maximumInAmount,
                    trading.tokenIn.value.decimals
                  ),
                  FNumFormats.token
                ),
                fNum2(trading.slippageBufferRate.value, FNumFormats.percent),
              ]),
            };
          } else if (validationError === ApiErrorCodes.NoLiquidity) {
            return {
              header: t('gnosisErrors.noLiquidity.header', [
                trading.tokenIn.value.symbol,
              ]),
              body: t('gnosisErrors.noLiquidity.body'),
            };
          } else {
            return {
              header: t('gnosisErrors.genericError.header'),
              body: trading.gnosis.validationError.value,
            };
          }
        }
      } else if (trading.isBalancerTrade.value) {
        if (isHighPriceImpact.value) {
          return {
            header: t('highPriceImpact'),
            body: t('highPriceImpactDetailed'),
            label: t('accept'),
          };
        }
      }
      return undefined;
    });
    const warning = computed(() => {
      if (trading.isGnosisTrade.value) {
        if (trading.gnosis.warnings.value.highFees) {
          return {
            header: t('gnosisWarnings.highFees.header'),
            body: t('gnosisWarnings.highFees.body'),
          };
        }
      }
      return undefined;
    });
    // WATCHERS
    watch(trading.isLoading, newVal => {
      if (!newVal) {
        trading.handleAmountChange();
      }
    });
    // METHODS
    function trade() {
      trading.trade(() => {
        trading.resetAmounts();
        modalTradePreviewIsOpen.value = false;
      });
    }
    function handleErrorButtonClick() {
      if (trading.sor.validationErrors.value.highPriceImpact) {
        dismissedErrors.value.highPriceImpact = true;
      }
    }
    async function populateInitialTokens(): Promise<void> {
      let assetIn = router.currentRoute.value.params.assetIn as string;
      if (assetIn === nativeAsset.deeplinkId) {
        assetIn = nativeAsset.address;
      } else if (isAddress(assetIn)) {
        assetIn = getAddress(assetIn);
      }
      let assetOut = router.currentRoute.value.params.assetOut as string;
      if (assetOut === nativeAsset.deeplinkId) {
        assetOut = nativeAsset.address;
      } else if (isAddress(assetOut)) {
        assetOut = getAddress(assetOut);
      }
      setTokenInAddress(assetIn || store.state.trade.inputAsset);
      setTokenOutAddress(assetOut || store.state.trade.outputAsset);
      setTokenOutAddress('');
    }
    function switchToWETH() {
      tokenInAddress.value = appNetworkConfig.addresses.weth;
    }
    function handlePreviewButton() {
      trading.resetSubmissionError();
      modalTradePreviewIsOpen.value = true;
    }
    function handlePreviewModalClose() {
      trading.resetSubmissionError();
      modalTradePreviewIsOpen.value = false;
    }
    // INIT
    onBeforeMount(() => {
      populateInitialTokens();
      // setInitialized(true);
    });
    return {
      // constants
      TOKENS,
      // context
      TradeSettingsContext,
      // data
      tokenInAddress,
      tokenInAmount,
      tokenOutAddress,
      tokenOutAmount,
      modalTradePreviewIsOpen,
      alwaysShowRoutes,
      exactIn,
      trading,
      account,
      // computed
      title,
      error,
      warning,
      errorMessage,
      isRequired,
      tradeDisabled,
      tradeCardShadow,
      handlePreviewButton,
      handlePreviewModalClose,
      // methods
      trade,
      switchToWETH,
      handleErrorButtonClick,
      startConnectWithInjectedProvider,
    };
  },
});
</script>
<style scoped>
.amount-button {
  background: #261737;
  border-radius: 12px;
  width: 100%;
  padding: 12px 0px;
  gap: 12px;
  left: 10px;
  top: 259px;
  color: #f5e1ff;
  font-size: 20px;
  line-height: 26px;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}

/* This is needed because the trade settings popover overflows */
.card-container {
  overflow: unset;
  background-color: #292043;
  /* width: 480px; */
}

.trade-gasless :deep(.bal-toggle) {
  width: 3rem;
}

.gas-symbol {
  @apply flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-lg dark:bg-gray-800;
}

.gas-symbol::before {
  content: '⛽';
}

.signature-symbol::before {
  content: '✍️';
}


.connect-wallet {
  padding: 10px 0px;
  gap: 12px;
  left: 12px;
  top: 226px;

  background: #41365E;
  border-radius: 12px;
  color: #A99BC6;

  width: 100%;
}

.connect-wallet:hover {

  box-shadow: inset -2px -2px 4px rgba(117, 92, 140, 0.3), inset 2px 2px 4px #010001;
}

.connect-wallet:active {
  background: linear-gradient(
    94.14deg,
    rgba(47, 22, 53, 0.5) 23.11%,
    rgba(52, 25, 58, 0.405) 81.52%
  );
  border-radius: 12px;
}

.swap-button {
  padding: 12px 0px;
  gap: 12px;
  left: 10px;

  background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  border-radius: 12px;
  width: 100%;
}

.swap-button:hover {
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  border-radius: 12px;
}

.swap-button:active {
  background: radial-gradient(
      49.66% 488.58% at 50% 30%,
      rgba(123, 48, 127, 0.5) 0%,
      rgba(123, 48, 127, 0.405) 100%
    )
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  border-radius: 12px;
}



.price {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  color: #b9babb;
  padding-bottom: 1em;
  padding-left: 1em;
}

.stats {
  margin-top: 1em !important;
}
.border{
  border: 0.5px solid rgba(59, 68, 189, 0.4);
}

</style>
