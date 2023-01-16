<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useFathom from '@/composables/useFathom';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { trackGoal, Goals } = useFathom();

/**
 * COMPUTED
 */
const classes = computed(() => ({
  //['h-72']: !isWalletReady.value && !isWalletConnecting.value,
  //['h-46']: isWalletReady.value || isWalletConnecting.value,
}));
</script>

<template>
  <AppHero :class="classes" class="app-hero">
    <!-- <h1 class="headline" v-text="$t('ammPlatform')" /> -->
    <h1 class="home-title max-w-2xl mx-auto">Put your assests to work.</h1>
    <h1 class="home-subtitle max-w-md mx-auto">Collect fees from pool and rebalance automatically.</h1>
    <template v-if="!isWalletReady && !isWalletConnecting">
      <div class="mt-[60px] flex w-full justify-center">
        <HeroConnectWalletButton class="mr-[16px]" />

        <a
          :href="EXTERNAL_LINKS.Balancer.Home"
          target="_blank"
          rel="noreferrer"
          @click="trackGoal(Goals.ClickStartEarning)"
          class="start-earning-button font-semibold"
        >
          Start earning
        </a>
      </div>
    </template>
  </AppHero>
</template>

<style scoped>
.app-hero{
  margin-top:200px;
}
.headline {
  @apply pb-2 text-center font-display text-4xl font-black text-white md:text-5xl;

  font-weight: 600;
  font-variation-settings: 'wght' 700;
}

.home-title {
  font-weight: 800;
  font-size: 84px;
  line-height: 104px;
  text-align: center;
  color: #fdfdfd;
}

.home-subtitle {
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #A99BC6;
}

.start-earning-button {
  padding: 10px 25px;

  border: 1px solid rgba(64, 51, 71, 0.5);
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
font-size: 16px;
line-height: 20px;
color: #FDFDFD;
}

.start-earning-button:hover {
  background: linear-gradient(
    94.14deg,
    rgba(45, 20, 51, 0.7) 23.11%,
    rgba(57, 28, 65, 0.567) 81.52%
  );
}

.start-earning-button:active {
  background: linear-gradient(
    94.14deg,
    rgba(47, 22, 53, 0.5) 23.11%,
    rgba(52, 25, 58, 0.405) 81.52%
  );
}
</style>
