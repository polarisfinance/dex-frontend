<script lang="ts" setup>
import { computed } from 'vue';

import useDarkMode from '@/composables/useDarkMode';
import useTailwind from '@/composables/useTailwind';

/**
 * TYPES
 */
type Props = {
  forceDark?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  forceDark: false,
});

/**
 * COMPOSABLES
 */
const { darkMode } = useDarkMode();
const tailwind = useTailwind();

/**
 * COMPUTED
 */
const fillColor = computed(() => {
  if (props.forceDark) return tailwind.theme.colors.white;

  return darkMode.value
    ? tailwind.theme.colors.white
    : tailwind.theme.colors.gray['900'];
});
</script>

<template>
  <div class="app-logo flex min-w-[185px] items-center sm:mr-4">
    <img src="./Logo.svg" width="62" height="62" class="mr-2" />
    <nobr className="custom-logo-text self-center text-[20px] font-medium">
      POLARIS
      <nobr className="custom-logo-text self-center text-[20px] font-semibold">
        D E X
      </nobr>
    </nobr>
  </div>
</template>

<style scoped>
.app-logo :deep(.logotype) {
  @apply relative origin-top-left;

  transform: scale(1.1);
}

.svg-path {
  transition: fill 0.2s ease-out;
}

.logo-svg:hover .svg-path {
  fill: theme('colors.purple.700');
}

.dark .logo-svg:hover .svg-path {
  fill: theme('colors.yellow.500');
}

.custom-logo-text {
  background: linear-gradient(180deg, #4b5e98 30%, #403a4e 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  color: transparent;
}
</style>
