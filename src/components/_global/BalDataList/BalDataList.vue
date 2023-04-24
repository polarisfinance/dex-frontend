<script setup lang="ts">
type Props = {
  title: string;
  hTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

withDefaults(defineProps<Props>(), {
  title: 'Summary',
  hTag: 'h6',
});
</script>

<template>
  <div class="divide-y">
    <component :is="hTag" v-if="title != null" class="p-2">
      {{ title }}
    </component>
    <div class="flex flex-col py-2">
      <slot />
    </div>
  </div>
</template>
