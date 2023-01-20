<script lang="ts">
import { PoolWithShares } from '@/services/pool/types';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import {ClaimProviderService} from '@/services/pool/claim.provider';
import { computed, defineComponent, ref, toRefs, PropType,watch,ComputedRef } from 'vue';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useWeb3 from '@/services/web3/useWeb3';
import { POOLS } from '@/constants/pools';
import communityAssetBackImg from '@/assets/images/coins/community-border.svg';
import {
  absMaxApr,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
} from '@/composables/usePool';
import ArrowRightIcon from '@/components/_global/icons/ArrowRightIcon.vue';


export default defineComponent({
  data() {
    return {
        claims: {},
        noClaims:true,
        xpolarPoolQuery: usePoolQuery(
          '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
        ),
    }},
  components: {
    ArrowRightIcon
},
  props: {
    pools: {
      type: Array as PropType<Array<PoolWithShares>>,
      default: null,
    },
    prices:{
      type: Object as PropType<ComputedRef<TokenPrices>>,
      default: null,
    },
    noApr:{
        type:Boolean,
        default:false,
    }
  },
  emits: ['click'],
  methods:{
    async claim() {
      // const { withdraw } = useStake();
      // let poolAddress = '';
      // if (this.pool) {
      //   poolAddress = this.pool.address;
      // }
      // const tx = await withdraw(
      //   poolAddress,
      //   BigNumber.from(0),
      //   this.getProvider()
      // );
      // this.txHandler(tx);
    },
    async fetchClaims() {
      if (this.pools.length==0) {
        await new Promise((resolve, reject) => {
          const loop = () =>
          this.pools !== undefined
              ? resolve(this.pools)
              : setTimeout(loop, 100);
          loop();
        });
      }

      /*const aprsPromises: any[] = [];
      for (var i = 0; i < this.data.length; i++) {
        aprsPromises.push(this.fetch(this.data[i]));
      }
      const aprs = await Promise.all(aprsPromises);
      for (var i = 0; i < this.data.length; i++) {
        this.aprs[this.data[i].address] = aprs[i];
      }*/
      const claimer = new ClaimProviderService(this.pools,this.prices,this.xpolarPoolQuery,this.account);
      claimer.init();
      claimer.claimsReceived = (claims:any)=>{
        this.claims = claims;
        this.$forceUpdate();
      }
      claimer.fetchAll();
    },
    
  },
  setup(props) {
    /**
     * COMPUTED
     */
     const { account, connector, startConnectWithInjectedProvider } = useWeb3();
    /**
     * METHODS
     */

    function iconAddresses(pool: PoolWithShares) {
      return POOLS.Metadata[pool.id]?.hasIcon
          ? [pool.address]
          : orderedTokenAddresses(pool);
    }

    return {
      account,
      iconAddresses,
      orderedPoolTokens,
      communityAssetBackImg,
      // methods
    };
  },
  created(){
      this.fetchClaims();
  }
});

</script>
  
<template >
    <div class="claim-container flex" >
        <div class="stats grid flex-none">
          <div class="flex justify-center items-center ">TVL</div>
          <div class="flex justify-center items-center ">FEES</div>
        </div>
        <div class="pools flex flex-1">
            <div class="grid-table">
              <div class="pool-header">
                <div class="h-4 ">My positions</div>
                <div class="h-4">Tokens</div>
                <div class="h-4">$ Value</div>
                <div class="h-4">To claim</div>
                <div class="h-4"></div>
              </div>
              <!-- div>To Claim</div -->

              <div class="border"></div>

              <template
                v-for="(claim, idx) in claims"
                :key="idx"
              >
                <div
                  class="my-[18px] flex w-full items-center pool-row"
                >
                  <div class="flex w-full items-center">
                    <BalAssetSet
                        :size="36"
                        :addresses="iconAddresses(claim.pool)"
                        :width="100"
                        :backImage="communityAssetBackImg"
                    />
                    <TokenPills class="token-pill"
                      :tokens="orderedPoolTokens(claim.pool.poolType, claim.pool.address, claim.pool.tokens)"
                      :isStablePool="false"
                      :selectedTokens="[]"
                      :showWeight="false"
                    />
                    
                  </div>
                  <div class="flex items-center self-center" >
                    {{claim.stakedBalance}}
                  </div>
                  <div class="flex items-center self-center" >
                    $ 0
                  </div>
                  <div class="flex items-center self-center claim-amount">
                    $ {{claim.xpolarToClaim}}
                  </div>
                  <div  class="flex items-center self-center">
                    <button class="claim-btn flex items-center" @click="claim()">
                      Claim
                      <ArrowRightIcon class="ml-3"/>
                    </button>
                  </div>
                  <!-- div>
                    <BalLoadingBlock
                      v-if="!pool?.apr?.total?.unstaked"
                      class="h-4 w-12"
                    />
                    <template v-else>
                      <div class="h-4 w-12">
                        {{ Math.round(aprLabelFor(pool), 2) }}
                      </div>
                    </template>
                  </div -->
                </div>
              </template>
            </div>
        </div>  
    </div>
</template>
  
  <style scoped>

  .claim-container{
    background-color: #292043;;
    border-radius: 32px;
    min-height: 400px;
  }
  .stats{
    min-width: 300px;
  }
  .stats > div{
    background-color: #41365E;
  }
  .stats > div:first-child{
    border-radius: 32px 0px 0px 0px;
  }
  .stats > div:last-child{
    border-radius: 0px 0px 0px 32px;
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

.grid-table {
  display: grid;
  grid-template-columns: 50% auto;
  width: 100%;
  color: rgba(253, 253, 253, 1);
}

.grid-table .border{
  grid-column: 1 / span 5;
  border: 0.5px solid rgba(151, 71, 255, 0.4);
  margin-bottom: 24px;
  height: 0px;
}
.pools{
  padding:24px 24px 32px 24px;
}
.pool-row{
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FDFDFD;
}
.pool-row, .pool-header{
  display: contents;
}
.pool-row > div, .pool-header > div{
  height: 100%;
  padding:18px 0px;
}
.pool-header > div{
  color: #BDB2DD;
  padding-bottom: 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
.claim-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 24px;
  padding: 10px 17px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}

.claim-btn:hover{
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
}
.claim-amount{
  color: #0CE6B5;
}
 </style>