<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePool } from '@/composables/usePool';
import { Pool } from '@/services/pool/types';

import BoostedActivities from '../BoostedPoolActivities/Activities.vue';
import Activities from '../PoolActivities/Activities.vue';
import { PoolTransactionsTab } from '../types';
import TradeTransactions from '../TradeTransactions/TradeTransactions.vue';
/**
 * TYPES
 */
type Props = {
  pool: Pool;
  loading: boolean;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

/**
 * COMPUTED
 */
const tabs = computed(() =>
  isStablePhantomPool.value
    ? [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allTransactions'),
        },
        {
          value: PoolTransactionsTab.USER_ACTIVITY,
          label: t('poolTransactions.tabs.myTransactions'),
        },
      ]
    : [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allInvestments'),
        },
        {
          value: PoolTransactionsTab.USER_ACTIVITY,
          label: t('poolTransactions.tabs.myInvestments'),
        },
        {
          value: PoolTransactionsTab.TRADES,
          label: t('poolTransactions.tabs.trades'),
        },
      ]
);

/**
 * COMPOSABLES
 */
const { isStablePhantomPool } = usePool(toRef(props, 'pool'));
const { t } = useI18n();

/**
 * STATE
 */
const activeTab = ref(tabs.value[0].value);
</script>

<template>
  <div>
    <div>
      <div class="flex w-full">
        <BalTabsSwitch v-model="activeTab" :tabs="tabs" noPad class="flex-1" />
      </div>
    </div>

    <template v-if="isStablePhantomPool">
      <BoostedActivities v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY" :poolActivityType="PoolTransactionsTab.ALL_ACTIVITY" :pool="pool" :loading="loading" />
      <BoostedActivities v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY" :poolActivityType="PoolTransactionsTab.USER_ACTIVITY" :pool="pool" :loading="loading" />
    </template>
    <template v-else>
      <div class="mb-20">
        <Activities v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY" :poolActivityType="PoolTransactionsTab.ALL_ACTIVITY" :pool="pool" :loading="loading" />
        <Activities v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY" :poolActivityType="PoolTransactionsTab.USER_ACTIVITY" :pool="pool" :loading="loading" />
        <TradeTransactions v-else-if="activeTab === PoolTransactionsTab.TRADES" :pool="pool" :loading="loading" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.table-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}
</style>
