<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useBreakpoints from '@/composables/useBreakpoints';
import BondPageHero from '@/components/heros/BondPageHero.vue';

import polarImg from './Pbond.svg';
import orbitalImg from './Obond.svg';
import uspImg from './USPbond.svg';
import ethernalImg from './Ebond.svg';
import binarisImg from './Bbond.svg';
import tripolarImg from './tripolar.svg';

const logo = {
  polar: polarImg,
  orbital: orbitalImg,
  usp: uspImg,
  ethernal: ethernalImg,
  binaris: binarisImg,
  tripolar: tripolarImg,
};

const { isMobile, isDesktop } = useBreakpoints();
import { sunriseDefinitions } from './config';

const sunrises = computed(() => Object.values(sunriseDefinitions).filter(sunrise => !sunrise.retired));
</script>

<template>
  <BondPageHero />
  <div class="container mx-auto">
    <div class="grid gap-6" :class="{ 'grid-cols-3': isDesktop, 'grid-cols-1': isMobile }">
      <div v-for="(sunrise, idx) in sunrises" :key="idx" :class="{ sunriseCard: isDesktop, sunriseCardMobile: isMobile }">
        <img :src="logo[sunrise.name]" class="logo" />
        <div class="sunrise-name mt-[34px]">{{ sunrise.name }}</div>
        <div class="sunrise-description mt-[12px] p-[10px]">
          <p>
            Stake your $SPOLAR to earn
            <span class="uppercase">{{ '$' + sunrise.name }}</span>
          </p>
        </div>
        <router-link :to="'/bond/' + sunrise.name">
          <button class="view-and-stake mt-[34px]">View and Stake</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sunrise-title {
  @apply flex items-center justify-center bg-cover bg-center px-4 text-center;

  font-weight: 600;
  font-size: 42px;
  line-height: 61px;
  text-align: center;
}
.sunrise-subtitle-text {
  color: rgba(215, 178, 255, 1);
  font-weight: 600;
  font-size: 30px;
  line-height: 61px;
  text-align: center;
}

.sunriseCard {
  @apply bg-frame-dark;
  border-radius: 22px;
  padding: 24px 0px;
  flex: 1 1 30%;
  text-align: center;
}

.sunriseCardMobile {
  @apply bg-frame-dark;
  border-radius: 16px;
  padding: 24px 52px;
  text-align: center;
  width: 100%;
}

.sunrisePlaceholder {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  gap: 24px;
  padding-left: 165px;
  padding-right: 165px;
  margin-top: 100px;
}

.sunrisePlaceholderMobile {
  padding-left: 24px;
  padding-right: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.sunrise-name {
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 51px;

  color: #ffffff;
  text-transform: uppercase;
}

.sunrise-description {
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;

  color: rgba(245, 225, 255, 0.7);
}

.view-and-stake {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  padding: 10px 25px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;
}

.view-and-stake:hover,
.view-and-stake:active {
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.logo {
  margin: 0 auto;
}
</style>
