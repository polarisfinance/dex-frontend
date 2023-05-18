<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import useBackgrounds from '@/composables/useBackgrounds';
import useBreakpoints from '@/composables/useBreakpoints';

const { isSunrise, isBond, isEarn, isAirdrop, isVexpolar, isPortfolio } =
  useBackgrounds();
const { isDesktop } = useBreakpoints();
</script>

<template>
  <div
    class="app-background"
    :class="{
      bond: isBond,
      sunrise: isSunrise,
      earn: isEarn,
      airdrop: isAirdrop,
      vexpolar: isVexpolar,
      portfolio: isPortfolio,
    }"
  >
    <div class="app-body">
      <AppNav />
      <div class="pb-16">
        <router-view v-slot="{ Component }" :key="$route.path">
          <transition appear name="appear">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.app-body {
  @apply mb-8;

  min-height: calc(100vh - 2rem);
}
.dark .app-background {
  background-repeat: no-repeat;
  top: 0px;
  transition: all 0.3s ease-in-out;
  background-image: url('/images/backgrounds/polaris/index.svg');
}
.app-background.sunrise {
  background-image: url('/images/backgrounds/polaris/sunrise_bg.svg');
  background-position-y: 0%;
  background-position-x: center;
}
.app-background.earn {
  background-image: url('/images/backgrounds/polaris/index.svg');
  background-position-y: 0%;
  background-size: contain;
}
.app-background.bond {
  background-image: url('/images/backgrounds/polaris/bond_bg.svg');
  background-position-y: 0%;
  background-position-x: right;
}

.app-background.airdrop {
  background-image: url('/images/backgrounds/polaris/airdrop_bg.svg');
  background-position-y: 0%;
  background-position-x: center;
}
.app-background.vexpolar {
  background-image: url('/images/backgrounds/polaris/vexpolar_bg.svg');
  background-position-y: 0%;
  background-position-x: center;
  width: 100%;
  height: 100%;
}
.app-background.portfolio {
  background-image: url('/images/backgrounds/polaris/portfolio_bg.svg');
  background-position-y: 5%;
  background-position-x: center;
}
</style>
