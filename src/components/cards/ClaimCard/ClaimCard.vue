<script lang="ts">
import { PoolWithShares, PoolType, AnyPool, Pool } from '@/services/pool/types';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import {
  ClaimType,
  ClaimProviderService,
} from '@/services/pool/claim.provider';
import {
  computed,
  defineComponent,
  ref,
  PropType,
  watch,
  ComputedRef,
  toRef,
} from 'vue';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useWeb3 from '@/services/web3/useWeb3';
import { POOLS } from '@/constants/pools';
import communityAssetBackImg from '@/assets/images/coins/community-border.svg';
import useStake from '@/composables/PolarisFinance/useStake';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import MyPoolInvsetmentFiat, {
  MyPollInvestmentFiatType,
} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import useEthers from '@/composables//useEthers';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
import {
  absMaxApr,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
  usePool,
} from '@/composables/usePool';
import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from '@/composables/PolarisFinance/utils';
import ArrowRightIcon from '@/components/_global/icons/ArrowRightIcon.vue';
import { BigNumber } from 'ethers';
import useBreakpoints from '@/composables/useBreakpoints';

import polarImg from '@/pages/polar.svg';
import orbitalImg from '@/pages/orbital.svg';
import uspImg from '@/pages/usp.svg';
import ethernalImg from '@/pages/ethernal.svg';
import binarisImg from '@/pages/binaris.svg';

const singlePools = [
  {
    name: 'POLAR',
    id: '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86',
    logo: polarImg,
  },
  {
    name: 'ORBITAL',
    id: '0x3AC55eA8D2082fAbda674270cD2367dA96092889',
    logo: orbitalImg,
  },
  {
    name: 'BINARIS',
    id: '0xafE0d6ca6AAbB43CDA024895D203120831Ba0370',
    logo: binarisImg,
  },
  {
    name: 'USP',
    id: '0xa69d9Ba086D41425f35988613c156Db9a88a1A96',
    logo: uspImg,
  },
  {
    name: 'ETHERNAL',
    id: '0x17cbd9C274e90C537790C51b4015a65cD015497e',
    logo: ethernalImg,
  },
  // { name: 'PBOND', id: '0x3a4773e600086A753862621A26a2E3274610da43' },
  // { name: 'OBOND', id: '0x192bdcdd7b95A97eC66dE5630a85967F6B79e695' },
  // { name: 'BBOND', id: '0xfa32616447C51F056Db97BC1d0E2D4C0c4D059C9' },
  // { name: 'USPBOND', id: '0xcE32b28c19C61B19823395730A0c7d91C671E54b' },
  // { name: 'EBOND', id: '0x266437E6c7500A947012F19A3dE96a3881a0449E' },
];

export default defineComponent({
  data() {
    return {
      claims: [] as Array<ClaimType>,
      noClaims: true,
      totalClaims: 0,
      totalPoolFiatValue: 0,
      xpolarPoolQuery: usePoolQuery(
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
      ),
      poolTotalFiatValues: [],
    };
  },
  watch: {
    pools(newValue, oldValue) {
      if (newValue.length != 0) this.fetchClaimsIfPossible();
    },
    prices(newValue, oldValue) {
      if (newValue != undefined) this.fetchClaimsIfPossible();
    },
    async account() {
      this.claims = [] as Array<ClaimType>;
      this.totalClaims = 0;
      this.fetchClaimsIfPossible();
    },
  },
  components: {
    ArrowRightIcon,
    MyPoolInvsetmentFiat,
  },
  props: {
    pools: {
      type: Array as PropType<Array<PoolWithShares>>, //PoolWithShares AnyPool
      default: null,
    },
    prices: {
      type: Object as PropType<ComputedRef<TokenPrices>>,
      default: null,
    },
    noApr: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  methods: {
    async claimXpolar(claim) {
      const { withdraw } = useStake();
      const tx = await withdraw(
        claim.address,
        BigNumber.from(0),
        this.getProvider()
      );
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.totalClaims = 0;
          this.fetchClaims();
        },
        onTxFailed: () => {},
      });
    },
    fetchClaimsIfPossible() {
      if (this.pools.length != 0 && this.prices != undefined) {
        this.fetchClaims();
      }
    },
    async claimXpolarAll() {
      const { claimAll } = useStake();
      const tx = await claimAll(this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.totalClaims = 0;
          this.fetchClaims();
        },
        onTxFailed: () => {},
      });
    },
    async fetchClaims() {
      const updateTotalClaims = true ? this.totalClaims == 0 : false;
      const claimer = new ClaimProviderService(
        this.pools,
        singlePools,
        this.prices,
        this.xpolarPoolQuery,
        this.account
      );
      claimer.init();
      claimer.claimReceived = (claim: ClaimType) => {
        let existingIndex = -1;
        this.claims.forEach(existingClaim => {
          if (existingClaim.address == claim.address) {
            existingIndex = this.claims.indexOf(existingClaim);
          }
        });
        if (existingIndex != -1) {
          this.claims[existingIndex] = claim;
        } else {
          this.claims.push(claim);
        }
        if (updateTotalClaims) {
          this.totalClaims = this.totalClaims + Number(claim.xpolarToClaim);
        }

        // this.claimsCount = this.claims.length;
        //this.$forceUpdate;
      };
      claimer.fetchAll();
    },
    refreshTotalValue() {
      this.totalPoolFiatValue = 0;
      for (const [key, value] of Object.entries(this.poolTotalFiatValues)) {
        this.totalPoolFiatValue = this.totalPoolFiatValue + value;
      }
    },
  },
  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum2, toFiat } = useNumbers();
    const { tokens, balances, balanceFor } = useTokens();
    const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
    const { txListener } = useEthers();
    /**
     * COMPUTED
     */
    const { account, connector, startConnectWithInjectedProvider } = useWeb3();
    const { getProvider } = useWeb3();
    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'claim',
        summary: 'claim staking reward',
      });
    };
    const { addTransaction } = useTransactions();
    const bptBalance = computed((pool): string => balanceFor(pool.address));

    /**
     * METHODS
     */

    function iconAddresses(claim: ClaimType) {
      if (claim.pool != undefined)
        return POOLS.Metadata[claim.pool.id]?.hasIcon
          ? [claim.pool.address]
          : orderedTokenAddresses(claim.pool);
    }

    function getRooterLink(claim) {
      if (claim.pool != undefined) return '/pool/' + claim.pool.id;
      else {
        for (var i = 0; i < singlePools.length; i++) {
          if (singlePools[i].id == claim.address)
            return '/singlestake/' + singlePools[i].name.toLowerCase();
        }
      }
      return '';
    }
    function getSingleStakeLogo(claim) {
      for (var i = 0; i < singlePools.length; i++) {
        if (singlePools[i].id == claim.address) return singlePools[i].logo;
      }
    }
    function getSingleStakeName(claim) {
      for (var i = 0; i < singlePools.length; i++) {
        if (singlePools[i].id == claim.address && isDesktop.value)
          return singlePools[i].name + ' - Single Stake';
        else if (singlePools[i].id == claim.address && isMobile.value)
          return singlePools[i].name;
      }
    }

    return {
      account,
      iconAddresses,
      orderedPoolTokens,
      communityAssetBackImg,
      // methods
      getProvider,
      txHandler,
      txListener,
      BigNumberToString,
      isMobile,
      isDesktop,
      fNum2,
      FNumFormats,
      getRooterLink,
      getSingleStakeLogo,
      getSingleStakeName,
    };
  },
  created() {},
  beforeUpdate() {},
  mounted() {},
  updated() {
    const target_copy: MyPollInvestmentFiatType = Object.assign(
      {},
      this.$refs['poolTotalFiatValues']
    ) as MyPollInvestmentFiatType;
    // this.totalPoolFiatValue +=;
    if (target_copy.fiatNumber != undefined) {
      this.poolTotalFiatValues[target_copy.pool.address] =
        target_copy.fiatNumber;
    }
    this.refreshTotalValue();
  },
});
</script>

<template>
  <div class="container mx-auto" v-if="account != ''">
    <div class="claim-container flex flex-wrap">
      <div
        class="stats grid"
        :class="{ 'flex-none': isDesktop, 'flex-1': isMobile }"
      >
        <div
          class="flex items-center justify-center"
          v-if="totalPoolFiatValue > 0"
        >
          <div class="flex py-5">
            <div class="mr-4 mt-3">
              <WalletNewIcon />
            </div>
            <div>
              <div class="title">
                {{ fNum2(Number(totalPoolFiatValue), FNumFormats.fiat) }}
              </div>
              <div>Total value</div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <div class="flex py-5">
            <div class="mr-4 mt-3">
              <CoinsIcon />
            </div>
            <div>
              <div class="title claim-amount">
                {{ totalClaims.toLocaleString('en-US') }}
              </div>
              <div>Total Rewards</div>
            </div>
          </div>
        </div>
      </div>
      <div class="break" v-if="isMobile"></div>
      <div class="pools flex flex-1 flex-col">
        <div
          class="grid-table"
          v-if="claims.length > 0"
          :class="{ mobile: isMobile }"
        >
          <div class="pool-header">
            <div class="h-4">My positions</div>
            <div class="h-4" v-if="isDesktop">Tokens</div>
            <div class="h-4" v-if="isDesktop">$ Tokens value</div>
            <div class="h-4">To claim</div>
            <div class="h-4" v-if="isDesktop"></div>
          </div>
          <!-- div>To Claim</div -->

          <div class="border" :class="{ mobile: isMobile }"></div>

          <template v-for="(claim, idx) in claims" :key="idx">
            <div class="pool-row my-[18px] flex w-full items-center">
              <router-link
                :to="getRooterLink(claim)"
                class="flex flex-1 items-center"
              >
                <template v-if="claim.pool != undefined">
                  <div class="flex-none">
                    <BalAssetSet
                      :size="36"
                      :addresses="iconAddresses(claim)"
                      :width="60"
                    />
                  </div>
                  <TokenPills
                    class="token-pill ml-4"
                    :tokens="
                      orderedPoolTokens(
                        claim.pool.poolType,
                        claim.pool.address,
                        claim.pool.tokens
                      )
                    "
                    :isStablePool="false"
                    :selectedTokens="[]"
                    :showWeight="false"
                  />
                </template>
                <template v-else>
                  <img
                    class="singlestake-logo"
                    :src="getSingleStakeLogo(claim)"
                  />
                  <div class="singlestake-tokenpill">
                    {{ getSingleStakeName(claim) }}
                  </div>
                </template>
              </router-link>
              <div class="flex items-center self-center" v-if="isDesktop">
                {{ claim.stakedBalance }}
              </div>
              <div class="flex items-center self-center" v-if="isDesktop">
                <MyPoolInvsetmentFiat
                  :pool="claim.pool"
                  :tokens="claim.stakedBalance"
                  ref="poolTotalFiatValues"
                />
              </div>
              <div
                class="claim-amount flex items-center self-center"
                v-if="isDesktop"
              >
                {{ claim.xpolarToClaim }}
              </div>
              <div class="flex items-center self-center">
                <button
                  class="claim-btn flex items-center"
                  @click="claimXpolar(claim)"
                  v-if="isDesktop"
                >
                  Claim
                  <ArrowRightIcon class="ml-3" />
                </button>
                <button
                  class="claim-btn-mobile w-full items-center"
                  @click="claimXpolar(claim)"
                  v-if="isMobile"
                >
                  {{ claim.xpolarToClaim }} | Claim
                </button>
              </div>
              <!-- div>
                    <BalLoadingBlock
                      v-if="!pool?.apr?.total?.unstaked"
                      class="h-4 w-12"
                    />
                    <template v-else>
                      <div class="h-4 w-12">
                        {{ Math.round(aprLabelFor(pool), 2) }}
                      </div>
                    </template>
                  </div -->
            </div>
          </template>
        </div>
        <div class="mt-5 w-full text-center" v-else>Loading...</div>
        <div
          class="mt-[26px] flex items-center self-center"
          v-if="claims.length > 0"
        >
          <button
            class="claim-btn-all flex items-center justify-center"
            @click="claimXpolarAll()"
          >
            Claim All
            <ArrowRightIcon class="ml-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.claim-container {
  background-color: #292043;
  border-radius: 32px;
  min-height: 0px;
  overflow: hidden;
}
.stats {
  min-width: 300px;
  color: rgba(189, 178, 221, 1);
}
.stats > div:first-child {
  background-color: #41365e;
}
.stats > div:last-child {
  background-color: #50456e;
}
.earn-button {
  padding: 6px 12px 6px 16px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgba(41, 32, 67, 1), rgba(41, 32, 67, 1))
      padding-box,
    linear-gradient(90deg, rgba(192, 4, 254, 1), rgba(126, 2, 245, 1))
      border-box;
  border: 1px solid transparent;
}
.earn-button:hover {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
}
.token-pill {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
}

.grid-table {
  display: grid;
  width: 100%;
  color: rgba(253, 253, 253, 1);
  grid-template-columns: 50% auto;
}
.grid-table.mobile {
  grid-template-columns: 65% auto;
}
.grid-table .border {
  border: 0.5px solid rgba(151, 71, 255, 0.4);
  margin-bottom: 24px;
  height: 0px;
}
.pools {
  padding: 24px 24px 32px 24px;
}
.pool-row {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.pool-row,
.pool-header {
  display: contents;
}
.pool-row > div,
.pool-header > div {
  height: 100%;
  padding: 18px 0px;
}
.pool-header > div {
  color: #bdb2dd;
  padding-bottom: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
.claim-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 24px;
  padding: 10px 17px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
.claim-btn-mobile {
  padding: 6px 12px 6px 16px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgba(41, 32, 67, 1), rgba(41, 32, 67, 1))
      padding-box,
    linear-gradient(90deg, rgba(192, 4, 254, 1), rgba(126, 2, 245, 1))
      border-box;
  border: 1px solid transparent;
}

.claim-btn-all {
  width: 180px;
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 24px;
  padding: 10px 17px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
.border {
  grid-column: 1 / span 5;
}
.border.mobile {
  grid-column: 1 / span 2;
}
.claim-btn:hover {
  background: linear-gradient(
    93.62deg,
    rgba(192, 4, 254, 0.7) 2.98%,
    rgba(126, 2, 245, 0.7) 97.02%
  );
}
.title {
  font-weight: 600;
  font-size: 32px;
  color: #fdfdfd;
}
.claim-amount {
  color: #0ce6b5;
}
.break {
  flex-basis: 100%;
  height: 0;
}
.singlestake-logo {
  height: 36px;
}
.singlestake-tokenpill {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  padding-left: 40px;
}
</style>
