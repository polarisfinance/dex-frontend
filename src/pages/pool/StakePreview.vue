<script setup lang="ts">
import { reactive, computed } from 'vue';
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import { getAddress } from '@ethersproject/address';
import { useI18n } from 'vue-i18n';
import AnimatePresence from '@/components/animate/AnimatePresence.vue';
import ConfirmationIndicator from '@/components/web3/ConfirmationIndicator.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import useTokenApprovalActions from '@/composables/approvals/useTokenApprovalActions';
import { bnum, trackLoading } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { TransactionActionInfo } from '@/types/transactions';
import useTransactions from '@/composables/useTransactions';
import { fiatValueOf, tokensListExclBpt } from '@/composables/usePoolHelpers';
import StakeSummary from './StakeSummary.vue';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { ApprovalAction } from '@/composables/approvals/types';

/**
 * TYPES
 */
export type StakeAction = 'stake' | 'unstake' | 'restake';
type Props = {
  pool: Pool;
  action: StakeAction;
};
const props = defineProps<Props>();
const emit = defineEmits(['close', 'success']);

/**
 * STATE
 */
const isLoadingApprovalsForGauge = ref(false);
const isActionConfirmed = ref(false);
const confirmationReceipt = ref<TransactionReceipt>();
const stakeActions = ref<TransactionActionInfo[]>([]);
/**
 * COMPOSABLES
 */
const { balanceFor, refetchBalances } = useTokens();
const { fNum } = useNumbers();
const { t } = useI18n();
const { addTransaction } = useTransactions();
const {
  setCurrentPool,
  stake,
  stakeValue,
  unstake,
  unstakeValue,
  stakedShares,
  refetchAllPoolStakingData,
  preferentialGaugeAddress,
} = usePoolStaking();

// Staked or unstaked shares depending on action type.
const currentShares =
  props.action === 'stake'
    ? balanceFor(getAddress(props.pool.address))
    : stakedShares.value;
const inputValue = ref('0.0');
const { getTokenApprovalActionsForSpender } = useTokenApprovalActions(
  ref<string[]>([props.pool.address]),
  ref<string[]>([currentShares]),
  ApprovalAction.Staking
);

const stakeValueWithParams = () => {
  return stakeValue(inputValue.value);
};
const unstakeValueWithParams = () => {
  return unstakeValue(inputValue.value);
};

const stakeAction = {
  label: t('stake'),
  loadingLabel: t('staking.staking'),
  confirmingLabel: t('confirming'),
  action: () => txWithNotification(stakeValueWithParams),
  stepTooltip: t('staking.stakeTooltip'),
};

const unstakeAction = {
  label: t('unstake'),
  loadingLabel: t('staking.unstaking'),
  confirmingLabel: t('confirming'),
  action: () => txWithNotification(unstakeValueWithParams),
  stepTooltip:
    props.action === 'restake'
      ? t('staking.restakeTooltip')
      : t('staking.unstakeTooltip'),
};

/**
 * COMPUTED
 */
const assetRowWidth = computed(
  () => (tokensListExclBpt(props.pool).length * 32) / 1.5
);

const isStakeAndZero = computed(
  () =>
    props.action === 'stake' &&
    (currentShares.value === '0' || currentShares.value === '')
);

const totalUserPoolSharePct = ref(
  bnum(
    bnum(stakedShares.value).plus(balanceFor(getAddress(props.pool.address)))
  )
    .div(props.pool.totalShares)
    .toString()
);

/**
 * METHODS
 */
async function handleSuccess({ receipt }) {
  isActionConfirmed.value = true;
  confirmationReceipt.value = receipt;
  await Promise.all([refetchBalances(), refetchAllPoolStakingData()]);
  emit('success');
}

async function txWithNotification(action: () => Promise<TransactionResponse>) {
  try {
    const tx = await action();
    addTransaction({
      id: tx.hash,
      type: 'tx',
      action: props.action,
      summary: t(`transactionSummary.${props.action}`, {
        pool: props.pool.symbol,
        // amount: fNum(fiatValueOf(props.pool, currentShares), FNumFormats.fiat),
        amount: fNum(inputValue.value, FNumFormats.fiat),
      }),
      details: {
        // total: fNum(fiatValueOf(props.pool, currentShares), FNumFormats.fiat),
        total: fNum(inputValue.value, FNumFormats.fiat),
        pool: props.pool,
      },
    });
    return tx;
  } catch (error) {
    throw new Error(`Failed create ${props.action} transaction`, {
      cause: error,
    });
  }
}

async function loadApprovalsForGauge() {
  const approvalActions = await trackLoading(async () => {
    if (!preferentialGaugeAddress.value) return;
    return await getTokenApprovalActionsForSpender(
      preferentialGaugeAddress.value
    );
  }, isLoadingApprovalsForGauge);

  if (approvalActions) {
    stakeActions.value.unshift(...approvalActions);
  }
}

function handleClose() {
  isActionConfirmed.value = false;
  confirmationReceipt.value = undefined;
  emit('close');
}
function maxBalance() {
  inputValue.value = currentShares.value;
}

/**
 * WATCHERS
 */
watch(
  () => props.action,
  () => {
    if (props.action === 'stake') stakeActions.value = [stakeAction];
    if (props.action === 'unstake') stakeActions.value = [unstakeAction];
    if (props.action === 'restake')
      stakeActions.value = [unstakeAction, stakeAction];
  },
  { immediate: true }
);

watch(preferentialGaugeAddress, async () => {
  if (props.action === 'unstake') return;
  await loadApprovalsForGauge();
});
watch(
  () => props.pool,
  newPool => {
    setCurrentPool(newPool.id);
  }
);

/**
 * LIFECYCLE
 */

onMounted(() => {
  setCurrentPool(props.pool.id);
});

onBeforeMount(async () => {
  if (props.action !== 'unstake') await loadApprovalsForGauge();
});
</script>

<template>
  <BalStack
    vertical
    class="overflow-hidden font-semibold dark:text-polaris-white dark:bg-polaris-card-medium rounded-default"
  >
    <div>
      <BalStack horizontal justify="between" align="center" class="p-5">
        <BalStack vertical spacing="none">
          <div v-if="props.action === 'stake'">
            <div>LP Tokens to stake</div>
            <span class="text-sm font-medium dark:text-polaris-2">
              Amount of available LP tokens on your wallet
            </span>
          </div>
          <div v-if="props.action === 'unstake'">
            <div>Staked LP Tokens</div>
            <span class="text-sm font-medium dark:text-polaris-2">
              Amount of staked LP tokens in pool
            </span>
          </div>
        </BalStack>
        {{ fNum(currentShares) }}
      </BalStack>
    </div>
    <div class="dark:bg-polaris-card-light">
      <div class="flex p-5 text-xl">
        <div v-if="action === 'stake'" class="flex-1">Total to stake</div>
        <div v-if="action === 'unstake'" class="flex-1">Total to unstake</div>
        <div class="flex-1 text-right">
          <input
            ref="textInput"
            v-model="inputValue"
            class="inline text-right bg-transparent total"
          />
          <button class="inline max" @click="maxBalance">MAX</button>
        </div>
      </div>
      <!-- <StakeSummary
        :action="action"
        :fiatValue="fiatValueOf(pool, currentShares)"
        :sharePercentage="totalUserPoolSharePct"
      /> -->
      <div class="pt-4 mb-4 dark:bg-polaris-card-light px-[16px]">
        <BalActionSteps
          v-if="!isActionConfirmed"
          :actions="stakeActions"
          :isLoading="isLoadingApprovalsForGauge"
          :disabled="isStakeAndZero"
          @success="handleSuccess"
        />
        <!-- <BalStack v-if="isActionConfirmed && confirmationReceipt" vertical>
          <ConfirmationIndicator :txReceipt="confirmationReceipt" />
          <AnimatePresence :isVisible="isActionConfirmed">
            <BalBtn
              v-if="action === 'stake'"
              color="gradient"
              block
              @click="$router.push({ name: 'claim' })"
            >
              {{ $t('viewClaims') }}
            </BalBtn>
            <BalBtn color="gray" outline block @click="handleClose">
              {{ $t('close') }}
            </BalBtn>
          </AnimatePresence>
        </BalStack> -->
      </div>
    </div>
  </BalStack>
</template>

<style scoped>
.max {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 20px;
  padding: 0px 8px;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #fdfdfd;
}
</style>
