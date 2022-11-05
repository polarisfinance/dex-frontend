<template>
  <div>
    <div class="p-4">
      <div class="box bg">
        <div
          class="txt w-full font-[500px] mt-[12px] grid h-[22px] grid-cols-2 grid-rows-1 items-center justify-between gap-5 text-sm font-medium leading-none text-purple-secondary"
        >
          Connected with {{ connectorName }}
          <div class="flex flex-row justify-end gap-[8px]">
            <button
              class="h-[22px] w-[86px] disconnect"
              @click="disconnectWallet"
            >
              <div
                class="text-center text-[14px] leading-[18px]"
                v-text="$t('disconnect')"
              />
            </button>
            <button
              class="h-[22px] w-[68px] change"
              @click="toggleWalletSelectModal"
              v-on:click="close"
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
            class="pl-[10px] font-bold text-black dark:text-white address"
            v-text="_shorten(account)"
          />
        </div>

        <div class="address mb-[12px] flex justify-start">
          <button class="button p-0">
            <div
              class="link flex flex-row justify-start gap-[8px] align-baseline copy-address"
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
            class="link ml-[16px] flex flex-row justify-start gap-[8px] align-baseline view"
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

import useEthereumTxType from '@/composables/useEthereumTxType';
import { ethereumTxTypeOptions } from '@/constants/options';
import { GP_SUPPORTED_NETWORKS } from '@/services/gnosis/constants';
import useWeb3 from '@/services/web3/useWeb3';
import {
  getConnectorLogo,
  getConnectorName,
} from '@/services/web3/web3.plugin';
// import X from '../../web3/x.vue';
import IconCheck from '@/components/icons/IconCheck.vue';
import IconCopy from '@/components/icons/IconCopy.vue';
import IconExplorer from '@/components/icons/IconExplorer.vue';
export default defineComponent({
  props: {
    close: { type: Function },
  },
  components: {
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

.copy-address {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #d7b3ff;
}

.view {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #cac7cc;
}

.option:hover {
  @apply border-blue-500 text-blue-500;
}

.option.active {
  @apply border-blue-500 text-blue-500;
}

.slippage-input {
  @apply bg-white;
}

.slippage-input.active {
  @apply border-2 border-blue-500 text-blue-500 ring;
}

.bal-card {
  @apply flex flex-col;
  /* background-color: #231928; */
  /* box-shadow: inset 0px 0px 2px #fbaaff; */
  border-radius: 22px;
  box-sizing: border-box;
  width: 440px;
}

.box {
  @apply transition-all;
  /* @apply bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800; */
  /* @apply border dark:border-gray-900; */
  @apply flex flex-col gap-[10px] rounded-md;
  /* background: #2e2433; */
  box-shadow: inset 0px 0px 1px rgba(255, 251, 251, 0.25);
  border-radius: 16px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 100% !important;
  background: #261737;
  box-shadow: inset 0px 0px 1px rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}

.change {
  padding: 2px 12px;

  background: #1e0d2c;
  border-radius: 16px;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #d7b3ff;
}

.address {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #fdfdfd;
}

.button {
  background: #ffffff00 !important;
}

.txt {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  /* identical to box height */

  /* Text/Šedá */

  color: #cac7cc;
}

.disconnect {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 12px;
}
</style>
