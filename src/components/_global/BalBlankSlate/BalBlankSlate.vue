<template>
  <div class="bal-blank-slate text-secondary">
    <slot v-text="$t('noContent')" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BalBlankSlate',
});
</script>

<style>
.bal-blank-slate {
  @apply flex flex-col items-center justify-center rounded-lg border border-dashed p-8 dark:border-gray-700;

  min-height: 5px;
}
</style>
