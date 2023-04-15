<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import useNumbers from '@/composables/useNumbers';
import { useUserSettings } from '@/providers/user-settings.provider';
import { bnum } from '@/lib/utils';

const FIXED_OPTIONS = ['0.005', '0.01', '0.02'];

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { slippage, setSlippage } = useUserSettings();

/**
 * STATE
 */
const state = reactive({
  fixedSlippage: '',
  customSlippage: '',
  isCustomInput: false,
});

const options = FIXED_OPTIONS.map(option => {
  return {
    label: fNum(option, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      fixedFormat: true,
    }),
    value: option,
  };
});

/**
 * COMPUTED
 */
const isFixedSlippage = computed(() => {
  return FIXED_OPTIONS.includes(slippage.value);
});

const customInputClasses = computed(() => ({
  ' dark:bg-[#50456E] rounded-small dark:text-polaris-white font-semibold':
    !isFixedSlippage.value && state.isCustomInput,
  ' dark:bg-polaris-card-default dark:text-polaris-2 font-semibold rounded-small': isFixedSlippage.value && !state.isCustomInput,
}));

/**
 * METHODS
 */
function onFixedInput(val: string): void {
  state.isCustomInput = false;
  state.customSlippage = '';
  setSlippage(val);
}

function onCustomInput(val: string): void {
  if (!val) return;
  state.isCustomInput = true;
  val = bnum(val).div(100).toString();
  setSlippage(val);
}

/**
 * WATCHERS
 */
watch(
  slippage,
  newSlippage => {
    if (isFixedSlippage.value && !state.isCustomInput) {
      state.fixedSlippage = newSlippage;
      state.customSlippage = '';
    } else {
      state.customSlippage = bnum(newSlippage).times(100).toString();
      state.fixedSlippage = '';
    }
  },
  { immediate: true }
);

watch(() => state.customSlippage, onCustomInput, { immediate: true });
</script>

<template>
  <div class="flex">
    <div class="flex dark:bg-polaris-card-dark rounded-small">
      <BalBtnGroup
        v-model="state.fixedSlippage"
        :options="options"
        @update:model-value="onFixedInput"
      />
    </div>
    <div :class="['custom-input', customInputClasses]">
      <input
        v-model="state.customSlippage"
        class="w-12 text-right bg-transparent border-0"
        placeholder="0.1"
        type="number"
        step="any"
        min="0"
      />
      <div class="px-2">%</div>
    </div>
  </div>
</template>

<style scoped>
.custom-input {
  @apply flex items-center px-1 rounded-small ml-5;

}
</style>
