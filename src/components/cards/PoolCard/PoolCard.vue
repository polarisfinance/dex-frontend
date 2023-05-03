<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  PropType,
  watch,
  ComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';
import { PoolWithShares } from '@/services/pool/types';
import { PoolToken } from '@/services/pool/types';
import TokenWeightsPills from '@/components/tables/PoolsTable/TokenPills/TokenWeightsPills.vue';
import TokenPills from '@/components/tables/PoolsTable/TokenPills/TokenPills.vue';
import { POOLS } from '@/constants/pools';
import useNetwork from '@/composables/useNetwork';
import {
  absMaxApr,
  fiatValueOf,
  isLiquidityBootstrapping,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
  isLBP,
  poolMetadata,
} from '@/composables/usePoolHelpers';

// import {AprProviderService} from '@/services/pool/apr.provider';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import useBreakpoints from '@/composables/useBreakpoints';

export default defineComponent({
  components: {
    TokenPills,
    TokenWeightsPills,
  },
  props: {
    pool: {
      type: Object as PropType<PoolWithShares>,
      default: null,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    selectedTokens: {
      type: Array,
      default: [],
    },
    noApr: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props) {
    /**
     * COMPUTED
     */
    const { isMobile, isDesktop } = useBreakpoints();
    const { networkSlug } = useNetwork();
    /**
     * METHODS
     */
    function iconAddresses(pool: PoolWithShares) {
      return POOLS.Metadata[pool.id]?.hasIcon
        ? [pool.address]
        : orderedTokenAddresses(pool);
    }
    function aprLabelFor(pool: Pool): string {
      const poolAPRs = pool?.apr;
      if (!poolAPRs) return '0';

      return totalAprLabel(poolAPRs, pool.boost);
    }

    return {
      // computed
      isMobile,
      isDesktop,
      // methods
      iconAddresses,
      orderedPoolTokens,
      aprLabelFor,
      poolMetadata,
      isStableLike,
      props,
      networkSlug,
    };
  },
  data() {
    return {
      aprs: {},
      xpolarPoolQuery: usePoolQuery(
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
      ),
    };
  },
  created() {
    // if(!this.noApr)
    //   this.fetchApr();
  },
  methods: {
    // async fetchApr() {
    //   if (!this.pool) {
    //     await new Promise((resolve, reject) => {
    //       const loop = () =>
    //       this.pool !== undefined
    //           ? resolve(this.pool)
    //           : setTimeout(loop, 100);
    //       loop();
    //     });
    //   }
    //   // const aprProviderClass = new AprProviderService([this.pool],this.prices,this.xpolarPoolQuery);
    //   // aprProviderClass.init();
    //   // aprProviderClass.aprsReceived = (aprs:any)=>{
    //   //   this.aprs = aprs;
    //   // }
    //   // aprProviderClass.fetchAll();
    // },
  },
});
</script>
  
<template>
  <div class="card-container">
    <router-link
      :to="{
        name: 'pool',
        params: {
          networkSlug,
          id: pool.id,
        },
      }"
      class="flex header"
    >
      <BalAssetSet
        :size="44"
        :addresses="iconAddresses(pool)"
        :width="130"
        :maxOffset="35"
      />
      <div class="w-full">
        <div
          v-if="poolMetadata(pool.id)"
          class="mb-4 text-xl font-semibold text-left dark:text-polaris-white"
        >
          {{ poolMetadata(pool.id)?.name }}
        </div>
        <div v-else>
          <TokenPills
            class="mb-4 text-xl"
            :tokens="orderedPoolTokens(pool, pool.tokens)"
            :isStablePool="isStableLike(pool.poolType)"
            :selectedTokens="selectedTokens"
            :pickedTokens="selectedTokens"
            :showWeight="false"
          />
        </div>
        <TokenWeightsPills
          class="w-fit"
          :tokens="orderedPoolTokens(pool, pool.tokens)"
          :isStablePool="isStableLike(pool.poolType)"
          :selectedTokens="selectedTokens"
          :pickedTokens="selectedTokens"
          :boosted="pool.boosted"
        />
      </div>
    </router-link>
    <div class="footer">
      <div v-if="isDesktop" class="flex texts">
        <div class="title">APR</div>
        <div class="flex-1 text-right">Earn swap fees and boost your APR</div>
      </div>
      <div class="flex">
        <div class="apr value">
          <template v-if="noApr">
            <div class="w-12 h-4">
              {{ '0' + '%' }}
            </div>
          </template>
          <template v-else>
            <div>
              {{ aprLabelFor(pool) }}
            </div>
          </template>
        </div>
        <div v-if="isMobile" class="title">APR</div>
        <div class="flex-1 text-right">
          <router-link
            :to="{
              name: 'pool',
              params: {
                networkSlug,
                id: pool.id,
              },
            }"
            class="block items-center mt-[12px]"
          >
            <button class="earn-button">
              Earn
              <ArrowRightIcon class="inline mx-1" />
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <style scoped>
.card-container {
  background-color: #292043;
  padding: 24px 12px;
  border-radius: 24px;
}
.header {
  padding: 0px 14px 17px 14px;
  border-bottom: 1px solid rgba(65, 54, 94, 0.4);
}
.footer {
  padding: 17px 14px 0px 14px;
}
.texts {
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  color: #a99bc6;
}
.title {
  font-size: 16px;
  color: #fdfdfd;
}
.apr {
  font-weight: 700;
  font-size: 44px;
  line-height: 44px;
  background: linear-gradient(95.72deg, #43cea2 -16.04%, #185a9d 100.53%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.earn-button {
  padding: 6px 12px 6px 16px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgba(41, 32, 67, 1), rgba(41, 32, 67, 1))
      padding-box,
    linear-gradient(90deg, rgba(192, 4, 254, 1), rgba(126, 2, 245, 1))
      border-box;
  border: 1px solid transparent;
}
.earn-button:hover {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
}
.token-pill {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
}
</style>