<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel } from '@/composables/usePool';
import { APR_THRESHOLD } from '@/constants/pools';
import { Pool, PoolAPRs } from '@/services/pool/types';
import ArrowDownIcon2 from '@/components/_global/icons/ArrowDownIcon2.vue';
import MyPoolInvsetmentFiat, {
  MyPollInvestmentFiatType,
} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import { BigNumber } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';
import useWeb3 from '@/services/web3/useWeb3';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers'
import useBreakpoints from '@/composables/useBreakpoints';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  poolApr: PoolAPRs;
  loading?: boolean;
  loadingApr?: boolean;
  aprString: string;
  stakedBalance: string;
  xpolarPrice: string;
  xpolarToClaim: string;
};


/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const { t } = useI18n();
const { isMobile, isDesktop } = useBreakpoints();
/**
 * COMPUTED
 */
const aprLabel = computed((): string => {
  const poolAPRs = props.poolApr;
  if (!poolAPRs) return '0';

  return totalAprLabel(poolAPRs, props.pool.boost);
});
const stakedBalance = computed(() => {
  return props.stakedBalance;
});
const rewardFiat = computed(() => {
  return fNum2(
    Number(props.xpolarPrice) * Number(props.xpolarToClaim),
    FNumFormats.fiat
  );
});

const { account } = useWeb3();


const stats = computed(() => {
  if (!props.pool) return [];

  let outStats = [
    {
      id: 'poolValue',
      label: t('poolValue'),
      value: fNum2(props.pool.totalLiquidity, FNumFormats.fiat),
      loading: props.loading,
    },
    {
      id: 'apr',
      label: 'APR',
      value:
        Number(props.poolApr?.total.unstaked || '0') * 100 > APR_THRESHOLD
          ? '-'
          : aprLabel.value,
      loading: props.loadingApr,
    },
  ];

  if (props.stakedBalance == '0') {
    outStats.splice(1, 0, {
      id: 'volumeTime',
      label: t('volumeTime', ['24h']),
      value: fNum2(props.pool.volumeSnapshot || '0', FNumFormats.fiat),
      loading: props.loading,
    });
    outStats.splice(1, 0, {
      id: 'feesTime',
      label: t('feesTime', ['24h']),
      value: fNum2(props.pool.feesSnapshot || '0', FNumFormats.fiat),
      loading: props.loading,
    });
  }

  return outStats;
});
const { addTransaction } = useTransactions();
const txHandler = (tx: TransactionResponse): void => {
  addTransaction({
    id: tx.hash,
    type: 'tx',
    action: 'approve',
    summary: 'approve for staking',
  });
};
const { txListener } = useEthers();
const { getProvider } = useWeb3();
async function claimXpolar(address) {
  const { withdraw } = useStake();
  const tx = await withdraw(address, BigNumber.from(0), getProvider());
  txHandler(tx);
  txListener(tx, {
    onTxConfirmed: () => {
      
    },
    onTxFailed: () => {},
  });
}
</script>

<template>
  <div class="flex w-full" :class="{'flex-wrap':isMobile,'mb-[24px]':isDesktop}">
    <template v-for="stat in stats" :key="stat.id">
      <BalLoadingBlock v-if="stat.loading" class="h-24" />
      <div v-else class="card-container flex flex-1" :class="{'justify-center':isDesktop,'justify-start mb-10':isMobile}"  >
        <div>
          <WalletNewIcon v-if="stat.id == 'poolValue'" />
          <VolumeTimeIcon v-if="stat.id == 'volumeTime'" />
          <DollarCoinsStackedIcon v-if="stat.id == 'feesTime'" />
          <AprIcon v-if="stat.id == 'apr'" />
        </div>
        <div class="ml-[16px]">
          <div class="text-secondary mb-[4px] flex text-sm font-medium">
            <div class="label">{{ stat.label }}</div>
            <!-- <APRTooltip
                v-if="stat.id === 'apr'"
                :pool="pool"
                :poolApr="poolApr"
              /> -->
          </div>
          <div
            class="funds flex items-center truncate text-xl font-medium"
            v-if="stat.label != 'APR'"
          >
            {{ stat.value }} <span v-if="stat.label == 'APR'">%</span>
          </div>
          <div
            class="funds flex items-center truncate text-xl font-medium"
            v-else
          >
            {{ aprString }} <span v-if="stat.label == 'APR'">%</span>
          </div>
        </div>
      </div>
    </template>
    <div class="pool-invest w-full text-center" v-if="isMobile">
      Invest in the pool and earn on swap fees!
      <router-link
        class="invest-btn flex w-full items-center"
        :to="'/pool/' + pool?.id + '/invest'"
      >
        <PlusIcon class="ml-3 flex-none" />
        <div class="w-full text-center">Invest in the pool</div>
      </router-link>
    </div>
    <template v-if="account && Number(stakedBalance) > 0">
        <div class="card-container flex flex-1" :class="{'my-8':isMobile}">
          <div class="card-container flex flex-1">
            <div>
              <DollarCircledIcon />
            </div>
            <div class="ml-[16px]">
              <div class="text-secondary mb-[4px] flex text-sm font-medium">
                <div class="label">Your total value in $</div>
              </div>
              <div class="funds flex items-center truncate text-xl font-medium">
                <MyPoolInvsetmentFiat :pool="pool" :tokens="Number(stakedBalance)" />
              </div>
            </div>
          </div>
        </div>
        <div class="card-container flex flex-1"  :class="{'my-8':isMobile}" v-if="account && Number(stakedBalance) > 0">
          <div class="card-container flex flex-1">
            <div>
              <DollarCoinsStackedIcon />
            </div>
            <div class="ml-[16px]">
              <div class="text-secondary mb-[4px] flex text-sm font-medium">
                <div class="label">Your reward in $</div>
              </div>
              <div
                class="funds claim flex items-center truncate text-xl font-medium"
              >
                {{ rewardFiat }}
              </div>
            </div>
          </div>
        </div>
    </template>
  </div>
  <div class="buttons-panel flex text-center" :class="{'flex-wrap':isMobile}" >
    <div class="pool-invest flex-1" v-if="isDesktop">
      Invest in the pool and earn on swap fees!
      <router-link
        class="invest-btn flex w-full items-center"
        :to="'/pool/' + pool?.id + '/invest'"
      >
        <PlusIcon class="ml-3 flex-none" />
        <div class="w-full text-center">Invest in the pool</div>
      </router-link>
    </div>
    <div class="my-panel flex flex-1 gap-4" v-if="account && Number(stakedBalance) > 0" :class="{'l-border pl-[24px]':isDesktop,'flex-col':isMobile}">
      <div class="pool-invest flex-1">
        You can claim in any time
        <button
                class="invest-btn block flex w-full items-center"
                @click="claimXpolar(pool.address)"
              >
                <div class="w-full text-center">Claim reward</div>
                <ArrowRightIcon class="ml-3 flex-none" />
              </button>
      </div>
      <div class="pool-invest flex-1">
        View more details about investment
        <router-link
          class="goto-btn flex w-full items-center"
          :to="'#dashboard'"
        >
          <div class="w-full text-center">View dashboard</div>
          <ArrowDownIcon2 class="ml-3 flex-none" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
}

.label {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #bdb2dd;
}

.funds {
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #fdfdfd;
}

.pool-stats-label {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #bdb2dd;
}

.pool-stats-funds {
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #fdfdfd;
}
.funds.claim {
  color: #0ce6b5;
}
.pool-invest {
}
.goto-btn,
.invest-btn {
  border-radius: 50px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  padding: 12px 20px;
  margin: 12px auto 0px auto;
  max-width: 520px;
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  color: #fdfdfd;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.goto-btn {
  background: #50456e;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.my-panel.l-border {
  border-left: 1px solid rgba(151, 71, 255, 0.4);
}
.buttons-panel {
  border-top: 1px solid rgba(151, 71, 255, 0.4);
  text-align: center;
  padding-top: 24px;
}
</style>
