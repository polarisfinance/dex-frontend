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

const { isMobile } = useBreakpoints();

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
  <Col3Layout offsetGutters mobileHideGutters class="mt-10 lg:mt-40">
    <BalLoadingBlock v-if="appLoading" class="h-96" />
    <template v-else>
      <TradeCard />
    </template>

    <div v-if="isMobile" class="mt-8 px-6">
      <MyWallet class="mt-2" />
      <TrendingPairs class="mt-2" />
      <PairPriceGraph class="mt-2" />
    </div>
    <!-- <template #gutterRight>
      <PairPriceGraph :toggleModal="togglePairPriceGraphModal" />
    </template> -->
  </Col3Layout>
</template>

<style scoped>
.graph-modal {
  height: 450px;
}
</style>
