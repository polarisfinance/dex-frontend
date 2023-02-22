<script setup lang="ts">
import { computed, onBeforeMount, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Components
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import { isLessThanOrEqualTo, isRequired } from '@/lib/utils/validations';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import ProportionalWithdrawalInput from './components/ProportionalWithdrawalInput.vue';
import WithdrawalTokenSelect from './components/WithdrawalTokenSelect.vue';
import WithdrawPreview from './components/WithdrawPreview/WithdrawPreview.vue';
import WithdrawTotals from './components/WithdrawTotals.vue';
import useWithdrawalState from './composables/useWithdrawalState';
// Composables
import useWithdrawMath from './composables/useWithdrawMath';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  step:Number;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emits = defineEmits(['preview','confirmWithdraw']);
const showPreview = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();

const {
  isProportional,
  tokenOut,
  tokenOutIndex,
  highPriceImpactAccepted,
  validInput,
  maxSlider,
  tokensOut,
  error,
  parseError,
  setError,
} = useWithdrawalState(toRef(props, 'pool'));

const withdrawMath = useWithdrawMath(
  toRef(props, 'pool'),
  isProportional,
  tokenOut,
  tokenOutIndex
);

const {
  hasAmounts,
  highPriceImpact,
  singleAssetMaxes,
  tokenOutAmount,
  tokenOutPoolBalance,
  initMath,
  loadingAmountsOut,
} = withdrawMath;

const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();

/**
 * COMPUTED
 */
const hasAcceptedHighPriceImpact = computed((): boolean =>
  highPriceImpact.value ? highPriceImpactAccepted.value : true
);

const hasValidInputs = computed(
  (): boolean => validInput.value && hasAcceptedHighPriceImpact.value
);

const singleAssetRules = computed(() => [
  isLessThanOrEqualTo(tokenOutPoolBalance.value, t('exceedsPoolBalance')),
]);

/**
 * METHODS
 */
 function onConfirmWithdraw(): void {
  emits('confirmWithdraw');
}

/**
 * WATCHERS
 */
watch(isProportional, newVal => {
  // If user selects to withdraw all tokens proportionally
  // reset the slider to max.
  if (newVal) {
    initMath();
    maxSlider();
  }
});

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  isProportional.value = true;
  initMath();
  maxSlider();
});
</script>

<template>

  <WithdrawPreview v-if="step==4"
      :pool="pool"
      :math="withdrawMath"
      @close="showPreview = false"
      @confirmWithdraw="onConfirmWithdraw"
  />

  <div class="container" v-if="step==3">
    <ProportionalWithdrawalInput
      class="pl-[12px] pr-[16px] py-[16px]"
      v-if="isProportional"
      :pool="pool"
      :tokenAddresses="tokensOut"
      :math="withdrawMath"
    />
    <TokenInput
      v-else
      class="pl-[12px] pr-[16px] pb-[16px]"
      v-model:amount="tokenOutAmount"
      v-model:isValid="validInput"
      :name="tokenOut"
      :address="tokenOut"
      :disableBalance="singleAssetMaxes[tokenOutIndex] === '-'"
      :customBalance="singleAssetMaxes[tokenOutIndex] || '0'"
      :rules="singleAssetRules"
      :balanceLabel="$t('singleTokenMax')"
      :balanceLoading="loadingAmountsOut"
      fixedToken
      disableNativeAssetBuffer
    >
      <template #tokenSelect>
        <WithdrawalTokenSelect :pool="pool" :initToken="tokenOut" />
      </template>
    </TokenInput>

    
    <div class="light-back px-[16px] py-[16px]">

      <WithdrawTotals :math="withdrawMath" class="mt-4" />
      <div
        v-if="highPriceImpact"
        class="mt-4 rounded-lg border p-2 pb-2 dark:border-gray-700"
      >
        <BalCheckbox
          v-model="highPriceImpactAccepted"
          :rules="[isRequired($t('priceImpactCheckbox'))]"
          name="highPriceImpactAccepted"
          size="sm"
          :label="$t('priceImpactAccept', [$t('withdrawing')])"
        />
      </div>

      <BalAlert
        v-if="error !== null"
        type="error"
        :title="parseError(error).title"
        :description="parseError(error).description"
        class="mt-4"
        block
        actionLabel="Dismiss"
        @action-click="setError(null)"
      />

      <div class="mt-4">
        <BalBtn
          v-if="!isWalletReady"
          :label="$t('connectWallet')"
          color="gradient"
          block
          @click="startConnectWithInjectedProvider"
        />
        <BalBtn
          v-else
          :label="$t('preview')"
          color="gradient"
          :disabled="
            !hasAmounts ||
            !hasValidInputs ||
            isMismatchedNetwork ||
            loadingAmountsOut
          "
          block
          @click="emits('preview')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container{
  background:#41365E;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  overflow:hidden;
}
.light-back{
  background: #50456E;
}
</style>
