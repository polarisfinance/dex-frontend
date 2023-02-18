<script setup lang="ts">
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useUserSettings from '@/composables/useUserSettings';
import { Pool } from '@/services/pool/types';
/**
 * TYPES
 */
type Props = {
  pool: Pool;
  fiatTotal: string;
  priceImpact: number;
  isLoadingPriceImpact?: boolean;
  highPriceImpact?: boolean;
};
/**
 * PROPS & EMITS
 */
withDefaults(defineProps<Props>(), {
  isLoadingPriceImpact: false,
  highPriceImpact: false,
});
/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const { currency } = useUserSettings();
</script>

<template>
  <div class="summary-table">
    <div class="flex">
        <div class="summary-table-label flex-1">
          {{ $t('total') }}
          <BalTooltip
            :text="$t('tooltips.invest.total', [currency.toUpperCase()])"
            iconSize="xs"
            class="ml-1 inline"
          />
        </div>
        <div class="summary-table-label flex-1 text-right">
          {{ fNum2(fiatTotal, FNumFormats.fiat) }}
        </div>
    </div>
    <div
      :class="[
        'flex',
        {
          'bg-red-50 text-red-500 dark:bg-red-500 dark:text-white':
            highPriceImpact,
        },
      ]"
    >
      <div class="flex-1">
        {{ $t('priceImpact') }} 
        <BalTooltip
            :text="$t('tooltips.invest.priceImpact')"
            iconSize="xs"
            :iconName="highPriceImpact ? 'alert-triangle' : 'info'"
            :iconClass="
              highPriceImpact
                ? 'text-red-500 dark:text-white'
                : 'text-gray-300'
            "
            width="50"
            class="ml-1 inline"
          />
      </div>
      <div class="summary-table-number flex-1">
        <BalLoadingBlock v-if="isLoadingPriceImpact" class="h-6 w-10" />
        <template v-else>
          {{ fNum2(priceImpact, FNumFormats.percent) }}
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-table {
  @apply mt-4 ;
  padding:0px 12px;
}


.summary-table-label {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;

}

.summary-table-number {
  @apply flex items-center justify-end;
}
</style>
