<template>
  <div class="sunrise-title py-10">
    <div class="flex-column">
      <div class="sunrise-title-text uppercase">{{ sunrise.name }}</div>
      <div class="sunrise-subtitle-text title">Single Stake</div>
    </div>
  </div>
  <div :class="{ info: isDesktop, infoMobile: isMobile }" class="title">
    Earn SPOLAR by depositing ETHERNAL
  </div>

  <div
    :class="{ sunrise: isDesktop, sunriseMobile: isMobile }"
    class="justify-center text-center"
  >
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" :src="logo[sunrise.name]" />
      <div class="num-tokens">{{ balance }}</div>
      <div class="details">${{ depositedInDollars }}</div>
      <div class="details">{{ sunrise.name.toUpperCase() }} Staked</div>

      <div class="mt-[24px] flex justify-center gap-[12px]" v-if="approved">
        <button class="claim-btn" @click="approve">Approve</button>
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]" v-else>
        <!-- <button class="claim-btn" @click="depositToken(depositAmount)">
          Deposit
        </button> -->
        <button class="claim-btn" @click="toggleSpolarModal(true)">
          Deposit
        </button>
        <SpolarModal
          :isVisible="isSpolarModalVisible"
          :deposit="depositToken"
          @close="
            toggleSpolarModal();
            fetchData();
          "
        />
        <SpolarWithdrawModal
          :isVisible="isSpolarWithdrawModalVisible"
          :deposit="depositToken"
          @close="toggleSpolarWithdrawModal"
        />
        <!-- <button class="withdraw-btn" @click="withdraw(depositAmount)">
          Withdraw
        </button> -->
        <button class="withdraw-btn" @click="toggleSpolarWithdrawModal(false)">
          Withdraw
        </button>
      </div>
    </div>
    <div :class="{ data: isDesktop, dataMobile: isMobile }">
      <div class="data-text text-right">
        <div>APR:</div>
        <div>Daily APR:</div>
        <div>TVL:</div>
      </div>
      <div class="data-text">
        <div>{{ APR }}%</div>
        <div>{{ DAILY_APR }}%</div>
        <div>{{ TVL }}</div>
      </div>
    </div>
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" src="./spolar.svg" />
      <div class="num-tokens">{{ earned }}</div>
      <div class="details">${{ earnedAmountInDollars }}</div>
      <div class="details"><span class="uppercase">SPOLAR</span> Earned</div>
      <div class="mt-[24px] flex justify-center gap-[12px]">
        <button
          class="claim-btn"
          @click="claim"
          :disabled="!(parseFloat(earned) > 0)"
        >
          Claim Rewards
        </button>
      </div>
    </div>
    <div class="w-full">
      <button class="claim-btn" text-center @click="withdraw(depositAmount)">
        Claim and withdraw
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import { useRoute } from 'vue-router';
import { sunriseDefinitions } from './config';
import useBreakpoints from '@/composables/useBreakpoints';

import polarImg from './polar.svg';
import orbitalImg from './orbital.svg';
import uspImg from './usp.svg';
import ethernalImg from './ethernal.svg';
import binarisImg from './binaris.svg';
import tripolarImg from './tripolar.svg';

import useWeb3 from '@/services/web3/useWeb3';

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
      tripolar: tripolarImg,
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

    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,
    };
  },
  data() {
    return {
      approved: false,
      DAILY_APR: '-',
      epoch: '-',
      balance: '-',
      earned: '-',
      canWithdraw: false,
      canClaim: false,
      spolarsStaked: '-',
      lastEpochTwap: '-',
      twap: '-',
      printTwap: '-',
      depositedInDollars: '-',
      earnedAmountInDollars: '-',
      nextEpoch: '-',
      APR: '-',
      withdrawTime: '-',
      claimTime: '-',
      TVL: '-',
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {},
  },
});
</script>

<style scoped>
.title {
  color: #d7b3ff !important;

  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}

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

  background: #1e0d2c;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  flex: 1 1 30%;
  max-width: 30%;
  text-align: center;
}

.cardMobile {
  gap: 40px;
  background: #1e0d2c;
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
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
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
  background: #160d22;
  box-shadow: inset -2px -2px 4px #2e1b46, inset 2px 2px 4px #050309;
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

.sunrise-input,
select,
textarea {
  color: black;
}

.timer-text {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 15px;

  color: #ffffff;
}
</style>
