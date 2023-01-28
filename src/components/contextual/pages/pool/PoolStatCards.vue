<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel } from '@/composables/usePool';
import { APR_THRESHOLD } from '@/constants/pools';
import { Pool, PoolAPRs } from '@/services/pool/types';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  poolApr: PoolAPRs;
  loading?: boolean;
  loadingApr?: boolean;
  aprString: string;
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
    {
      id: 'feesTime',
      label: t('feesTime', ['24h']),
      value: fNum2(props.pool.feesSnapshot || '0', FNumFormats.fiat),
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
});
</script>

<template>
  <div
    class="grid grid-cols-2 gap-[12px] pb-[12px] sm:grid-cols-2 xl:grid-cols-4"
  >
    <template v-for="stat in stats" :key="stat.id">
      <BalLoadingBlock v-if="stat.loading" class="h-24" />
      <div class="card-container flex" v-else>
        <div>
          <svg v-if="stat.id=='poolValue'" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_639_3270)">
            <path d="M22.6668 10.6666V6.66659C22.6668 6.31296 22.5264 5.97383 22.2763 5.72378C22.0263 5.47373 21.6871 5.33325 21.3335 5.33325H8.00016C7.29292 5.33325 6.61464 5.6142 6.11454 6.1143C5.61445 6.6144 5.3335 7.29267 5.3335 7.99992M5.3335 7.99992C5.3335 8.70716 5.61445 9.38544 6.11454 9.88554C6.61464 10.3856 7.29292 10.6666 8.00016 10.6666H24.0002C24.3538 10.6666 24.6929 10.8071 24.943 11.0571C25.193 11.3072 25.3335 11.6463 25.3335 11.9999V15.9999M5.3335 7.99992V23.9999C5.3335 24.7072 5.61445 25.3854 6.11454 25.8855C6.61464 26.3856 7.29292 26.6666 8.00016 26.6666H24.0002C24.3538 26.6666 24.6929 26.5261 24.943 26.2761C25.193 26.026 25.3335 25.6869 25.3335 25.3333V21.3333" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M26.6665 16V21.3333H21.3332C20.6259 21.3333 19.9477 21.0524 19.4476 20.5523C18.9475 20.0522 18.6665 19.3739 18.6665 18.6667C18.6665 17.9594 18.9475 17.2811 19.4476 16.781C19.9477 16.281 20.6259 16 21.3332 16H26.6665Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_639_3270">
            <rect width="32" height="32" fill="white"/>
            </clipPath>
            </defs>
          </svg>
          <svg v-if="stat.id=='volumeTime'"  width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_639_3279)">
            <path d="M11.0002 16H5.66683C4.93045 16 4.3335 16.597 4.3335 17.3333V25.3333C4.3335 26.0697 4.93045 26.6667 5.66683 26.6667H11.0002C11.7365 26.6667 12.3335 26.0697 12.3335 25.3333V17.3333C12.3335 16.597 11.7365 16 11.0002 16Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.0002 10.6667H13.6668C12.9304 10.6667 12.3335 11.2637 12.3335 12.0001V25.3334C12.3335 26.0698 12.9304 26.6667 13.6668 26.6667H19.0002C19.7365 26.6667 20.3335 26.0698 20.3335 25.3334V12.0001C20.3335 11.2637 19.7365 10.6667 19.0002 10.6667Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27.0002 5.33325H21.6668C20.9304 5.33325 20.3335 5.93021 20.3335 6.66659V25.3333C20.3335 26.0696 20.9304 26.6666 21.6668 26.6666H27.0002C27.7365 26.6666 28.3335 26.0696 28.3335 25.3333V6.66659C28.3335 5.93021 27.7365 5.33325 27.0002 5.33325Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66699 26.6667H24.3337" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_639_3279">
            <rect width="32" height="32" fill="white" transform="translate(0.333496)"/>
            </clipPath>
            </defs>
          </svg>
          <svg v-if="stat.id=='feesTime'"  width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_639_3290)">
            <path d="M21.9997 12.0002C25.6816 12.0002 28.6663 10.2094 28.6663 8.00024C28.6663 5.79111 25.6816 4.00024 21.9997 4.00024C18.3178 4.00024 15.333 5.79111 15.333 8.00024C15.333 10.2094 18.3178 12.0002 21.9997 12.0002Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.333 8.00024V13.3336C15.333 15.5429 18.3183 17.3336 21.9997 17.3336C25.681 17.3336 28.6663 15.5429 28.6663 13.3336V8.00024" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.333 13.3337V18.6671C15.333 20.8764 18.3183 22.6671 21.9997 22.6671C25.681 22.6671 28.6663 20.8764 28.6663 18.6671V13.3337" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.333 18.667V24.0003C15.333 26.2097 18.3183 28.0003 21.9997 28.0003C25.681 28.0003 28.6663 26.2097 28.6663 24.0003V18.667" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.99984 12.0002H6.6665C6.13607 12.0002 5.62736 12.211 5.25229 12.586C4.87722 12.9611 4.6665 13.4698 4.6665 14.0002C4.6665 14.5307 4.87722 15.0394 5.25229 15.4145C5.62736 15.7895 6.13607 16.0002 6.6665 16.0002H7.99984C8.53027 16.0002 9.03898 16.211 9.41405 16.586C9.78912 16.9611 9.99984 17.4698 9.99984 18.0002C9.99984 18.5307 9.78912 19.0394 9.41405 19.4145C9.03898 19.7895 8.53027 20.0002 7.99984 20.0002H4.6665" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.33301 20.0003V21.3337M7.33301 10.667V12.0003" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_639_3290">
            <rect width="32" height="32" fill="white" transform="translate(0.666504)"/>
            </clipPath>
            </defs>
          </svg>
          <svg v-if="stat.id=='apr'"  width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_639_3303)">
            <path d="M24 27.9999V9.33325" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20L16 16L20 20" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 13.3333L24 9.33325L28 13.3333" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 28H28" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 28V16" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 8L8 4L12 8" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 28V4" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_639_3303">
            <rect width="32" height="32" fill="white"/>
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
  </div>
</template>

<style scoped>
.card-container {
  justify-content:center;
}

.label {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #BDB2DD;
}

.funds {
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #FDFDFD;
}
</style>
