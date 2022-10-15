<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

import AppIcon from '@/components/images/AppIcon.vue';
import AppLogo from '@/components/images/AppLogo.vue';
import useAlerts from '@/composables/useAlerts';
import useBreakpoints from '@/composables/useBreakpoints';
import useFathom from '@/composables/useFathom';

import AppNavActions from './AppNavActions.vue';
import AppNavAlert from './AppNavAlert.vue';
import DesktopLinks from './DesktopLinks/DesktopLinks.vue';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * STATE
 */
const appNav = ref<HTMLDivElement>();

/**
 * COMPOSABLES
 */
const { bp, isDesktop, isMobile } = useBreakpoints();
const { trackGoal, Goals } = useFathom();
const { currentAlert } = useAlerts();

/**
 * METHODS
 */
function handleScroll() {
  if (!appNav.value) return;

  if (window.scrollY === 0) {
    appNav.value.classList.remove('shadow-lg');
  } else {
    appNav.value.classList.add('shadow-lg');
  }
}

/**
 * LIFECYCLE
 */
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <AppNavAlert v-if="currentAlert" :alert="currentAlert" />
  <nav id="app-nav" ref="appNav" class="top-0 h-20 pr-1 pl-4 lg:px-6">
    <div class="flex h-full w-full items-center justify-between">
      <router-link
        :to="{ name: 'home' }"
        @click="trackGoal(Goals.ClickNavLogo)"
      >
        <AppIcon v-if="['xs', 'sm'].includes(bp)" />
        <AppLogo v-else />
      </router-link>

      <!-- <img src="./AuroraLogo.svg" v-if="isMobile" /> -->
      <DesktopLinks v-if="isDesktop" class="ml-8 flex font-medium" />

      <AppNavActions class="actions" />
    </div>
  </nav>
</template>

<style scoped>
#app-nav {
  @apply z-30 w-full;
  /* @apply bg-white dark:bg-gray-900; */
  @apply border-b border-transparent;

  transition: all 0.2s ease-in-out;
}

.actions {
  z-index: 999;
}
</style>
