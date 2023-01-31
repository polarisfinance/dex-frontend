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
</script>

<template>
  <div class="mb-[24px] flex w-full">
    <template v-for="stat in stats" :key="stat.id">
      <BalLoadingBlock v-if="stat.loading" class="h-24" />
      <div class="card-container flex flex-1" v-else>
        <div>
          <WalletNewIcon v-if="stat.id == 'poolValue'" />
          <svg
            v-if="stat.id == 'volumeTime'"
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_639_3279)">
              <path
                d="M11.0002 16H5.66683C4.93045 16 4.3335 16.597 4.3335 17.3333V25.3333C4.3335 26.0697 4.93045 26.6667 5.66683 26.6667H11.0002C11.7365 26.6667 12.3335 26.0697 12.3335 25.3333V17.3333C12.3335 16.597 11.7365 16 11.0002 16Z"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19.0002 10.6667H13.6668C12.9304 10.6667 12.3335 11.2637 12.3335 12.0001V25.3334C12.3335 26.0698 12.9304 26.6667 13.6668 26.6667H19.0002C19.7365 26.6667 20.3335 26.0698 20.3335 25.3334V12.0001C20.3335 11.2637 19.7365 10.6667 19.0002 10.6667Z"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M27.0002 5.33325H21.6668C20.9304 5.33325 20.3335 5.93021 20.3335 6.66659V25.3333C20.3335 26.0696 20.9304 26.6666 21.6668 26.6666H27.0002C27.7365 26.6666 28.3335 26.0696 28.3335 25.3333V6.66659C28.3335 5.93021 27.7365 5.33325 27.0002 5.33325Z"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.66699 26.6667H24.3337"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_639_3279">
                <rect
                  width="32"
                  height="32"
                  fill="white"
                  transform="translate(0.333496)"
                />
              </clipPath>
            </defs>
          </svg>
          <CoinsIcon v-if="stat.id == 'feesTime'" />
          <svg
            v-if="stat.id == 'apr'"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_639_3303)">
              <path
                d="M24 27.9999V9.33325"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 20L16 16L20 20"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20 13.3333L24 9.33325L28 13.3333"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 28H28"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 28V16"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4 8L8 4L12 8"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 28V4"
                stroke="#BDB2DD"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_639_3303">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
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
    <template v-if="stakedBalance > 0">
      <div class="card-container flex flex-1">
        <div class="card-container flex flex-1">
          <div>
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_699_6305)">
                <path
                  d="M16.6665 28C23.2939 28 28.6665 22.6274 28.6665 16C28.6665 9.37258 23.2939 4 16.6665 4C10.0391 4 4.6665 9.37258 4.6665 16C4.6665 22.6274 10.0391 28 16.6665 28Z"
                  stroke="#BDB2DD"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.3998 12.0004C20.1583 11.5814 19.8074 11.236 19.3846 11.0011C18.9619 10.7662 18.4832 10.6508 17.9998 10.667H15.3332C14.6259 10.667 13.9477 10.948 13.4476 11.4481C12.9475 11.9482 12.6665 12.6265 12.6665 13.3337C12.6665 14.0409 12.9475 14.7192 13.4476 15.2193C13.9477 15.7194 14.6259 16.0004 15.3332 16.0004H17.9998C18.7071 16.0004 19.3854 16.2813 19.8855 16.7814C20.3856 17.2815 20.6665 17.9598 20.6665 18.667C20.6665 19.3743 20.3856 20.0526 19.8855 20.5527C19.3854 21.0528 18.7071 21.3337 17.9998 21.3337H15.3332C14.8498 21.35 14.3712 21.2345 13.9484 20.9996C13.5256 20.7648 13.1747 20.4194 12.9332 20.0004"
                  stroke="#BDB2DD"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.6665 8V10.6667M16.6665 21.3333V24"
                  stroke="#BDB2DD"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_699_6305">
                  <rect
                    width="32"
                    height="32"
                    fill="white"
                    transform="translate(0.666504)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="ml-[16px]">
            <div class="text-secondary mb-[4px] flex text-sm font-medium">
              <div class="label">Your total value in $</div>
            </div>
            <div class="funds flex items-center truncate text-xl font-medium">
              <MyPoolInvsetmentFiat :pool="pool" :tokens="stakedBalance" />
            </div>
          </div>
        </div>
      </div>
      <div class="card-container flex flex-1" v-if="stakedBalance > 0">
        <div class="card-container flex flex-1">
          <div>
            <CoinsIcon />
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
  <div class="buttons-panel flex text-center">
    <div class="pool-invest flex-1">
      Invest in the pool and earn on swap fees!
      <router-link
        class="invest-btn flex w-full items-center"
        :to="'/pool/' + pool?.id + '/invest'"
      >
        <PlusIcon class="ml-3 flex-none" />
        <div class="w-full text-center">Invest in the pool</div>
      </router-link>
    </div>
    <div class="my-panel flex flex-1 gap-4 pl-[24px]" v-if="stakedBalance > 0">
      <div class="pool-invest flex-1">
        You can claim in any time
        <router-link
          class="invest-btn flex w-full items-center"
          :to="'/pool/' + pool?.id + '/invest'"
        >
          <div class="w-full text-center">Invest in the pool</div>
          <ArrowRightIcon class="ml-3 flex-none" />
        </router-link>
      </div>
      <div class="pool-invest flex-1">
        View more details about investment
        <router-link
          class="goto-btn flex w-full items-center"
          :to="'#dashboard'"
        >
          <div class="w-full text-center">Invest in the pool</div>
          <ArrowDownIcon2 class="ml-3 flex-none" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  justify-content: center;
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
}
.invest-btn {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  color: #fdfdfd;
}
.goto-btn {
  background: #50456e;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
}
.my-panel {
  border-left: 1px solid rgba(151, 71, 255, 0.4);
}
.buttons-panel {
  border-top: 1px solid rgba(151, 71, 255, 0.4);
  text-align: center;
  padding-top: 24px;
}
</style>
