<script lang="ts" setup>
type Props = {
  label?: string;
  value?: string;
};

defineProps<Props>();
</script>

<template>
  <BalCard>
    <div class="text-secondary mb-2 text-sm font-medium">
      <slot name="label">
        {{ label }}
      </slot>
    </div>
    <div class="flex items-center truncate text-xl font-medium">
      <slot name="value">
        {{ value }}
      </slot>
    </div>
  </BalCard>
</template>
