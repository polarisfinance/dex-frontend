<template>
  <div>
    <div class="p-4 bal-card">
      <div class="flex justify-between items-center mb-[20px]">
        <h5
          class="tracking-tight leading-none font-semibold text-[16px]"
          v-text="$t('account')"
        />

        <div class="flex gap-2 items-center pr-[8px]">
          <X v-on:click="close" />
        </div>
      </div>
      <div class="box">
        <div
          class="grid grid-cols-2 gap-5 grid-rows-1 justify-between items-center text-sm leading-none text-gray-600 dark:text-gray-400 w-ful h-[22px] mt-[12px] font-[500px]"
        >
          Connected with {{ connectorName }}
          <div class="flex flex-row gap-[8px] justify-end">
            <button class="h-[22px] w-[86px] border" @click="disconnectWallet">
              <div
                class="text-center text-[14px] leading-[18px]"
                v-text="$t('disconnect')"
              />
            </button>
            <button
              class="h-[22px] w-[68px] border"
              @click="toggleWalletSelectModal"
            >
              <div
                class="text-center text-[14px] leading-[18px]"
                v-text="$t('change')"
              />
            </button>
          </div>
        </div>
        <div class="flex flex-row">
          <Avatar :iconURI="profile?.avatar" :address="account" :size="24" />
          <div
            class="font-bold text-black dark:text-white pl-[10px]"
            v-text="_shorten(account)"
          />
        </div>

        <div class="flex address justify-start mb-[12px]">
          <button class="p-0 button">
            <div
              class="flex flex-row gap-[8px] justify-start align-baseline link"
              @click="copyAddress"
            >
              <IconCheck v-if="copiedAddress" class="mt-0.5" />
              <IconCopy v-else />
              <div
                class="text-center"
                v-text="copiedAddress ? $t('copied') : $t('copyAddress')"
              />
            </div>
          </button>

          <component
            :is="'a'"
            :href="explorer.addressLink(account)"
            target="_blank"
            rel="noreferrer"
            class="flex flex-row gap-[8px] justify-start align-baseline ml-[16px] link"
          >
            <IconExplorer />
            <div class="text-center" v-text="'View on explorer'" />
          </component>
        </div>
      </div>
    </div>
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
import IconCheck from '@/components/icons/IconCheck.vue';
import IconCopy from '@/components/icons/IconCopy.vue';
import IconExplorer from '@/components/icons/IconExplorer.vue';
export default defineComponent({
  props: {
    close: { type: Function },
  },
  components: {
    AppSlippageForm,
    Avatar,
    X,
    IconCheck,
    IconCopy,
    IconExplorer,
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
  @apply flex rounded-md flex-col gap-[10px];
  background: #2e2433;
  box-shadow: inset 0px 0px 1px rgba(255, 251, 251, 0.25);
  border-radius: 16px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100% !important;
}

.button {
  background: #ffffff00 !important;
}

.border {
  @apply py-[2px] px-[12px] bg-[#231928] bg-none border-transparent text-[#BE95C0];
}
.border:hover {
  @apply text-[#FBAAFF];
  background: #391c41 !important;
  border: 1px solid #552162 !important;
  border-radius: 12px !important;
}

.link {
  @apply text-[#B9BABB] font-semibold leading-[20px] fill-[B9BABB];
}
.link:hover {
  @apply text-[#be95c0] font-semibold leading-[20px] no-underline fill-[#be95c0];
}

.link:focus {
  @apply text-[#be95c0] font-semibold leading-[20px] no-underline fill-[#be95c0];
}
</style>
