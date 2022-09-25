<script setup lang="ts">
import { PoolToken } from '@/services/pool/types';

import BalanceTooltip from './BalanceTooltip.vue';

type Props = {
  hasBalance: boolean;
  symbol: string;
  weight: string;
  isSelected: boolean;
  token: PoolToken;
  lastToken: boolean;
};

withDefaults(defineProps<Props>(), {
  hasBalance: false,
  isSelected: false,
});
</script>

<template>
  <div class="flex-col">
    <div class="flex">
      {{ symbol }}
      <div v-if="!lastToken" class="mx-[3px]">-</div>
    </div>
    <div
      :class="{ isMobile: weightMobile, isDesktop: weight }"
      class="weight text-center"
    >
      {{ weight }}
    </div>
  </div>
  <!-- <BalTooltip
    :disabled="!hasBalance"
    class="mr-2 last:mr-0 leading-normal cursor-pointer"
    textAlign="left"
    :delayMs="50"
  >
    <template #activator>
      <div
        :class="[
          'pill',
          {
            'pill-selected': isSelected,
            'pill-hoverable': hasBalance,
          },
        ]"
      >
        <div v-if="hasBalance" class="balance-indicator" />
        <span
          :class="[
            {
              'font-medium': isSelected,
            },
          ]"
        >
          {{ symbol }}
        </span>
        <span class="pill-weight">
          {{ weight }}
        </span>
      </div>
    </template>
    <BalanceTooltip :token="token" :symbol="symbol" />
  </BalTooltip> -->
</template>

<style scoped>
.pill {
  @apply relative my-1 flex h-full items-center rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-700;
}

.pill-selected {
  @apply ring-2 ring-blue-500 dark:ring-blue-400;
}

.pill-weight {
  @apply text-xs font-medium text-gray-600 dark:text-gray-400;
  @apply mt-px ml-1;
}

.balance-indicator {
  @apply h-3 w-3;
  @apply rounded-full border-2 border-white group-hover:border-gray-50 dark:border-gray-850
    dark:group-hover:border-gray-800;
  @apply bg-green-400 dark:bg-green-500;
  @apply absolute top-0 right-0 -mt-1 -mr-1;
}

.pill-hoverable:hover,
.pill-hoverable:focus {
  @apply bg-gray-200 dark:bg-gray-900;
}

.weight {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: rgba(245, 225, 255, 0.7);
}

.weightMobile {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;
}
</style>
