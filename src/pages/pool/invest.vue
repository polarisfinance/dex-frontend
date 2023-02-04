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
import questionIcon from './questionIcon.vue';
import StakeView from './Stake.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';


const steps = [
  {
  "step":1,
  "headline":"Swap tokens to create an LP and profit on swap fees"
  },
  {
  "step":2,
  "headline":"Preview your investment"
  },
  {
  "step":3,
  "headline":"Approve pool for investing"
  },
  {
  "step":4,
  "headline":"Swap3 tokens to create an LP and profit on swap fees"
  },
  {
  "step":5,
  "headline":"Swap3 tokens to create an LP and profit on swap fees"
  },
];


export default defineComponent({
  components: {
    PoolUserStats,
    InvestForm,
    InvestPreviewModal,
    questionIcon,
    ArrowLeftIcon,
    CloseIcon,
    StakeView,
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
    };
  },
  async mounted() {
    if(this.isWalletReady && this.activeStep==1){
        this.activeStep=2;
    }
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
        this.activeStep = step;
    },
    handleLPPreview(){
       this.activeStep = this.activeStep+1;     //THIS WILL BE OK. TESTING BELOW

       
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
      const approvedPool = false;
      if(approvedPool){
        this.activeStep = this.activeStep+2;
      }else{
        this.activeStep = this.activeStep+1;
      }
    },
    handleStakeConfirmed(){
      this.$router.push({ name: 'pool', params: { id: this.pool?.id }});
    },
    progressPerc(){
      if(this.activeStep==1){
          return 0.2;
      }
      if(this.activeStep==steps.length){
        return 0.9;
      }

      return 1/steps.length *(this.activeStep);
    },
    goBack(){
      this.activeStep = this.activeStep-1;
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
          this.activeStep = this.activeStep+1;
        },
        onTxFailed: () => {
          this.activeStep = this.activeStep+1;                                                    //IF POOL APPROVAL WAS REJECTED 
        },
      });
    },
    
  },

  emits: [],
});
</script>
<template>
    <div class="pb-16">

    <div>
        <!-- <InvestHero :step="getActiveStep(activeStep).step" :headline="getActiveStep(activeStep).headline"/> -->
        <div class="container mx-auto">
          <div class=" mt-[40px] w-full items-center self-center">
            <div class="steps flex justify-between ">
                <button @click="setActiveStep(1)"><questionIcon class="inline"/>Connect wallet</button>
                <button @click="setActiveStep(2)"><questionIcon class="inline"/>Create LP</button>
                <button @click="setActiveStep(3)"><questionIcon class="inline"/>Preview & confirmation</button>
                <button @click="setActiveStep(4)"><questionIcon class="inline"/>Approve staking</button>  
                <button @click="setActiveStep(5)"><questionIcon class="inline"/>Stake LP</button>
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
          <div class="flex flex-col">
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
                            Approving pool. Info what it is about.
                          </template>
                          <template v-if="activeStep==5">
                            <StakeView :balance="balanceFor(pool?.address!)" :token="``" :address="pool?.address" @stakeConfirmed="handleStakeConfirmed"/>
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
</style>