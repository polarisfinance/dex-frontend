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

import arrow from './table-arrow.svg';

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
    const { explorerLinks } = useWeb3();
    const { t } = useI18n();
    const { isMobile, isDesktop, upToLargeBreakpoint } = useBreakpoints();
    const { priceFor } = useTokens();
    const { isStableLikePool } = usePool(pool);

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

    const columns = computed(() => [
      {
        name: t('token'),
        id: 'token',
        accessor: 'address',
        Cell: 'tokenColumnCell',
        width: 175,
      },
      {
        name: t('weight'),
        id: 'weight',
        accessor: 'index',
        Cell: 'tokenWeightCell',
        align: 'right',
        sortKey: pool => weightFor(pool.address),
        width: 125,
        hidden: !props.loading && isStableLikePool.value,
      },
      {
        name: t('balance'),
        id: 'balance',
        accessor: 'index',
        Cell: 'tokenBalanceCell',
        align: 'right',
        sortKey: pool => balanceFor(pool.address),
        width: 125,
      },
      {
        name: t('value'),
        id: 'value',
        accessor: 'index',
        Cell: 'tokenValueCell',
        align: 'right',
        sortKey: pool => numeral(fiatValueFor(pool.address)).value(),
        width: 125,
      },
    ]);

    /**
     * METHODS
     */
    function symbolFor(address: string) {
      if (!pool || !pool.value) return '-';
      const symbol = pool.value?.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }

    function balanceFor(address: string): string {
      if (!pool || !pool.value) return '-';
      const balance = pool.value?.onchain?.tokens[address]?.balance;
      return balance ? fNum2(balance, FNumFormats.token) : '-';
    }

    function weightFor(address: string): string {
      if (!pool || !pool.value) return '-';
      const weight = pool.value?.onchain?.tokens[address]?.weight;
      return weight ? fNum2(weight, FNumFormats.percent) : '-';
    }

    function fiatValueFor(address: string): string {
      const price = priceFor(address);
      if (!pool || !pool.value || price === 0) return '-';

      const balance = pool.value?.onchain?.tokens[address]?.balance;
      return balance ? fNum2(Number(balance) * price, FNumFormats.fiat) : '-';
    }

    return {
      symbolFor,
      balanceFor,
      weightFor,
      fiatValueFor,
      fNum2,
      explorer: explorerLinks,
      columns,
      tableData,
      upToLargeBreakpoint,
      arrow,
      isMobile,
      isDesktop,
    };
  },
});
</script>

<template>
  <div class="card w-full" :class="{'max-w':isDesktop}" v-for="(token, index) in tableData" :key="index">
    <div class="subheadline text-center">Pool Composition</div>
    <div class="flex mx-1 my-4">
      <BalAsset :address="token.address" :size="48" />
      <div class="token-name ml-[12px]">
        {{ symbolFor(token.address) }}
      </div>
      <img :src="arrow" class="ml-[12px]" />
    </div>
    <div class="composition-data flex p-2">
      <div class="flex-1 text-left">
        <div class="subheadline">Weight</div>
        {{ weightFor(token.address) }}
      </div>
      <div class="flex-1 text-center">
        <div class="subheadline">Balance</div>
        {{ balanceFor(token.address) }}
      </div>
      <div class="flex-1 text-right">
        <div class="subheadline">Value</div>
        {{ fiatValueFor(token.address) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.card{
  padding: 12px ;
  gap: 16px;
  background: #292043;
  border-radius: 20px;
}
.card.max-w{
  max-width: 355px;
}
.subheadline{
  background: #41365E;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #FDFDFD;
}
.token-name{
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;

}
.composition-data{
  border-top: 1px solid rgba(65, 54, 94, 0.4);
  margin-top: 24px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FDFDFD;
}
.composition-data .subheadline{
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #BDB2DD;
  background:none;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
