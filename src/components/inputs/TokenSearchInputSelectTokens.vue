<script setup lang="ts">
type Props = {
  addresses: string[];
  label: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'click', address: string): void;
}>();
</script>
<template>
  <div
    class="flex flex-wrap items-center gap-3 overflow-x-auto rounded-lg border border-gray-100 bg-white px-3 text-gray-900 dark:border-gray-900 dark:bg-gray-850 dark:text-gray-400"
  >
    <span
      class="flex items-center self-stretch border-r border-gray-100 py-1 pr-3 dark:border-gray-900"
    >
      {{ props.label }}
    </span>
    <BalAsset
      v-for="address in addresses"
      :key="address"
      :address="address"
      button
      @click="emit('click', address)"
    />
  </div>
</template>
