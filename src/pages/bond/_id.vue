<template>
  <div class="sunrise-title py-10">
    <div class="flex-column">
      <div class="sunrise-title-text uppercase">{{ sunrise.name }}</div>
      <div class="sunrise-subtitle-text">Bond</div>
    </div>
  </div>
  <div :class="{ info: isDesktop, infoMobile: isMobile }">
    Buy & Redeem Bonds. Earn premiums upon redemption
  </div>

  <div
    :class="{ sunrise: isDesktop, sunriseMobile: isMobile }"
    class="justify-center text-center"
  >
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <div class="bond-title">Purchase {{ sunrise.bond }}</div>
      <div
        class="mt-[40px] flex items-center justify-between"
        :class="{ tokenTransition: isDesktop, tokenTransitionMobile: isMobile }"
      >
        <div class="flex-column">
          <img :src="logo[sunrise.name]" />
          <div class="token-name mt-[8px] uppercase">{{ sunrise.name }}</div>
        </div>
        <img src="./arrow.svg" />
        <div class="flex-column">
          <img :src="logo[sunrise.name]" />
          <div class="token-name mt-[8px] uppercase">{{ sunrise.bond }}</div>
        </div>
      </div>
      <div class="details mt-[32px]">
        {{ sunrise.bond }} is available for purchase
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]" v-if="approved">
        <button class="claim-btn" @click="purchase('1')">Purchase</button>
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]" v-else>
        <button class="claim-btn" @click="approve">Approve</button>
      </div>
    </div>
    <div :class="{ data: isDesktop, dataMobile: isMobile }">
      <div>
        <div class="bond-h1">ETHERNAL = {{ currentTwap }} WETH</div>
        <div class="bond-h2">Last-Hour TWAP Price</div>
      </div>
      <div>
        <div class="bond-h1">ETHERNAL = {{ previousEpochTwap }} WETH</div>
        <div class="bond-h2">Previous Epoch TWAP Price</div>
      </div>
      <div>
        <div class="bond-h1">EBOND = {{ bondPrice }} WETH</div>
        <div class="bond-h2">Current Price: (Ethernal)^2</div>
      </div>
    </div>
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <div class="bond-title">Purchase {{ sunrise.bond }}</div>
      <div
        class="mt-[40px] flex items-center justify-between px-[70px]"
        :class="{ tokenTransition: isDesktop, tokenTransitionMobile: isMobile }"
      >
        <div class="flex-column">
          <img :src="logo[sunrise.name]" />
          <div class="token-name mt-[8px] uppercase">{{ sunrise.name }}</div>
        </div>
        <img src="./arrow.svg" />
        <div class="flex-column">
          <img :src="logo[sunrise.name]" />
          <div class="token-name mt-[8px] uppercase">{{ sunrise.bond }}</div>
        </div>
      </div>
      <div class="details mt-[32px]">
        {{ earnedAmount }} {{ sunrise.bond }} Redeemable
      </div>
      <div class="mt-[24px] flex justify-center">
        <button class="claim-btn" @click="redeem">
          Enable when <span class="uppercase">{{ sunrise.name }}</span> > 1.01
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { sunriseDefinitions } from './config.js';
import useBreakpoints from '@/composables/useBreakpoints';

import polarImg from './polar.svg';
import orbitalImg from './orbital.svg';
import uspImg from './usp.svg';
import ethernalImg from './ethernal.svg';
import binarisImg from './binaris.svg';
import tripolarImg from './tripolar.svg';
import useWeb3 from '@/services/web3/useWeb3';

import useBonds from '@/composables/PolarisFinance/useBonds';
import useTreasury from '@/composables/PolarisFinance/useTreasury';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {},

  setup() {
    const route = useRoute();
    const { isMobile, isDesktop } = useBreakpoints();

    const { account, getProvider } = useWeb3();

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

    const purchase = async amount => {
      const tokenName = route.params.id.toString();
      const { purchase } = useBonds(account.value, getProvider(), tokenName);
      await purchase(amount);
    };

    const approve = async () => {
      const tokenName = route.params.id.toString();
      const { approve } = useBonds(account.value, getProvider(), tokenName);
      await approve();
    };

    const redeem = async () => {
      const tokenName = route.params.id.toString();
      const { redeem } = useBonds(account.value, getProvider(), tokenName);
      await redeem();
    };

    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,
      approve,
      purchase,
      redeem,
    };
  },
  async created() {
    const route = useRoute();
    const route_id = route.params.id;
    const { account, getProvider } = useWeb3();

    const result = await fetch(
      `https://graph.polarisfinance.io/subgraphs/name/polaris`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
      query {
        sunrises {
          id,
          type
        }
    }`,
        }),
      }
    );

    const { isApproved, getEarnedAmount } = useBonds(
      account.value,
      getProvider(),
      route_id.toString()
    );
    const { getCurrentTWAP, getLastEpochTWAP } = useTreasury(
      account.value,
      getProvider(),
      route_id.toString()
    );

    const currentTwap = await getCurrentTWAP();
    const twap = parseFloat(currentTwap);

    let bondPrice = 0;
    if (twap >= 1.01) {
      bondPrice = 1 + (twap - 1) * 0.7;
    } else {
      bondPrice = twap;
    }

    this.bondPrice = bondPrice.toString();
    this.currentTwap = currentTwap;
    this.previousEpochTwap = await getLastEpochTWAP();
    this.approved = await isApproved();
    this.earnedAmount = await getEarnedAmount();
  },
  data() {
    return {
      approved: false,
      previousEpochTwap: '-',
      currentTwap: '-',
      bondPrice: '-',
      earnedAmount: '-',
    };
  },
});
</script>

<style scoped>
.sunrise-title {
  @apply flex items-center justify-center bg-cover bg-center px-4 text-center;

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
  margin-top: 100px;
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

  margin-top: 40px;

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
  flex-direction: column;
  gap: 32px;
  justify-content: center;
}

.dataMobile {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 32px;
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
  background: #362d3b;
  border-radius: 12px;
  padding: 10px 35px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #b9babb;
}

/* .claim-btn:hover {
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
} */

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

.bond-h1 {
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.bond-h2 {
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  color: rgba(245, 225, 255, 0.7);
}

.bond-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}

.token-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.tokenTransition {
  padding-left: 70px;
  padding-right: 70px;
}

.tokenTransitionMobile {
  padding-left: 30px;
  padding-right: 30px;
}
</style>
