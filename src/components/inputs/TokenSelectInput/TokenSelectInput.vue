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
      <div class="px-[6px] grid content-center">
        <BalAsset :address="token?.address" class="shadow" />
      </div>
      <span class="text-base font-semibold text-[20px]">
        {{ token?.symbol }}
      </span>
      <span v-if="Number(weight) > 0" class="ml-2 text-secondary">
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
        class="pl-[6px] pr-[4px]"
      />
    </div>
    <BalDropdown
      v-else-if="hasToken && fixed && options.length > 0"
      :options="options"
      minWidth="40"
      @selected="emit('update:modelValue', $event)"
    >
      <template #activator>
        <div class="group token-select-input selected selectable">
          <div class="w-8">
            <BalAsset :address="token?.address" class="shadow" />
          </div>
          <span class="text-base font-medium">
            {{ token?.symbol }}
          </span>
          <span v-if="Number(weight) > 0" class="ml-2 text-secondary">
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
            class="ml-2 text-blue-500 group-hover:text-purple-500 dark:text-blue-400 dark:group-hover:text-purple-400 transition-colors"
          />
        </div>
      </template>
      <template #option="{ option: address }">
        <div
          :set="(optionToken = getToken(address) || {})"
          class="flex justify-between items-center"
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
      <BalIcon name="chevron-down" size="sm" class="ml-2" />
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
  background-color: #2e2433 !important;
  border-radius: 16px !important;
}

.group:hover {
  background-color: #3e3045 !important;
  border-radius: 16px !important;
}

.token-select-input {
  @apply shadow rounded-lg flex items-center whitespace-nowrap;
  @apply text-sm;

  font-variation-settings: 'wght' 700;
  height: 36.49px;
}

.selectable {
  @apply cursor-pointer hover:shadow-none transition-shadow;
}

.unselected {
  @apply bg-blue-500 dark:bg-blue-400 text-white;
}

.selected {
  @apply bg-gray-50 dark:bg-gray-700 text-black dark:text-white;
}

.no-token {
  padding: 4px 4px 4px 16px;
  gap: 6px;

  background: #7b307f !important;
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
