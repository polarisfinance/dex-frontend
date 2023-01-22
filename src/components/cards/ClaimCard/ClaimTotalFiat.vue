<template>
  <div>{{ totalValue }}
  </div>
</template>

<script lang="ts">
import numeral from 'numeral';
import { computed, defineComponent, PropType, Ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { usePool } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { shortenLabel } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';


export default defineComponent({
  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
    loading: { type: Boolean, default: false },
  },
  setup(props) {
    /**
     * STATE
     */
    const { pool }: { pool: Ref<Pool> } = toRefs(props);

    /**
     * COMPOSABLES
     */
    const { fNum2 } = useNumbers();
    const { upToLargeBreakpoint } = useBreakpoints();
    const { priceFor } = useTokens();


    /**
     * COMPUTED
     */
    const tableData = computed(() => {
      if (!pool || !pool.value || props.loading) return [];
      const onchainTokens = pool.value?.onchain?.tokens || [];
      return Object.keys(onchainTokens).map((address, index) => ({
        address,
        index,
      }));
    });
    const totalValue = computed(() => {
      if (!pool || !pool.value || props.loading) return [];
      const onchainTokens = pool.value?.onchain?.tokens || [];
      const data = Object.keys(onchainTokens).map((address, index) => ({
        address,
        index,
      }));
      let poolTotalValue = 0;
      data.forEach(token => {
        const price = priceFor(token.address);
        if (!pool || !pool.value || price === 0) return '-';

        const balance = pool.value?.onchain?.tokens[token.address]?.balance;
        poolTotalValue = poolTotalValue + Number(balance) * price;
        return balance ? fNum2(Number(balance) * price, FNumFormats.fiat) : '-';
        
      });
      return fNum2(poolTotalValue, FNumFormats.fiat);
    });

    return {
      fNum2,
      upToLargeBreakpoint,
      totalValue,
    };
  },
});
</script>

<style scoped>
</style>
