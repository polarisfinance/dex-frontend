<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

import useNumbers from '@/composables/useNumbers';
import useUserSettings from '@/composables/useUserSettings';
import { bnum } from '@/lib/utils';

const FIXED_OPTIONS = ['0.005', '0.01', '0.02'];

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
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
    label: fNum2(option, {
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
  'bg-[#50456E] text-text-white': !isFixedSlippage.value || state.isCustomInput,
  'bg-[#292043] text-text-purple-secondary ': isFixedSlippage.value && !state.isCustomInput,
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
</script>

<template>
  <div class="flex">
    <BalBtnGroup v-model="state.fixedSlippage" :options="options" @update:model-value="onFixedInput" />
    <div :class="['custom-input', customInputClasses]">
      <input v-model="state.customSlippage" class="w-[55px] bg-transparent text-right placeholder:text-white" placeholder="0.1" type="number" step="any" min="0" @update:modelValue="onCustomInput" />
      <div class="pr-2">%</div>
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  @apply text-text-purple-secondary;
}
.custom-input {
  @apply ml-[19px] flex items-center rounded-xl px-1 pt-[5px] pb-[3px] shadow-inner;
  font-weight: 500;
  font-size: 18px;
  line-height: 23px;
  border-radius: 16px;
}
</style>
