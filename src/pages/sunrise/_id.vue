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
      Please stake your {{ sunrise.name.toUpperCase() }} in the EARN single
      stake.
    </div>
  </div>
  <div :class="{ info: isDesktop, infoMobile: isMobile }">
    Staked SPOLARs can only be withdrawn after 3 epochs since deposit.
  </div>

  <div
    :class="{ sunrise: isDesktop, sunriseMobile: isMobile }"
    class="justify-center text-center"
  >
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" src="./spolar.svg" />
      <div class="num-tokens">{{ depositedBalance }}</div>
      <div class="details">${{ depositedInDollars }}</div>
      <div class="details">SPOLAR Staked</div>

      <div class="mt-[24px] flex justify-center gap-[12px]" v-if="!approved">
        <button class="claim-btn" @click="approve">Approve Spolar</button>
        <div class="absolute mt-[80px]">
          Withdraw possible in: {{ withdrawTime }}
        </div>
      </div>
      <div class="container mt-[24px] flex justify-center gap-[12px]" v-else>
        <!-- <button class="claim-btn" @click="depositToken(depositAmount)">
          Deposit
        </button> -->
        <button class="claim-btn" @click="toggleSpolarModal(true)">
          Deposit
        </button>
        <SpolarModal
          :depositBol="true"
          :isVisible="isSpolarModalVisible"
          :deposit="depositToken"
          :balance="balance"
          @close="
            toggleSpolarModal();
            fetchData();
          "
        />
        <SpolarModal
          :isVisible="isSpolarWithdrawModalVisible"
          :deposit="depositToken"
          :balance="depositedBalance"
          @close="toggleSpolarWithdrawModal"
        />
        <!-- <button class="withdraw-btn" @click="withdraw(depositAmount)">
          Withdraw
        </button> -->
        <button
          class="withdraw-btn"
          :disabled="!canWithdraw || !(parseFloat(depositedBalance) > 0)"
          @click="toggleSpolarWithdrawModal(false)"
        >
          Withdraw
        </button>
        <div class="absolute mt-[80px]">
          Withdraw possible in: {{ withdrawTime }}
        </div>
      </div>
    </div>
    <div :class="{ data: isDesktop, dataMobile: isMobile }">
      <div class="data-text text-right">
        <div>Next Epoch:</div>
        <div>Current Epoch:</div>
        <div>{{ sunrise.name.toUpperCase() }} Price (TWAP):</div>
        <div>Previous Epoch (TWAP):</div>
        <div>TWAP to print:</div>
        <div>APR:</div>
        <div>SPOLARS Staked</div>
      </div>
      <div class="data-text">
        <div>{{ nextEpoch }}</div>
        <div>{{ epoch }}</div>
        <div>{{ twap }}</div>
        <div>{{ lastEpochTwap }}</div>
        <div>{{ printTwap }}</div>
        <div>{{ APR }}%</div>
        <div>{{ spolarsStaked }}</div>
      </div>
    </div>
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" :src="logo[sunrise.name]" />
      <div class="num-tokens">{{ earned }}</div>
      <div class="details">${{ earnedAmountInDollars }}</div>
      <div class="details">
        <span class="uppercase">{{ sunrise.name }}</span> Earned
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]">
        <button
          class="claim-btn"
          @click="claim"
          :disabled="!(parseFloat(earned) > 0) || !canClaim"
        >
          Claim
        </button>
        <router-link :to="'/singlestake/' + sunrise['name']">
          <button class="single-stake-btn">
            <div class="single-stake-btn-text">Single Stake</div>
          </button>
        </router-link>
        <div class="absolute mt-[80px]">Claim possible in: {{ claimTime }}</div>
      </div>
    </div>
    <div class="w-full">
      <button
        class="claim-btn"
        text-center
        @click="withdrawAll"
        :disabled="!canWithdraw || !(parseFloat(depositedBalance) > 0)"
      >
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

import useSunrise from '../../composables/PolarisFinance/useSunrise';
import useTreasury from '../../composables/PolarisFinance/useTreasury';
import useTokens from '../../composables/PolarisFinance/useTokens';

import SpolarModal from './SpolarModal.vue';
import { parseFixed } from '@ethersproject/bignumber';

import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';
import isDate from 'date-fns/esm/isDate/index.js';
import useEthers from '../../composables/useEthers';

interface PoolPageData {
  id: string;
}

function getLength(number) {
  return number.toString().length;
}

function formatDateNumber(number) {
  return getLength(number) == 2 ? number : '0' + number;
}

function formatDate(hours, minutes, seconds) {
  return (
    formatDateNumber(hours) +
    ':' +
    formatDateNumber(minutes) +
    ':' +
    formatDateNumber(seconds)
  );
}

// async function setDate(event, instance, property, epochTimer = true) {
//   var date = await event();

//   var interval = setInterval(async function () {
//     var now = new Date().getTime();
//     var distance = date.getTime() - now;

//     if (distance >= 0) {
//       var hours = Math.floor(
//         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       var seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       instance[property] = formatDate(hours, minutes, seconds);
//     } else {
//       instance[property] = '00:00:00';
//       if (epochTimer) date = await event();
//       else clearInterval(interval);
//     }
//   }, 1000);
// }

export default defineComponent({
  components: { SpolarModal },
  setup() {
    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();

    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'deposit for sunrise',
      });
    };
    const route = useRoute();
    const route_id = route.params.id;
    var sunriseName = route_id.toString();

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

    const isSpolarModalVisible = ref(false);
    const isSpolarWithdrawModalVisible = ref(false);
    const depositToken = ref(false);

    const toggleSpolarModal = (depositProp: boolean, value?: boolean) => {
      isSpolarModalVisible.value = value ?? !isSpolarModalVisible.value;
      depositToken.value = depositProp;
    };

    const toggleSpolarWithdrawModal = (
      depositProp: boolean,
      value?: boolean
    ) => {
      isSpolarWithdrawModalVisible.value =
        value ?? !isSpolarWithdrawModalVisible.value;
      depositToken.value = depositProp;
    };
    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,

      isSpolarModalVisible,
      isSpolarWithdrawModalVisible,
      toggleSpolarWithdrawModal,
      toggleSpolarModal,
      depositToken,
      account,
      getProvider,
      sunriseName,
      txHandler,
      txListener,
    };
  },
  data() {
    return {
      approved: false,
      depositAmount: '0',
      withdrawAmount: '0',
      epoch: '-',
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
      nextEpochDate: new Date(),
      APR: '-',
      withdrawTime: '-',
      withdrawTimeDate: new Date(),
      claimTime: '-',
      claimTimeDate: new Date(),
      depositedBalance: '-',
      balance: '-',
    };
  },
  methods: {
    async claim() {
      const { claim } = useSunrise(this.sunriseName);
      const tx = await claim(this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.render();
        },
        onTxFailed: () => {},
      });
    },
    async approve() {
      const { approve } = useSunrise(this.sunriseName);
      const tx = await approve(this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.render();
        },
        onTxFailed: () => {},
      });
    },
    async withdrawAll() {
      const amount = this.depositedBalance;
      const formatedAmount = parseFixed(amount, 18);
      const { withdraw } = useSunrise(this.sunriseName);
      const tx = await withdraw(formatedAmount, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.render();
        },
        onTxFailed: () => {},
      });
    },
    async setDate(time: Date) {
      var now = new Date().getTime();
      var distance = time.getTime() - now;

      if (distance >= 0) {
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return formatDate(hours, minutes, seconds);
      } else {
        return '00:00:00';
      }
    },
    async render() {
      const {
        isApproved,
        getEpoch,
        getRewardsEarned,
        canWithdraw,
        canClaimReward,
        getSpolarStaked,
        getBalance,
        getSunriseAPR,
        getUnstakePeriod,
        getClaimPeriod,
      } = useSunrise(this.sunriseName);

      const {
        getLastEpochTWAP,
        getPrintTWAP,
        getCurrentTWAP,
        getNextEpochTime,
      } = useTreasury(this.sunriseName);

      const { getSpolarBalance } = useTokens();

      const { getSpolarPrice, getTokenPriceInUSD } = useTokens();

      // this.nextEpochDate = await getNextEpochTime();
      // this.epoch = await getEpoch();
      // this.spolarsStaked = await getSpolarStaked();
      // this.lastEpochTwap = await getLastEpochTWAP();
      // this.printTwap = await getPrintTWAP();
      // this.twap = await getCurrentTWAP();
      // this.APR = await getSunriseAPR();
      if (this.account === '') {
        [
          this.nextEpochDate,
          this.epoch,
          this.spolarsStaked,
          this.lastEpochTwap,
          this.printTwap,
          this.twap,
          this.APR,
        ] = await Promise.all([
          getNextEpochTime(),
          getEpoch(),
          getSpolarStaked(),
          getLastEpochTWAP(),
          getPrintTWAP(),
          getCurrentTWAP(),
          getSunriseAPR(),
        ]);
      } else {
        let spolarPrice: number;
        let tokenUsdPrice: number;
        [
          this.nextEpochDate,
          this.epoch,
          this.spolarsStaked,
          this.lastEpochTwap,
          this.printTwap,
          this.twap,
          this.APR,
          this.approved,
          this.earned,
          this.canWithdraw,
          this.canClaim,
          this.depositedBalance,
          spolarPrice,
          tokenUsdPrice,
          this.claimTimeDate,
          this.withdrawTimeDate,
        ] = await Promise.all([
          getNextEpochTime(),
          getEpoch(),
          getSpolarStaked(),
          getLastEpochTWAP(),
          getPrintTWAP(),
          getCurrentTWAP(),
          getSunriseAPR(),
          isApproved(this.account),
          getRewardsEarned(this.account),
          canWithdraw(this.account),
          canClaimReward(this.account),
          getBalance(this.account),
          getSpolarPrice(),
          getTokenPriceInUSD(this.sunriseName),
          getClaimPeriod(this.account),
          getUnstakePeriod(this.account),
        ]);
        this.depositedInDollars = (
          parseFloat(this.depositedBalance) * spolarPrice
        )
          .toFixed(2)
          .toString();

        this.earnedAmountInDollars = (parseFloat(this.earned) * tokenUsdPrice)
          .toFixed(2)
          .toString();

        this.balance = await getSpolarBalance(this.account);
      }

      // await setDate(getClaimPeriod, this, 'claimTime');
      // await setDate(getNextEpochTime, this, 'nextEpoch');
    },
  },
  async created() {
    setInterval(
      async () => (this.claimTime = await this.setDate(this.claimTimeDate)),
      1000
    );
    setInterval(
      async () =>
        (this.withdrawTime = await this.setDate(this.withdrawTimeDate)),
      1000
    );
    setInterval(
      async () => (this.nextEpoch = await this.setDate(this.nextEpochDate)),
      1000
    );
    await this.render();
  },
  watch: {
    async account(newAccount, oldAccount) {
      await this.render();
    },
    async nextEpoch(newEpoch, oldEpoch) {
      if (newEpoch === '00:00:00') {
        await this.render();
      }
    },
  },
});
</script>

<style scoped>
.sunrise-title {
  @apply flex items-center justify-center bg-cover bg-center px-4 text-center;

  /*background-image: url('./index_bg.svg');*/

  font-weight: 600;
  font-size: 84px;
  line-height: 104px;
  text-align: center;
  margin: 100px auto;
}

.sunrise-subtitle-text {
  color: #bdb2dd;
  font-weight: 400;
  font-size: 36px;
  line-height: 42px;
  text-align: center;
}

.sunriseWarning {
  background: linear-gradient(
    93.62deg,
    rgba(192, 4, 254, 0.3) 2.98%,
    rgba(126, 2, 245, 0.3) 97.02%
  );
  border-radius: 16px;
  margin-left: 200px;
  margin-right: 200px;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;

  margin-top: 100px;
  align-items: center;
}

.sunriseWarningMobile {
  background: linear-gradient(
    93.62deg,
    rgba(192, 4, 254, 0.3) 2.98%,
    rgba(126, 2, 245, 0.3) 97.02%
  );
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

  color: #d7b3ff;
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

  color: #d7b3ff;
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
  @apply bg-frame-dark;
  padding: 24px 50px;

  border-radius: 22px;

  flex: 1 1 30%;
  max-width: 30%;
  text-align: center;
}

.cardMobile {
  @apply bg-frame-dark;
  gap: 40px;
  border-radius: 22px;
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

.claim-btn:hover,
.claim-btn:active {
  background: linear-gradient(
    93.62deg,
    rgba(192, 4, 254, 0.7) 2.98%,
    rgba(126, 2, 245, 0.7) 97.02%
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

  color: #fdfdfd;
}
.withdraw-btn:hover,
.withdraw-btn:active {
  background: #2e1b46;
}

.withdraw-btn:disabled {
  cursor: not-allowed;
  background: #261737 !important;
  color: rgba(245, 225, 255, 0.7) !important;
  box-shadow: none !important;
}
.claim-btn:disabled {
  cursor: not-allowed;
  background: #261737 !important;
  color: rgba(245, 225, 255, 0.7) !important;
  box-shadow: none !important;
}

.single-stake-btn-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  background: linear-gradient(97.8deg, #7b307f 7.03%, #f89c35 92.27%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}

.single-stake-btn {
  background: #160d22;
  box-shadow: inset -2px -2px 4px #2e1b46, inset 2px 2px 4px #050309;
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
