<script setup lang="ts">
type Props = {
  title: string;
  hTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  divide: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  title: 'Summary',
  hTag: 'h6',
  divide: true,
});
const Classes = computed(() => {
  return {
    'divide-y': props.divide,
  };
});
</script>

<template>
  <div :class="[Classes]">
    <component :is="hTag" v-if="title != null" class="p-2">
      {{ title }}
    </component>
    <div class="flex flex-col py-2">
      <slot />
    </div>
  </div>
</template>
