<template>
  <div class="sunrise-title py-10">
    <div class="flex-column">
      <div class="sunrise-title-text uppercase">{{ sunrise.name }}</div>
      <div class="sunrise-subtitle-text title">Single Stake</div>
    </div>
  </div>
  <div :class="{ info: isDesktop, infoMobile: isMobile }" class="title">
    Earn XPOLAR by depositing {{ sunrise.name.toUpperCase() }}
  </div>

  <div
    :class="{ sunrise: isDesktop, sunriseMobile: isMobile }"
    class="justify-center text-center"
  >
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" :src="logo[sunrise.name]" />
      <div class="num-tokens">{{ balance }}</div>
      <!-- <div class="details">${{ depositedInDollars }}</div> -->
      <div class="details">{{ sunrise.name.toUpperCase() }} Staked</div>

      <div class="mt-[24px] flex justify-center gap-[12px]" v-if="!approved">
        <button class="claim-btn" @click="approve">Approve</button>
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]" v-else>
        <!-- <button class="claim-btn" @click="depositToken(depositAmount)">
          Deposit
        </button> -->
        <button class="claim-btn" @click="toggleStakeModal()">Deposit</button>
        <StakeModal
          :depositBol="true"
          :isVisible="isStakeModalVisible"
          :token="sunrise.name.toUpperCase()"
          :balance="balanceFor(tokenAddress)"
          :address="tokenAddress"
          @close="toggleStakeModal()"
        />
        <!-- <button class="withdraw-btn" @click="withdraw(depositAmount)">
          Withdraw
        </button> -->
        <button class="withdraw-btn" @click="toggleUnstakeModal()">
          Withdraw
        </button>
        <StakeModal
          :depositBol="false"
          :isVisible="isUnstakeModalVisible"
          :token="sunrise.name.toUpperCase()"
          :balance="balance"
          :address="tokenAddress"
          @close="toggleUnstakeModal()"
        />
      </div>
    </div>
    <div :class="{ data: isDesktop, dataMobile: isMobile }">
      <div class="data-text text-right">
        <div>APR:</div>
        <div>Daily APR:</div>
        <!-- <div>TVL:</div> -->
      </div>
      <div class="data-text">
        <div>{{ APR }}%</div>
        <div>{{ DAILY_APR }}%</div>
        <!-- <div>{{ TVL }}</div> -->
      </div>
    </div>
    <div :class="{ card: isDesktop, cardMobile: isMobile }">
      <img class="logo" src="./xpolar.png" width="80" height="80" />
      <div class="num-tokens">{{ earned }}</div>
      <!-- <div class="details">${{ earnedAmountInDollars }}</div> -->
      <div class="details"><span class="uppercase">xpolar</span> Earned</div>
      <div class="mt-[24px] flex justify-center gap-[12px]">
        <button
          class="claim-btn"
          @click="claim()"
          :disabled="!(parseFloat(earned) > 0)"
        >
          Claim Rewards
        </button>
      </div>
    </div>
    <div class="w-full">
      <button class="claim-btn" text-center @click="withdrawEverything()">
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

import PbondImg from './bond/Pbond.svg';
import ObondImg from './bond/Obond.svg';
import USPbondImg from './bond/USPbond.svg';
import EbondImg from './bond/Ebond.svg';
import BbondImg from './bond/Bbond.svg';

import useWeb3 from '@/services/web3/useWeb3';

import useStake from '../composables/PolarisFinance/useStake';
import StakeModal from './pool/StakeModal.vue';
import useTokens from '@/composables/useTokens';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from '../composables/PolarisFinance/utils';
interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: { StakeModal },
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

      pbond: PbondImg,
      obond: ObondImg,
      uspbond: USPbondImg,
      ebond: EbondImg,
      bbond: BbondImg,
    };
    const data = reactive<PoolPageData>({
      id: route.params.id as string,
    });

    const sunrise = computed(() => {
      for (let sunrise of Object.values(sunriseDefinitions)) {
        if (sunrise.name == data.id) return sunrise;
      }
      if (
        ['OBOND', 'EBOND', 'USPBOND', 'BBOND', 'PBOND'].includes(
          data.id.toUpperCase()
        )
      ) {
        return { name: data.id };
      }
      return undefined;
    });

    const tokenAddress = computed(() => {
      for (let sunrise of Object.values(sunriseDefinitions)) {
        if (sunrise.name == data.id) return sunrise.tokenAddress;
      }
      if (
        ['OBOND', 'EBOND', 'USPBOND', 'BBOND', 'PBOND'].includes(
          data.id.toUpperCase()
        )
      ) {
        for (let sunrise of Object.values(sunriseDefinitions)) {
          if (sunrise.bond == data.id.toUpperCase())
            return sunrise.bondTokenAddress;
        }
      }
      return undefined;
    });
    const isStakeModalVisible = ref(false);
    const isUnstakeModalVisible = ref(false);

    const toggleStakeModal = (value?: boolean) => {
      isStakeModalVisible.value = value ?? !isStakeModalVisible.value;
    };

    const toggleUnstakeModal = (value?: boolean) => {
      isUnstakeModalVisible.value = value ?? !isUnstakeModalVisible.value;
    };

    const { balanceFor } = useTokens();
    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();

    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'approve for staking',
      });
    };
    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,
      isStakeModalVisible,
      isUnstakeModalVisible,
      toggleStakeModal,
      toggleUnstakeModal,
      tokenAddress,
      account,
      balanceFor,
      txHandler,
      txListener,
      getProvider,
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
      tokenWalletBalance: '0',
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const { balance, pendingShare, walletBalance, isApproved } = useStake();
      this.balance = await balance(this.tokenAddress, this.account);
      this.earned = BigNumberToString(
        await pendingShare(this.tokenAddress, this.account),
        14,
        4
      );
      this.approved = await isApproved(this.tokenAddress, this.account);
    },
    async approve() {
      const { approve } = useStake();
      const tx = await approve(this.tokenAddress, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchData();
        },
        onTxFailed: () => {},
      });
    },
    async claim() {
      const { withdraw } = useStake();
      const tx = await withdraw(
        this.tokenAddress,
        BigNumber.from(0),
        this.getProvider()
      );
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchData();
        },
        onTxFailed: () => {},
      });
    },
    async withdrawEverything() {
      const { withdrawAll } = useStake();
      const tx = await withdrawAll(
        this.tokenAddress,
        this.account,
        this.getProvider()
      );
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchData();
        },
        onTxFailed: () => {},
      });
    },
  },
  watch: {
    async account(newAccount, oldAccount) {
      await this.fetchData();
    },
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
