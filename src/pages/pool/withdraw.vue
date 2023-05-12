<script setup lang="ts">
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { usePoolHelpers } from '@/composables/usePoolHelpers';
import { oneSecondInMs } from '@/composables/useTime';
import { useIntervalFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { hasFetchedPoolsForSor } from '@/lib/balancer.sdk';
import WithdrawPage from '@/components/contextual/pages/pool/withdraw/WithdrawPage.vue';
import { useTokens } from '@/providers/tokens.provider';
import { providePoolStaking } from '@/providers/local/pool-staking.provider';
import useWeb3 from '@/services/web3/useWeb3';
const route = useRoute();
const id = (route.params.id as string).toLowerCase();
providePoolStaking(id);

import StakePreview, { StakeAction } from './StakePreview.vue';

type Props = {
  step: {
    type: number;
    default: 1;
  };
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'active-step-updated', step: number): void }>();

/**
 * COMPUTED
 */
const step = computed(() => props.step);
const activeStep = ref(step);
const { isWalletReady } = useWeb3();
/**
 * COMPOSABLES
 */
const { pool, poolDecorationQuery, loadingPool } = usePoolTransfers();
const { isDeepPool } = usePoolHelpers(pool);
const { balanceQueryLoading } = useTokens();

// Instead of refetching pool data on every block, we refetch every 20s to prevent
// overfetching a request on short blocktime networks like Polygon.
useIntervalFn(poolDecorationQuery.refetch, oneSecondInMs * 20);

/**
 * COMPUTED
 */
// We only need to wait for SOR if it's a deep pool.
const isLoadingSor = computed(
  (): boolean => isDeepPool.value && !hasFetchedPoolsForSor.value
);

const isLoading = computed(
  (): boolean =>
    loadingPool.value || isLoadingSor.value || balanceQueryLoading.value
);

function setActiveStep(newStep) {
  emit('active-step-updated', newStep);
}

function handleUnstakeConfirmed() {
  setActiveStep(activeStep.value + 1);
}
function handleWithdrawPreview() {
  setActiveStep(activeStep.value + 1);
}
function handleWithdrawConfirm() {
  setActiveStep(activeStep.value + 1);
}

watch(isWalletReady, isReady => {
  if (isReady == true) activeStep.value = 2;
});
onBeforeMount(async () => {
  if (isWalletReady && activeStep.value == 1) {
    setActiveStep(2);
  }
});
</script>

<template>
  <div class="px-4 sm:px-0 mx-auto max-w-md">
    <BalLoadingBlock v-if="isLoading || !pool" class="h-96" />
    <template v-else>
      <StakePreview
        v-if="activeStep >= 1 && activeStep <= 2"
        :pool="pool"
        action="unstake"
        @success="handleUnstakeConfirmed"
      />
      <WithdrawPage
        v-if="activeStep >= 3 && activeStep <= 4"
        :pool="pool"
        @preview="handleWithdrawPreview"
        @confirm-withdraw="handleWithdrawConfirm"
      ></WithdrawPage>
    </template>
    <template v-if="activeStep == 5">
      <div class="text-center finished">
        <svg
          class="mx-auto mb-5 mt-[70px]"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M62.5 32C62.5 36.0053 61.7111 39.9714 60.1783 43.6718C58.6456 47.3723 56.3989 50.7346 53.5668 53.5668C50.7346 56.3989 47.3723 58.6456 43.6718 60.1783C39.9714 61.7111 36.0053 62.5 32 62.5C27.9947 62.5 24.0286 61.7111 20.3282 60.1783C16.6277 58.6456 13.2654 56.3989 10.4332 53.5668C7.60106 50.7346 5.35444 47.3723 3.82167 43.6718C2.28891 39.9714 1.5 36.0053 1.5 32C1.5 27.9947 2.28891 24.0286 3.82168 20.3282C5.35444 16.6277 7.60106 13.2654 10.4332 10.4332C13.2654 7.60105 16.6277 5.35444 20.3282 3.82167C24.0286 2.2889 27.9947 1.5 32 1.5C36.0053 1.5 39.9714 2.28891 43.6718 3.82168C47.3723 5.35444 50.7346 7.60106 53.5668 10.4332C56.3989 13.2654 58.6456 16.6277 60.1783 20.3282C61.7111 24.0286 62.5 27.9947 62.5 32L62.5 32Z"
            stroke="#BDB2DD"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M32.5 20C32.1867 20 31.8984 20.1422 31.6602 20.4007L23.3384 28.9822C23.1002 29.2536 23 29.525 23 29.8223C23 30.4685 23.4511 30.9596 24.0778 30.9596C24.366 30.9596 24.6669 30.8433 24.8674 30.6365L27.7249 27.7544L31.5726 23.3861L31.372 26.5267V42.8626C31.372 43.5347 31.8483 44 32.5 44C33.1517 44 33.6155 43.5347 33.6155 42.8626V26.5267L33.4275 23.399L37.2751 27.7544L40.12 30.6365C40.3331 30.8563 40.6214 30.9596 40.9222 30.9596C41.5363 30.9596 42 30.4685 42 29.8223C42 29.525 41.8872 29.2407 41.624 28.9564L33.3397 20.4007C33.089 20.1422 32.8008 20 32.5 20Z"
            fill="#BDB2DD"
          />
        </svg>

        <h1>Done!</h1>
        <h3>You have withdrawn your tokens!</h3>
        <router-link
          class="inline-block exit mt-[20px]"
          :to="{ name: 'pool', params: { id: id } }"
        >
          Return to pool
        </router-link>
      </div>
    </template>
  </div>
</template>
<style scoped>
.finished h1 {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #fdfdfd;
}
.exit {
  padding: 6px 50px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgba(41, 32, 67, 1), rgba(41, 32, 67, 1))
      padding-box,
    linear-gradient(90deg, rgba(192, 4, 254, 1), rgba(126, 2, 245, 1))
      border-box;
  border: 1px solid transparent;
}
</style>
