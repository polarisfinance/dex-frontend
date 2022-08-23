<script lang="ts">
import BigNumber from 'bignumber.js';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { VueQueryDevTools } from 'vue-query/devtools';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import Notifications from '@/components/notifications/Notifications.vue';
import ThirdPartyServicesModal from '@/components/web3/ThirdPartyServicesModal.vue';
import WalletSelectModal from '@/components/web3/WalletSelectModal.vue';
import useWeb3Watchers from '@/composables/watchers/useWeb3Watchers';
import { DEFAULT_TOKEN_DECIMALS } from '@/constants/tokens';
import * as Layouts from '@/pages/_layouts';
import useWeb3 from '@/services/web3/useWeb3';

import GlobalModalContainer from './components/modals/GlobalModalContainer.vue';
import AppSidebar from './components/navs/AppNav/AppSidebar/AppSidebar.vue';
import SanctionedWalletModal from './components/web3/SanctionedWalletModal.vue';
import useBackgroundColor from './composables/useBackgroundColor';
import useGnosisSafeApp from './composables/useGnosisSafeApp';
import useNavigationGuards from './composables/useNavigationGuards';
import { useSidebar } from './composables/useSidebar';
import useExploitWatcher from './composables/watchers/useExploitWatcher';
import useGlobalQueryWatchers from './composables/watchers/useGlobalQueryWatchers';
import usePoolCreationWatcher from './composables/watchers/usePoolCreationWatcher';
import MyWallet from '@/components/cards/MyWallet/MyWallet.vue';
import TrendingPairs from '@/components/cards/TrendingPairs/TrendingPairs.vue';
import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';

BigNumber.config({ DECIMAL_PLACES: DEFAULT_TOKEN_DECIMALS });

export const isThirdPartyServicesModalVisible = ref(false);

export default defineComponent({
  components: {
    ...Layouts,
    VueQueryDevTools,
    WalletSelectModal,
    SanctionedWalletModal,
    ThirdPartyServicesModal,
    Notifications,
    AppSidebar,
    GlobalModalContainer,
    MyWallet,
    TrendingPairs,
    PairPriceGraph,
  },

  setup() {
    /**
     * STATE
     */
    const layout = ref('DefaultLayout');
    /**
     * COMPOSABLES
     */
    useWeb3Watchers();
    usePoolCreationWatcher();
    useGlobalQueryWatchers();
    useGnosisSafeApp();
    useExploitWatcher();
    useNavigationGuards();
    const {
      isWalletSelectVisible,
      toggleWalletSelectModal,
      isSanctioned,
      // isMainnet
    } = useWeb3();
    const route = useRoute();
    const store = useStore();
    const { newRouteHandler: updateBgColorFor } = useBackgroundColor();
    const { sidebarOpen } = useSidebar();

    // ADD FEATURE ALERT HERE
    // const featureAlert: Alert = {
    //   id: 'vebal-gap',
    //   priority: AlertPriority.LOW,
    //   label: t('alerts.vebalL2'),
    //   type: AlertType.FEATURE,
    //   rememberClose: false,
    //   actionOnClick: false
    // };
    // addAlert(featureAlert);

    /**
     * CALLBACKS
     */
    onBeforeMount(async () => {
      store.dispatch('app/init');
    });

    function handleThirdPartyModalToggle(value: boolean) {
      isThirdPartyServicesModalVisible.value = value;
    }

    /**
     * WATCHERS
     */
    watch(route, newRoute => {
      // updateBgColorFor(newRoute);
      if (newRoute.meta.layout) {
        layout.value = newRoute.meta.layout as string;
      } else {
        layout.value = 'DefaultLayout';
      }
    });

    return {
      // state
      layout,
      isSanctioned,
      isThirdPartyServicesModalVisible,
      // computed
      isWalletSelectVisible,
      sidebarOpen,
      // methods
      toggleWalletSelectModal,
      handleThirdPartyModalToggle,
    };
  },
});
</script>

<template>
  <div id="modal" />
  <div id="app">
    <div class="absolute bar hidden lg:block">
      <img src="./Bar.svg" />
      <div class="absolute sidebar w-full">
        <MyWallet class="sidebar-component" />
        <TrendingPairs class="sidebar-component" />
        <PairPriceGraph class="sidebar-component" />
      </div>
    </div>
    <component :is="layout" />
    <VueQueryDevTools />
    <WalletSelectModal
      :isVisible="isWalletSelectVisible"
      :onShowThirdParty="() => handleThirdPartyModalToggle(true, 'wallet')"
      @close="toggleWalletSelectModal"
    />
    <SanctionedWalletModal v-if="isSanctioned" />
    <ThirdPartyServicesModal
      :isVisible="isThirdPartyServicesModalVisible"
      @close="handleThirdPartyModalToggle(false, 'third')"
    />
    <AppSidebar v-if="sidebarOpen" />
    <Notifications />
  </div>
  <GlobalModalContainer />
</template>

<style>
.VueQueryDevtoolsPanel + button {
  @apply text-black bg-gray-100 p-2 rounded text-sm;
}

.bar {
  right: 0;
}

.my-wallet {
  right: 0;
  width: 100%;
}

.sidebar {
  top: 0;
  margin-top: 12em;
}

.sidebar-component {
  margin-top: 0.5em;
  width: 85%;
  margin-left: auto;
  margin-right: auto;
}
</style>
