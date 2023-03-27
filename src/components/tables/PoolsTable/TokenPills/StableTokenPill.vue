<script setup lang="ts">
import { PoolToken } from '@/services/pool/types';
import BalanceTooltip from './BalanceTooltip.vue';

type Props = {
  hasBalance: boolean;
  symbol: string;
  isSelected: boolean;
  isPicked: boolean;
  token: PoolToken;
  separator: boolean;
};

withDefaults(defineProps<Props>(), {
  hasBalance: false,
  isSelected: false,
  isPicked: false,
  separator: false,
});
</script>

<template>
  <BalTooltip
    :disabled="!hasBalance"
    class="leading-normal cursor-pointer"
    textAlign="left"
    :delayMs="50"
  >
    <template #activator>
      <div
        :class="[
          'pill',
          {
            'pill-selected': isSelected,
            'pill-picked': isPicked,
            'pill-hoverable': hasBalance,
          },
        ]"
      >
        <div v-if="separator" class="pill-text px-1">-</div>
        <div v-if="hasBalance" class="balance-indicator" />
        <div
          :class="[
            'pill-text',
            {
              'font-medium': isSelected,
            },
          ]"
        >
          {{ symbol }}
        </div>
      </div>
    </template>
    <BalanceTooltip :token="token" :symbol="symbol" />
  </BalTooltip>
</template>

<style scoped>
.pill {
  @apply flex;
  @apply relative;
  @apply items-center;
  line-height: 20px;
}

.pill::before {
  @apply w-full h-full;
  @apply absolute;

  content: '';
  /*transform: skew(-16deg);*/
}

.pill-text {
  @apply dark:text-polaris-white font-semibold;
  z-index: 1;
}

.pill-selected::before {
  @apply ring-2 ring-blue-500 dark:ring-blue-400;
}

.pill.pill-picked::before {
  @apply bg-blue-50 dark:bg-blue-500 dark:bg-opacity-20;
}

.balance-indicator {
  @apply w-3 h-3;
  @apply rounded-full border-2 border-white dark:border-gray-850 group-hover:border-gray-50
    dark:group-hover:border-gray-800;
  @apply bg-green-200 dark:bg-green-500;
  @apply absolute top-0 right-0 -mt-1 -mr-2;
}

.pill-hoverable:hover::before,
.pill-hoverable:focus::before {
  @apply bg-gray-200 dark:bg-gray-900;
}
</style>
