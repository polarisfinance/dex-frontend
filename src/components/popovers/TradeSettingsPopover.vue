<template>
  <BalPopover @show="open = true" @hide="open = false">
    <template #activator>
      <button
        class="icon-spin-anim settings-button"
        @click="onActivatorClick"
      >
        <!-- <BalIcon name="settings" size="sm" class="icon" /> -->
        <!-- <IconSettings class="mt-1 mr-[12px]" /> -->
        <img :src="Picture" height="24" class="mr-[12px] mt-[12px]" />
      </button>
    </template>

    <div class="px-[4px]">
      <div class="flex items-baseline">
        <span
          class="mb-[12px] font-semibold leading-[20px]"
          v-text="$t('slippageTolerance')"
        />
        <!-- <BalTooltip class="ml-2 p-2">
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px text-gray-400" />
          </template>
          <div v-html="$t('marketConditionsWarning')" />
        </BalTooltip> -->
      </div>
      <AppSlippageForm class="" />
    </div>
    <div v-if="isEIP1559SupportedNetwork" class="mt-[16px] px-[4px] pb-[3px]">
      <div class="flex items-baseline">
        <span
          class="mb-[12px] font-semibold leading-[20px]"
          v-text="$t('transactionType')"
        />
        <!-- <BalTooltip class="ml-2 p-2">
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px text-gray-400" />
          </template>
          <div v-text="$t('ethereumTxTypeTooltip')" />
        </BalTooltip> -->
      </div>
      <div class="flex">
        <BalBtnGroup
          v-model="ethereumTxType"
          :options="ethereumTxTypeOptions"
          @update:model-value="setEthereumTxType"
        />
      </div>
    </div>
    <div
      v-if="isGassless && context === TradeSettingsContext.trade"
      class="mt-6"
    >
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('transactionDeadline')" />
        <BalTooltip>
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px ml-1 text-gray-400" />
          </template>
          <div v-html="$t('transactionDeadlineTooltip')" />
        </BalTooltip>
      </div>
      <div class="mt-1 flex">
        <div
          class="flex items-center rounded-lg border px-1 shadow-inner dark:border-gray-700"
        >
          <input
            v-model="appTransactionDeadline"
            class="w-8 bg-transparent text-right"
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

<script lang="ts">
import { computed, defineComponent, PropType, Ref, toRefs } from 'vue';
import { useStore } from 'vuex';

import AppSlippageForm from '@/components/forms/AppSlippageForm.vue';
import useEthereumTxType from '@/composables/useEthereumTxType';
import useFathom from '@/composables/useFathom';
import useNumbers from '@/composables/useNumbers';
import { ethereumTxTypeOptions } from '@/constants/options';
import useWeb3 from '@/services/web3/useWeb3';
import IconSettings from '@/components/icons/SettingsIcon.vue';

export enum TradeSettingsContext {
  trade,
  invest,
}

export default defineComponent({
  name: 'TradeSettingsPopover',

  components: {
    AppSlippageForm,
    IconSettings,
  },

  props: {
    context: {
      type: [String, Number] as PropType<TradeSettingsContext>,
      required: true,
    },
    isGassless: { type: Boolean, default: false },
  },
  data() {
    return {
      settings: require('@/components/icons/SettingsIcon.svg'),
      x: require('@/components/icons/x.svg'),
      open: false,
    };
  },
  computed: {
    Picture() {
      if (this.open == false) {
        return this.settings;
      } else {
        return this.x;
      }
    },
  },
  setup(props) {
    // DATA
    const { context }: { context: Ref<TradeSettingsContext> } = toRefs(props);

    // COMPOSABLES
    const store = useStore();
    const { fNum } = useNumbers();
    const { explorerLinks, isEIP1559SupportedNetwork } = useWeb3();
    const { trackGoal, Goals } = useFathom();
    const { ethereumTxType, setEthereumTxType } = useEthereumTxType();

    // COMPUTED
    const appTransactionDeadline = computed<number>(
      () => store.state.app.transactionDeadline
    );

    // METHODS
    const setTransactionDeadline = transactionDeadline =>
      store.commit('app/setTransactionDeadline', transactionDeadline);

    function onActivatorClick(): void {
      if (context.value === TradeSettingsContext.trade) {
        trackGoal(Goals.ClickTradeSettings);
      } else if (context.value === TradeSettingsContext.invest) {
        trackGoal(Goals.ClickInvestSettings);
      }
    }

    return {
      Goals,
      // types,
      TradeSettingsContext,
      // computed
      appTransactionDeadline,
      isEIP1559SupportedNetwork,
      // methods
      setTransactionDeadline,
      fNum,
      explorer: explorerLinks,
      onActivatorClick,
      ethereumTxType,
      setEthereumTxType,
      ethereumTxTypeOptions,
    };
  },
});
</script>

<style scoped>
.icon {
  width: '20px';
}

.settings-button {
  background: none;
  margin: 0 !important;
  padding: 0 !important;
  min-height: 24px;
  min-width: 24px;
}

.trade-settings-option:hover {
  /* @apply text-blue-500 border-blue-500; */
}

.trade-settings-option.active {
  /* @apply text-blue-500 border-blue-500; */
}
</style>
