<script lang="ts">
export enum SwapSettingsContext {
  swap,
  invest,
}
export default {
  data() {
    return {
      settings,
      x
    };
  },
};
</script>

<script setup lang="ts">
import AppSlippageForm from '@/components/forms/AppSlippageForm.vue';
import { useApp } from '@/composables/useApp';
import useEthereumTxType from '@/composables/useEthereumTxType';
import useFathom from '@/composables/useFathom';
import { ethereumTxTypeOptions } from '@/constants/options';
import useWeb3 from '@/services/web3/useWeb3';
import settings from '@/components/_global/icons/polaris/SettingsIcon.svg';
import  x from '@/components/_global/icons/polaris/x.svg';




type Props = {
  context: SwapSettingsContext;
  isGassless?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isGassless: false,
});

// DATA
const { context } = toRefs(props);

// COMPOSABLES
const { transactionDeadline, setTransactionDeadline } = useApp();

const { isEIP1559SupportedNetwork } = useWeb3();
const { trackGoal, Goals } = useFathom();
const { ethereumTxType, setEthereumTxType } = useEthereumTxType();

// METHODS
function onActivatorClick(): void {
  if (context.value === SwapSettingsContext.swap) {
    trackGoal(Goals.ClickSwapSettings);
  } else if (context.value === SwapSettingsContext.invest) {
    trackGoal(Goals.ClickJoinPoolSettings);
  }
}


let open=false;
function Picture() {
  if (open == false) {
    return settings;
  } else {
    return x;
  }
}

</script>

<template>
  <BalPopover class="dark:bg-polaris-back-main">
    <template #activator>
      <button
        class="icon-spin-anim settings-button dark:bg-polaris-card-medium"
        @click="onActivatorClick"
      >
        <img :src="Picture()" height="24" class="mr-[12px] mt-[12px]" />
      </button>
    </template>

    <div>
      <div class="flex items-baseline">
        <span class="mb-2 font-medium dark:text-polaris-white font-semibold" v-text="$t('slippageTolerance')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-html="$t('marketConditionsWarning')" />
        </BalTooltip>
      </div>
      <AppSlippageForm class="mt-1" />
    </div>
    <div v-if="isEIP1559SupportedNetwork" class="mt-6">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium dark:text-polaris-white font-semibold" v-text="$t('transactionType')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-text="$t('ethereumTxTypeTooltip')" />
        </BalTooltip>
      </div>
      <div class="flex mt-1 dark:bg-polaris-card-dark rounded-small">
        <BalBtnGroup class="w-full"
          v-model="ethereumTxType"
          :options="ethereumTxTypeOptions"
          @update:model-value="setEthereumTxType"
        />
      </div>
    </div>
    <div v-if="isGassless && context === SwapSettingsContext.swap" class="mt-6">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('transactionDeadline')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-html="$t('transactionDeadlineTooltip')" />
        </BalTooltip>
      </div>
      <div class="flex mt-1">
        <div
          class="flex items-center px-1 rounded-lg border dark:border-gray-700 shadow-inner"
        >
          <input
            v-model="transactionDeadline"
            class="w-8 text-right bg-transparent"
            placeholder="20"
            type="number"
            step="1"
            min="0"
            @update:modelValue="setTransactionDeadline"
          />
        </div>
        <div class="px-2">minutes</div>
      </div>
    </div>
  </BalPopover>
</template>


<style>
.swap-settings-option:hover {
  @apply text-blue-500 border-blue-500;
}

.swap-settings-option.active {
  @apply text-blue-500 border-blue-500;
}
</style>
