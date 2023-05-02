<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePoolHelpers } from '@/composables/usePoolHelpers';
import { Pool } from '@/services/pool/types';

import BoostedActivities from '../BoostedPoolActivities/Activities.vue';
import Activities from '../PoolActivities/Activities.vue';
import { PoolTransactionsTab } from '../types';
import useWeb3 from '@/services/web3/useWeb3';
import SwapTransactions from '../SwapTransactions/SwapTransactions.vue';
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
 * COMPOSABLES
 */
const { isWalletReady } = useWeb3();

/**
 * COMPUTED
 */
const tabs = computed(() =>
  isDeepPool.value || isStablePhantomPool.value
    ? [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allTransactions'),
        },
        ...(isWalletReady.value
          ? [
              {
                value: PoolTransactionsTab.USER_ACTIVITY,
                label: t('poolTransactions.tabs.myTransactions'),
              },
            ]
          : []),
      ]
    : [
        {
          value: PoolTransactionsTab.ALL_ACTIVITY,
          label: t('poolTransactions.tabs.allInvestments'),
        },
        ...(isWalletReady.value
          ? [
              {
                value: PoolTransactionsTab.USER_ACTIVITY,
                label: t('poolTransactions.tabs.myInvestments'),
              },
            ]
          : []),
          {
          value: PoolTransactionsTab.TRADES,
          label: t('poolTransactions.tabs.trades'),
        },
      ]
);

/**
 * COMPOSABLES
 */
const { isDeepPool, isStablePhantomPool } = usePoolHelpers(
  toRef(props, 'pool')
);
const { t } = useI18n();

/**
 * STATE
 */
const activeTab = ref(tabs.value[0].value);

/**
 * COMPUTED
 */
const title = computed((): string => {
  if (isDeepPool.value || isStablePhantomPool.value) return t('poolActivity');

  return t('liquidityProvision');
});
</script>

<template>
  <div>
    <div>
      <h4 class="px-4 lg:px-0 mb-7 dark:text-polaris-white font-semibold" v-text="title" />
      <div
        class="flex w-full"
      >
        <BalTabsSwitch v-model="activeTab" :tabs="tabs" noPad class="flex-1" />
      </div>
    </div>

    <template v-if="isStablePhantomPool || isDeepPool">
      <BoostedActivities
        v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY"
        :poolActivityType="PoolTransactionsTab.ALL_ACTIVITY"
        :pool="pool"
        :loading="loading"
      />
      <BoostedActivities
        v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY"
        :poolActivityType="PoolTransactionsTab.USER_ACTIVITY"
        :pool="pool"
        :loading="loading"
      />
    </template>
    <template v-else>
      <div class="mb-20">
        <Activities
          v-if="activeTab === PoolTransactionsTab.ALL_ACTIVITY"
          :poolActivityType="PoolTransactionsTab.ALL_ACTIVITY"
          :pool="pool"
          :loading="loading"
        />
        <Activities
          v-else-if="activeTab === PoolTransactionsTab.USER_ACTIVITY"
          :poolActivityType="PoolTransactionsTab.USER_ACTIVITY"
          :pool="pool"
          :loading="loading"
        />
        <SwapTransactions
          v-else-if="activeTab === PoolTransactionsTab.TRADES && !isStablePhantomPool && !isDeepPool"
          :pool="pool"
          :loading="loading"
        />
      </div>
    </template>
  </div>
</template>
