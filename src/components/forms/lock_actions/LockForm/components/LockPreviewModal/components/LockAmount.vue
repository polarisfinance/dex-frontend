<script setup lang="ts">
import { computed } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { Pool } from '@/services/pool/types';
import { PoolToken } from '@balancer-labs/sdk';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  totalLpTokens: string;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { getToken } = useTokens();
const { fNum } = useNumbers();

/**
 * COMPUTED
 */
const poolWeightsLabel = computed(() =>
  props.lockablePool.tokens
    .map(token => {
      const weightLabel = formatWeightLabel(token.weight);
      const symbol = token.symbol ?? getToken(token.address).symbol;

      return `${weightLabel} ${symbol}`;
    })
    .join(' / ')
);

/**
 * METHODS
 */
function formatWeightLabel(weight: PoolToken['weight']) {
  return fNum(weight || '0', {
    style: 'percent',
    maximumFractionDigits: 0,
  });
}
</script>

<template>
  <div class="container">
    <div class="flex justify-between items-center p-3">
      <div class="flex flex-col">
        <div>
          <BalAsset
            v-for="tokenAddress in lockablePool.tokensList"
            :key="tokenAddress"
            :address="tokenAddress"
            :size="30"
          />
        </div>
        <div
          class="ml-2 text-lg font-semibold text-gray-400 dark:text-polaris-white"
        >
          {{ poolWeightsLabel }}
        </div>
      </div>
      <div>
        <div class="text-lg font-semibold text-right dark:text-polaris-white">
          {{
            $t('getVeBAL.previewModal.lpTokens', [
              fNum(totalLpTokens, FNumFormats.token),
            ])
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply divide-y dark:divide-gray-700;
}
</style>
