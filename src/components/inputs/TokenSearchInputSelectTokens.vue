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
    class="flex overflow-x-auto flex-wrap gap-3 items-center px-3 mx-auto text-gray-900 dark:text-polaris-white bg-white dark:bg-transparent"
  >
    <span class="flex items-center self-stretch py-2 md:py-1 pr-3">
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
