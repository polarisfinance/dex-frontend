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
    <div v-for="(amount, address) in amountMap" :key="address"  class="relative">
      <div class="token-amount-table-content items-center">
        <div class="flex items-center">
          <BalAsset :address="address" :size="36" />
          <div class="ml-3 flex flex-col">
            <div class="text-lg font-medium">
              <span class="font-numeric">
                {{ fNum2(amount, FNumFormats.token) }}
              </span>
              {{ tokenMap[address].symbol }}

            </div>
          </div>
        </div>
        <div class="text-secondary font-numeric  text-right">
          <div class="value">{{ fNum2(fiatAmountMap[address], FNumFormats.fiat) }}</div>
          <div class="perc">({{ fNum2(amountShare(address), FNumFormats.percent) }})</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.token-amount-table {
  padding:12px;
}

.token-amount-table-content {
  @apply flex justify-between py-2;
}

.token {
  @apply mr-2 mb-2 flex items-center ;
}
.value{
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #F5F5F5;
}
.perc{
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #BDB2DD;
}
</style>


