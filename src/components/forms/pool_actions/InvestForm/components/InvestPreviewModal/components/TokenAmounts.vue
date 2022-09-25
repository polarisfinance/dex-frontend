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
};

type AmountMap = {
  [address: string]: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();

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
    bnum(amounts.amount).isZero() ? 'zeroAmounts' : 'nonZeroAmounts'
  )
);

const shouldShowCompactViewForZeroAmounts = computed(
  () => (groupedAmounts.value.zeroAmounts?.length || 0) > 3
);

const amountsToShow = computed(() =>
  shouldShowCompactViewForZeroAmounts.value
    ? groupedAmounts.value.nonZeroAmounts
    : sortedAmounts.value
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
    <div v-for="token in amountsToShow" :key="token.address" class="relative">
      <div class="token-amount-table-content items-center">
        <div class="flex items-center">
          <BalAsset :address="token.address" :size="36" />
          <div class="ml-3 flex flex-col">
            <div class="text-lg font-medium">
              <span class="font-numeric">
                {{ fNum2(token.amount, FNumFormats.token) }}
              </span>
              {{ tokenMap[token.address].symbol }}
            </div>
          </div>
        </div>
        <div class="text-secondary font-numeric text-sm">
          {{ fNum2(token.fiatAmount, FNumFormats.fiat) }}
          ({{ fNum2(amountShare(token.address), FNumFormats.percent) }})
        </div>
      </div>
    </div>
    <div
      v-if="shouldShowCompactViewForZeroAmounts"
      class="token-amount-table-content -mb-2 items-start"
    >
      <div class="mr-6 flex flex-wrap">
        <div
          v-for="token in groupedAmounts.zeroAmounts"
          :key="token.address"
          class="token"
        >
          <BalAsset :address="token.address" class="mr-2" />
          <span>{{ tokenMap[token.address].symbol }}</span>
        </div>
      </div>
      <div class="text-secondary font-numeric whitespace-nowrap text-sm">
        {{ fNum2(0, FNumFormats.fiat) }}
        ({{ fNum2(0, FNumFormats.percent) }})
      </div>
    </div>
  </div>
</template>

<style scoped>
.token-amount-table {
  @apply divide-y rounded-lg border shadow-lg dark:divide-gray-700 dark:border-gray-700;
}

.token-amount-table-content {
  @apply flex justify-between p-3;
}

.token {
  @apply mr-2 mb-2 flex items-center rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-700;
}
</style>
