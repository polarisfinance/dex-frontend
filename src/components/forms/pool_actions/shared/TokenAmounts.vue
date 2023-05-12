<script setup lang="ts">
import { groupBy, orderBy } from 'lodash';
import { computed } from 'vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { bnum } from '@/lib/utils';
import { TokenInfoMap } from '@/types/TokenList';
/**
 * TYPES
 */
type Props = {
  amountMap: AmountMap;
  fiatAmountMap: AmountMap;
  tokenMap: TokenInfoMap;
  fiatTotal: string;
  title?: string;
  hideAmountShare?: boolean;
  showZeroAmounts?: boolean;
};
type AmountMap = {
  [address: string]: string;
};
/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  title: '',
  hideAmountShare: false,
  showZeroAmounts: false,
});
/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
/**
 * COMPUTED
 */
const sortedAmounts = computed(() =>
  orderBy(
    Object.entries(props.fiatAmountMap),
    ([, fiatAmount]) => Number(fiatAmount),
    'desc'
  ).map(([address, fiatAmount]) => ({
    amount: props.amountMap[address],
    fiatAmount,
    address,
  }))
);
const groupedAmounts = computed(() =>
  groupBy(sortedAmounts.value, amounts =>
    bnum(amounts.amount || '0').isZero() ? 'zeroAmounts' : 'nonZeroAmounts'
  )
);
const amountsToShow = computed(() =>
  props.showZeroAmounts
    ? sortedAmounts.value
    : groupedAmounts.value.nonZeroAmounts
);
/**
 * METHODS
 */
// The investment amount's relative percentage of the total fiat investment value.
// This has nothing to do with the pool weights.
function amountShare(address: string): string {
  return bnum(props.fiatAmountMap[address]).div(props.fiatTotal).toString();
}
</script>
  
<template>
  <div class="token-amount-table">
    <div v-if="props.title" class="title">
      {{ props.title }}
    </div>
    <div v-for="token in amountsToShow" :key="token.address" class="flex">
      <BalAsset :address="token.address" :size="36" class="flex-none pt-2" />
      <div class="w-full token-amount-table-content">
        <div class="flex self-center w-full dark:text-polaris-white">
          <div class="flex-none text-xl font-medium">
            <span class="font-numeric">
              {{ fNum(token.amount, FNumFormats.token) }}
            </span>
            {{ tokenMap[token.address]?.symbol }}
          </div>
          <div
            v-if="Number(token.fiatAmount) > 0 || true"
            class="w-full text-xl font-medium text-right"
          >
            {{ fNum(token.fiatAmount, FNumFormats.fiat) }}
            <span v-if="!hideAmountShare">
              ({{ fNum(amountShare(token.address), FNumFormats.percent) }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
.token-amount-table {
  @apply overflow-hidden;
}

.title {
  @apply px-3 py-2;
  @apply font-medium text-sm text-gray-600 dark:text-gray-400;
}

.token-amount-table-content {
  @apply py-3 pl-3 flex justify-between;
}
</style>
