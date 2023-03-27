<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useFathom from '@/composables/useFathom';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import HeroConnectWalletButton from './HeroConnectWalletButton.vue';


/**
 * TYPES
 */
 type Props = {
  title: string;
  subtitle: string;
};

/**
 * PROPS
 */
 const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
});
/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { trackGoal, Goals } = useFathom();
const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
/**
 * COMPUTED
 */
const classes = computed(() => ({
  // ['h-64']: !isWalletReady.value && !isWalletConnecting.value,
  // ['h-44']: isWalletReady.value || isWalletConnecting.value,
  
}));
</script>

<template>
  <AppHero :class="classes" class="h-64">
    <h1 class="home-title">{{title}}</h1>
    <h1 class="home-subtitle">{{subtitle}}</h1>
  </AppHero>
</template>

<style>
.headline {
  @apply pb-2 text-center font-display text-4xl font-black text-white md:text-5xl;

  font-weight: 600;
  font-variation-settings: 'wght' 700;
}

.home-title {
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}

.home-subtitle {
  font-weight: 400;
  font-size: 36px;
  line-height: 48px;
  text-align: center;
  color: #D7B3FF;
}
</style>
