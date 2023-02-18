<script setup lang="ts">
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useVeBal from '@/composables/useVeBAL';

/**
 * TYPES
 */
type Props = {
  expectedVeBalAmount: string;
};

/**
 * PROPS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const { veBalTokenInfo } = useVeBal();
</script>

<template>
  <div class="container">
    <div class="row">
      <div>{{ $t('getVeBAL.lockForm.summary.receive.title') }}</div>
      <div>
        {{ expectedVeBalAmount != null ? fNum2(expectedVeBalAmount, FNumFormats.token) : '-' }}
        {{ veBalTokenInfo.symbol }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply divide-y rounded-lg border bg-gray-50 text-sm dark:divide-gray-850 dark:border-gray-800 dark:bg-gray-800;
}

.row {
  @apply flex justify-between p-3;
}
</style>
