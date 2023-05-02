<script lang="ts" setup>
import { RouterLinkProps } from 'vue-router';
import PrefetchLinks from '@/components/links/PrefetchLinks.vue';

interface Props extends RouterLinkProps {
  active: boolean;
  prefetch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  prefetch: false,
});

const classes = computed(() => ({
  'font-semibold dark:text-polaris-white hover:dark:text-polaris-3': !props.active,
  'font-semibold dark:text-polaris-white':
    props.active,
}));
</script>

<template>
  <router-link v-bind="props" :class="['desktop-link-item', classes]">
    <slot />
    <PrefetchLinks v-if="prefetch" :to="$attrs.to" />
  </router-link>
</template>

<style scoped>
.desktop-link-item {
  @apply  h-full flex-col justify-center cursor-pointer flex relative
    overflow-hidden p-0 transition-all
    ease-in-out duration-500 ;
}

.desktop-link-item::before {
  content: '';

  @apply top-0 left-0 w-full block absolute overflow-hidden transition-all;

  transform: translate3d(0%, -101%, 0);
}


.desktop-link-item.router-link-active:hover::before {
}

.dark .desktop-link-item.router-link-active:hover::before {
}

.desktop-link-item.router-link-active {
  @apply text-blue-600 dark:text-polaris-white transition-colors;
}

.desktop-link-item:hover::before {
  transform: translate3d(0, 0, 0);
}
</style>
