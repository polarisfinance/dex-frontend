<script setup lang="ts">
import { computed, toRefs } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';

import { WithdrawMathResponse } from '../composables/useWithdrawMath';

/**
 * TYPES
 */
type Props = {
  math: WithdrawMathResponse;
};

/**
 * Props
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();

const { priceImpact, highPriceImpact, loadingAmountsOut } = toRefs(props.math);

/**
 * COMPUTED
 */
const priceImpactClasses = computed(() => ({
  'bg-red-500 text-white divide-red-400 border-none': highPriceImpact.value,
}));
</script>

<template>
  <div class="data-table">
    <div :class="['data-table-row', priceImpactClasses]">
      <div class="">
        {{ $t('priceImpact') }}
      </div>
      <div class="data-table-number-col">
        <div class="flex items-center">
          <BalLoadingBlock v-if="loadingAmountsOut" class="h-6 w-10" />
          <span v-else>{{ fNum2(priceImpact, FNumFormats.percent) }}</span>

          <BalTooltip :text="$t('withdraw.tooltips.priceImpact')">
            <template #activator>
              <BalIcon
                v-if="highPriceImpact"
                name="alert-triangle"
                size="xs"
                class="-mb-px pl-2"
              />
              <BalIcon
                v-else
                name="info"
                size="xs"
                class="-mb-px pl-2 text-gray-400"
              />
            </template>
          </BalTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-table {
}

.data-table-row {
  @apply flex;
}

.data-table-number-col {
  @apply flex flex-grow items-center justify-between ;
}

.total-row {
  @apply text-lg font-semibold;
}
</style>
