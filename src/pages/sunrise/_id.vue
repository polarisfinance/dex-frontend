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
      Please stake your ETHERNAL in the DAWN single stake.
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
      <div class="num-tokens">{{ balance }}</div>
      <div class="details">${{ depositedInDollars }}</div>
      <div class="details">SPOLAR Staked</div>

      <div class="mt-[24px] flex justify-center gap-[12px]" v-if="!approved">
        <button class="claim-button" @click="approveSpolar">
          Approve Spolar
        </button>
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
          :deposit="deposit"
          @close="toggleSpolarModal"
        />
        <!-- <button class="withdraw-btn" @click="withdrawToken(depositAmount)">
          Withdraw
        </button> -->
        <button class="withdraw-btn" @click="toggleSpolarModal(false)">
          Withdraw
        </button>
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
        <div>18:20</div>
        <div>{{ epoch }}</div>
        <div>{{ twap }}</div>
        <div>{{ lastEpochTwap }}</div>
        <div>{{ printTwap }}</div>
        <div>429%</div>
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
        <button class="claim-btn" @click="claim">Claim</button>
        <button class="single-stake-btn">
          <div class="single-stake-btn-text">Single Stake</div>
        </button>
      </div>
    </div>
    <button class="claim-btn" text-center @click="withdrawToken(depositAmount)">
      Claim and withdraw
    </button>
  </div>
  <div>
    <p>Deposit</p>
    <input class="sunrise-input" v-model="depositAmount" />
    <button @click="depositToken(depositAmount)">Deposit</button>
    <p>Withdraw</p>
    <input class="sunrise-input" v-model="withdrawAmount" />
    <button @click="withdrawToken(depositAmount)">Withdraw</button>
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

import config from '@/lib/config/aurora.json';
import Web3 from 'web3';

import useWeb3 from '@/services/web3/useWeb3';

import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

import useSunrise from '../../composables/PolarisFinance/useSunrise';
import useTreasury from '../../composables/PolarisFinance/useTreasury';
import useTokens from '../../composables/PolarisFinance/useTokens';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {},
  setup() {
    const claimABIs = {
      binaris: JSON.parse(
        `[{ "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
      ),
      orbital: JSON.parse(`[{
        "inputs": [],
        "name": "claimReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      usp: JSON.parse(
        `[{ "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
      ),
      ethernal: JSON.parse(
        `[{ "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
      ),
      polar: JSON.parse(
        `[{ "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
      ),
      tripolar: JSON.parse(
        `[{ "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
      ),
    };

    const withdrawABIs = {
      polar: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      binaris: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      orbital: JSON.parse(`[{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      usp: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      tripolar: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      ethernal: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
    };

    const depositABIs = {
      binaris: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      orbital: JSON.parse(`[{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      ethernal: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      usp: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      tripolar: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
      polar: JSON.parse(`[{
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`),
    };

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

    async function depositToken(amount) {
      const address = await getSunriseAddress();
      const depositAmount = BigNumber.from(amount).toString();
      const route_id = route.params.id;

      const abi = depositABIs[route_id.toString()];

      if (address) {
        try {
          const tx = await sendTransaction(
            getProvider(),
            address,
            abi,
            'stake',
            [depositAmount]
          );

          return tx;
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      }
    }

    async function withdrawToken(amount) {
      const address = await getSunriseAddress();
      const withdrawAmount = BigNumber.from(amount).toString();
      const route_id = route.params.id;

      const abi = withdrawABIs[route_id.toString()];

      if (address) {
        try {
          const tx = await sendTransaction(
            getProvider(),
            address,
            abi,
            'withdraw',
            [withdrawAmount]
          );

          return tx;
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      }
    }

    async function approveToken(
      address: string,
      spender: string,
      abi
    ): Promise<TransactionResponse> {
      const amount = MaxUint256.toString();

      try {
        const tx = await sendTransaction(
          getProvider(),
          address,
          abi,
          'approve',
          [spender, amount]
        );

        return tx;
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }

    async function getSunriseAddress() {
      type Sunrises = [{ id: string; type: string }];

      const result = await fetch(
        `https://api.thegraph.com/subgraphs/name/polarisfinance/polaris-subgraph`,
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
      const result_json = await result.json();
      const sunrises: Sunrises = result_json['data']['sunrises'];

      const route_id = route.params.id;
      var sunriseName = '';

      for (let sunrise of Object.values(sunriseDefinitions)) {
        if (sunrise.name == route_id) sunriseName = sunrise.name;
      }

      if (sunriseName != '') {
        var sunriseAddress = '';

        for (let s of Object.values(sunrises)) {
          if (s.type.toLowerCase() == sunriseName) sunriseAddress = s.id;
        }

        return sunriseAddress;
      }

      return undefined;
    }

    async function approveSpolar() {
      const web3 = new Web3(config.rpc);

      const abi = JSON.parse(
        `[{
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      }]`
      );

      const sunriseAddress = await getSunriseAddress();

      if (sunriseAddress) {
        approveToken(
          '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729', // Spolar
          sunriseAddress,
          abi
        );
      }
    }

    async function claim() {
      const route_id = route.params.id;
      const abi = claimABIs[route_id.toString()];

      const address = await getSunriseAddress();

      try {
        if (address) {
          const tx = await sendTransaction(
            getProvider(),
            address,
            abi,
            'claimReward',
            []
          );
          return tx;
        }
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }
    const isSpolarModalVisible = ref(false);
    const deposit = ref(false);
    const toggleSpolarModal = (depositProp: boolean, value?: boolean) => {
      isSpolarModalVisible.value = value ?? !isSpolarModalVisible.value;
      deposit.value = depositProp;
      console.log(deposit.value);
    };
    return {
      // data
      ...toRefs(data),
      isMobile,
      isDesktop,
      logo,

      // computed
      sunrise,
      approveSpolar,
      depositToken,
      withdrawToken,
      claim,

      isSpolarModalVisible,
      toggleSpolarModal,
      deposit,
    };
  },
  data() {
    return {
      approved: false,
      depositAmount: '0',
      withdrawAmount: '0',
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
    };
  },
  async created() {
    const route = useRoute();
    const { account, getProvider } = useWeb3();

    const result = await fetch(
      `https://api.thegraph.com/subgraphs/name/polarisfinance/polaris-subgraph`,
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

    const route_id = route.params.id;
    var sunriseName = route_id.toString();

    const {
      isApproved,
      getEpoch,
      getRewardsEarned,
      canWithdraw,
      canClaimReward,
      getSpolarStaked,
      getBalance,
    } = useSunrise(account.value, getProvider(), sunriseName);

    const { getLastEpochTWAP, getPrintTWAP, getCurrentTWAP } = useTreasury(
      account.value,
      getProvider(),
      sunriseName
    );

    const { getSpolarPrice, getTokenPriceInUSD } = useTokens();

    this.approved = await isApproved();

    this.epoch = await getEpoch();
    this.earned = await getRewardsEarned();
    this.canWithdraw = await canWithdraw();
    this.canClaim = await canClaimReward();
    this.spolarsStaked = await getSpolarStaked();
    this.balance = await getBalance();

    this.lastEpochTwap = await getLastEpochTWAP();
    this.printTwap = await getPrintTWAP();
    this.twap = await getCurrentTWAP();

    const spolarPrice = await getSpolarPrice();
    const tokenUsdPrice = await getTokenPriceInUSD(sunriseName);

    this.depositedInDollars = (
      parseFloat(this.balance) * spolarPrice
    ).toString();

    this.earnedAmountInDollars = (
      parseFloat(this.balance) * tokenUsdPrice
    ).toString();
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

.sunrise-input,
select,
textarea {
  color: black;
}
</style>
