<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel } from '@/composables/usePoolHelpers';
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
import useEthers from '@/composables/useEthers';
import useBreakpoints from '@/composables/useBreakpoints';
import useNetwork from '@/composables/useNetwork';

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
const { networkSlug } = useNetwork();
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
    onTxConfirmed: () => {},
    onTxFailed: () => {},
  });
}
</script>

<template>
  <div
    class="flex w-full"
    :class="{ 'flex-wrap': isMobile, 'mb-[24px]': isDesktop }"
  >
    <template v-for="stat in stats" :key="stat.id">
      <BalLoadingBlock v-if="stat.loading" class="h-24" />
      <div
        v-else
        class="flex flex-1 card-container"
        :class="{
          'justify-center': isDesktop,
          'justify-start mb-10': isMobile,
        }"
      >
        <div>
          <WalletNewIcon v-if="stat.id == 'poolValue'" />
          <VolumeTimeIcon v-if="stat.id == 'volumeTime'" />
          <DollarCoinsStackedIcon v-if="stat.id == 'feesTime'" />
          <AprIcon v-if="stat.id == 'apr'" />
        </div>
        <div class="ml-[16px]">
          <div class="flex text-sm font-medium text-secondary mb-[4px]">
            <div class="label">{{ stat.label }}</div>
            <!-- <APRTooltip
                v-if="stat.id === 'apr'"
                :pool="pool"
                :poolApr="poolApr"
              /> -->
          </div>
          <div
            v-if="stat.label != 'APR'"
            class="flex items-center text-xl font-medium truncate funds"
          >
            {{ stat.value }} <span v-if="stat.label == 'APR'">%</span>
          </div>
          <div
            v-else
            class="flex items-center text-xl font-medium truncate funds"
          >
            {{ aprString }} <span v-if="stat.label == 'APR'">%</span>
          </div>
        </div>
      </div>
    </template>
    <div v-if="isMobile" class="w-full text-center pool-invest">
      Invest in the pool and earn on swap fees!
      <router-link
        class="flex items-center w-full invest-btn"
        :to="{
          name: 'invest',
          params: { id: pool?.id, networkSlug },
        }"
      >
        <PlusIcon class="flex-none ml-3" />
        <div class="w-full text-center">Invest in the pool</div>
      </router-link>
    </div>
    <template v-if="account && Number(stakedBalance) > 0">
      <div class="flex flex-1 card-container" :class="{ 'my-8': isMobile }">
        <div class="flex flex-1 card-container">
          <div>
            <DollarCircledIcon />
          </div>
          <div class="ml-[16px]">
            <div class="flex text-sm font-medium text-secondary mb-[4px]">
              <div class="label">Your total value in $</div>
            </div>
            <div class="flex items-center text-xl font-medium truncate funds">
              <MyPoolInvsetmentFiat
                :pool="pool"
                :tokens="Number(stakedBalance)"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="account && Number(stakedBalance) > 0"
        class="flex flex-1 card-container"
        :class="{ 'my-8': isMobile }"
      >
        <div class="flex flex-1 card-container">
          <div>
            <DollarCoinsStackedIcon />
          </div>
          <div class="ml-[16px]">
            <div class="flex text-sm font-medium text-secondary mb-[4px]">
              <div class="label">Your reward in $</div>
            </div>
            <div
              class="flex items-center text-xl font-medium truncate funds claim"
            >
              {{ rewardFiat }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div
    class="flex text-center buttons-panel"
    :class="{ 'flex-wrap': isMobile }"
  >
    <div v-if="isDesktop" class="flex-1 pool-invest">
      Invest in the pool and earn on swap fees!
      <router-link
        class="flex items-center w-full invest-btn"
        :to="{
          name: 'invest',
          params: { id: pool?.id, networkSlug },
        }"
      >
        <PlusIcon class="flex-none ml-3" />
        <div class="w-full text-center">Invest in the pool</div>
      </router-link>
    </div>
    <div
      v-if="account && Number(stakedBalance) > 0"
      class="flex flex-1 gap-4 my-panel"
      :class="{ 'l-border pl-[24px]': isDesktop, 'flex-col': isMobile }"
    >
      <div class="flex-1 pool-invest">
        You can claim in any time
        <button
          class="block flex items-center w-full invest-btn"
          @click="claimXpolar(pool.address)"
        >
          <div class="w-full text-center">Claim reward</div>
          <ArrowRightIcon class="flex-none ml-3" />
        </button>
      </div>
      <div class="flex-1 pool-invest">
        View more details about investment
        <router-link
          class="flex items-center w-full goto-btn"
          :to="'#dashboard'"
        >
          <div class="w-full text-center">View dashboard</div>
          <ArrowDownIcon2 class="flex-none ml-3" />
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
  margin: 12px auto 0;
  max-width: 520px;
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  color: #fdfdfd;
  box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
}

.goto-btn {
  background: #50456e;
  box-shadow: 0 1px 2px rgb(0 0 0 / 20%);
}

.my-panel.l-border {
  border-left: 1px solid rgb(151 71 255 / 40%);
}

.buttons-panel {
  border-top: 1px solid rgb(151 71 255 / 40%);
  text-align: center;
  padding-top: 24px;
}
</style>
