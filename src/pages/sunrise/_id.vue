<template>
  <div class="sunrise-title py-10">
    <div class="flex-column">
      <div class="sunrise-title-text uppercase">{{ sunrise.name }}</div>
      <div class="sunrise-subtitle-text">Sunrise</div>
    </div>
  </div>
  <div
    class="flex justify-center"
    :class="{ sunriseWarning: isDesktop, sunriseWarningMobile: isMobile }"
  >
    <img src="./alert.svg" class="mr-[12px]" />
    <div>
      As we are in recovery mode, it is important to not sell your reward.
      Please stake your ETHERNAL in the DAWIN single stake.
    </div>
  </div>
  <div :class="{ info: isDesktop, infoMobile: isMobile }">
    Staked SPOLARs can only be withdrawn after 3 epochs since deposit.
  </div>

  <div
    :class="{ sunrise: isDesktop, sunriseMobile: isMobile }"
    class="text-center justify-center"
  >
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" src="./spolar.svg" />
      <div class="num-tokens">100</div>
      <div class="details">$832.32</div>
      <div class="details">SPOLAR Staked</div>
      <div class="flex justify-center mt-[24px] gap-[12px]">
        <button class="claim-btn">Deposit</button>
        <button class="withdraw-btn">Withdraw</button>
      </div>
    </div>
    <div :class="{ data: isDesktop, dataMobile: isMobile }">
      <div class="data-text text-right">
        <div>Next Epoch:</div>
        <div>Current Epoch:</div>
        <div>ETHERNAL Price (TWAP):</div>
        <div>Previous Epoch (TWAP):</div>
        <div>TWAP to print:</div>
        <div>APR:</div>
        <div>SPOLARS Staked</div>
      </div>
      <div class="data-text">
        <div>
          <!-- {{ time }} -->
        </div>
        <div>134</div>
        <div>0.6034</div>
        <div>0.6030</div>
        <div>0.6000</div>
        <div>429%</div>
        <div>11234.4966</div>
      </div>
    </div>
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" :src="logo[sunrise.name]" />
      <div class="num-tokens">0.85</div>
      <div class="details">$980.2</div>
      <div class="details">
        <span class="uppercase">{{ sunrise.name }}</span> Earned
      </div>
      <div class="flex justify-center mt-[24px] gap-[12px]">
        <button class="claim-btn">Claim</button>
        <button class="single-stake-btn">
          <div class="single-stake-btn-text">Single Stake</div>
        </button>
      </div>
    </div>
    <button class="claim-btn" text-center>Claim and withdraw</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { sunriseDefinitions } from './config';
import useBreakpoints from '@/composables/useBreakpoints';
import usePolarisFinance from '@/composables/usePolarisFinance';

import polarImg from './polar.svg';
import orbitalImg from './orbital.svg';
import uspImg from './usp.svg';
import ethernalImg from './ethernal.svg';
import binarisImg from './binaris.svg';
import tripolarImg from './tripolar.svg';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {},

  setup() {
    const route = useRoute();
    const { isMobile, isDesktop } = useBreakpoints();

    const logo = {
      polar: polarImg,
      orbital: orbitalImg,
      usp: uspImg,
      ethernal: ethernalImg,
      binaris: binarisImg,
      tripolar: orbitalImg,
    };
    const data = reactive<PoolPageData>({
      id: route.params.id as string,
    });

    const sunrise = computed(() => {
      for (let sunrise of Object.values(sunriseDefinitions)) {
        if (sunrise.name == data.id) return sunrise;
      }
      return undefined;
    });

    const PolarisFinance = usePolarisFinance().pf;
    // doesnt work as it can be undefined
    // const time = usePolarisFinance().pf.value.getTreasuryNextAllocationTime(
    //   sunrise.value
    // );

    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,
      PolarisFinance,
      // time,
    };
  },
  // async mounted() {
  //   const PolarisFinance = usePolarisFinance();
  //   return { PolarisFinance };
  // },
});
</script>

<style scoped>
.sunrise-title {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;

  background-image: url('./index_bg.svg');

  font-weight: 600;
  font-size: 48px;
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

.sunriseWarning {
  background: #7b307f;
  border-radius: 16px;
  margin-left: 278px;
  margin-right: 278px;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;

  margin-top: 100px;
  align-items: center;
}

.sunriseWarningMobile {
  background: #7b307f;
  border-radius: 16px;
  margin-left: 24px;
  margin-right: 24px;
  padding: 8px 10px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;

  margin-top: 40px;
}

.info {
  font-weight: 500;
  font-size: 24px;
  line-height: 31px;

  color: rgba(245, 225, 255, 0.7);
  text-align: center;
  margin-left: 380px;
  margin-right: 380px;
  margin-top: 12px;
}

.infoMobile {
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 24px;
  text-align: center;

  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  text-align: center;

  color: rgba(245, 225, 255, 0.7);
}

.sunrise {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-top: 32px;
}

.sunriseMobile {
  display: flex;
  flex-direction: column;
  margin-left: 24px;
  margin-right: 24px;
  gap: 24px;
  margin-top: 40px;
}

.card {
  padding: 24px 50px;

  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  flex: 1 1 30%;
  max-width: 30%;
  text-align: center;
}

.cardMobile {
  gap: 40px;
  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 24px;
}

.data {
  flex: 1 1 30%;
  max-width: 30%;
  display: flex;
  gap: 50px;
  justify-content: center;
}

.dataMobile {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.num-tokens {
  font-weight: 600;
  font-size: 40px;
  line-height: 51px;

  color: #ffffff;
  margin-top: 32px;
}

.logo {
  margin: 0 auto;
}

.details {
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;

  color: rgba(245, 225, 255, 0.7);
}

.claim-btn {
  background: #772f7b;
  border-radius: 12px;
  padding: 10px 35px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;
}

.claim-btn:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.claim-btn:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}

.withdraw-btn {
  background: #231928;
  border-radius: 12px;
  padding: 10px 35px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #be95c0;
}

.single-stake-btn-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  background: linear-gradient(
    90.64deg,
    #fbaaff -20.45%,
    #f89c35 36.77%,
    #7b307f 100.27%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}

.single-stake-btn {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 10px 35px;
}

.data-text {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
  gap: 24px;
}
</style>
