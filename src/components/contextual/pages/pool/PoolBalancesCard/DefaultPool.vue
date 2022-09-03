<template>
  <!-- <BalCard
    class="overflow-x-auto whitespace-nowrap"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="columns"
      :data="tableData"
      :isLoading="loading"
      skeletonClass="h-64"
      sticky="both"
      :initialState="{
        sortColumn: 'weight',
        sortDirection: 'desc',
      }"
    >
      <template #tokenColumnCell="token">
        <div class="flex flex-row py-4 px-6 bg-[#231928]">
          <BalLink
            :href="explorer.addressLink(token.address)"
            external
            noStyle
            class="flex items-center w-full"
          >
            <div>
              <BalAsset :address="token.address" :size="36" />
            </div>
            <div
              class="overflow-hidden pl-4 font-medium truncate eth-address text-ellipsis"
            >
              {{ symbolFor(token.address) }}
            </div>
            <BalIcon
              name="arrow-up-right"
              size="sm"
              class="ml-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            />
          </BalLink>
        </div>
      </template>
      <template #tokenWeightCell="token">
        <div class="py-4 px-6 text-right font-numeric bg-[#231928]">
          {{ weightFor(token.address) }}
        </div>
      </template>
      <template #tokenBalanceCell="token">
        <div class="py-4 px-6 text-right font-numeric bg-[#231928]">
          {{ balanceFor(token.address) }}
        </div>
      </template>
      <template #tokenValueCell="token">
        <div class="py-4 px-6 text-right font-numeric bg-[#231928]">
          {{ fiatValueFor(token.address) }}
        </div>
      </template>
    </BalTable>
  </BalCard> -->
  <div class="table-container">
    <div class="flex w-full justify-between">
      <div>Token</div>
      <div :class="{ gapMobile: isMobile, gapDesktop: isDesktop }">
        <div>Weight</div>
        <div>Balance</div>
        <div>Value</div>
      </div>
    </div>
    <div class="border mt-[24px]" />
    <div v-for="(token, index) in tableData" :key="index">
      <a :href="explorer.addressLink(token.address)">
        <div class="flex items-center justify-between mt-[24px]">
          <div class="flex items-center">
            <BalAsset :address="token.address" :size="33" />
            <div class="ml-[13.5px] token-name">
              {{ symbolFor(token.address) }}
            </div>
            <img :src="arrow" class="ml-[12px]" />
          </div>
          <div :class="{ gapMobile: isMobile, gapDesktop: isDesktop }">
            <div class="token-detail w-[45px] text-center">
              {{ weightFor(token.address) }}
            </div>
            <div class="token-detail w-[45px] text-center">
              {{ balanceFor(token.address) }}
            </div>
            <div class="token-detail w-[45px] text-center">
              {{ fiatValueFor(token.address) }}
            </div>
          </div>
        </div>
      </a>
    </div>
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
    const { upToLargeBreakpoint } = useBreakpoints();
    const { priceFor } = useTokens();
    const { isStableLikePool } = usePool(pool);

    const { isMobile, isDesktop } = useBreakpoints();

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

<style>
.table-container {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  padding: 24px !important;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;
}

.border {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
}

.token-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
}

.token-detail {
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  color: rgba(245, 225, 255, 0.7);
}

.gapMobile {
  display: flex;
  gap: 50px;
}

.gapDesktop {
  display: flex;
  gap: 70px;
}
</style>
