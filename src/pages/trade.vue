<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// Composables
import { useStore } from 'vuex';

// Components
import MyWallet from '@/components/cards/MyWallet/MyWallet.vue';
import PairPriceGraph from '@/components/cards/PairPriceGraph/PairPriceGraph.vue';
import TradeCard from '@/components/cards/TradeCard/TradeCard.vue';
import TrendingPairs from '@/components/cards/TrendingPairs/TrendingPairs.vue';
import Col3Layout from '@/components/layouts/Col3Layout.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';

/**
 * STATE
 */
const showPriceGraphModal = ref(false);

/**
 * COMPOSABLES
 */
const store = useStore();
const { setSelectedTokens } = usePoolFilters();
const { upToLargeBreakpoint } = useBreakpoints();

/**
 * COMPUTED
 */
const appLoading = computed(() => store.state.app.loading);

/**
 * METHODS
 */
function onPriceGraphModalClose() {
  showPriceGraphModal.value = false;
}

function togglePairPriceGraphModal() {
  showPriceGraphModal.value = !showPriceGraphModal.value;
}

/**
 * CALLBACKS
 */
onMounted(() => {
  // selectedPoolTokens are only persisted between the Home/Pool pages
  setSelectedTokens([]);
});
</script>

<template>
  <Col3Layout offsetGutters mobileHideGutters class="mt-8">
    <!-- <template #gutterLeft>
      <MyWallet />
      <TrendingPairs class="mt-4" />
    </template> -->

    <!-- <div class="absolute bar hidden lg:block">
      <img src="./Bar.svg" />
      <div class="absolute sidebar w-full">
        <MyWallet class="sidebar-component" />
        <TrendingPairs class="sidebar-component" />
        <PairPriceGraph class="sidebar-component" />
      </div>
    </div> -->

    <BalLoadingBlock v-if="appLoading" class="h-96" />
    <template v-else>
      <TradeCard />
    </template>
    <!-- <template #gutterRight>
      <PairPriceGraph :toggleModal="togglePairPriceGraphModal" />
    </template> -->
  </Col3Layout>
</template>

<style scoped>
.graph-modal {
  height: 450px;
}

.bar {
  right: 0;
  top: 0;
  height: 100%;
}

img {
  height: 100%;
}

.my-wallet {
  right: 0;
  width: 100%;
}

.sidebar {
  top: 0;
  margin-top: 11em;
}

.sidebar-component {
  margin-top: 0.5em;
  width: 85%;
  margin-left: auto;
  margin-right: auto;
}
</style>
