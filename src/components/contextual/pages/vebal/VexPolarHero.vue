<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useBreakpoints from '@/composables/useBreakpoints';

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const router = useRouter();
const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();

/**
 * COMPUTED
 */
const benefits = computed(() => [
  t('veBAL.hero.benefits.boost'),
  t('veBAL.hero.benefits.vote'),
  t('veBAL.hero.benefits.earn'),
]);

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
  <div class="title">
    <img src="./bubble.svg" />
    <div class="title-text">
      <div class="leading-[82px]">Extra earnings <br />& voting power</div>
      <div class="flex justify-center gap-[28px] mt-[16px]">
        <BalLink :href="`/#/${networkSlug}/get-vexpolar?returnRoute=vebal`">
          <BalBtn color="gradient" class="leading-4 get-btn">
            Lock LP to get VexPolar
          </BalBtn>
        </BalLink>
        <a
          href="https://medium.com/@PolarisFinance/polaris-dex-917e45c4869c"
          target="_blank"
          class="learn-btn"
          >Learn More</a
        >
      </div>
    </div>
  </div>
  <div
    :class="{
      'info-container': isDesktop,
      'info-container-mobile': isMobile,
    }"
    class="mt-[160px]"
  >
    <div class="info">
      <div class="info-title">
        Boost liquidity mining<br />
        yield up to 2.5x
      </div>
      <div class="info-token">
        <img class="w-[124px]" src="./xpolar.svg" />
      </div>
      <div class="info-subtitle">XPOLAR</div>
    </div>
    <div class="info">
      <div class="info-title">
        Vote to direct liquidity <br />
        mining emissions
      </div>
      <div class="info-token">
        <img class="w-[124px]" src="./polar-fancy.svg" />
      </div>
      <div class="info-subtitle">SPOLAR</div>
    </div>
    <div class="info">
      <div class="info-title">
        Earn your share of <br />
        protocol revenue
      </div>
      <div class="info-token">
        <img class="w-[124px]" src="./near.svg" />
      </div>
      <div class="info-subtitle">NEAR</div>
    </div>
  </div>
</template>

<style scoped>
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  text-align: center;
  color: #fdfdfd;
}

.get-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #f5f5f5;

  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 50px;
  padding-right: 50px;
}

.learn-btn {
  border: 1px solid rgba(64, 51, 71, 0.5);
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #f5f5f5;

  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 50px;
  padding-right: 50px;
}
.info-token {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  width: 100%;
}

.info-container-mobile {
  display: flex;
  flex-direction: column;
}

.info-subtitle {
  text-align: center;

  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-top: 24px;

  color: #fdfdfd;
}

.info-container {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.info-title {
  color: #d7b3ff;
  text-align: center;

  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
  text-align: center;
}

.info {
  display: flex;
  flex-direction: column;
}
</style>