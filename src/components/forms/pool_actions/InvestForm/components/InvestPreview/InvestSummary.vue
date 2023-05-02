<script setup lang="ts">
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useUserSettings } from '@/providers/user-settings.provider';
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
  summaryTitle?: string | undefined;
};

/**
 * PROPS & EMITS
 */
withDefaults(defineProps<Props>(), {
  isLoadingPriceImpact: false,
  highPriceImpact: false,
  summaryTitle: undefined,
});

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { currency } = useUserSettings();
</script>

<template>
  <BalDataList :title="null">
    <BalDataListRow>
      <template #label>
        <div class="text-xl font-semibold dark:text-polaris-white">
          {{ $t('investment.preview.summary.total') }}
        </div>
        <BalTooltip
          :text="$t('tooltips.addLiquidity.total', [currency.toUpperCase()])"
          iconSize="xs"
          class="ml-2"
        />
      </template>
      <template #value>
        <div class="text-lg font-semibold dark:text-polaris-white">
          {{ fNum(fiatTotal, FNumFormats.fiat) }}
        </div>
      </template>
    </BalDataListRow>
    <BalDataListRow>
      <template #label>
        <div
          class="text-base dark:text-polaris-white"
          :class="{
            'bg-red-50 dark:bg-red-500 text-red-500 dark:text-white':
              highPriceImpact,
          }"
        >
          {{ $t('priceImpact') }}
        </div>
        <BalTooltip
          :text="$t('tooltips.addLiquidity.priceImpact')"
          iconSize="xs"
          :iconName="highPriceImpact ? 'alert-triangle' : 'info'"
          :iconClass="
            highPriceImpact ? 'text-red-500 dark:text-white' : 'text-gray-300'
          "
          width="72"
          class="ml-2"
        />
      </template>
      <template #value>
        <BalLoadingBlock v-if="isLoadingPriceImpact" class="w-10 h-6" />
        <template v-else>
          {{ fNum(priceImpact, FNumFormats.percent) }}
        </template>
      </template>
    </BalDataListRow>
  </BalDataList>
</template>
