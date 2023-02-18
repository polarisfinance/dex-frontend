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
const nvb = ref<HTMLDivElement>();

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
  if (!nvb.value) return;

  if (window.scrollY === 0) {
    appNav.value.classList.remove('shadow-lg');
    nvb.value.classList.remove('navbar-bg');
  } else {
    appNav.value.classList.add('shadow-lg');
    nvb.value.classList.add('navbar-bg');
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
  <div class="z-30 h-full w-full top-0 sticky" id="menuConatiner">
    <AppNavAlert v-if="currentAlert" :alert="currentAlert" />
    <nav id="app-nav" ref="appNav" class="h-20 pr-1 pl-4 lg:px-6 ">
      <div ref="nvb" class="flex h-full w-full items-center justify-between px-10">
        <router-link
          :to="{ name: 'home' }"
          @click="trackGoal(Goals.ClickNavLogo)"
        >
          <AppIcon v-if="['xs', 'sm'].includes(bp)" />
          <AppLogo v-else />
        </router-link>

        <!-- <img src="./AuroraLogo.svg" v-if="isMobile" /> -->
        <DesktopLinks v-if="isDesktop" class="flex font-medium" />

        <AppNavActions class="actions" />
      </div>
    </nav>
  </div>
</template>

<style scoped>
#app-nav {
  @apply z-30 w-full;
  /* @apply bg-white dark:bg-gray-900; */
  @apply border-b border-transparent;

  transition: all 0.2s ease-in-out;
  background: transparent;
  padding: 0px;
}

.actions {
  z-index: 999;
}

.navbar-bg {
  background: linear-gradient(
    90.08deg,
    rgba(19, 7, 25, 0.7) -0.61%,
    rgba(19, 7, 25, 0.7) 100%
  );
  backdrop-filter: blur(10px);
}
</style>
