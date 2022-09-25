<template>
  <div
    class="absolute top-0 left-0 z-10 h-full w-full rounded-lg bg-white text-center dark:bg-gray-850"
  >
    <div class="flex h-full flex-col items-center justify-between p-4">
      <h3 v-text="title" />
      <div class="flex flex-col items-center">
        <div
          class="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-500 dark:text-gray-850"
        >
          <BalIcon name="check-circle" size="xl" />
        </div>
        <p class="text-secondary" v-html="description" />
      </div>
      <div class="mt-4 grid w-full grid-cols-2 gap-4">
        <BalBtn
          tag="a"
          :href="explorerLink"
          target="_blank"
          rel="noreferrer"
          flat
          color="gray"
        >
          <span v-text="$t('receipt')" />
          <BalIcon name="arrow-up-right" size="sm" class="ml-1" />
        </BalBtn>
        <BalBtn :label="closeLabel" color="gray" flat @click="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SuccessOverlay',

  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    closeLabel: { type: String, required: true },
    explorerLink: { type: String, required: true },
  },

  emits: ['close'],
});
</script>
