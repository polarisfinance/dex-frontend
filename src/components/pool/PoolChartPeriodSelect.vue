<script setup lang="ts">
import { PoolChartPeriod } from '@/components/contextual/pages/pool/PoolChart.vue';

/**
 * TYPES
 */
type Props = {
  options: PoolChartPeriod[];
  activeOption: PoolChartPeriod;
};

const emit = defineEmits<{
  (e: 'change-option', value: PoolChartPeriod): void;
}>();

/**
 * PROPS
 */
defineProps<Props>();
</script>

<template>
  <BalPopover noPad>
    <template #activator>
      <div class="period-select-input h-10 text-base">
        <div class="flex h-full flex-1 items-center justify-between">
          <div class="period-select-input__selected">
            {{ activeOption.text }}
          </div>
          <BalIcon name="chevron-down" class="mt-[-2px]" />
        </div>
      </div>
    </template>
    <template #default="{ close }">
      <div class="flex w-44 flex-col overflow-hidden rounded-lg" @click="close">
        <div class="whitespace-nowrap border-b bg-gray-50 py-2 px-3 text-sm font-medium text-gray-500 dark:border-gray-900 dark:bg-gray-800">{{ $t('poolChart.period.title') }}:</div>
        <div v-for="option in options" :key="option.days" class="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-850" @click="emit('change-option', option)">
          <div class="ml-1 flex items-center font-medium">
            {{ option.text }}
          </div>
          <BalIcon v-if="activeOption.days === option.days" name="check" class="btn-color" />
        </div>
      </div>
    </template>
  </BalPopover>
</template>

<style scoped>
.period-select-input {
  @apply relative w-28 overflow-hidden  px-2 shadow transition-all
    hover:shadow-none focus:shadow-none;

  padding: 6px 12px 6px 24px;
  gap: 12px;

  background: #41365e;
  border-radius: 40px;
}

.period-select-input__selected {
  @apply -ml-px flex h-full items-center bg-transparent text-xs font-semibold leading-loose leading-none;

  appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

.period-select-input .bal-icon :deep(svg) {
  @apply transition-all;

  stroke: theme('colors.blue.500');
}

.period-select-input:hover .bal-icon :deep(svg),
.period-select-input:focus .bal-icon :deep(svg) {
  stroke: theme('colors.pink.500');
}
</style>
