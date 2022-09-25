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
      <div v-if="approved == '0'">
        <button class="claim-button" @click="approveSpolar">
          Approve Spolar
        </button>
      </div>
      <div class="mt-[24px] flex justify-center gap-[12px]" v-else>
        <button class="claim-btn" @click="depositToken(depositAmount)">
          Deposit
        </button>
        <button class="withdraw-btn" @click="withdrawToken(depositAmount)">
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
import { Contract } from 'ethers';

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
    };
  },
  data() {
    return {
      approved: '0',
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

    function BigNumberToFixedString(
      number: BigNumber,
      decimals = 18,
      fixed = 4
    ) {
      return number
        .div(BigNumber.from(10).pow(decimals))
        .toNumber()
        .toFixed(fixed);
    }

    if (sunriseName != '') {
      var sunriseAddress = '';

      for (let s of Object.values(sunrises)) {
        if (s.type.toLowerCase() == sunriseName) sunriseAddress = s.id;
      }

      const abi = JSON.parse(
        `[{
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }]`
      );
      const contract = new Contract(
        '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729', // Spolar
        abi,
        getProvider()
      );

      const _owner = account.value;
      const _spender = sunriseAddress;
      const approval: BigNumber = await contract.allowance(_owner, _spender);

      if (approval != MaxUint256) this.approved = '1';

      const abiSunrise = JSON.parse(`[{
        "inputs": [],
        "name": "epoch",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
        "name": "earned",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
        "name": "canWithdraw",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [{ "internalType": "address", "name": "mason", "type": "address" }],
        "name": "canClaimReward",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      }]`);

      const spolarAbi = JSON.parse(`[{
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }]`);

      const treasuryABI = JSON.parse(
        `[{
        "inputs": [],
        "name": "previousEpoch` +
          `${sunriseName.charAt(0).toUpperCase()}` +
          `${sunriseName.slice(1)}` +
          `Price",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }, {
        "inputs": [],
        "name": "` +
          sunriseName +
          `PriceCeiling",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [],
        "name": "get` +
          `${sunriseName.charAt(0).toUpperCase()}` +
          `${sunriseName.slice(1)}` +
          `UpdatedPrice",
        "outputs": [{ "internalType": "uint256", "name": "_ethernalPrice", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }]`
      );

      const polarTreasuryABI = JSON.parse(`[{
          "inputs": [],
          "name": "previousEpochpolarPrice",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        },{
        "inputs": [],
        "name": "polarPriceCeiling",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      },{
        "inputs": [],
        "name": "getpolarUpdatedPrice",
        "outputs": [{ "internalType": "uint256", "name": "_polarPrice", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }]`);

      const uniswapABI = JSON.parse(
        `[{"inputs":[],"payable":"false","stateMutability":"nonpayable","type":"constructor"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"owner","type":"address"},{"indexed":"true","internalType":"address","name":"spender","type":"address"},{"indexed":"false","internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":"true","internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"sender","type":"address"},{"indexed":"false","internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":"false","internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":"true","internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":"false","inputs":[{"indexed":"false","internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":"false","internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":"false","inputs":[{"indexed":"true","internalType":"address","name":"from","type":"address"},{"indexed":"true","internalType":"address","name":"to","type":"address"},{"indexed":"false","internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":"true","inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"false","inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[],"name":"sync","outputs":[],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"true","inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"true","inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":"false","stateMutability":"view","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"},{"constant":"false","inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":"false","stateMutability":"nonpayable","type":"function"}]`
      );

      const treasuries = {
        ethernal: '0x4EB8Be5cFe68710Df61bf53F718CCAb48Da82263',
        binaris: '0x4a1678998bd470eeEDb6e82116c05821a2eF2Bc1',
        usp: '0x58d030Fb9b40ed1245762Fe321FbEd41bb217eEE',
        orbital: '0xc9f5D8bC7a3E4a01bF6926f99540714027F7fF61',
        polar: '0x2Af7e5b19405A02FC99468Af38a23aa270921781',
        tripolar: '0x116449c7B1d0837439E12216d7b1EbaecbD848FF',
      };

      const spolarContract = new Contract(
        '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729',
        spolarAbi,
        getProvider()
      );

      const sunriseContract = new Contract(
        sunriseAddress,
        abiSunrise,
        getProvider()
      );

      const treasuryContract = new Contract(
        treasuries[sunriseName],
        sunriseName != 'polar' ? treasuryABI : polarTreasuryABI,
        getProvider()
      );

      this.epoch = await sunriseContract.epoch();
      const earned = await sunriseContract.earned(account.value);
      this.earned = (
        Number(earned.div(BigNumber.from(10).pow(14))) / 10000
      ).toString();
      this.canWithdraw = await sunriseContract.canWithdraw(account.value);
      this.canClaim = await sunriseContract.canClaimReward(account.value);
      const spolarsStaked: BigNumber = await spolarContract.balanceOf(
        sunriseAddress
      );
      this.spolarsStaked = (
        Number(spolarsStaked.div(BigNumber.from(10).pow(14))) / 10000
      ).toString();
      const balance: BigNumber = await sunriseContract.balanceOf(account.value);
      // this.balance = BigNumberToFixedString(balance);
      this.balance = (
        Number(balance.div(BigNumber.from(10).pow(14))) / 10000
      ).toString();

      var lastEpochTwap = BigNumber.from('0');
      var printTwap = BigNumber.from('0');
      if (sunriseName != 'polar') {
        lastEpochTwap = await treasuryContract[
          'previousEpoch' +
            sunriseName.charAt(0).toUpperCase() +
            sunriseName.slice(1) +
            'Price'
        ]();

        printTwap = await treasuryContract[sunriseName + 'PriceCeiling']();
      } else {
        lastEpochTwap = await treasuryContract.previousEpochpolarPrice();
        printTwap = await treasuryContract.polarPriceCeiling();
      }

      this.lastEpochTwap = (
        Number(lastEpochTwap.div(BigNumber.from(10).pow(14))) / 10000
      ).toString();

      this.printTwap = (
        Number(printTwap.div(BigNumber.from(10).pow(14))) / 10000
      ).toString();

      const w3 = new Web3(config.rpc);

      const pools = {
        binaris: '0x29A3e2Bb73891f20C6d4A34ecE0c4a6F8020ec32',
        orbital: '0x7243cB5DBae5921c78A022110645a23a38ffBA5D',
        polar: '0x3fa4d0145a0b6ad0584b1ad5f61cb490a04d8242',
        usp: '0xa984B8062316AFE25c86576b0478E76E65FdF564',
        tripolar: '0x51488c4BcEEa96Ee530bC6093Bd0c00F9461fbb5',
        ethernal: '0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7',
        near: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
        spolar: '0xADf9D0C77c70FCb1fDB868F54211288fCE9937DF',
      };

      const contractAddress = pools[sunriseName];
      const uniswapContract = new w3.eth.Contract(uniswapABI, contractAddress);

      if (sunriseName != 'polar') {
        const twap: BigNumber = await treasuryContract[
          `get` +
            `${sunriseName.charAt(0).toUpperCase()}` +
            `${sunriseName.slice(1)}` +
            `UpdatedPrice`
        ]();
        this.twap = (
          Number(twap.div(BigNumber.from(10).pow(14))) / 10000
        ).toString();
      } else {
        const twap: BigNumber = await treasuryContract[
          `getpolarUpdatedPrice`
        ]();
        this.twap = (
          Number(twap.div(BigNumber.from(10).pow(14))) / 10000
        ).toString();
      }
      const nearPriceContract = new w3.eth.Contract(uniswapABI, pools['near']);
      const nearReserves = await nearPriceContract.methods.getReserves().call();
      const near_price =
        1 / (nearReserves[1] / nearReserves[0] / 10 ** (24 - 6));
      const spolarPriceContract = new w3.eth.Contract(
        uniswapABI,
        pools['spolar']
      );
      const polarReserves = await spolarPriceContract.methods
        .getReserves()
        .call();
      const polar_price =
        1 / (polarReserves[0] / polarReserves[1] / 10 ** (18 - 24));

      const spolarPrice = polar_price * near_price;
      this.depositedInDollars = (
        parseFloat(this.balance) * spolarPrice
      ).toString();

      const uspPools = {
        binaris: '0x0444eD96DccB0bA4b47908E144026cbA7355E454',
        orbital: '0x711aB8ef67196Afd1dE0B35cBb81c775c12fA91F',
        ethernal: '0x2BA1175563eb7FC165D640d3EAEe5D094e4af613',
        polar: '0xc7193703dC70d0Ab3Ebc1a92cc013D70DC08e189',
        tripolar: '',
      };

      var tokenUsdPrice = '0';
      if (sunriseName == 'binaris') {
        const uniswapPriceContractAddress = uspPools[sunriseName];
        const uniswapPriceContract = new w3.eth.Contract(
          uniswapABI,
          uniswapPriceContractAddress
        );
        const res = await uniswapPriceContract.methods.getReserves().call();
        const pr = res[0] / res[1];

        const uspPoolAddr = '0xa984B8062316AFE25c86576b0478E76E65FdF564';
        const uspPoolContract = new w3.eth.Contract(uniswapABI, uspPoolAddr);
        const uspReserves = await uspPoolContract.methods.getReserves().call();
        const uspPriceRes = uspReserves[1] / uspReserves[0];
        const uspPrice = uspPriceRes / 10 ** (6 - 18);
        tokenUsdPrice = (uspPrice * pr).toString();
      } else if (sunriseName == 'ethernal') {
        const contractAddr = '0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7';
        const contract = new w3.eth.Contract(uniswapABI, contractAddr);
        const reserves = await contract.methods.getReserves().call();
        const price_eth = reserves[1] / reserves[0];
        const contractAddr2 = '0x2F41AF687164062f118297cA10751F4b55478ae1';
        const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
        const reserves2 = await contract2.methods.getReserves().call();
        const price = reserves2[1] / reserves2[0];
        const usdc_price = 1 / (price / 10 ** (18 - 6));
        tokenUsdPrice = (usdc_price * price_eth).toString();
      } else if (sunriseName == 'orbital') {
        const contractAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
        const contract = new w3.eth.Contract(uniswapABI, contractAddr);
        const reserves = await contract.methods.getReserves().call();
        const price = reserves[1] / reserves[0];
        const near_price = 1 / (price / 10 ** (24 - 6));
        const contractAddr2 = '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb';
        const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
        const reserves2 = await contract2.methods.getReserves().call();
        const price2 = reserves2[1] / reserves2[0];
        const btc_near_price = 1 / (price2 / 10 ** (8 - 24));
        const contractAddr3 = '0x7243cB5DBae5921c78A022110645a23a38ffBA5D';
        const contract3 = new w3.eth.Contract(uniswapABI, contractAddr3);
        const reserves3 = await contract3.methods.getReserves().call();
        const price3 = reserves3[1] / reserves3[0];
        const orbital_btc_price = price3 / 10 ** (8 - 18);
        tokenUsdPrice = (
          near_price *
          btc_near_price *
          orbital_btc_price
        ).toString();
      } else if (sunriseName == 'polar') {
        const contractAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
        const contract = new w3.eth.Contract(uniswapABI, contractAddr);
        const reserves = await contract.methods.getReserves().call();
        const near_res = reserves[1] / reserves[0];
        const near_price = 1 / (near_res / 10 ** (24 - 6));
        const contractAddr2 = '0x3fa4d0145a0b6Ad0584B1ad5f61cB490A04d8242';
        const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
        const reserves2 = await contract2.methods.getReserves().call();
        const polar_res = reserves2[1] / reserves2[0];
        const polar_price = 1 / (polar_res / 10 ** (18 - 24));
        tokenUsdPrice = (near_price * polar_price).toString();
      } else if (sunriseName == 'tripolar') {
        const tri_nearAddr = '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD';
        const tri_near = new w3.eth.Contract(uniswapABI, tri_nearAddr);
        const tri_near_reserves = await tri_near.methods.getReserves().call();
        const tri_near_priceRes = tri_near_reserves[0] / tri_near_reserves[1];
        const tri_near_price = tri_near_priceRes / 10 ** (24 - 18);

        const near_usdcAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
        const near_usdc = new w3.eth.Contract(uniswapABI, near_usdcAddr);
        const near_usdc_reserves = await near_usdc.methods.getReserves().call();
        const near_usdc_priceRes =
          near_usdc_reserves[1] / near_usdc_reserves[0];
        const near_usdc_price = 1 / (near_usdc_priceRes / 10 ** (24 - 6));

        const contractAddr = '0x51488c4BcEEa96Ee530bC6093Bd0c00F9461fbb5';
        const contract = new w3.eth.Contract(uniswapABI, contractAddr);
        const reserves = await contract.methods.getReserves().call();
        const priceRes = reserves[1] / reserves[0];
        tokenUsdPrice = (
          priceRes *
          tri_near_price *
          near_usdc_price
        ).toString();
      } else {
        const uspPoolAddr = '0xa984B8062316AFE25c86576b0478E76E65FdF564';
        const uspPoolContract = new w3.eth.Contract(uniswapABI, uspPoolAddr);
        const uspReserves = await uspPoolContract.methods.getReserves().call();
        const uspPriceRes = uspReserves[1] / uspReserves[0];
        tokenUsdPrice = (uspPriceRes / 10 ** (6 - 18)).toString();
      }

      this.earnedAmountInDollars = (
        parseFloat(this.balance) * parseFloat(tokenUsdPrice)
      ).toString();

      const masonryABI = JSON.parse(`[{
        "inputs": [],
        "name": "rewardPerShare",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }]`);

      const masonryContract = new Contract(
        '0xA452f676F109d34665877B7a7B203f2B445D7DE0',
        masonryABI,
        getProvider()
      );

      const rewardsPerShare = await masonryContract.functions.rewardPerShare();
      const epochRewardsPerShare = rewardsPerShare / 1e18;
      const amountOfRewardsPerDay =
        epochRewardsPerShare * Number(tokenUsdPrice) * 4;

      const tvl = parseFloat(this.spolarsStaked) * spolarPrice;
      const APR = ((amountOfRewardsPerDay * 100) / tvl) * 365;
      console.log(APR);
      //       async getSunriseAPR(sunrise: Sunrise) {
      //   let latestSnapshotIndex: BigNumber,
      //     lastHistory: BigNumber,
      //     SPOLARPrice: TokenStat,
      //     tokenPricePromise: Promise<TokenStat>,
      //     tokenPrice: TokenStat;
      //   const token = sunrise.earnTokenName;
      //   const contract = this.contracts[sunrise.contract];
      //   tokenPricePromise = this.getStat(token);
      //   latestSnapshotIndex = await contract.latestSnapshotIndex();
      //   [lastHistory, SPOLARPrice, tokenPrice] = await Promise.all([
      //     contract.masonryHistory(latestSnapshotIndex),
      //     this.getStat('SPOLAR'),
      //     tokenPricePromise,
      //   ]);
      //   const lastRewardsReceived = lastHistory[1];
      //   const epochRewardsPerShare = lastRewardsReceived / 1e18;

      //   //Mgod formula
      //   const amountOfRewardsPerDay = epochRewardsPerShare * Number(tokenPrice.priceInDollars) * 4;
      //   const masonrytShareBalanceOf = await this.SPOLAR.balanceOf(contract.address);
      //   const masonryTVL =
      //     Number(getDisplayBalance(masonrytShareBalanceOf, this.SPOLAR.decimal)) * Number(SPOLARPrice.priceInDollars);
      //   const realAPR = ((amountOfRewardsPerDay * 100) / masonryTVL) * 365;
      //   return realAPR;
      // }
    }
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
