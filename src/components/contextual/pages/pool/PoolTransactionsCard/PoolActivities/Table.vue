<script setup lang="ts">
import { getAddress } from '@ethersproject/address';
import { formatDistanceToNow } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
import { PoolActivity, PoolActivityType } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import plus from './plus.svg';
import minus from './minus.svg';

/**
 * TYPES
 */
type TokenAmount = {
  address: string;
  symbol: string;
  amount: string;
};

type ActivityRow = {
  label: string;
  formattedValue: string;
  value: number;
  timestamp: number;
  formattedDate: string;
  tx: string;
  type: PoolActivityType;
  tokenAmounts: TokenAmount[];
};

type Props = {
  tokens: string[];
  poolActivities: PoolActivity[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  // eslint-disable-next-line vue/require-default-prop -- TODO: Define default prop
  loadMore?: () => void;
  isPaginated?: boolean;
  noResultsLabel?: string;
};

const { isMobile, isDesktop } = useBreakpoints();

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
const { explorerLinks } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();
const { getToken, priceFor } = useTokens();
/**
 * COMPUTED
 */
const columns = computed<ColumnDefinition<ActivityRow>[]>(() => [
  {
    name: t('action'),
    id: 'action',
    accessor: 'tx',
    Cell: 'actionCell',
    width: 150,
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
    name: t('tokens'),
    id: 'details',
    accessor: '',
    Cell: 'detailsCell',
    width: 325,
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

const activityRows = computed<ActivityRow[]>(() =>
  props.isLoading
    ? []
    : props.poolActivities.map(({ type, timestamp, tx, amounts }) => {
        const isJoin = type === 'Join';
        const value = getJoinExitValue(amounts);

        return {
          label: isJoin ? t('invest') : t('withdraw.label'),
          value,
          formattedValue:
            value > 0
              ? fNum2(value, { style: 'currency', abbreviate: true })
              : '-',
          timestamp,
          formattedDate: t('timeAgo', [formatDistanceToNow(timestamp)]),
          tx,
          type,
          tokenAmounts: getJoinExitDetails(amounts),
        };
      })
);

/**
 * METHODS
 */
function getJoinExitValue(amounts: PoolActivity['amounts']) {
  let total = bnum(0);

  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];
    const address = getAddress(props.tokens[i]);
    const token = getToken(address);
    const price = priceFor(token?.address);
    const amountNumber = Math.abs(parseFloat(amount));
    // If the price is unknown for any of the positive amounts - the value cannot be computed.
    if (amountNumber > 0 && price === 0) {
      return 0;
    }
    total = total.plus(bnum(amountNumber).times(price));
  }
  return total.toNumber();
}

function getJoinExitDetails(amounts: PoolActivity['amounts']) {
  return amounts.map((amount, index) => {
    const address = getAddress(props.tokens[index]);
    const token = getToken(address);
    const symbol = token ? token.symbol : address;
    const amountNumber = parseFloat(amount);
    return {
      address,
      symbol,
      amount: fNum2(amountNumber, FNumFormats.token),
    };
  });
}

// var len = Math.min(5, activityRows.value.length);
var len = 0;
function load_more() {
  if (len + 5 >= activityRows.value.length) {
    len = activityRows.value.length;
  } else {
    len += 5;
  }
}

const getRows = computed<ActivityRow[]>(() => {
  return activityRows.value.slice(0, len);
});
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
      :data="activityRows"
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
    > -->
    <!-- <template #actionCell="action">
        <div class="py-2 px-6">
          <div class="flex items-center">
            <div class="flex mr-3 center">
              <BalIcon
                v-if="action.type === 'Join'"
                name="plus"
                size="sm"
                class="text-green-500 dark:text-green-400"
              />
              <BalIcon v-else name="minus" size="sm" class="text-red-500" />
            </div>
            <div>{{ action.label }}</div>
          </div>
        </div>
      </template>

      <template #detailsCell="action">
        <div class="flex flex-wrap py-4 px-6 -mt-1">
          <template v-for="(tokenAmount, i) in action.tokenAmounts" :key="i">
            <div
              v-if="tokenAmount.amount !== '0'"
              class="flex items-center p-1 px-2 m-1 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <BalAsset
                :address="tokenAmount.address"
                class="flex-shrink-0 mr-2"
              />
              <span class="font-numeric">{{ tokenAmount.amount }}</span>
            </div>
          </template>
        </div>
      </template>

      <template #valueCell="action">
        <div class="flex justify-end py-4 px-6 font-numeric">
          {{ action.formattedValue }}
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
    <div class="grid">
      <div>Action</div>
      <div class="ml-[32px] flex w-full items-start gap-[40px]">
        <div>Value</div>
        <div>Tokens</div>
      </div>
      <div class="text-right">Time</div>
    </div>
    <div class="my-[24px] border" />
    <div v-for="(action, index) in activityRows" :key="index">
      <a :href="explorerLinks.txLink(action.tx)" target="_blank">
        <div class="grid">
          <!-- <div class="flex items-center justify-between"> -->
          <div class="flex items-center">
            <img :src="plus" v-if="action.label == 'Invest'" />
            <img :src="minus" v-else />
            <div class="ml-[12px]">
              {{ action.label }}
            </div>
          </div>
          <div class="ml-[32px] flex items-start justify-start">
            <div class="value-text mr-[16px]">
              {{ action.formattedValue }}
            </div>
            <div class="flex items-center gap-[12px]">
              <div v-for="(tokenAmount, i) in action.tokenAmounts" :key="i">
                <div
                  v-if="tokenAmount.amount !== '0'"
                  class="token-card text-center"
                >
                  <BalAsset
                    :size="16"
                    :address="tokenAmount.address"
                    class="flex-shrink-0"
                  />
                  <div class="font-numeric">{{ tokenAmount.amount }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="value-text text-right" v-if="isDesktop">
            {{ action.formattedDate }}
          </div>
          <!-- </div> -->
        </div>
        <div class="value-text mt-[8px] flex justify-end" v-if="isMobile">
          {{ action.formattedDate }}
        </div>
      </a>
    </div>
    <!-- <div class="w-full flex justify-center">
      <button class="load-more">
        <div class="flex items-center">
          <div>Load more</div>
          <img src="./load-more.svg" />
        </div>
      </button>
    </div> -->
  </div>
</template>

<style scoped>
.table-container {
  background: #1e0d2c;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
  padding-bottom: 0;
}

.border {
  border: 0.5px solid rgba(151, 71, 255, 0.4);
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

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: column;
}
</style>
