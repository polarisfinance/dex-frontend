<script lang="ts">
import {ref, defineComponent,computed,toRef,toRefs,reactive,onBeforeMount} from 'vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { isStableLike, isStablePhantom, usePool } from '@/composables/usePool';
import useInvestState from '@/components/forms/pool_actions/InvestForm/composables/useInvestState';
import { forChange } from '@/lib/utils';
import TradeSettingsPopover, {TradeSettingsContext,} from '@/components/popovers/TradeSettingsPopover.vue';
import PoolUserStats from '@/components/contextual/pages/pool/PoolUserStats.vue';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { useRoute, useRouter } from 'vue-router';
import InvestForm from '@/components/forms/pool_actions/InvestForm/InvestForm.vue';
import InvestPreviewModal from '@/components/forms/pool_actions/InvestForm/components/InvestPreviewModal/InvestPreviewModal.vue';
import useWeb3 from '@/services/web3/useWeb3';
import ArrowLeftIcon from '@/components/_global/icons/ArrowLeftIcon.vue';
import CloseIcon from '@/components/_global/icons/CloseIcon.vue';
import QuestionIcon from '../../components/_global/icons/QuestionIcon.vue';
import TickIcon from '../../components/_global/icons/TickIcon.vue';
import StakeView from './Stake.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';
import InvestHero from '@/components/heros/InvestHero.vue';
import useBreakpoints from '@/composables/useBreakpoints';


const steps = [
  {
  "step":1,
  "headline":"Connect your wallet to start earning",
  "button":"Connect wallet",
  },
  {
  "step":2,
  "headline":"Choose your token amounts to invest",
  "button":"Create LP",
  },
  {
  "step":3,
  "headline":"Preview your investment",
  "button":"Preview & confirmation",
  },
  {
  "step":4,
  "headline":"Approve staking of your invested LP tokens",
  "button":"Approve staking",
  },
  {
  "step":5,
  "headline":"Stake your liquidity pool tokens",
  "button":"Stake LP",
  },
  {
  "step":6,
  "headline":"Everything is set and done!",
  "button":"Done",
  },
];


export default defineComponent({
  components: {
    PoolUserStats,
    InvestForm,
    InvestPreviewModal,
    QuestionIcon,
    ArrowLeftIcon,
    CloseIcon,
    StakeView,
    TickIcon,
    InvestHero,
  },
  props: {
  },
  watch: {
    isWalletReady(newValue, oldValue) {
      if (newValue==true) 
        this.activeStep=2;
    }
  },
  setup(props, { emit }) {
    const { isMobile, isDesktop } = useBreakpoints();
    const {transfersAllowed } = usePoolTransfers();
    const route = useRoute();
    const id = ref<string>(route.params.id as string);

    const poolQuery = usePoolQuery(route.params.id as string);
    const pool = computed(() => poolQuery.data.value);
    const { isStablePhantomPool } = usePool(pool);
    const {tokenAddresses,amounts, sor,sorReady} = useInvestState();
    
    const { account,isWalletReady, getProvider,startConnectWithInjectedProvider, isMismatchedNetwork } =useWeb3();
    const { addTransaction } = useTransactions();
    const { balanceFor } = useTokens();

    const investmentTokens = computed((): string[] => {
        if (isStablePhantom(pool.value!.poolType)) {
            return pool.value!.mainTokens || [];
        }
        return pool.value!.tokensList;
    });
    
    const poolQueryLoading = computed(
      () =>
        poolQuery.isLoading.value ||
        poolQuery.isIdle.value ||
        Boolean(poolQuery.error.value)
    );
    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    
    return {
      account,
      transfersAllowed,
      sorReady,
      sor,
      pool,
      TradeSettingsContext,
      isStablePhantomPool,
      loadingPool,
      investmentTokens,
      isWalletReady,
      getProvider,
      addTransaction,
      balanceFor,
      steps,
      isDesktop,
      isMobile,
    };
  },
  async mounted() {
    
    if (this.pool!=undefined && this.isStablePhantomPool) {
        // Initialise SOR for batch swap queries
        this.sorReady = await this.sor.fetchPools();
    } else {
        this.sorReady = true;
    }
    const {isApproved} = useStake();
    const approval = await isApproved(this.pool?.address!, this.account);
    this.poolApproved = approval;

  },
  onBeforeMount(){
    if(this.isWalletReady && this.activeStep==1){
        this.activeStep=2;
    }
  },
  updated() {
  },
  data() {
    return {
        activeStep:1,
        tokenAddresses:[]  as string[],
        poolApproved: false,
        
    };
  },
  methods: {
    setActiveStep(step){
      alert(step+' vs '+steps.length);
      if(step!=steps.length)
        this.activeStep = step;
    },
    handleLPPreview(){
      this.setActiveStep(this.activeStep+1);     //THIS WILL BE OK. TESTING BELOW
       
      // this.handleStakeConfirmed();
      // this.activeStep = 3;
      // if(this.poolApproved){
      //   this.activeStep = this.activeStep+2;
      // }else{
      //   this.approvePool();
      //   this.activeStep = this.activeStep+1;
      // }
    },
    handleInvestConfirm(){
      // const poolApproved = false;      //TESTING
      if(this.poolApproved){
        this.setActiveStep(this.activeStep+2);
      }else{
        this.setActiveStep(this.activeStep+1);
        this.approvePool();
      }
    },
    handleStakeConfirmed(){
      this.setActiveStep(this.activeStep+1);
      //this.$router.push({ name: 'pool', params: { id: this.pool?.id }});
    },
    progressPerc(){
      if(this.activeStep==steps.length){
          return 1;
      }
      return (1/(steps.length-1) *(this.activeStep-1))+0.05;
    },
    goBack(){
      this.setActiveStep(this.activeStep-1);
    },
    async approvePool() {
      const { approve } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      const tx = await approve(poolAddress, this.getProvider());
      
      (tx: TransactionResponse): void => {
        this.addTransaction({
          id: tx.hash,
          type: 'tx',
          action: 'approve',
          summary: 'approve for staking',
        });
      };

      const { txListener } = useEthers();
      txListener(tx, {
        onTxConfirmed: () => {
          this.setActiveStep(this.activeStep+1);
        },
        onTxFailed: () => {
        },
      });
    },
    
  },

  emits: [],
});
</script>
<template>
    <div class="pb-16">
      <div class="fireworks" v-if="activeStep==steps.length">
        <div class="before" />
        <div class="after" />
      </div>
    <div>
        <InvestHero :step="activeStep" :headline="steps[activeStep-1].headline"/>
        <div class="container mx-auto">
          <div class=" mt-[40px] w-full items-center self-center">
            <div class="steps flex justify-between ">
              <template v-for="step in steps">
                <button @click="setActiveStep(step.step)">
                  <TickIcon v-if="step.step<activeStep || activeStep==steps.length" class="inline mr-1"/>
                  <QuestionIcon v-else class="inline mr-1"/>
                  
                  {{step.button}}</button>
              </template>
            </div>
            <div class="progress-bar mt-[32px] h-[2px] rounded-[24px] w-full">
                <div
                  class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
                  :style="{ width: `${(progressPerc() * 100).toFixed(0)}%` }"
              />
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
        <div class="card flex flex-wrap mt-[60px]">
          <div class="flex flex-col" v-if="isDesktop">
            <div class="stats-header flex-none">
              <div>
                <h3>My pool balance</h3>
              </div>
            </div>
            <div class="stats flex-1">
                <BalLoadingBlock
                    v-if="loadingPool || !transfersAllowed || !sorReady"
                    class="h-96"
                    />
                <PoolUserStats v-else :pool="pool" :xpolarToClaim="`0`" :dailyAPR="`1`" :stakedBalance="`0`" /> 
            </div>
          </div>
          <div class=" flex-1 justify-center">
              <div class="header flex">
                  <div class="flex-1">
                    <button class="back" @click="goBack">
                      <template v-if="activeStep<5"><ArrowLeftIcon class="ml-3 mr-[12px] inline" />Go back</template>
                    </button>
                    
                  </div>
                  <div class="flex-1 title text-center">
                      Invest in pool
                  </div>
                  <div class="flex-1 text-right">
                    <router-link
                      :to="{ name: 'pool', params: { id: pool?.id } }"
                      >
                      Exit <CloseIcon class="inline ml-[12px]"/>
                    </router-link>
                  </div>
              </div>
              <div class="m-[24px] nested-card mt-[16px] max-w-[480px] mx-auto">
                  <div class="nested-card mt-[16px]">
                      <template v-if="activeStep<=3">
                          <BalLoadingBlock
                          v-if="loadingPool || !transfersAllowed || !sorReady"
                          class="h-96"
                          />
                          <BalCard  exposeOverflow noBorder noPad  v-else>
                          <template #header>
                              <div class="w-full">
                              <div class="flex items-center justify-between">
                                  <!-- <h4 class="title ml-[18px] mt-[10px]" >{{ $t('investInPool') }}</h4> -->
                                  <TradeSettingsPopover :context="TradeSettingsContext.invest" />
                              </div>
                              </div>
                          </template>
                          <InvestForm :pool="pool" :step="activeStep" @preview="handleLPPreview" @confirmInvestment="handleInvestConfirm" ref="investForm"/>
                          </BalCard>
                      </template>
                      <template v-if="activeStep==4">
                        <div class="text-center finished">
                          <h1 >Pool staking approval</h1>
                          <h3>Please, approve staking for this pool in your wallet!</h3>
                          <button class="exit inline-block mt-[20px]" @click="approvePool">Approve staking</button>
                        </div>
                      </template>
                      <template v-if="activeStep==5">
                        <StakeView :balance="balanceFor(pool?.address!)" :token="``" :address="pool?.address" @stakeConfirmed="handleStakeConfirmed"/>
                      </template>
                      <template v-if="activeStep==6">
                        <div class="text-center finished">
                          <svg class="mt-[70px] mb-5 mx-auto" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M62.5 32C62.5 36.0053 61.7111 39.9714 60.1783 43.6718C58.6456 47.3723 56.3989 50.7346 53.5668 53.5668C50.7346 56.3989 47.3723 58.6456 43.6718 60.1783C39.9714 61.7111 36.0053 62.5 32 62.5C27.9947 62.5 24.0286 61.7111 20.3282 60.1783C16.6277 58.6456 13.2654 56.3989 10.4332 53.5668C7.60106 50.7346 5.35444 47.3723 3.82167 43.6718C2.28891 39.9714 1.5 36.0053 1.5 32C1.5 27.9947 2.28891 24.0286 3.82168 20.3282C5.35444 16.6277 7.60106 13.2654 10.4332 10.4332C13.2654 7.60105 16.6277 5.35444 20.3282 3.82167C24.0286 2.2889 27.9947 1.5 32 1.5C36.0053 1.5 39.9714 2.28891 43.6718 3.82168C47.3723 5.35444 50.7346 7.60106 53.5668 10.4332C56.3989 13.2654 58.6456 16.6277 60.1783 20.3282C61.7111 24.0286 62.5 27.9947 62.5 32L62.5 32Z" stroke="#BDB2DD" stroke-width="3" stroke-linecap="round"/>
                          <path d="M32.5 20C32.1867 20 31.8984 20.1422 31.6602 20.4007L23.3384 28.9822C23.1002 29.2536 23 29.525 23 29.8223C23 30.4685 23.4511 30.9596 24.0778 30.9596C24.366 30.9596 24.6669 30.8433 24.8674 30.6365L27.7249 27.7544L31.5726 23.3861L31.372 26.5267V42.8626C31.372 43.5347 31.8483 44 32.5 44C33.1517 44 33.6155 43.5347 33.6155 42.8626V26.5267L33.4275 23.399L37.2751 27.7544L40.12 30.6365C40.3331 30.8563 40.6214 30.9596 40.9222 30.9596C41.5363 30.9596 42 30.4685 42 29.8223C42 29.525 41.8872 29.2407 41.624 28.9564L33.3397 20.4007C33.089 20.1422 32.8008 20 32.5 20Z" fill="#BDB2DD"/>
                          </svg>

                          <h1 >Good job!</h1>
                          <h3>Now, you are earning!</h3>
                          <router-link class="exit inline-block mt-[20px]"
                            :to="{ name: 'pool', params: { id: pool?.id } }"
                            >
                            Return to pool
                          </router-link>
                        </div>
                      </template>
                      
                  </div>
              </div>
          </div>
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

.back, .header{
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #BDB2DD;
}
.header{
    background: #292043;
    padding:12px 24px;
    
    border-bottom-right-radius: 32px;
}
.header .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #FDFDFD;
}
.card {
  background-color: #1D0D33;
  border-radius: 32px;
  min-height: 0px;
  overflow: hidden;
}
.stats {
  min-width: 300px;
  background-color: #34264E;
  padding: 24px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}
h3 {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #fdfdfd;
  padding-bottom: 16px;
}
.break {
  flex-basis: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(151, 71, 255, 0.4),
    rgba(59, 68, 189, 0.4)
  );
}
.progress-bar {
  background: #41365e;
  position: relative;
  margin-bottom: 10px;
}
.stats-header{
  background: #292043;
  
}
.stats-header div{
  background: #34264F;
  border-top-right-radius: 32px;
}
.stats-header h3{
  background: #41365E;
  border-radius: 32px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #BDB2DD;

}
.exit{
  padding: 6px 50px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgba(41, 32, 67, 1),rgba(41, 32, 67, 1)) padding-box,
  linear-gradient(90deg,rgba(192, 4, 254, 1), rgba(126, 2, 245, 1)) border-box;
  border: 1px solid transparent;
}
.finished h1{
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;
}
</style>