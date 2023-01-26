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
    <img src="./Logo.svg" width="35" height="35" class="mr-2" />
    <nobr className="custom-logo-text self-center font-medium">
      POLARIS
      <nobr className="custom-logo-text self-center font-bold">
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
font-style: normal;
font-size: 14px;
line-height: 18px;
color: #FDFDFD;
}
</style>
