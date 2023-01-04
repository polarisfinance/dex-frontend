<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { shortenLabel } from '@/lib/utils';
import { bnum } from '@/lib/utils';
import { PoolSwap } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * TYPES
 */
type SwapRow = {
  tokenIn: string;
  tokenOut: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  timestamp: number;
  formattedDate: string;
  value: number;
  formattedValue: string;
  tx: string;
};

type Props = {
  tokens: string[];
  poolSwaps: PoolSwap[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  // eslint-disable-next-line vue/require-default-prop -- TODO: Define default prop
  loadMore?: () => void;
  isPaginated?: boolean;
  noResultsLabel?: string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isLoadingMore: false,
  isPaginated: false,
  noResultsLabel: '',
});

const emit = defineEmits(['loadMore']);

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const { t } = useI18n();
const { priceFor } = useTokens();
const { upToLargeBreakpoint } = useBreakpoints();
const { explorerLinks } = useWeb3();
const { isMobile, isDesktop } = useBreakpoints();

/**
 * COMPUTED
 */
const columns = computed<ColumnDefinition<SwapRow>[]>(() => [
  {
    name: t('trader'),
    id: 'action',
    accessor: 'tx',
    Cell: 'actionCell',
    width: 190,
    sortable: false,
  },
  {
    name: t('value'),
    id: 'value',
    accessor: 'value',
    Cell: 'valueCell',
    align: 'right',
    className: 'align-center w-40',
    sortKey: pool => pool.value,
    width: 125,
  },
  {
    name: t('tradeDetails'),
    id: 'details',
    accessor: '',
    Cell: 'detailsCell',
    width: 310,
    sortable: false,
  },

  {
    name: t('time'),
    id: 'timeAgo',
    accessor: 'timestamp',
    Cell: 'timeCell',
    align: 'right',
    sortKey: pool => pool.timestamp,
    width: 200,
  },
]);

const swapRows = computed<SwapRow[]>(() =>
  props.isLoading
    ? []
    : props.poolSwaps.map(
        ({
          tokenIn,
          tokenOut,
          tokenAmountIn,
          tokenAmountOut,
          timestamp,
          tx,
          userAddress,
          ensName,
          ensAvatar,
        }) => {
          const value = bnum(priceFor(tokenOut))
            .times(tokenAmountOut)
            .toNumber();

          return {
            value,
            formattedValue:
              value > 0
                ? fNum2(value, { style: 'currency', abbreviate: true })
                : '-',
            tokenIn,
            tokenOut,
            tokenAmountIn,
            tokenAmountOut,
            timestamp,
            userAddress: userAddress.id,
            ensName,
            ensAvatar,
            formattedDate: t('timeAgo', [formatDistanceToNow(timestamp)]),
            tx,
          };
        }
      )
);
</script>

<template>
  <div
    class="table-container overflow-x-auto p-[24px]"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <!-- <BalTable
      :columns="columns"
      :data="swapRows"
      :isLoading="isLoading"
      :isLoadingMore="isLoadingMore"
      :isPaginated="isPaginated"
      skeletonClass="h-64"
      sticky="both"
      :noResultsLabel="noResultsLabel"
      :initialState="{
        sortColumn: 'timeAgo',
        sortDirection: 'desc',
      }"
      @load-more="emit('loadMore')"
    >
      <template #actionCell="action">
        <div class="py-2 px-6">
          <div class="flex items-center">
            <BalAsset
              class="flex-shrink-0 mr-2"
              :address="action.userAddress"
              :iconURI="action.ensAvatar"
              :size="30"
            />
            <span :class="[action.ensName && 'truncate']">
              {{ action.ensName || shortenLabel(action.userAddress) }}
            </span>
          </div>
        </div>
      </template>

      <template #valueCell="action">
        <div class="flex justify-end py-4 px-6 font-numeric">
          {{ action.formattedValue }}
        </div>
      </template>

      <template #detailsCell="action">
        <div class="flex flex-wrap items-center py-4 px-6 -mt-1">
          <div class="token-item">
            <BalAsset :address="action.tokenIn" class="flex-shrink-0 mr-2" />
            <span class="font-numeric">{{
              fNum2(action.tokenAmountIn, FNumFormats.token)
            }}</span>
          </div>
          <BalIcon name="arrow-right" class="mx-1" />
          <div class="token-item">
            <BalAsset :address="action.tokenOut" class="flex-shrink-0 mr-2" />
            <span class="font-numeric">{{
              fNum2(action.tokenAmountOut, FNumFormats.token)
            }}</span>
          </div>
        </div>
      </template>

      <template #timeCell="action">
        <div class="py-4 px-6">
          <div
            class="flex justify-end items-center text-right whitespace-nowrap wrap"
          >
            {{ action.formattedDate }}
            <BalLink
              :href="explorerLinks.txLink(action.tx)"
              external
              class="flex items-center ml-2"
            >
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="text-gray-500 hover:text-blue-500 transition-colors"
              />
            </BalLink>
          </div>
        </div>
      </template>
    </BalTable> -->
    <div :class="{'grid': isDesktop , 'grid-mobile': isMobile,}">
      <div>Action</div>
      <div class="text-right mr-[12px]">Value</div>
      <div class="text-center" >Tokens</div>
      <div  v-if="isDesktop" class="text-right">Time</div>
      <div class="my-[24px] border"/>
      <template v-for="(action, index) in swapRows" :key="index">
        <div class="flex" :class="{'items-center': isDesktop , 'items-top': isMobile,}">
          <BalAsset
            class="mr-2"
            :address="action.userAddress"
            :iconURI="action.ensAvatar"
            :size="24"
          />
          <div class="ml-[12px] mr-[20px]">
            {{ action.ensName || shortenLabel(action.userAddress) }}
          </div>
        </div>
        <div class="text-right value-text mr-[12px]">
          {{ action.formattedValue }}
        </div>
        <div :class="{'text-right': isMobile,'text-center': isDesktop,}">
            <div class="flex text-center" :class="{'justify-center': isDesktop , 'justify-end': isMobile,}">
              <div class="token-item">
                <BalAsset
                  :address="action.tokenIn"
                  class="mr-[8px]"
                  :size="16"
                />
                <span class="font-numeric">{{
                  fNum2(action.tokenAmountIn, FNumFormats.token)
                }}</span>
              </div>
              <img src="./swap.svg" class="mx-[12px]" />
              <div class="token-item">
                <BalAsset
                  :address="action.tokenOut"
                  class="mr-[8px]"
                  :size="16"
                />
                <span class="font-numeric">{{
                  fNum2(action.tokenAmountOut, FNumFormats.token)
                }}</span>
              </div>
            </div>
            <div v-if="isMobile" class="value-text text-right my-[4px]">
                {{ action.formattedDate }}
              </div>
          </div>
          <div class="value-text text-right" v-if="isDesktop">
            {{ action.formattedDate }}
          </div>
        </template>
    </div>
  </div>
</template>

<style scoped>
.token-item {
  /* @apply m-1 flex items-center p-1 px-2 bg-gray-50 dark:bg-gray-700 rounded-lg; */
  display: flex;
  padding: 2px 4px;
  align-items: center;
  background: #2e2433;
  border-radius: 10px;
}

.table-container {
  background: #1e0d2c;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
  /* padding-bottom: 0; */
}
.border{
  border: 0.5px solid rgba(151, 71, 255, 0.4);
}
.grid .border {
  grid-column: 1 / span 4;
}
.grid-mobile .border {
  grid-column: 1 / span 3;
}
.value-text {
  color: rgba(245, 225, 255, 0.7);

  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
}

.token-card {
  display: flex;
  align-items: center;
  background: #2e2433;
  border-radius: 10px;
  padding: 2px 4px;
  gap: 8px;
}

.load-more {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #be95c0;
  background: #231928;
}
.grid{
  display: grid;
  grid-template-columns: 145px auto;
}
.grid-mobile{
  display: grid;

  grid-template-columns: 145px auto auto;
  
}
</style>
