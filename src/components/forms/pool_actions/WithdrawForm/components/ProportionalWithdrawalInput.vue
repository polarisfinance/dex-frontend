<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { computed, onBeforeMount, toRef, toRefs, watch } from 'vue';

import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
// Composables
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import {
  isDeep,
  tokensListExclBpt,
  usePoolHelpers,
} from '@/composables/usePoolHelpers';
import { useTokens } from '@/providers/tokens.provider';
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
  loadingData,
} = toRefs(props.math);

const { slider } = useWithdrawalState(toRef(props, 'pool'));

const { isWalletReady } = useWeb3();
const { missingPrices } = usePoolTransfers();
const { getTokens } = useTokens();
const { isStableLikePool } = usePoolHelpers(toRef(props, 'pool'));
const { fNum } = useNumbers();

/**
 * COMPUTED
 */
const tokens = computed((): TokenInfoMap => {
  if (isDeep(props.pool)) {
    return getTokens(props.pool.mainTokens || []);
  }
  return getTokens(tokensListExclBpt(props.pool));
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
          <div class="text-xl text-right grow font-numeric">
            <BalLoadingBlock v-if="loadingData" class="float-right w-20 h-8" />
            <span v-else>{{ missingPrices ? '-' : fiatTotalLabel }}</span>
          </div>
        </div>
        <div class="flex mt-2 text-sm text-secondary">
          <span>
            {{ $t('proportionalWithdrawal') }}
          </span>
          <span class="text-right grow">{{ percentageLabel }}%</span>
        </div>
        <BalRangeInput
          v-model="slider.val"
          :max="slider.max"
          :interval="slider.interval"
          :min="slider.min"
          tooltip="none"
          :disabled="!hasBpt"
          @update:model-value="handleSliderChange"
        />
      </div>
    </div>

    <div class="token-amounts">
      <div
        v-for="(token, address, i) in tokens"
        :key="address"
        class="py-3 px-5 last:mb-0 text-lg font-semibold dark:text-polaris-white"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <BalAsset :address="address" class="mr-2" />
            <div class="flex flex-col leading-none">
              <span class="">
                {{ token.symbol }}
                <span v-if="!isStableLikePool">
                  {{
                    fNum(seedTokens[i], {
                      style: 'percent',
                      maximumFractionDigits: 0,
                    })
                  }}
                </span>
              </span>
            </div>
          </div>
          <div
            class="flex flex-col items-end pl-2 text-right grow font-numeric"
          >
            <BalLoadingBlock v-if="loadingData" class="w-20 h-12" />
            <template v-else>
              <span class="text-xl break-words">
                {{ fNum(proportionalAmounts[i], FNumFormats.token) }}
              </span>
              <span class="text-sm text-gray-400">
                {{ fNum(fiatAmounts[i], FNumFormats.fiat) }}
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
  @apply mb-4 w-full;
}

.proportional-input-container {
  @apply p-3 pb-1;
}
</style>
