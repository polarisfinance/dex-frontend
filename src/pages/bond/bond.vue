<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useBreakpoints from '@/composables/useBreakpoints';

import polarImg from './polar.svg';
import orbitalImg from './orbital.svg';
import uspImg from './usp.svg';
import ethernalImg from './ethernal.svg';
import binarisImg from './binaris.svg';

const logo = {
  polar: polarImg,
  orbital: orbitalImg,
  usp: uspImg,
  ethernal: ethernalImg,
  binaris: binarisImg,
  tripolar: orbitalImg,
};

const { isMobile, isDesktop } = useBreakpoints();
import { sunriseDefinitions } from './config.js';

const sunrises = computed(() =>
  Object.values(sunriseDefinitions).filter(sunrise => !sunrise.retired)
);

onMounted(() => {});
</script>

<template>
  <div class="sunrise-title py-10">
    <div class="flex-column">
      <div class="sunrise-title-text">Bond</div>
      <div class="sunrise-subtitle-text">Earn premiums upon redemption</div>
    </div>
  </div>
  <div
    :class="{
      sunrisePlaceholder: isDesktop,
      sunrisePlaceholderMobile: isMobile,
    }"
  >
    <div
      v-for="(sunrise, idx) in sunrises"
      :key="idx"
      :class="{ sunriseCard: isDesktop, sunriseCardMobile: isMobile }"
    >
      <img :src="logo[sunrise.name]" class="logo" />
      <div class="sunrise-name mt-[34px]">
        <span>{{ sunrise.name }}</span> BOND
      </div>
      <div class="sunrise-description mt-[12px]">
        <p>
          Bond room for
          <span class="uppercase">{{ '$' + sunrise.name }}</span>
        </p>
      </div>
      <button class="view-and-stake mt-[34px]">
        <router-link :to="'/bond/' + sunrise.name"> View and Bond </router-link>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sunrise-title {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;

  background-image: url('./index_bg.svg');

  font-weight: 600;
  font-size: 42px;
  line-height: 61px;
  text-align: center;
}

.sunrise-subtitle-text {
  color: #be95c0;
  font-weight: 600;
  font-size: 30px;
  line-height: 61px;
  text-align: center;
}

.sunriseCard {
  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 24px 0px;
  flex: 1 1 30%;
  max-width: 30%;
  text-align: center;
}

.sunriseCardMobile {
  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 24px 52px;
  text-align: center;
  width: 100%;
}

.sunrisePlaceholder {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
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
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.sunrise-name {
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
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
  padding: 10px 25px;

  background: #772f7b;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;
}

.view-and-stake:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.view-and-stake:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}

.logo {
  margin: 0 auto;
}
</style>
