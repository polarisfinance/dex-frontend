<script lang="ts">
import { computed, defineComponent, PropType, toRef, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel, usePool } from '@/composables/usePool';
import { APR_THRESHOLD } from '@/constants/pools';
import { Pool, PoolAPRs } from '@/services/pool/types';
import { TransactionResponse } from '@ethersproject/providers';
import MyPoolInvsetmentFiat, {
  MyPollInvestmentFiatType,
} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import useWeb3 from '@/services/web3/useWeb3';
import { BigNumber } from 'ethers';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import useBreakpoints from '@/composables/useBreakpoints';
import { shortenLabel } from '@/lib/utils';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import useTokens from '@/composables/useTokens';
import PoolCalculator from '@/services/pool/calculator/calculator.sevice';
import PoolUserStats from './PoolUserStats.vue';
import { bnum, isSameAddress } from '@/lib/utils';
import StakeModal from '@/pages/pool/StakeModal.vue';

export default defineComponent({
  data() {
    return {};
  },
  watch: {},
  components: {
    MyPoolInvsetmentFiat,
    BalAsset,
    PoolUserStats,
    StakeModal,
  },
  props: {
    pool: {
      type: Object as PropType<Pool>,
      default: null,
    },
    stakedBalance: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: true,
    },
    poolApr: {
      type: Object as PropType<PoolAPRs>,
      default: 0,
    },
    loadingApr: {
      type: Boolean,
      default: true,
    },
    xpolarPrice: {
      type: String,
      default: '',
    },
    xpolarToClaim: {
      type: String,
      default: '',
    },
    dailyAPR: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  methods: {
    async claimXpolar(address) {
      const { withdraw } = useStake();
      const tx = await withdraw(address, BigNumber.from(0), this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchClaims();
        },
        onTxFailed: () => {},
      });
    },
    async fetchClaims() {},
  },
  setup(props) {
    const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
    const { txListener } = useEthers();
    const isStakeModalVisible = ref(false);

    const toggleStakeModal = (value?: boolean) => {
      isStakeModalVisible.value = value ?? !isStakeModalVisible.value;
    };

    /**
     * COMPOSABLES
     */
    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'approve for staking',
      });
    };
    const { tokens, balances, balanceFor, getTokens } = useTokens();
    const { fNum2, toFiat } = useNumbers();
    const { t } = useI18n();
    const rewardFiat = computed(() => {
      return fNum2(
        Number(props.xpolarPrice) * Number(props.xpolarToClaim),
        FNumFormats.fiat
      );
    });
    const { isStableLikePool, isStablePhantomPool, isMigratablePool } = usePool(
      toRef(props, 'pool')
    );

    const unstakedTokens = computed((): string =>
      balanceFor(props.pool.address)
    );

    const totalTokens = computed((): string =>
      bnum(props.stakedBalance).plus(unstakedTokens.value).toString()
    );
    const stakedPerc = computed(() => {
      const perc = Number(props.stakedBalance) / Number(totalTokens.value);
      return Math.round(perc * 1000) / 1000;
    });


    function symbolFor(address: string) {
      if (!props.pool) return '-';
      const symbol = props.pool?.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }

    const tokenAddresses = computed((): string[] => {
      if (isStablePhantomPool.value) {
        // We're using mainToken balances for StablePhantom pools
        // so return mainTokens here so that fiat values are correct.
        return props.pool.mainTokens || [];
      }
      return props.pool.tokensList;
    });
    // const walletFreeTokens = computed(() =>
    //   tokenAddresses.value
    //     .map((address, i) => propTokenAmounts.value[i], address)
    //     .reduce((total, value) => bnum(total).plus(value).toString())
    // );
    const xpolarToClaim = computed(() => props.xpolarToClaim);
    const stats = computed(() => {
      if (!props.pool) return [];

      return [
        {
          id: 'poolValue',
          label: t('poolValue'),
          value: fNum2(props.pool.totalLiquidity, FNumFormats.fiat),
          loading: props.loading,
        },
        {
          id: 'volumeTime',
          label: t('volumeTime', ['24h']),
          value: fNum2(props.pool.volumeSnapshot || '0', FNumFormats.fiat),
          loading: props.loading,
        },
      ];
    });

    /**
     * COMPUTED
     */
    const { addTransaction } = useTransactions();
    const { getProvider } = useWeb3();

    const aprLabel = computed((): string => {
      const poolAPRs = props.poolApr;
      if (!poolAPRs) return '0';

      return totalAprLabel(poolAPRs, props.pool.boost);
    });

    /*
     * PoolBalances
     */

    const { isWalletReady } = useWeb3();

    const poolCalculator = new PoolCalculator(
      toRef(props, 'pool'),
      tokens,
      balances,
      'exit',
      ref(false)
    );

    const propTokenAmounts = computed((): string[] => {
      const { receive } = poolCalculator.propAmountsGiven(
        bnum(totalTokens.value).toString(),
        0,
        'send'
      );

      if (isStablePhantomPool.value) {
        // Return linear pool's main token balance using the price rate.
        // mainTokenBalance = linearPoolBPT * priceRate
        return props.pool.tokensList.map((address, i) => {
          if (!props.pool?.onchain?.linearPools) return '0';

          const priceRate = props.pool.onchain.linearPools[address].priceRate;

          return bnum(receive[i]).times(priceRate).toString();
        });
      }

      return receive;
    });
    function fiatLabelFor(index: number, address: string): string {
      const fiatValue = toFiat(propTokenAmounts.value[index], address);
      return fNum2(fiatValue, FNumFormats.fiat);
    }

    const fiatValue = computed(() => {
      let fiatVal = 0;
      if (props.pool != undefined) {
        props.pool.tokens.forEach(token => {
          fiatVal += Number(toFiat(token.balance, token.address));
        });
        const lpVal = fiatVal / Number(props.pool.totalShares);
        const totalValue = lpVal * Number(props.stakedBalance);

        return fNum2(totalValue, FNumFormats.fiat);
      } else {
        return '-';
      }
    });

    const dailyAPR = props.dailyAPR;
    const dailyEarnings = Number(props.dailyAPR) * Number(props.stakedBalance);

    /**
     * METHODS
     */

    return {
      getProvider,
      txHandler,
      txListener,
      stats,
      isMobile,
      isDesktop,
      rewardFiat,
      xpolarToClaim,
      symbolFor,
      balanceFor,
      unstakedTokens,
      stakedPerc,
      dailyAPR,
      isWalletReady,
      fNum2,
      propTokenAmounts,
      FNumFormats,
      fiatLabelFor,
      totalTokens,
      fiatValue,
      dailyEarnings,
      toggleStakeModal,
      isStakeModalVisible,
    };
  },
  created() {},
  beforeUpdate() {},
  mounted() {},
  updated() {},
});
</script>

<template>
  <div class="container mx-auto" id="dashboard">
    <div class="card flex flex-wrap">
      <div class="stats">
        <h3>My dashboard</h3>
        <div class="break"></div>
        <PoolUserStats :pool="pool" :xpolarToClaim="xpolarToClaim" :dailyAPR="dailyAPR" :stakedBalance="stakedBalance" />
      </div>
      <div class="m-[24px] flex flex-1 flex-col justify-center">
        <div class="mt-5 w-full text-center" v-if="loading">Loading...</div>
        <template v-else>
          <div class="mt-[40px] flex w-full items-center self-center">
            <div class="flex flex-1 items-center justify-center">
              <div class="flex py-5">
                <div class="mr-4 mt-3">
                  <WalletNewIcon />
                </div>
                <div>
                  <div class="title">
                    <!-- <MyPoolInvsetmentFiat
                      :pool="pool"
                      :tokens="stakedBalance"
                      ref="poolTotalFiatValues"
                    /> -->
                    {{ fiatValue }}
                  </div>
                  <div>Total value</div>
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-center justify-center">
              <div class="flex py-5">
                <div class="mr-4 mt-3">
                  <CoinsIcon />
                </div>
                <div>
                  <div class="title claim-amount">
                    {{ rewardFiat }}
                  </div>
                  <div>Total Rewards</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mx-10 w-full max-w-md self-center">
            <div class="progress-bar mt-[32px] h-[2px] rounded-[24px]">
              <div
                class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
                :style="{ width: `${(stakedPerc * 100).toFixed(0)}%` }"
              />
            </div>
            <div class="progress-perc text-right">
              {{ stakedPerc * 100 }}% of your LP tokens staked
              <button v-if="stakedPerc<1" class="stake-btn inline ml-2" @click="toggleStakeModal()">Stake the rest</button>
            </div>
          </div>
          <div class="my-panel flex flex-1 pl-[24px]">
            <div class="pool-invest flex-1 self-end text-center">
              Unstake and withdraw your position
              <router-link
                class="withdraw-btn flex items-center"
                :to="'/pool/' + pool?.id + '/withdraw'"
              >
                <div class="w-full text-center">Withdraw</div>
              </router-link>
            </div>
            <div class="pool-invest flex-1 self-end text-center">
              You can claim in any time
              <button
                class="claim-btn block flex w-full items-center"
                @click="claimXpolar(pool.address)"
              >
                <div class="w-full text-center">Claim reward</div>
                <ArrowRightIcon class="ml-3 flex-none" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <StakeModal
      :depositBol="true"
      :isVisible="isStakeModalVisible"
      :token="``"
      :balance="balanceFor(pool.address)"
      :address="pool.address"
      @close="toggleStakeModal"
    />
</template>

<style scoped>
.card {
  background-color: #292043;
  border-radius: 32px;
  min-height: 0px;
  overflow: hidden;
}
.stats {
  min-width: 300px;
  background-color: #41365e;
  padding: 24px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}
h3 {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #fdfdfd;
  padding-bottom: 16px;
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

.progress-bar {
  background: #41365e;
  position: relative;
  margin-bottom: 10px;
}

.withdraw-btn,
.claim-btn {
  border-radius: 50px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;

  padding: 12px 20px;
  margin: 12px auto 0px auto;
  max-width: 230px;
}
.claim-btn {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  color: #fdfdfd;
}
.withdraw-btn {
  background: #50456e;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.stats .token {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.break {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(151, 71, 255, 0.4),
    rgba(59, 68, 189, 0.4)
  );
}
.token-value > div:first-child {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.progress-perc {
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #bdb2dd;
}
.stake-btn{
  margin-right: 8px;
  padding: 1px 7px;
  gap: 10px;
  background: linear-gradient(92.92deg, #C004FE 4.85%, #7E02F5 95.15%);
  border-radius: 20px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
</style>
