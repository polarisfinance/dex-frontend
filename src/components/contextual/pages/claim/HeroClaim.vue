<script setup lang="ts"></script>

<template>
  <div class="bg">
    <div class="hero-container w-full">
      <div class="hero-content">
        <div class="hero-text fade-in-slow">
          <h1 class="title text-shadow mb-3 text-white">
            {{ $t('claimHero.title') }}
          </h1>
          <p class="body-text text-shadow max-w-3xl">
            {{ $t('claimHero.description') }}
          </p>
        </div>
      </div>
      <div class="hero-graphic-container">
        <div
          class="fade-in-slow grid w-full grid-cols-2 items-center gap-8 sm:grid-cols-4 sm:gap-4 xl:gap-12"
        >
          <div class="tip group">
            <img
              width="144"
              height="144"
              class="tip-icon"
              src="@/assets/images/icons/claims-header/add-liquidity.svg"
            />
            <p class="tip-label text-shadow font-semibold">
              {{ $t('claimHero.tipLabel.addLiquidity') }}
              <BalTooltip
                iconSize="xs"
                textAlign="left"
                class="relative top-px"
                iconClass="text-white"
                width="60"
              >
                {{ $t('claimHero.tips.addLiquidity') }}
              </BalTooltip>
            </p>
          </div>
          <div class="tip group">
            <img
              width="144"
              height="144"
              class="tip-icon"
              src="@/assets/images/icons/claims-header/stake.svg"
            />
            <p class="tip-label text-shadow font-semibold">
              {{ $t('claimHero.tipLabel.stake') }}
              <BalTooltip
                iconSize="xs"
                textAlign="left"
                class="relative top-px"
                iconClass="text-white"
                width="60"
              >
                {{ $t('claimHero.tips.stake') }}
              </BalTooltip>
            </p>
          </div>
          <div class="tip group">
            <img
              width="144"
              height="144"
              class="tip-icon"
              src="@/assets/images/icons/claims-header/vebal.svg"
            />
            <p class="tip-label text-shadow font-semibold">
              {{ $t('claimHero.tipLabel.boost') }}
              <BalTooltip
                iconSize="xs"
                textAlign="left"
                class="relative top-px"
                iconClass="text-white"
                width="60"
              >
                {{ $t('claimHero.tips.boost') }}
              </BalTooltip>
            </p>
          </div>
          <div class="tip group">
            <img
              width="144"
              height="144"
              class="tip-icon"
              src="@/assets/images/icons/claims-header/claim.svg"
            />
            <p class="tip-label text-shadow font-semibold">
              {{ $t('claimHero.tipLabel.claim') }}
              <BalTooltip
                iconSize="xs"
                textAlign="left"
                class="relative top-px"
                iconClass="text-white"
                width="60"
              >
                {{ $t('claimHero.tips.claim') }}
              </BalTooltip>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  @apply relative bg-gradient-to-r from-pink-500 to-yellow-500;

  background-image: url('/images/backgrounds/claims-header.svg');

  @apply bg-cover bg-center bg-no-repeat;
}

.hero-container {
  @apply grid grid-cols-1 px-4 lg:grid-cols-3 xl:container xl:mx-auto;
}

.hero-graphic-container {
  @apply flex w-full items-center px-4 py-8 lg:col-span-2 xl:p-8;
}

.hero-content {
  @apply relative flex w-full items-center pt-8 lg:py-4;
}

.hero-text {
  @apply opacity-0;
}

.body-text {
  @apply pb-0 font-medium text-white;

  text-shadow: 0 1px 0 rgb(0 0 0 / 15%), 4px 4px 8px rgb(0 0 0 / 15%);
}

.tip {
  @apply flex flex-col items-center text-center;
}

.tip-icon {
  @apply w-20 pb-4 transition-transform duration-300 md:w-24 lg:w-full;
}

.tip-label {
  @apply leading-5 text-white transition-colors;
}

.tip:hover .tip-icon {
  /* Tailwind class -translate-y-2 not working for some reason here */
  transform: translateY(-8px);
}

.tip-number {
  @apply block pb-1;
}
</style>
