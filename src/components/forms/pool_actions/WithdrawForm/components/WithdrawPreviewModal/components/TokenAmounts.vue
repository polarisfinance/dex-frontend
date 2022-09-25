<script setup lang="ts">
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
    <div v-for="(amount, address) in amountMap" :key="address" class="relative">
      <div class="token-amount-table-content">
        <BalAsset :address="address" :size="36" />
        <div class="ml-3 flex flex-col">
          <div class="text-lg font-medium">
            <span class="font-numeric">
              {{ fNum2(amount, FNumFormats.token) }}
            </span>
            {{ tokenMap[address].symbol }}
          </div>
          <div class="text-secondary font-numeric text-sm">
            {{ fNum2(fiatAmountMap[address], FNumFormats.fiat) }}
            ({{ fNum2(amountShare(address), FNumFormats.percent) }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.token-amount-table {
  @apply divide-y rounded-lg border shadow-lg dark:divide-gray-700 dark:border-gray-700;
}

.token-amount-table-content {
  @apply flex items-center p-3;
}
</style>
