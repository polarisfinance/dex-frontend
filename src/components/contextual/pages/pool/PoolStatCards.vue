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
      <div class="card-container" v-else>
        <div class="text-secondary mb-[12px] flex text-sm font-medium">
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
    </template>
  </div>
</template>

<style scoped>
.card-container {
  background: #1e0d2c;
  border-radius: 16px;
  padding: 16px;
}

.label {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #d7b3ff;
}

.funds {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}
</style>
