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
const { fNum } = useNumbers();

const { priceImpact, highPriceImpact, loadingData } = toRefs(props.math);

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
      <div class="p-2">
        {{ $t('priceImpact') }}
      </div>
      <div class="data-table-number-col">
        <div class="flex items-center">
          <BalLoadingBlock v-if="loadingData" class="w-10 h-6" />
          <span v-else>{{ fNum(priceImpact, FNumFormats.percent) }}</span>

          <BalTooltip :text="$t('withdraw.tooltips.priceImpact')">
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-table {
  @apply text-polaris-white;
}

.data-table-row {
  @apply flex;
}

.data-table-number-col {
  @apply p-2 flex grow items-center justify-between;
}

.total-row {
  @apply text-lg font-semibold;
}
</style>
