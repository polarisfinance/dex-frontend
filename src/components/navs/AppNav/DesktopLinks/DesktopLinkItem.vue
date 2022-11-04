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
  // 'gradient-underline': props.active,
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
    overflow-hidden p-0 text-[16px]
    font-semibold transition-all duration-500 ease-in-out text-[#FDFDFD];
}

/* .gradient-underline::after {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  content: '';
  position: absolute;
  top: 70%;
  left: 0;
  height: 2px;
  width: 100%;
} */
.desktop-link-item:hover {
  @apply text-[#CAC7CC];
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
