<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import useBackgrounds from '@/composables/useBackgrounds';
import useBreakpoints from '@/composables/useBreakpoints';

const { isSunrise, isBond, isDawn } = useBackgrounds();
const { isDesktop } = useBreakpoints();
</script>

<template>
  <div class="app-custom-background" :class="{ 'bond-bg': isBond && isDesktop, 'sunrise-bg': isSunrise && isDesktop, 'dawn-bg': isDawn && isDesktop }">
    <div class="app-body">
      <AppNav />
      <div class="pb-16">
        <router-view :key="$route.path" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.VueQueryDevtoolsPanel + button {
  @apply rounded bg-gray-100 p-2 text-sm text-black;
}

.app-body {
  @apply mb-8;

  min-height: calc(100vh - 2rem);
}
.app-custom-background{
  background-repeat: no-repeat;
  top:0px;
}
.sunrise-bg{
  background-image: url('../sunrise/sunrise_bg.svg');
  background-position-y: 0%;
  background-position-x: center;
}
.dawn-bg{
  background-image: url('../dawn_bg.svg');
  background-position-y: 0%;
  background-position-x: right;
}
.bond-bg{
  background-image: url('../bond/bond_bg.svg');
  background-position-y: 0%;
  background-position-x: right;
}
</style>