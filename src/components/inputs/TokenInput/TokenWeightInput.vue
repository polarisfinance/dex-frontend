<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

import TokenSelectInput from '@/components/inputs/TokenSelectInput/TokenSelectInput.vue';
import useTokens from '@/composables/useTokens';
import { HtmlInputEvent } from '@/types';
import { TokenInfo } from '@/types/TokenList';
import BalTextInputCreatePool from '@/components/_global/BalTextInput/BalTextInputCreatePool.vue';

/**
 * TYPES
 */
type InputValue = string | number;

type Props = {
  address?: string;
  weight?: number;
  label?: string;
  fixedToken?: boolean;
  hint?: string;
  hintAmount?: string;
  excludedTokens?: string[];
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  address: '',
  weight: 0,
  hintAmount: '',
  label: '',
  hint: '',
  excludedTokens: () => [],
});

const emit = defineEmits<{
  (e: 'blur', value: string): void;
  (e: 'input', value: string): void;
  (e: 'update:weight', value: string): void;
  (e: 'update:address', value: string): void;
  (e: 'update:isValid', value: boolean): void;
  (e: 'update:isLocked', value: boolean): void;
  (e: 'keydown', value: HtmlInputEvent);
  (e: 'delete'): void;
}>();

/**
 * STATE
 */
const _weight = ref<InputValue>('');
const _address = ref<string>('');
const lockPath = ref<HTMLElement>();
const lockIcon = ref<HTMLElement>();
const isLocked = ref(false);

/**
 * COMPOSABLEs
 */
const { getToken } = useTokens();
import anime from 'animejs';

/**
 * COMPUTED
 */
const hasToken = computed(() => !!_address.value);

const token = computed((): TokenInfo | undefined => {
  if (!hasToken.value) return undefined;
  return getToken(_address.value);
});

/**
 * METHODS
 */
function lockWeight(keepLocked?: boolean) {
  if (isLocked.value && !keepLocked) {
    anime({
      targets: lockPath.value,
      d: 'M7 11V7a5 4 0 0 1 10 -2v-1',
      easing: 'spring(0.2, 80, 10, 0)',
    });
    isLocked.value = false;
  } else {
    if (!isLocked.value) {
      anime({
        targets: lockPath.value,
        d: 'M7 11V7a5 5 0 0 1 10 0v4',
        easing: 'spring(0.2, 80, 10, 0)',
      });

      anime({
        delay: 125,
        targets: lockIcon.value,
        translateY: '1px',
        easing: 'linear',
        duration: 100,
        complete: () => {
          anime({
            targets: lockIcon.value,
            translateY: '0px',
            easing: 'linear',
            duration: 100,
          });
        },
      });
    }
    isLocked.value = true;
  }
  emit('update:isLocked', isLocked.value);
}

function onInput(event) {
  emit('input', event);
  lockWeight(true);
}

/**
 * CALLBACKS
 */
watchEffect(() => {
  _weight.value = props.weight;
  _address.value = props.address;
});
</script>

<template>
  <BalTextInputCreatePool
    v-model="_weight"
    name="weight"
    :placeholder="hintAmount || '0.0'"
    type="number"
    :label="label"
    :decimalLimit="token?.decimals || 18"
    validateOn="input"
    autocomplete="off"
    autocorrect="off"
    noShadow
    noBorder
    noRadius
    step="any"
    spellcheck="false"
    v-bind="$attrs"
    inputAlignRight
    @blur="emit('blur', $event)"
    @input="onInput"
    @update:model-value="emit('update:weight', $event)"
    @update:is-valid="emit('update:isValid', $event)"
    @keydown="emit('keydown', $event)"
  >
    <template #prepend>
      <TokenSelectInput
        v-model="_address"
        :fixed="fixedToken"
        class="mr-2"
        :excludedTokens="excludedTokens"
        @update:model-value="emit('update:address', $event)"
      />
    </template>
    <template #append>
      <div class="flex flex-row items-center h-full justify-center">
        <span class="text-pink-third text-[24px] leading-[31px] font-medium"
          >%</span
        >
        <button
          :class="[
            'ml-[16px]  text-secondary  flex items-center bg-none bg-[#2E2433] rounded-full px-[10px] py-[8px] justify-center',
            {
              'text-blue-600 dark:text-blue-400': isLocked,
              'border-transparent': !isLocked,
            },
          ]"
          @click="lockWeight(false)"
        >
          <!-- <svg
            ref="lockIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-unlock"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path ref="lockPath" d="M7 11V7a5 4 0 0 1 10 -2v-1" />
          </svg> -->
          <svg
            width="13"
            height="16"
            viewBox="0 0 13 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.40034 8.79962C6.18815 8.79962 5.98466 8.88391 5.83462 9.03395C5.68459 9.18398 5.6003 9.38748 5.6003 9.59966V11.9998C5.6003 12.212 5.68459 12.4155 5.83462 12.5655C5.98466 12.7155 6.18815 12.7998 6.40034 12.7998C6.61252 12.7998 6.81602 12.7155 6.96605 12.5655C7.11609 12.4155 7.20038 12.212 7.20038 11.9998V9.59966C7.20038 9.38748 7.11609 9.18398 6.96605 9.03395C6.81602 8.88391 6.61252 8.79962 6.40034 8.79962ZM10.4005 5.59945H4.00021V3.99937C3.99904 3.52429 4.13889 3.05956 4.40204 2.66402C4.66519 2.26848 5.0398 1.95993 5.47843 1.77746C5.91707 1.59498 6.39999 1.54678 6.86604 1.63896C7.33208 1.73114 7.76029 1.95955 8.09643 2.29528C8.3972 2.60255 8.61234 2.98317 8.72046 3.39933C8.74673 3.50125 8.79281 3.59699 8.85607 3.68109C8.91934 3.76519 8.99855 3.83601 9.08919 3.8895C9.17982 3.94299 9.2801 3.9781 9.38431 3.99283C9.48851 4.00757 9.5946 4.00163 9.69651 3.97536C9.79842 3.9491 9.89416 3.90302 9.97827 3.83975C10.0624 3.77649 10.1332 3.69727 10.1867 3.60664C10.2402 3.516 10.2753 3.41572 10.29 3.31152C10.3047 3.20731 10.2988 3.10122 10.2725 2.99931C10.0903 2.30712 9.72878 1.67519 9.22449 1.16722C8.6646 0.609079 7.95189 0.229356 7.17635 0.0759931C6.4008 -0.0773693 5.5972 0.00250687 4.86702 0.305536C4.13685 0.608564 3.51283 1.12116 3.07377 1.77859C2.63471 2.43602 2.40029 3.2088 2.40013 3.99937V5.59945C1.76357 5.59945 1.15309 5.85232 0.702981 6.30243C0.25287 6.75254 0 7.36302 0 7.99958V13.5999C0 14.2364 0.25287 14.8469 0.702981 15.297C1.15309 15.7471 1.76357 16 2.40013 16H10.4005C11.0371 16 11.6476 15.7471 12.0977 15.297C12.5478 14.8469 12.8007 14.2364 12.8007 13.5999V7.99958C12.8007 7.36302 12.5478 6.75254 12.0977 6.30243C11.6476 5.85232 11.0371 5.59945 10.4005 5.59945ZM11.2006 13.5999C11.2006 13.8121 11.1163 14.0156 10.9663 14.1656C10.8162 14.3156 10.6127 14.3999 10.4005 14.3999H2.40013C2.18794 14.3999 1.98445 14.3156 1.83441 14.1656C1.68437 14.0156 1.60008 13.8121 1.60008 13.5999V7.99958C1.60008 7.78739 1.68437 7.5839 1.83441 7.43386C1.98445 7.28382 2.18794 7.19953 2.40013 7.19953H10.4005C10.6127 7.19953 10.8162 7.28382 10.9663 7.43386C11.1163 7.5839 11.2006 7.78739 11.2006 7.99958V13.5999Z"
              fill="#F5E1FF"
              fill-opacity="0.7"
            />
          </svg>
        </button>
        <button
          :class="[
            'ml-[8px] text-secondary bg-none bg-[#2E2433] flex items-center rounded-full px-[9px] py-[8px] justify-center',
          ]"
          @click="emit('delete')"
        >
          <svg
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.6 3.2H10.4V2.4C10.4 1.76348 10.1471 1.15303 9.69706 0.702944C9.24697 0.252856 8.63652 0 8 0H6.4C5.76348 0 5.15303 0.252856 4.70294 0.702944C4.25286 1.15303 4 1.76348 4 2.4V3.2H0.8C0.587827 3.2 0.384344 3.28429 0.234315 3.43431C0.0842854 3.58434 0 3.78783 0 4C0 4.21217 0.0842854 4.41566 0.234315 4.56569C0.384344 4.71571 0.587827 4.8 0.8 4.8H1.6V13.6C1.6 14.2365 1.85286 14.847 2.30294 15.2971C2.75303 15.7471 3.36348 16 4 16H10.4C11.0365 16 11.647 15.7471 12.0971 15.2971C12.5471 14.847 12.8 14.2365 12.8 13.6V4.8H13.6C13.8122 4.8 14.0157 4.71571 14.1657 4.56569C14.3157 4.41566 14.4 4.21217 14.4 4C14.4 3.78783 14.3157 3.58434 14.1657 3.43431C14.0157 3.28429 13.8122 3.2 13.6 3.2ZM5.6 2.4C5.6 2.18783 5.68429 1.98434 5.83431 1.83431C5.98434 1.68429 6.18783 1.6 6.4 1.6H8C8.21217 1.6 8.41566 1.68429 8.56568 1.83431C8.71571 1.98434 8.8 2.18783 8.8 2.4V3.2H5.6V2.4ZM11.2 13.6C11.2 13.8122 11.1157 14.0157 10.9657 14.1657C10.8157 14.3157 10.6122 14.4 10.4 14.4H4C3.78783 14.4 3.58434 14.3157 3.43431 14.1657C3.28429 14.0157 3.2 13.8122 3.2 13.6V4.8H11.2V13.6Z"
              fill="#F5E1FF"
              fill-opacity="0.7"
            />
          </svg>
        </button>
      </div>
    </template>
  </BalTextInputCreatePool>
</template>

<style scoped>
.ease-color {
  transition: color border-color easeout 0.1s;
}
</style>
