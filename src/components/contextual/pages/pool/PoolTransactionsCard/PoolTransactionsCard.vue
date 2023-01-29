<script setup lang="ts">
import { toRef } from 'vue';

import { usePool } from '@/composables/usePool';
import { Pool } from '@/services/pool/types';

import InvestmentTransactions from './InvestmentTransactions/InvestmentTransactions.vue';

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
const { isStablePhantomPool } = usePool(toRef(props, 'pool'));
</script>

<template>
  <h4
    class="mt-[95px] mb-[24px]"
    v-text="$t('poolTransactions.tabs.investmentsTrades')"
  />
  <InvestmentTransactions :pool="pool" :loading="loading" />

</template>
<style scoped>
h4{
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;
  padding: 10px 24px;
}
</style>
