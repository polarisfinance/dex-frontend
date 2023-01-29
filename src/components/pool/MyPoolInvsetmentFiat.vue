<script lang="ts">
import numeral from 'numeral';
import { computed, defineComponent, PropType, Ref, toRefs, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { usePool } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { shortenLabel } from '@/lib/utils';
import { Pool, PoolWithShares } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { bnum } from '@/lib/utils';
import BigNumber from 'bignumber.js';

export interface MyPollInvestmentFiatType {
  fiatValue: String;
  fiatNumber: Number;
  pool: PoolWithShares;
}

export default defineComponent({
  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
    tokens: {
      type: String,
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
    const { fNum2, toFiat } = useNumbers();
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
    const { isStablePhantomPool } = usePool(toRef(props, 'pool'));

    const tokenAddresses = computed((): string[] => {
      if (props.pool != undefined) {
        if (isStablePhantomPool.value) {
          // We're using mainToken balances for StablePhantom pools
          // so return mainTokens here so that fiat values are correct.
          return props.pool.mainTokens || [];
        }
        return props.pool.tokensList;
      } else {
        return new Array();
      }
    });

    const fiatValue = computed(() => {
      let fiatVal = 0;

      props.pool.tokens.forEach(token => {
        fiatVal += Number(toFiat(token.balance, token.address));
      });

      const lpVal = fiatVal / Number(pool.value.totalShares);
      const totalValue = lpVal * Number(props.tokens);

      return fNum2(totalValue, FNumFormats.fiat);
    });

    const fiatValue2 = computed(() => {
      let total = bnum(0);
      if (props.pool != undefined) {
        for (const token of props.pool.tokensList) {
          total = total.plus(bnum(priceFor(token)).times(props.tokens));
        }
      }
      return total;
    });

    // const fiatNumber = computed(() => {
    //   const fiatval = tokenAddresses.value
    //     .map((address, i) => toFiat(props.tokens, address))
    //     .reduce((total, value) => bnum(total).plus(value).toString());

    //   return Number(fiatval);
    // });

    // function fiatValue( propTokenAmount,pool){
    //   alert(pool.id);
    //   return toFiat(propTokenAmount, pool.address)
    // };
    function myalert() {
      return fiatValue;
    }

    return {
      fNum2,
      upToLargeBreakpoint,
      fiatValue,
      fiatValue2,
      // fiatNumber,
      FNumFormats,
      myalert,
    };
  },
});
</script>

<template>
  <div>{{ fiatValue }}</div>
</template>

<style scoped></style>
