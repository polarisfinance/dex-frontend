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
};

/**
 * PROPS & EMITS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { currency } = useUserSettings();
</script>

<template>
  <BalDataList :title="``" :divide="false">
    <BalDataListRow
      :label="$t('total')"
      class="text-xl font-semibold dark:text-polaris-white"
    >
      <template #value>
        {{ fNum(fiatTotal, FNumFormats.fiat) }}
        <BalTooltip
          :text="$t('tooltips.withdraw.total', [currency.toUpperCase()])"
          iconSize="sm"
          class="ml-2"
        />
      </template>
    </BalDataListRow>
    <BalDataListRow :label="$t('priceImpact')" class="font-semibold">
      <template #value>
        {{ fNum(priceImpact, FNumFormats.percent) }}
        <BalTooltip
          :text="$t('tooltips.withdraw.priceImpact')"
          iconSize="sm"
          width="72"
          class="ml-2"
        />
      </template>
    </BalDataListRow>
  </BalDataList>
</template>
