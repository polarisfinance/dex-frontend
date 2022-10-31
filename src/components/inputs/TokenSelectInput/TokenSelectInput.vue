<script setup lang="ts">
import { computed, ref } from 'vue';

import SelectTokenModal from '@/components/modals/SelectTokenModal/SelectTokenModal.vue';
import useNumbers from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { isSameAddress } from '@/lib/utils';
import { TokenInfo } from '@/types/TokenList';

/**
 * TYPES
 */
type Props = {
  modelValue: string;
  fixed?: boolean;
  weight?: number | string;
  excludedTokens?: string[];
  options?: string[];
  disableInjection?: boolean;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  fixed: false,
  weight: 0,
  excludedTokens: () => [],
  options: () => [],
  disableInjection: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

/**
 * STATE
 */
const openTokenModal = ref(false);

/**
 * COMPOSABLEs
 */
const { getToken } = useTokens();
const { fNum2 } = useNumbers();

/**
 * COMPUTED
 */
const hasToken = computed(() => !!props.modelValue);

const token = computed((): TokenInfo | null => {
  if (!hasToken.value) return null;
  return getToken(props.modelValue);
});

/**
 * METHODS
 */
function toggleModal(): void {
  if (!props.fixed) openTokenModal.value = !openTokenModal.value;
}
</script>

<template>
  <div>
    <div
      v-if="hasToken && options.length === 0"
      :class="['token-select-input selected group', { selectable: !fixed }]"
      @click="toggleModal"
    >
      <div class="grid content-center px-[6px]">
        <BalAsset :address="token?.address" class="shadow" />
      </div>
      <span class="text-base text-[20px] font-semibold">
        {{ token?.symbol }}
      </span>
      <span v-if="Number(weight) > 0" class="text-secondary ml-2">
        {{
          fNum2(weight, {
            style: 'percent',
            maximumFractionDigits: 0,
          })
        }}
      </span>
      <BalIcon
        v-if="!fixed"
        name="chevron-down"
        size="sm"
        class="pl-[6px] pr-[4px] mt-0"
      />
    </div>
    <BalDropdown
      v-else-if="hasToken && fixed && options.length > 0"
      :options="options"
      minWidth="40"
      @selected="emit('update:modelValue', $event)"
    >
      <template #activator>
        <div class="token-select-input selected selectable group">
          <div class="w-8">
            <BalAsset :address="token?.address" class="shadow" />
          </div>
          <span class="text-base font-medium">
            {{ token?.symbol }}
          </span>
          <span v-if="Number(weight) > 0" class="text-secondary ml-2">
            {{
              fNum2(weight, {
                style: 'percent',
                maximumFractionDigits: 0,
              })
            }}
          </span>
          <BalIcon
            name="chevron-down"
            size="sm"
            class="ml-2 text-blue-500 transition-colors group-hover:text-purple-500 dark:text-blue-400 dark:group-hover:text-purple-400 mt-0"
          />
        </div>
      </template>
      <template #option="{ option: address }">
        <div
          :set="(optionToken = getToken(address) || {})"
          class="flex items-center justify-between"
        >
          <div class="flex items-center">
            <BalAsset :address="optionToken?.address" class="shadow" />
            <span class="ml-1 font-medium">
              {{ optionToken?.symbol }}
            </span>
          </div>
          <BalIcon
            v-if="isSameAddress(optionToken.address, modelValue)"
            name="check"
            class="ml-4 text-blue-500 dark:text-blue-400"
          />
        </div>
      </template>
    </BalDropdown>

    <div
      v-else
      class="token-select-input unselected selectable no-token"
      @click="toggleModal"
    >
      {{ $t('selectToken') }}
      <BalIcon name="chevron-down" size="sm" class="ml-2 mt-0" />
    </div>

    <teleport to="#modal">
      <SelectTokenModal
        v-if="openTokenModal"
        :excludedTokens="[...excludedTokens, modelValue]"
        :includeEther="true"
        :disableInjection="disableInjection"
        @close="openTokenModal = false"
        @select="emit('update:modelValue', $event)"
      />
    </teleport>
  </div>
</template>

<style scoped>
.group {
  background: #261737 !important;
  box-shadow: inset -2px -2px 4px rgba(117, 92, 140, 0.3),
    inset 2px 2px 4px #18111c !important;
  border-radius: 16px !important;
}

.group:hover {
  background-color: #3e3045 !important;
  border-radius: 16px !important;
}

.token-select-input {
  @apply flex items-center whitespace-nowrap rounded-lg shadow;
  @apply text-sm;

  font-variation-settings: 'wght' 700;
  height: 36.49px;
}

.selectable {
  @apply cursor-pointer transition-shadow hover:shadow-none;
}

.unselected {
  @apply bg-blue-500 text-white dark:bg-blue-400;
}

.selected {
  @apply bg-gray-50 text-black dark:bg-gray-700 dark:text-white;
}

.no-token {
  padding: 4px 4px 4px 16px;
  gap: 6px;

  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
}

.no-token:hover {
  background: rgba(123, 48, 127, 0.7) !important;
}
</style>
