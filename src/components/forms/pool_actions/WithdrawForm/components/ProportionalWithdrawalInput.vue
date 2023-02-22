<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { computed, onBeforeMount, toRef, toRefs, watch } from 'vue';

import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
// Composables
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { isStablePhantom, usePool } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
// Types
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { TokenInfoMap } from '@/types/TokenList';

import useWithdrawalState from '../composables/useWithdrawalState';
import { WithdrawMathResponse } from '../composables/useWithdrawMath';
// Components
import WithdrawalTokenSelect from './WithdrawalTokenSelect.vue';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  tokenAddresses: string[];
  math: WithdrawMathResponse;
};

/**
 * Props
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const {
  propBptIn,
  bptBalance,
  hasBpt,
  fiatTotalLabel,
  fiatAmounts,
  proportionalAmounts,
  shouldFetchBatchSwap,
  loadingAmountsOut,
} = toRefs(props.math);

const { slider } = useWithdrawalState(toRef(props, 'pool'));

const { isWalletReady } = useWeb3();
const { missingPrices } = usePoolTransfers();
const { getTokens } = useTokens();
const { isStableLikePool } = usePool(toRef(props, 'pool'));
const { fNum2 } = useNumbers();

/**
 * COMPUTED
 */
const tokens = computed((): TokenInfoMap => {
  if (isStablePhantom(props.pool.poolType)) {
    return getTokens(props.pool.mainTokens || []);
  }
  return getTokens(props.pool.tokensList);
});

const percentageLabel = computed(() => {
  try {
    if (!hasBpt.value) return '100';

    return bnum(propBptIn.value)
      .div(bptBalance.value)
      .times(100)
      .integerValue(BigNumber.ROUND_CEIL)
      .toString();
  } catch (error) {
    console.error(error);
    return '0';
  }
});

const seedTokens = computed((): number[] =>
  Object.values(props.pool?.onchain?.tokens || []).map(token => token.weight)
);

/**
 * METHODS
 */
function handleSliderChange(newVal: number): void {
  const fractionBasisPoints = (newVal / slider.value.max) * 10000;
  propBptIn.value = bnum(bptBalance.value)
    .times(fractionBasisPoints)
    .div(10000)
    .toFixed(props.pool?.onchain?.decimals || 18);
}

async function handleSliderEnd(): Promise<void> {
  if (shouldFetchBatchSwap.value) {
    await props.math.getSwap();
  }
}

/**
 * WATCHERS
 */
watch(isWalletReady, () => {
  propBptIn.value = bptBalance.value;
});

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  propBptIn.value = bptBalance.value;
});
</script>

<template>
  <div>
    <div class="proportional-input">
      <div class="proportional-input-container">
        <div class="flex">
          <WithdrawalTokenSelect :pool="pool" />
          <div class="token-amount flex-grow text-right text-xl">
            <BalLoadingBlock
              v-if="loadingAmountsOut"
              class="float-right h-8 w-20"
            />
            <span v-else>{{ missingPrices ? '-' : fiatTotalLabel }}</span>
          </div>
        </div>
        <div class="text-secondary mx-1 mb-2 mt-4 flex text-sm">
          <span>
            {{ $t('proportionalWithdrawal') }}
          </span>
          <span class="flex-grow text-right">{{ percentageLabel }}%</span>
        </div>
        <BalRangeInput
          v-model="slider.val"
          :max="slider.max"
          :interval="slider.interval"
          :min="slider.min"
          tooltip="none"
          :disabled="!hasBpt"
          @update:model-value="handleSliderChange"
          @drag-end="handleSliderEnd"
        />
      </div>
    </div>

    <div class="token-amounts">
      <div
        v-for="(token, address, i) in tokens"
        :key="address"
        class="pl-[8px] py-3"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <BalAsset :address="address" class="mr-2" />
            <div class="flex flex-col leading-none">
              <span class="token-name">
                {{ token.symbol }}
                <span v-if="!isStableLikePool">
                  {{
                    fNum2(seedTokens[i], {
                      style: 'percent',
                      maximumFractionDigits: 0,
                    })
                  }}
                </span>
              </span>
            </div>
          </div>
          <div
            class="font-numeric flex flex-grow flex-col items-end pl-2 text-right"
          >
            <BalLoadingBlock v-if="loadingAmountsOut" class="h-12 w-20" />
            <template v-else>
              <span class="token-amount">
                {{ fNum2(proportionalAmounts[i], FNumFormats.token) }}
              </span>
              <span class="text-secondary">
                {{ fNum2(fiatAmounts[i], FNumFormats.fiat) }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.proportional-input {
}

.proportional-input-container {
}
.token-name {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #FDFDFD;
}
.token-amount {
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #F5F5F5;
}
.text-secondary{
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #BDB2DD;
}
</style>
