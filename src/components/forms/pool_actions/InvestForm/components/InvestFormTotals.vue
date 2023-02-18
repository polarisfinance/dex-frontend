<script setup lang="ts">
import { computed, toRefs } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useWeb3 from '@/services/web3/useWeb3';

import { InvestMathResponse } from '../composables/useInvestMath';

/**
 * TYPES
 */
type Props = {
  math: InvestMathResponse;
  maxFiatValue: string;
};

/**
 * Props
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'maximize'): void;
  (e: 'optimize'): void;
}>();

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const { isWalletReady } = useWeb3();

const {
  fiatTotal,
  hasNoBalances,
  hasAllTokens,
  priceImpact,
  highPriceImpact,
  maximized,
  optimized,
  maximizeAmounts,
  batchSwapLoading,
  supportsPropotionalOptimization,
} = toRefs(props.math);


/**
 * COMPUTED
 */
const priceImpactClasses = computed(() => ({
  'small-btn': !highPriceImpact.value,
  'bg-red-500 dark:bg-red-500 text-white divide-red-400': highPriceImpact.value,
}));

const optimizeBtnClasses = computed(() => ({
  'text-gradient': !highPriceImpact.value,
  'text-red-500 px-2 py-1 bg-white rounded-lg': highPriceImpact.value,
}));
</script>

<template>
  <div class="break mx-[16px]"></div>
  <div class="max-investment flex">
    <div class="flex flex-col flex-1">
      <div class="max-amount">Totally you can invest</div>
      <div>You can use all your tokens to maximize your investment</div>
    </div>
    <div class="flex flex-col data-table-number-col  flex-1">
      <div class="max-amount">{{ fNum2(maxFiatValue, FNumFormats.fiat) }}</div>
      <div v-if="isWalletReady && !hasNoBalances" class="text-sm">
        <span v-if="maximized" class="">
          {{ $t('maxed') }}
        </span>
        <span 
          v-else
          class="cursor-pointer small-btn"
          @click="emit('maximize')"
        >
          {{ $t('maximize') }}
        </span>
      </div>
    </div>
  </div>

  <div class="grid data-table">
    <div class="data-table-row total-row">
      <div class="total">
        {{ $t('total') }}
      </div>
      <div class="data-table-number-col flex flex-col">
        <div class="total">{{ fNum2(fiatTotal, FNumFormats.fiat) }}</div>
      </div>
    </div>
    <div :class="['data-table-row price-impact-row', priceImpactClasses]">
      <div class="">
        {{ $t('priceImpact') }}
        <BalTooltip :text="$t('customAmountsTip')">
          <template #activator>
            <BalIcon
              v-if="highPriceImpact"
              name="alert-triangle"
              size="xs"
              class="-mb-px ml-1"
            />
            <BalIcon
              v-else
              name="info"
              size="xs"
              class="-mb-px ml-1 text-gray-400"
            />
          </template>
        </BalTooltip>
      </div>
      <div class="data-table-number-col  flex flex-col">
        <div>
          <div class="flex">
            <div
              v-if="
                isWalletReady && hasAllTokens && supportsPropotionalOptimization
              "
              class="text-sm font-semibold"
            >
              <span v-if="optimized" class="">
                {{ $t('optimized') }}
              </span>
              <div
                v-else
                class="cursor-pointer small-btn"
                @click="emit('optimize')"
              >
                {{ $t('optimize') }}
              </div>
            </div>
            <span v-if="!batchSwapLoading" class="ml-[8px]">
              {{ fNum2(priceImpact, FNumFormats.percent) }}
            </span>
            <BalLoadingBlock v-else class="w-10" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  /* @apply divide-y rounded-lg border dark:divide-gray-900 dark:border-gray-900; */
  padding:18px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #BDB2DD;
  grid-template-columns: 50% auto;
}

.data-table-row {
  @apply grid items-center;
  /* @apply divide-x dark:divide-gray-900; */
  display: contents;
}

.data-table-number-col {
  @apply  flex items-end justify-between p-2;
}

.total-row {
  color: #FDFDFD;

}
.total{
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;

}

.price-impact-row {
  @apply rounded-b-lg text-sm;
}
.max-amount{
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FDFDFD;
}
.max-investment{
  padding:16px;
  background-color: #41365E;
}
.break {
  flex-basis: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(151, 71, 255, 0.4),
    rgba(59, 68, 189, 0.4)
  );
}
.small-btn{
  background: linear-gradient(92.92deg, #C004FE 4.85%, #7E02F5 95.15%);
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #FDFDFD;
  padding: 0px 8px;
}
</style>
