<script lang="ts" setup>
import { computed } from 'vue';

type Props = {
  active: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  active: false,
});

const classes = computed(() => ({
  // 'border-white dark:border-gray-900': !props.active,
  // 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400':
  //   props.active,
}));
</script>

<template>
  <router-link :class="['desktop-link-item', classes]">
    <slot />
  </router-link>
</template>

<style scoped>
.desktop-link-item {
  /* @apply h-full flex-col justify-center cursor-pointer hover:text-green-400 dark:hover:text-green-400 flex relative */
  @apply relative flex h-full cursor-pointer flex-col justify-center
    overflow-hidden p-0 text-[20px]
    font-semibold transition-all duration-500 ease-in-out;
}

.desktop-link-item:hover {
  color: #be95c0;
}

.desktop-link-item::before {
  content: '';

  @apply absolute top-0 left-0 block w-full overflow-hidden font-semibold transition-all;

  /* border-top: 4px solid theme('colors.purple.600'); */
  transform: translate3d(0%, -101%, 0);
}

.dark .desktop-link-item::before {
  /* border-color: theme('colors.polarisgreen'); */
}

.desktop-link-item.router-link-active::before {
  content: '';
  /* border-color: theme('colors.polarisgreen'); */

  @apply absolute top-0 left-0 block w-full;

  transform: translate3d(0, 0, 0);
}

.dark .desktop-link-item.router-link-active::before {
  content: '';
  /* border-color: theme('colors.polarisgreen'); */
}

.desktop-link-item.router-link-active:hover::before {
  /* border-color: theme('colors.polarisgreen'); */
}

.dark .desktop-link-item.router-link-active:hover::before {
  /* border-color: theme('colors.polarisgreen'); */
}

.desktop-link-item.router-link-active {
  /* @apply text-green-400 dark:text-green-400 hover:text-green-400 dark:hover:text-green-400 transition-colors; */
}

.desktop-link-item:hover::before {
  transform: translate3d(0, 0, 0);
}
</style>
