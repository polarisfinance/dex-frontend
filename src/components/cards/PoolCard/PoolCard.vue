<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { PoolWithShares } from '@/services/pool/types';
import { PoolToken } from '@/services/pool/types';
// import TokenPills from '@/components/tables/PoolsTable/TokenPills/TokenPills.vue';
// import TokenWeightsPills from '@/components/tables/PoolsTable/TokenPills/TokenWeightPill.vue';

import { POOLS } from '@/constants/pools';
import {
  absMaxApr,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
} from '@/composables/usePool';





export default defineComponent({
  data() {
    return {
        aprs: {},
    }},
  components: {
  },
  props: {
    pool: {
      type: PoolWithShares,
      default: null,
    },
    noApr:{
        type:Boolean,
        default:false,
    },
    aprs:{
        type:Object,
        default:null,
    }
  },
  emits: ['click'],
  methods:{
  },
  setup(props) {
    /**
     * COMPUTED
     */

    /**
     * METHODS
     */
    function iconAddresses(pool: PoolWithShares) {
        console.log(orderedPoolTokens(pool.poolType, pool.address, pool.tokens));
        return POOLS.Metadata[pool.id]?.hasIcon
            ? [pool.address]
            : orderedTokenAddresses(pool);
    }

    return {
      // computed

      // methods
      iconAddresses,
      orderedPoolTokens
    };
  },
});

</script>
  
<template>
    <div class="card-container">
        <div class="header flex">
            <BalAssetSet
                :size="44"
                :addresses="iconAddresses(pool)"
                :width="100"
            />
            <div class="w-full">
                <TokenPills class="token-pill"
                  :tokens="orderedPoolTokens(pool.poolType, pool.address, pool.tokens)"
                  :isStablePool="false"
                  :selectedTokens="[]"
                  :showWeight="false"
                />
                <TokenWeightPill class="mt-[8px] inline-block w-min"
                  :tokens="
                    orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
                  "
                />
            </div>
        </div>
        <div class="footer flex">
            <div class="apr">
                <div class="title">APR</div>
                <div class="value">859 %
                <template v-if="noApr">
                    <div class="h-4 w-12">
                    {{ '0' + '%' }}
                    </div>
                </template>
                <BalLoadingBlock
                    v-else-if="
                    !aprs ||
                    !aprs[pool.address] ||
                    !aprs[pool.address]['yearlyAPR']
                    "
                />
                <template v-else>
                    <div>
                    {{ aprs[pool.address]['yearlyAPR'] + '%' }}
                    </div>
                </template>
                </div>
            </div>
            <div class="flex-1 text-right">
                Earn swap fees and boost your APR
                <router-link
                    :to="'/pool/' + pool.id"
                    class="mt-[12px] block items-center"
                >
                <button class="earn-button">
                    Earn
                    <ArrowRightIcon class="inline mx-1"/>
                </button>
                </router-link>
            </div>

        </div>  
    </div>
</template>
  
  <style scoped>

  .card-container{
    background-color: #292043;
    padding: 24px 12px;
    border-radius: 24px;
  }
  .header{
    padding:14px 14px 17px 14px;
    border-bottom: 1px solid rgba(65, 54, 94, 0.4);
  }
  .footer{
    padding:17px 14px 0px 14px;
  }
  .apr .title{
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
  .apr .value{
    font-weight: 700;
    font-size: 44px;
    line-height: 44px;
    background: linear-gradient(95.72deg, #43CEA2 -16.04%, #185A9D 100.53%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
  .earn-button{
    padding: 6px 12px 6px 16px;
    gap: 10px;
    border-radius: 24px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    background: linear-gradient(rgba(41, 32, 67, 1),rgba(41, 32, 67, 1)) padding-box,
    linear-gradient(90deg,rgba(192, 4, 254, 1), rgba(126, 2, 245, 1)) border-box;
    border: 1px solid transparent;
  }
  .earn-button:hover{
    background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
  }
  .token-pill{
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }
  </style>