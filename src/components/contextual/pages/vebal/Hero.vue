<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const router = useRouter();

/**
 * COMPUTED
 */
const benefits = computed(() => [t('veBAL.hero.benefits.boost'), t('veBAL.hero.benefits.vote'), t('veBAL.hero.benefits.earn')]);

/**
 * METHODS
 */
function navigateToGetVeBAL() {
  router.push({
    name: 'get-vebal',
    query: {
      returnRoute: 'vebal',
    },
  });
}
</script>

<template>
  <div class="hero-container">
    <div class="hero-content">
      <div class="hero-text 2xl:px-0 max-w-md py-8 px-4 lg:py-4 lg:px-8 xl:pt-0">
        <p class="eyebrow font-medium">veBAL</p>
        <h1 class="title mb-5 text-white">
          {{ $t('veBAL.hero.title') }}
        </h1>
        <ul>
          <li v-for="(benefit, i) in benefits" :key="i" class="mb-2 flex items-center text-white">– {{ benefit }}</li>
        </ul>
        <div class="mt-6 flex">
          <BalBtn class="hero-btn btn-gold mr-3" @click="navigateToGetVeBAL">
            {{ $t('veBAL.hero.buttons.getVeBAL') }}
          </BalBtn>
          <BalBtn tag="a" href="https://docs.balancer.fi/ecosystem/vebal-and-gauges" target="_blank" rel="noreferrer" color="white" class="hero-btn" outline>
            {{ $t('veBAL.hero.buttons.learnMore') }}
            <BalIcon name="arrow-up-right" size="sm" class="ml-px transition-colors group-hover:text-pink-500" />
          </BalBtn>
        </div>
      </div>
      <div class="coins">
        <div class="coin group">
          <div class="coin-wrapper w-full">
            <BalImage class="graphic" width="330" height="377" :src="require('@/assets/images/coins/coins-1.png')" alt="BAL and WETH tokens" />
          </div>
          <div class="caption font-semibold">
            <p class="mr-1 inline text-sm tracking-tighter lg:text-base lg:tracking-normal">
              {{ $t('veBAL.hero.tokens.balWETH') }}
            </p>
            <BalTooltip iconSize="xs" textAlign="left" class="mt-1 font-medium">
              {{ $t('veBAL.hero.tokenInfo.balWETH') }}
            </BalTooltip>
          </div>
        </div>
        <div class="coin group">
          <div class="coin-wrapper">
            <BalImage class="graphic" width="330" height="377" :src="require('@/assets/images/coins/coins-2.png')" alt="B-80BAL-20WETH LP token" />
          </div>
          <div class="caption font-semibold">
            <p class="mr-1 inline text-sm tracking-tighter lg:text-base lg:tracking-normal">
              {{ $t('veBAL.hero.tokens.lpToken') }}
            </p>
            <BalTooltip iconSize="xs" textAlign="left" class="mt-1">
              {{ $t('veBAL.hero.tokenInfo.lpToken') }}
            </BalTooltip>
          </div>
        </div>
        <div class="coin group">
          <div class="coin-wrapper">
            <BalImage class="graphic" width="330" height="377" :src="require('@/assets/images/coins/coins-3.png')" alt="veBAL token" />
          </div>
          <div class="caption font-semibold">
            <p class="mr-1 inline text-sm tracking-tighter lg:text-base lg:tracking-normal">
              {{ $t('veBAL.hero.tokens.veBAL') }}
            </p>
            <BalTooltip iconSize="xs" textAlign="left" class="mt-1">
              {{ $t('veBAL.hero.tokenInfo.veBAL') }}
            </BalTooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.hero-container {
  @apply relative flex w-full content-center;

  min-height: 440px;
  z-index: 0;
  background-color: #0b0f19;
}

.dark .hero-container {
  background-color: #0e1420;
}

.hero-container::before {
  content: ' ';
  background-image: url('/images/patterns/fish-scale.png');
  background-repeat: repeat;

  @apply absolute left-0 top-0 z-0 block h-full w-full opacity-10;
}

.dark .hero-container::before {
  opacity: 0.07;
}

.hero-container::after {
  content: ' ';
  background: linear-gradient(45deg, rgb(0 0 0 / 100%), rgb(0 0 0 / 50%)), url('/images/backgrounds/vebal-hero-noise.svg');

  @apply absolute left-0 top-0 z-0 block h-full w-full bg-cover bg-no-repeat opacity-20;

  min-height: 440px;
}

.hero-content {
  @apply z-10 mx-auto flex w-full flex-col py-4 md:flex-row md:items-center md:gap-4
    md:py-8 lg:gap-8 xl:pl-4;
}

.eyebrow {
  @apply mb-4;

  color: #ccb373;
  background: linear-gradient(#ccb373, #977622);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-text {
  @apply opacity-0;

  animation: fadeIn 1s ease-out 0.1s both;
}

.title {
  @apply max-w-sm;
}

.hero-btn {
  min-width: 140px;
}

.btn-gold {
  background: linear-gradient(45deg, #977622, #ccb373);
  transition: 0.5s all ease-in-out;
}

.btn-gold:hover {
  background: linear-gradient(-45deg, #ae8d39, #684e09);
}

.coins {
  @apply flex px-1 lg:gap-8 lg:px-0;

  flex-grow: 1;
}

.coin-wrapper {
  aspect-ratio: 7 / 8;
}

.coin {
  @apply relative flex w-full flex-col items-center justify-end;
}

.graphic {
  @apply relative transition-transform duration-300;
}

.coin:hover .graphic {
  transform: translateY(-8px);
}

.caption {
  @apply text-center text-sm text-gray-400 transition-colors group-hover:text-white md:text-base;

  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}

@media (min-width: 768px) {
  .hero-text {
    min-width: 400px;
  }
}

.caption .bal-icon {
  animation: fadeInMoveUp 0.5s ease-out 0.15s both;
}
</style>
