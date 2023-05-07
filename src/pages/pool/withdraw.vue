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
  setActiveStep(3);
}
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
      ></WithdrawPage>
    </template>
  </div>
</template>
