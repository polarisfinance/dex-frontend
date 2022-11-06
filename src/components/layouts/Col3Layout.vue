<script setup lang="ts">
import { computed } from 'vue';

/**
 * TYPES
 */
type Props = {
  mobileGuttersFirst?: boolean;
  mobileGuttersLast?: boolean;
  mobileHideGutters?: boolean;
  offsetGutters?: boolean;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  mobileGuttersFirst: false,
  mobileGuttersLast: false,
  mobileHideGutters: false,
  offsetGutters: false,
});

/**
 * COMPUTED
 */
const gutterClasses = computed(() => ({
  'order-1 lg:order-2': props.mobileGuttersFirst,
  'order-3 lg:order-2': props.mobileGuttersLast,
  'hidden lg:block': props.mobileHideGutters,
  'mt-6': props.offsetGutters,
}));

const centerClasses = computed(() => ({
  'order-2': props.mobileGuttersFirst,
  'order-1 lg:order-2': props.mobileGuttersLast,
}));
</script>

<template>
  <div class="layout-container">
    <div :class="['gutter-col', gutterClasses]">
      <slot name="gutterLeft" />
    </div>
    <div :class="['center-col', centerClasses]">
      <slot />
    </div>
    <div :class="['gutter-col', gutterClasses]">
      <slot name="gutterRight" />
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  @apply mx-auto max-w-6xl px-[8px] sm:px-4;
  @apply grid grid-cols-1 gap-y-8 gap-x-0 lg:grid-cols-7 lg:gap-x-8;
}

.center-col {
  @apply col-span-3 mx-auto w-full sm:max-w-xl lg:mx-0;
}

.gutter-col {
  @apply col-span-2;
}
</style>
