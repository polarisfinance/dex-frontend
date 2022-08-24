<template>
  <div>
    <div class="p-4 bal-card">
      <div class="flex justify-between items-center mb-6">
        <h5
          class="tracking-tight leading-none font-semibold text-[16px]"
          v-text="$t('account')"
        />

        <div class="flex gap-2 items-center">
          <X v-on:click="$emit('close')" />
        </div>
      </div>
      <div class="box">
        <div
          class="grid grid-cols-2 gap-5 grid-rows-1 justify-between items-center text-sm leading-none text-gray-600 dark:text-gray-400 w-full"
        >
          Connected with MetaMask
          <div class="grid grid-cols-2 gap-1 place-items-end">
            <div v-if="!hideDisconnect">
              <BalBtn
                outline
                color="gray"
                size="xs"
                class="capitalize h-[22px] w-[86px] text-[14px]"
                @click="disconnectWallet"
              >
                {{ $t('disconnect') }}
              </BalBtn>
            </div>
            <BalBtn
              color="gray"
              size="xs"
              @click="toggleWalletSelectModal"
              class="h-[22px] w-[68px] text-[14px]"
            >
              {{ $t('change') }}
            </BalBtn>
          </div>
        </div>
        <div>
          <!-- <div class="relative">
            <Avatar :iconURI="profile?.avatar" :address="account" :size="44" />
            <div class="connector-icon-wrapper">
              <img
                :src="connectorLogo"
                class="flex absolute right-0 bottom-0 justify-center items-center p-0.5 w-5 h-5 bg-white rounded-full"
              />
            </div>
          </div> -->
          <div
            class="font-bold text-black dark:text-white"
            v-text="_shorten(account)"
          />
        </div>

        <div class="ml-2">
          <div class="flex items-baseline address">
            <div class="flex ml-3">
              <BalTooltip width="auto">
                <template #activator>
                  <BalBtn
                    circle
                    color="gray"
                    size="xs"
                    flat
                    @click="copyAddress"
                  >
                    <BalIcon v-if="copiedAddress" name="check" size="xs" />
                    <BalIcon v-else name="clipboard" size="xs" />
                  </BalBtn>
                </template>
                <div
                  class="text-center"
                  v-text="copiedAddress ? $t('copied') : $t('copyAddress')"
                />
              </BalTooltip>
              <BalBtn
                circle
                flat
                color="gray"
                size="xs"
                tag="a"
                :href="explorer.addressLink(account)"
                target="_blank"
                rel="noreferrer"
                class="ml-2"
              >
                <BalIcon name="arrow-up-right" size="xs" />
              </BalBtn>
            </div>
            <div class="text-sm">
              {{ connectorName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="hidden px-4 mt-4">
      <span class="mb-2 font-medium" v-text="$t('theme')" />
      <div class="flex mt-1">
        <div
          class="flex justify-center items-center py-1.5 mr-2 w-16 rounded-xl border cursor-pointer option"
          :class="{ active: !appDarkMode }"
          @click="setDarkMode(false)"
        >
          <BalIcon name="sun" size="sm" />
        </div>
        <div
          class="flex justify-center items-center py-1.5 mr-2 w-16 rounded-xl border cursor-pointer option"
          :class="{ active: appDarkMode }"
          @click="setDarkMode(true)"
        >
          <BalIcon name="moon" size="sm" />
        </div>
      </div>
    </div> -->
    <!-- <div class="px-4 mt-4">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('slippageTolerance')" />
        <BalTooltip class="p-2 ml-2">
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px text-gray-400" />
          </template>
          <div v-html="$t('marketConditionsWarning')" />
        </BalTooltip>
      </div>
      <AppSlippageForm class="mt-1" />
    </div>
    <div v-if="isEIP1559SupportedNetwork" class="px-4 mt-6">
      <div class="flex items-baseline">
        <span class="mb-2 font-medium" v-text="$t('transactionType')" />
        <BalTooltip class="p-2 ml-2">
          <template #activator>
            <BalIcon name="info" size="xs" class="-mb-px text-gray-400" />
          </template>
          <div v-text="$t('ethereumTxTypeTooltip')" />
        </BalTooltip>
      </div>
      <BalBtnGroup
        v-model="ethereumTxType"
        :options="ethereumTxTypeOptions"
        @update:model-value="setEthereumTxType"
      />
    </div> -->
    <!-- <div
      class="p-4 text-sm rounded-b-xl network"
    >
      <div v-text="$t('network')" />
      <div class="flex items-baseline">
        <div :class="['w-2 h-2 mr-1 rounded-full', networkColorClass]" />
        {{ isUnsupportedNetwork ? $t('unsupportedNetwork') : networkName }}
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Network } from '@balancer-labs/sdk';
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';

import AppSlippageForm from '@/components/forms/AppSlippageForm.vue';
import Avatar from '@/components/images/Avatar.vue';
import useEthereumTxType from '@/composables/useEthereumTxType';
import { ethereumTxTypeOptions } from '@/constants/options';
import { GP_SUPPORTED_NETWORKS } from '@/services/gnosis/constants';
import useWeb3 from '@/services/web3/useWeb3';
import {
  getConnectorLogo,
  getConnectorName,
} from '@/services/web3/web3.plugin';
import X from '../../web3/x.vue';

export default defineComponent({
  components: {
    AppSlippageForm,
    Avatar,
    X,
  },

  setup() {
    // COMPOSABLES
    const store = useStore();
    const {
      explorerLinks,
      account,
      profile,
      disconnectWallet,
      toggleWalletSelectModal,
      connector,
      provider,
      isEIP1559SupportedNetwork,
      userNetworkConfig,
      appNetworkConfig,
      isUnsupportedNetwork,
    } = useWeb3();
    const { ethereumTxType, setEthereumTxType } = useEthereumTxType();

    // DATA
    const data = reactive({
      copiedAddress: false,
    });

    // COMPUTED
    const networkColorClass = computed(() => {
      let color = 'green';

      if (isUnsupportedNetwork.value) {
        color = 'red';
      } else {
        switch (userNetworkConfig.value?.chainId) {
          case Network.KOVAN:
            color = 'purple';
            break;
          case Network.ROPSTEN:
            color = 'pink';
            break;
          case Network.RINKEBY:
            color = 'yellow';
            break;
          case Network.GÖRLI:
            color = 'blue';
            break;
        }
      }

      return `bg-${color}-500 dark:bg-${color}-400`;
    });
    const networkName = computed(() => userNetworkConfig.value?.name);
    const appLocale = computed(() => store.state.app.locale);
    const appDarkMode = computed(() => store.state.app.darkMode);
    const connectorName = computed(() =>
      getConnectorName(connector.value?.id, provider.value)
    );
    const connectorLogo = computed(() =>
      getConnectorLogo(connector.value?.id, provider.value)
    );
    const hideDisconnect = computed(() => connector.value?.id == 'gnosis');
    const isGnosisSupportedNetwork = computed(() =>
      GP_SUPPORTED_NETWORKS.includes(appNetworkConfig.chainId)
    );

    // METHODS
    const setDarkMode = val => store.commit('app/setDarkMode', val);
    const setLocale = locale => store.commit('app/setLocale', locale);

    function copyAddress() {
      navigator.clipboard.writeText(account.value);
      data.copiedAddress = true;

      setTimeout(() => {
        data.copiedAddress = false;
      }, 2 * 1000);
    }

    return {
      // data
      ...toRefs(data),
      // computed
      account,
      profile,
      networkName,
      networkColorClass,
      appLocale,
      appDarkMode,
      connectorName,
      connectorLogo,
      hideDisconnect,
      isEIP1559SupportedNetwork,
      isGnosisSupportedNetwork,
      isUnsupportedNetwork,
      // methods
      disconnectWallet,
      toggleWalletSelectModal,
      setDarkMode,
      setLocale,
      copyAddress,
      explorer: explorerLinks,
      ethereumTxType,
      setEthereumTxType,
      ethereumTxTypeOptions,
    };
  },
});
</script>

<style scoped>
.address {
  @apply text-blue-500;

  font-variant-ligatures: no-contextual;
}

.option:hover {
  @apply text-blue-500 border-blue-500;
}

.option.active {
  @apply text-blue-500 border-blue-500;
}

.slippage-input {
  @apply bg-white;
}

.slippage-input.active {
  @apply text-blue-500 border-blue-500 border-2 ring;
}

.bal-card {
  @apply flex flex-col;
  background-color: #231928;
  box-shadow: inset 0px 0px 2px #fbaaff;
  border-radius: 22px;
  box-sizing: border-box;
  width: 440px;
}

.box {
  @apply transition-all;
  /* @apply bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800; */
  /* @apply border dark:border-gray-900; */
  @apply grid rounded-md grid-rows-3 gap-[10px];
  background: #2e2433;
  box-shadow: inset 0px 0px 1px rgba(255, 251, 251, 0.25);
  border-radius: 16px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 12px;
  padding-right: 12px;
  width: 100% !important;
}
</style>
