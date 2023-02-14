<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { useReturnRoute } from '@/composables/useReturnRoute';
import { useRoute } from 'vue-router';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { shortenLabel } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';
import arrow from './table-arrow.svg';

export default defineComponent({
  components: {},
  props: {},
  watch: {},
  setup(props, { emit }) {
    const { getReturnRoute } = useReturnRoute();
    const route = useRoute();
    const id = ref<string>(route.params.id as string);
    const poolQuery = usePoolQuery(route.params.id as string);
    const pool = computed(() => poolQuery.data.value);
    const poolQueryLoading = computed(
      () =>
        poolQuery.isLoading.value ||
        poolQuery.isIdle.value ||
        Boolean(poolQuery.error.value)
    );
    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    const creationDate = computed(() => {
      if (pool.value?.createTime) {
        const date = new Date(pool.value.createTime * 1000);
        return date.toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return '';
    });
    const swapFee = computed(() => {
      if (pool.value?.swapFee) {
        return Number(pool.value.swapFee) * 100;
      }
      return 0;
    });
    const poolOwner = computed(() => {
      if (pool.value?.owner) {
        return shortenLabel(pool.value.owner);
      }
      return '';
    });
    const poolAddress = computed(() => {
      if (pool.value?.id) {
        return shortenLabel(pool.value.address);
      }
      return '';
    });

    const { explorerLinks: explorer } = useWeb3();

    const poolOwnerLink = computed(() => {
      if (pool.value?.owner) {
        return explorer.addressLink(pool.value.owner);
      }
      return '';
    });
    const poolAddressLink = computed(() => {
      if (pool.value?.id) {
        return explorer.addressLink(pool.value.address);
      }
      return '';
    });

    const tableData = computed(() => {
      const onchainTokens = pool.value?.onchain?.tokens || [];
      return Object.keys(onchainTokens).map((address, index) => ({
        address,
        index,
      }));
    });

    function symbolFor(address: string) {
      if (!pool || !pool.value) return '-';
      const symbol = pool.value?.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }
    function iconAddresses(tableData) {
      let addresses: string[] = [];
      tableData.forEach(token => {
        addresses.push(token?.address);
      });
      // if (pool != undefined)
      //   return POOLS.Metadata[pool.id]?.hasIcon
      //     ? [pool.address]
      //     : orderedTokenAddresses(pool);
      return addresses;
    }
    return {
      getReturnRoute,
      id,
      pool,
      creationDate,
      swapFee,
      poolOwner,
      poolAddress,
      poolOwnerLink,
      poolAddressLink,
      arrow,
      tableData,
      symbolFor,
      iconAddresses,
      loadingPool,
    };
  },
  mounted() {},
  onBeforeMount() {},
  updated() {},
  data() {
    return {};
  },
  methods: {},

  emits: [],
});
</script>

<template>
  <div class="layout-header mb-12">
    <div />
    <router-link :to="getReturnRoute({ name: 'pool', params: { id } })">
      <BalIcon name="x" size="lg" />
    </router-link>
  </div>
  <div class="container mx-auto">
    <div class="card gap- mx-auto grid">
      <div class="header flex">
        <div class="attr-wrapper"><div class="attr">Attribute</div></div>
        <div class="val flex justify-between">
          <div>Pool Details</div>
          <div class="flex">
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="token-name flex"
            >
              <div>
                {{ symbolFor(token.address) }}
              </div>
              <div v-if="idx < tableData.length - 1">-</div>
            </div>
            <div class="pl-[12px]">
              <BalAssetSet
                :size="18"
                :addresses="iconAddresses(tableData)"
                :width="32"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div>Pool name</div>
        <div>{{ pool?.name }}</div>
      </div>
      <div class="row">
        <div>Pool symbol</div>
        <div>{{ pool?.symbol }}</div>
      </div>
      <div class="row">
        <div>Pool type</div>
        <div>{{ pool?.poolType }}</div>
      </div>
      <div class="row">
        <div>Swap fees</div>
        <div v-if="!loadingPool">{{ swapFee }}%</div>
        <div v-else></div>
      </div>
      <div class="row">
        <div>Pool manager</div>
        <div v-if="!loadingPool">None</div>
        <div v-else></div>
      </div>
      <div class="row">
        <div>Pool owner address</div>
        <a
          :href="poolOwnerLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex"
        >
          <div class="py-[12px] pl-[24px] underline">{{ poolOwner }}</div>
          <img :src="arrow" class="ml-[12px] inline" v-if="!loadingPool" />
        </a>
      </div>
      <div class="row">
        <div>Contract address</div>
        <a
          :href="poolAddressLink"
          target="_blank"
          rel="noopener noreferrer"
          class="flex"
        >
          <div class="py-[12px] pl-[24px] underline">{{ poolAddress }}</div>
          <img :src="arrow" class="ml-[12px] inline" v-if="!loadingPool" />
        </a>
      </div>
      <div class="row">
        <div>Creation date</div>
        <div>{{ creationDate }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-header {
  @apply h-16;
  @apply px-4 lg:px-6;
  @apply flex items-center justify-between;
}
.grid {
  display: grid;
  grid-template-columns: 50% auto;
  width: 100%;
}
.card {
  min-height: 0px;
  max-width: 730px;
}
.header {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 50px;
}
.attr-wrapper {
  overflow: hidden;
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
  margin-bottom: 40px;
}
.val {
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
  margin-bottom: 40px;
}
.attr {
  background: #41365e !important;
  border-radius: 32px;
  overflow: hidden;
}
.header div {
  background: #292043;
}
.val,
.attr {
  padding: 12px 24px;
}

.row,
.header {
  display: contents;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: rgba(253, 253, 253, 0.8);
}
.row > div {
  padding: 12px 24px;
}

.token-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
</style>
