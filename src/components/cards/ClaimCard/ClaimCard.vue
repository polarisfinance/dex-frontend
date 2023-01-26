<script lang="ts">
import { PoolWithShares,PoolType,AnyPool,Pool } from '@/services/pool/types';
import { TokenPrices } from '@/services/coingecko/api/price.service';
import {ClaimType, ClaimProviderService} from '@/services/pool/claim.provider';
import { computed, defineComponent, ref, PropType,watch,ComputedRef,toRef } from 'vue';

import usePoolQuery from '@/composables/queries/usePoolQuery';
import useWeb3 from '@/services/web3/useWeb3';
import { POOLS } from '@/constants/pools';
import communityAssetBackImg from '@/assets/images/coins/community-border.svg';
import useStake from '@/composables/PolarisFinance/useStake';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import MyPoolInvsetmentFiat, { MyPollInvestmentFiatType} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import useEthers from '@/composables//useEthers';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
import {
  absMaxApr,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
  usePool,
} from '@/composables/usePool';
import {
    BigNumberToString,
    sunriseNameToAddress,
    SPOLAR,
    getDisplayBalance,
} from '@/composables/PolarisFinance/utils';
import ArrowRightIcon from '@/components/_global/icons/ArrowRightIcon.vue';
import { BigNumber } from 'ethers';
import useBreakpoints from '@/composables/useBreakpoints';

import polarImg from '@/pages/polar.svg';
import orbitalImg from '@/pages/orbital.svg';
import uspImg from '@/pages/usp.svg';
import ethernalImg from '@/pages/ethernal.svg';
import binarisImg from '@/pages/binaris.svg';

const singlePools = [
    { name: 'POLAR', id: '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86', logo:polarImg},
    { name: 'ORBITAL', id: '0x3AC55eA8D2082fAbda674270cD2367dA96092889', logo:orbitalImg },
    { name: 'BINARIS', id: '0xafE0d6ca6AAbB43CDA024895D203120831Ba0370', logo:binarisImg },
    { name: 'USP', id: '0xa69d9Ba086D41425f35988613c156Db9a88a1A96', logo:uspImg },
    { name: 'ETHERNAL', id: '0x17cbd9C274e90C537790C51b4015a65cD015497e', logo:ethernalImg },
    // { name: 'PBOND', id: '0x3a4773e600086A753862621A26a2E3274610da43' },
    // { name: 'OBOND', id: '0x192bdcdd7b95A97eC66dE5630a85967F6B79e695' },
    // { name: 'BBOND', id: '0xfa32616447C51F056Db97BC1d0E2D4C0c4D059C9' },
    // { name: 'USPBOND', id: '0xcE32b28c19C61B19823395730A0c7d91C671E54b' },
    // { name: 'EBOND', id: '0x266437E6c7500A947012F19A3dE96a3881a0449E' },
  ];

export default defineComponent({
  
  data() {
    return {
        claims: [] as Array < ClaimType >,
        noClaims:true,
        totalClaims: 0,
        totalPoolFiatValue:0,
        xpolarPoolQuery: usePoolQuery(
          '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
        ),
        poolTotalFiatValues:[],

  }},
  watch:{
    pools(newValue,oldValue){
      if(newValue.length!=0)
        this.fetchClaimsIfPossible();
    },
    prices(newValue,oldValue){
      if(newValue!=undefined)
        this.fetchClaimsIfPossible();
    },
    async account() {
      this.fetchClaimsIfPossible();
    },
  },
  components: {
    ArrowRightIcon,
    MyPoolInvsetmentFiat,
  },
  props: {
    pools: {
      type: Array as PropType<Array<PoolWithShares>>,  //PoolWithShares AnyPool
      default: null,
    },
    singlePools: {
      type: Array as PropType<Array<Pool>>,
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
    async claimXpolar(claim){
      const { withdraw } = useStake();
      if(claim.pool!=undefined){
        const tx = await withdraw(
          claim.pool.address,
          BigNumber.from(0),
          this.getProvider()
        );
        this.txHandler(tx);
        this.txListener(tx, {
          onTxConfirmed: () => {
            this.fetchClaims();
          },
          onTxFailed: () => {},
        });
      }
      
    },
    fetchClaimsIfPossible(){
      if(this.pools.length!=0 && this.prices!=undefined ){
        this.fetchClaims();
      }
    },
    async fetchClaims() {

      const claimer = new ClaimProviderService(this.pools,singlePools,this.prices,this.xpolarPoolQuery,this.account);
      claimer.init();
      claimer.claimReceived = (claim:ClaimType)=>{

        let existingIndex = -1;
        this.claims.forEach(existingClaim => {
          if(existingClaim.address==claim.address){
            existingIndex = this.claims.indexOf(existingClaim);
          }
        });
        if(existingIndex!=-1){
          this.claims[existingIndex] = claim;
        }else{
          this.claims.push(claim);
          this.totalClaims=  this.totalClaims + Number(claim.xpolarToClaim);

        }
        
        // this.claimsCount = this.claims.length;
        // this.$forceUpdate;
      }
      claimer.fetchAll();
    },
    refreshTotalValue(){
      this.totalPoolFiatValue = 0;
      for (const [key, value] of Object.entries(this.poolTotalFiatValues)) {
        this.totalPoolFiatValue = this.totalPoolFiatValue + value;
      }
    },
    
  },
  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum2, toFiat } = useNumbers();
    const { tokens, balances, balanceFor } = useTokens();
    const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
    const { txListener } = useEthers();
    /**
     * COMPUTED
     */
     const { account, connector, startConnectWithInjectedProvider } = useWeb3();
     const { getProvider } = useWeb3();
     const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'claim',
        summary: 'claim staking reward',
      });
    };
    const { addTransaction } = useTransactions();
    const bptBalance = computed((pool): string => balanceFor(pool.address));


    /**
     * METHODS
     */

    function iconAddresses(claim: ClaimType) {
      if(claim.pool!=undefined)
        return POOLS.Metadata[claim.pool.id]?.hasIcon
          ? [claim.pool.address]
          : orderedTokenAddresses(claim.pool);
    }

    function getRooterLink(claim){
      if(claim.pool!=undefined)
        return '/pool/' + claim.pool.id;
      else{
        singlePools.forEach(singlePool => {
          if(singlePool.id == claim.address)
          return 'singlestake/'+singlePool.name.toLowerCase();
        });
        return '';
      }
    }
    function getSingleStakeLogo(claim){
      singlePools.forEach(singlePool => {
          if(singlePool.id == claim.address)
          return singlePool.logo;
        });
    }



    return {
      account,
      iconAddresses,
      orderedPoolTokens,
      communityAssetBackImg,
      // methods
      getProvider,
      txHandler,
      txListener,
      BigNumberToString,
      isMobile, 
      isDesktop,
      fNum2,
      FNumFormats,
      getRooterLink,
      getSingleStakeLogo,
    };
  },
  created(){
  },
  beforeUpdate() {
  },
  mounted(){
  },
  updated(){
    const target_copy:MyPollInvestmentFiatType = Object.assign({}, this.$refs['poolTotalFiatValues']) as  MyPollInvestmentFiatType;
    // this.totalPoolFiatValue +=;
    if(target_copy.fiatNumber!=undefined){
      this.poolTotalFiatValues[target_copy.pool.address] = target_copy.fiatNumber;
    }
    this.refreshTotalValue();
    
  }
});

</script>
  
<template >
  <div class="container mx-auto" v-if="account!= ''">
    <div class="claim-container flex flex-wrap" >
        <div class="stats grid " :class="{'flex-none':isDesktop,'flex-1':isMobile}">
          <div class="flex justify-center items-center " v-if="totalPoolFiatValue>0">
            <div class="flex py-5" >
              <div class="mr-4 mt-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6668 6.66659V2.66659C18.6668 2.31296 18.5264 1.97383 18.2763 1.72378C18.0263 1.47373 17.6871 1.33325 17.3335 1.33325H4.00016C3.29292 1.33325 2.61464 1.6142 2.11454 2.1143C1.61445 2.6144 1.3335 3.29267 1.3335 3.99992M1.3335 3.99992C1.3335 4.70716 1.61445 5.38544 2.11454 5.88554C2.61464 6.38563 3.29292 6.66659 4.00016 6.66659H20.0002C20.3538 6.66659 20.6929 6.80706 20.943 7.05711C21.193 7.30716 21.3335 7.6463 21.3335 7.99992V11.9999M1.3335 3.99992V19.9999C1.3335 20.7072 1.61445 21.3854 2.11454 21.8855C2.61464 22.3856 3.29292 22.6666 4.00016 22.6666H20.0002C20.3538 22.6666 20.6929 22.5261 20.943 22.2761C21.193 22.026 21.3335 21.6869 21.3335 21.3333V17.3333" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22.6665 12V17.3333H17.3332C16.6259 17.3333 15.9477 17.0524 15.4476 16.5523C14.9475 16.0522 14.6665 15.3739 14.6665 14.6667C14.6665 13.9594 14.9475 13.2811 15.4476 12.781C15.9477 12.281 16.6259 12 17.3332 12H22.6665Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <div class="title">{{fNum2(Number(totalPoolFiatValue), FNumFormats.fiat)}}</div>
                <div>Total value</div>
              </div>
            </div>

          </div>
          <div class="flex justify-center items-center ">
            <div class="flex py-5">
              <div class="mr-4 mt-3">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.3332 9.00024C22.0151 9.00024 24.9998 7.20938 24.9998 5.00024C24.9998 2.79111 22.0151 1.00024 18.3332 1.00024C14.6513 1.00024 11.6665 2.79111 11.6665 5.00024C11.6665 7.20938 14.6513 9.00024 18.3332 9.00024Z" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.6665 5.00024V10.3336C11.6665 12.5429 14.6518 14.3336 18.3332 14.3336C22.0145 14.3336 24.9998 12.5429 24.9998 10.3336V5.00024" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.6665 10.3337V15.6671C11.6665 17.8764 14.6518 19.6671 18.3332 19.6671C22.0145 19.6671 24.9998 17.8764 24.9998 15.6671V10.3337" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.6665 15.667V21.0003C11.6665 23.2097 14.6518 25.0003 18.3332 25.0003C22.0145 25.0003 24.9998 23.2097 24.9998 21.0003V15.667" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.33333 9.00024H3C2.46957 9.00024 1.96086 9.21096 1.58579 9.58603C1.21071 9.9611 1 10.4698 1 11.0002C1 11.5307 1.21071 12.0394 1.58579 12.4145C1.96086 12.7895 2.46957 13.0002 3 13.0002H4.33333C4.86377 13.0002 5.37247 13.211 5.74755 13.586C6.12262 13.9611 6.33333 14.4698 6.33333 15.0002C6.33333 15.5307 6.12262 16.0394 5.74755 16.4145C5.37247 16.7895 4.86377 17.0002 4.33333 17.0002H1" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.6665 17.0003V18.3337M3.6665 7.66699V9.00033" stroke="#BDB2DD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <div class="title claim-amount">{{totalClaims.toLocaleString('en-US') }}</div>
                <div>Total Rewards</div>
              </div>
            </div>
          </div>
        </div>
        <div  class="break" v-if="isMobile"></div>
        <div class="pools flex flex-1" >
            <div class="grid-table" v-if="claims.length>0" :class="{ 'mobile':isMobile}">
              <div class="pool-header">
                <div class="h-4 ">My positions</div>
                <div class="h-4" v-if="isDesktop">Tokens</div>
                <div class="h-4" v-if="isDesktop">$ Tokens value</div>
                <div class="h-4">To claim</div>
                <div class="h-4"></div>
              </div>
              <!-- div>To Claim</div -->

              <div class="border" :class="{'mobile':isMobile}"></div>

              <template 
                v-for="(claim, idx) in claims"
                :key="idx"  
              >
                <div
                  class="my-[18px] flex w-full items-center pool-row"
                >
                <router-link
                  :to="getRooterLink(claim)"
                  class="flex w-full items-center"
                >
                    <BalAssetSet v-if="claim.pool!=undefined"
                        :size="36"
                        :addresses="iconAddresses(claim)"
                        :width="100"
                        :backImage="communityAssetBackImg"
                    />
                    <img class="singlestake-logo" :src="getSingleStakeLogo(claim)"  v-if="claim.pool==undefined"/>
                    <TokenPills class="token-pill" v-if="claim.pool!=undefined" 
                      :tokens="orderedPoolTokens(claim.pool.poolType, claim.pool.address, claim.pool.tokens)"
                      :isStablePool="false"
                      :selectedTokens="[]"
                      :showWeight="false"
                    />
                    
                </router-link>
                  <div class="flex items-center self-center"  v-if="isDesktop" >
                    {{claim.stakedBalance}}
                  </div>
                  <div class="flex items-center self-center"  v-if="isDesktop">
                    <MyPoolInvsetmentFiat :pool="claim.pool" :tokens="claim.stakedBalance" ref="poolTotalFiatValues"/>
                  </div>
                  <div class="flex items-center self-center claim-amount">
                    {{claim.xpolarToClaim }}
                  </div>
                  <div  class="flex items-center self-center">
                    <button class="claim-btn flex items-center" @click="claimXpolar(claim)">
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
            <div class="text-center w-full mt-5" v-else="">
              Loading...
            </div>
        </div>  
    </div>
  </div>
</template>
  
  <style scoped>

  .claim-container{
    background-color: #292043;;
    border-radius: 32px;
    min-height: 0px;
    overflow: hidden;
  }
  .stats{
    min-width: 300px;
    color:rgba(189, 178, 221, 1);
  }
  .stats > div:first-child{
    background-color: #41365E;
  }
  .stats > div:last-child{
    background-color: #50456E;
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
  width: 100%;
  color: rgba(253, 253, 253, 1);
  grid-template-columns: 50% auto;
}
.grid-table.mobile{
  grid-template-columns: 1fr 1fr 1fr;
}
.grid-table .border{
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
.border{
  grid-column: 1 / span 5;
}
.border.mobile{
  grid-column: 1 / span 3;
}
.claim-btn:hover{
 
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
}
.title{
  font-weight: 600;
  font-size: 32px;
  color: #FDFDFD;
}
.claim-amount{
  color: #0CE6B5;
}
.break{
  flex-basis: 100%;
  height: 0;
}
 </style>