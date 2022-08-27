<template>
  <BalCard
    class="relative card-container px-[10px] py-[12px]"
    :shadow="tradeCardShadow"
    noBorder
  >
    <template #header>
      <div class="flex justify-between items-center w-full header mb-[12px]">
        <h4 class="title ml-[10px]">{{ title }}</h4>
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
        class="p-3 mb-[12px]"
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
        class="p-3 mb-[12px]"
        type="warning"
        size="sm"
        :title="warning.header"
        :description="warning.body"
        block
      />
      <div
        v-if="
          tokenInAddress &&
          tokenOutAddress &&
          tokenInAmount > 0 &&
          tokenOutAmount > 0
        "
        class="price"
      >
        Price:
        {{
          trading.exactIn.value
            ? trading.effectivePriceMessage.value.tokenIn
            : trading.effectivePriceMessage.value.tokenOut
        }}
      </div>
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
        class="swap-button font-semibold text-[16px]"
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
      <div
        v-if="
          tokenInAddress &&
          tokenOutAddress &&
          tokenInAmount > 0 &&
          tokenOutAmount > 0
        "
        class="stats"
      >
        <div>
          <TradePreviewModalGP
            :trading="trading"
            @trade="trade"
            @close="handlePreviewModalClose"
          />
          <div class="border" />
          <TradeRoute
            :addressIn="trading.tokenIn.value.address"
            :amountIn="trading.tokenInAmountInput.value"
            :addressOut="trading.tokenOut.value.address"
            :amountOut="trading.tokenOutAmountInput.value"
            :pools="trading.sor.pools.value"
            :sorReturn="trading.sor.sorReturn.value"
            class="mt-2"
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
      if (trading.isBalancerTrade.value && !trading.isLoading.value) {
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
      // setTokenOutAddress(assetOut || store.state.trade.outputAsset);
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
      setInitialized(true);
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
  background: #231928;
  border-radius: 12px;
  width: 100%;
  padding: 12px 0px;
  gap: 12px;
  left: 10px;
  top: 259px;
  color: #b9babb;
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
  /* width: 480px; */
}

.trade-gasless :deep(.bal-toggle) {
  width: 3rem;
}

.gas-symbol {
  @apply h-8 w-8 rounded-full flex items-center justify-center text-lg bg-gray-50 dark:bg-gray-800;
}

.gas-symbol::before {
  content: '⛽';
}

.signature-symbol::before {
  content: '✍️';
}

.connect-wallet {
  padding: 12px 0px;
  gap: 12px;
  left: 10px;
  top: 226px;

  background: linear-gradient(
    94.14deg,
    #391b40 23.11%,
    rgba(57, 27, 64, 0.81) 81.52%
  );
  border-radius: 12px;
  width: 100%;
}

.connect-wallet:hover {
  background: linear-gradient(
    94.14deg,
    rgba(45, 20, 51, 0.7) 23.11%,
    rgba(57, 28, 65, 0.567) 81.52%
  );
  border-radius: 12px;
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

  background: radial-gradient(
      49.66% 488.58% at 50% 30%,
      #7b307f 0%,
      rgba(123, 48, 127, 0.81) 100%
    )
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  border-radius: 12px;
  width: 100%;
}

.swap-button:hover {
  background: radial-gradient(
      49.66% 488.58% at 50% 30%,
      rgba(123, 48, 127, 0.7) 0%,
      rgba(123, 48, 127, 0.567) 100%
    )
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

.border {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
  margin-left: 0.55em !important;
  margin-right: 0.55em !important;
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
</style>
