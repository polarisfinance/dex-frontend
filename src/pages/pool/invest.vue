<script lang="ts">
import {ref, defineComponent,computed,toRef,toRefs,reactive,onBeforeMount} from 'vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { isStableLike, isStablePhantom, usePool } from '@/composables/usePool';
import useInvestState from '@/components/forms/pool_actions/InvestForm/composables/useInvestState';
import { forChange } from '@/lib/utils';
import TradeSettingsPopover, {TradeSettingsContext,} from '@/components/popovers/TradeSettingsPopover.vue';
import PoolUserStats from '@/components/contextual/pages/pool/PoolUserStats.vue';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { useRoute } from 'vue-router';
import InvestForm from '@/components/forms/pool_actions/InvestForm/InvestForm.vue';
import InvestPreviewModal from '@/components/forms/pool_actions/InvestForm/components/InvestPreviewModal/InvestPreviewModal.vue';
import useWeb3 from '@/services/web3/useWeb3';

import questionIcon from './questionIcon.vue';

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

    
    const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =useWeb3();

    
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
        transfersAllowed,
        sorReady,
        sor,
        pool,
        TradeSettingsContext,
        isStablePhantomPool,
        loadingPool,
        investmentTokens,
        isWalletReady,
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

  },
  onBeforeMount(){
    
    
  },
  updated() {
  },
  data() {
    return {
        activeStep:1,
        tokenAddresses:[]  as string[],
    };
  },
  methods: {
    setActiveStep(step){
        this.activeStep = step;
    },
    handleLPPreview(){
        this.activeStep = this.activeStep+1;
    },
    progressPerc(){
        if(this.activeStep==1)
            return 0.2;

        return 1/steps.length *(this.activeStep);
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
        <div class="stats">
            <h3>My pool balance</h3>
            <div class="break"></div>
            <BalLoadingBlock
                v-if="loadingPool || !transfersAllowed || !sorReady"
                class="h-96"
                />
            <PoolUserStats v-else :pool="pool" :xpolarToClaim="`0`" :dailyAPR="`1`" :stakedBalance="`0`" /> 
        </div>
        <div class=" flex-1 justify-center">
            <div class="header flex">
                <div class="flex-1">
                    Go Back
                </div>
                <div class="flex-1 title">
                    Invest in pool
                </div>
                <div class="flex-1">
                    Exit
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
                            <InvestForm :pool="pool" @submit="handleLPPreview" ref="investForm"/>
                            </BalCard>
                        </template>
                        <template v-if="activeStep==3">

                        </template>
                        <template v-if="activeStep==4">
                            <!-- <div class="p-[12px]">
                            <div class="header px-[12px]">
                                <div v-if="depositBol" class="title text-white">Stake {{ token }}</div>
                                <div v-else class="title text-white">Unstake {{ token }}</div>
                                <X class="pt-[4px]" v-on:click="$emit('close')" />
                            </div>
                            <div class="grid justify-items-start pt-[24px]">
                                <span
                                class="pl-[12px] text-[14px] font-medium leading-[18px] text-pink-third"
                                >Available: {{ balance }}</span
                                >
                                <div
                                class="input-container mt-[8px] flex w-full justify-between rounded-[16px] bg-[#2E2433] p-[12px]"
                                >
                                <button
                                    class="button-style my-[1.5px] rounded-[10px] px-[12px] py-[4px] font-semibold leading-[20px] text-white"
                                    @click="maxBalance"
                                >
                                    MAX
                                </button>
                                <input
                                    ref="textInput"
                                    placeholder="0.0"
                                    class="bg-transparent text-right text-[24px] font-medium leading-[31px]"
                                    v-model="inputValue"
                                />
                                </div>
                                <button
                                class="button-style mt-[12px] h-[44px] w-full rounded-[16px] text-white"
                                @click="depositBol ? deposit(inputValue) : withdraw(inputValue)"
                                >
                                Confirm
                                </button>
                            </div>
                            </div> -->
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
.header{
    background: #292043;
    padding:12px 24px;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    color: #BDB2DD;
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
  background-color: #41365e;
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
</style>