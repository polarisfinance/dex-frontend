<script lang="ts">

import {ref, defineComponent,onBeforeMount} from 'vue';
import { useRoute } from 'vue-router';
import PoolUserStats from '@/components/contextual/pages/pool/PoolUserStats.vue';
import useWeb3 from '@/services/web3/useWeb3';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import useStake from '@/composables/PolarisFinance/useStake';
import useInvestState from '@/components/forms/pool_actions/InvestForm/composables/useInvestState';
import InvestForm from '@/components/forms/pool_actions/InvestForm/InvestForm.vue';
import TradeSettingsPopover, {
  TradeSettingsContext,
} from '@/components/popovers/TradeSettingsPopover.vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { usePool } from '@/composables/usePool';
import { forChange } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import { useReturnRoute } from '@/composables/useReturnRoute';
import InvestHero from '@/components/heros/InvestHero.vue';
import useEthers from '@/composables/useEthers';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';

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
];



const { pool, loadingPool, transfersAllowed } = usePoolTransfers();
const { isStablePhantomPool } = usePool(pool);
const {sor,sorReady} = useInvestState();
onBeforeMount(async () => {
  await forChange(loadingPool, false);

  if (pool.value && isStablePhantomPool.value) {
    // Initialise SOR for batch swap queries
    sorReady.value = await sor.fetchPools();
  } else {
    sorReady.value = true;
  }
});


export default defineComponent({
  components: {
  },
  props: {
  },
  setup(props, { emit }) {

    const { txListener } = useEthers();
    const { addTransaction } = useTransactions();
    const approveTxHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'approve for staking',
      });
    };
    const createLPTxHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'approve for staking',
      });
    };

    const { getProvider } = useWeb3();

    const route = useRoute();
    const id = ref<string>(route.params.id as string);
    const { account, connector, startConnectWithInjectedProvider } = useWeb3();
    const poolQuery = usePoolQuery(route.params.id as string);

    // const pool = computed(() => poolQuery.data.value);


    const { balance, isApproved, pendingShare } = useStake();
    const { getReturnRoute } = useReturnRoute();
    const { network } = configService;
    
    
    const { useNativeAsset } = usePoolTransfers();
    
    // const investMath = useInvestMath(
    //   pool,
    //   tokenAddresses,
    //   amounts,
    //   useNativeAsset,
    //   sor
    // );

    // const stepPerc = 1/steps.length *(this.activeStep-1);
    const stepPerc=0.3;
    const handleLPPreview = (event) => {
      alert();
    }

    return {
      stepPerc,
      pool,
      getReturnRoute,
      loadingPool,
      transfersAllowed,
      getProvider,
      approveTxHandler,
      txListener,
      sorReady,
      handleLPPreview,
      TradeSettingsContext,
      id,
      isStablePhantomPool,
      sor,
    };
  },
  onMounted(){

  },
  data() {
    return {
      pool: Object,
      activeStep:1,
    };
  },
  methods: {
    getActiveStep(){
      // return steps[this.activeStep];
    },
    async loadPool(){
      // await forChange(this.loadingPool, false);

      if (this.pool!=undefined && this.isStablePhantomPool) {
        // Initialise SOR for batch swap queries
        this.sorReady = await this.sor.fetchPools();
      } else {
        this.sorReady = true;
      }
    },
    async approve() {
      const { approve } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      const tx = await approve(poolAddress, this.getProvider());
      this.approveTxHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          // goToNextStep();
        },
        onTxFailed: () => {},
      });
    },
    
  },

  emits: [],
});
</script>
<template>
  <div class="pb-16">
    <div class="layout-header mb-12">
      <div />
      <router-link :to="getReturnRoute({ name: 'pool', params: { id } })">
        <BalIcon name="x" size="lg" />
      </router-link>
    </div>

    <div>
        <!-- <InvestHero :step="getActiveStep(activeStep).step" :headline="getActiveStep(activeStep).headline"/> -->
        <div class="container mx-auto">
          <div class=" mt-[40px] w-full items-center self-center">
            <div class="steps flex justify-between ">
              <div>Create LP</div>
              <div>Preview</div>
              <div>Approve pool</div>  
              <div>Stake LP</div>
              <div>Done</div>
            </div>
            <div class="progress-bar mt-[32px] h-[2px] rounded-[24px] w-full">
              <div
                  class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
                  :style="{ width: `${(stepPerc * 100).toFixed(0)}%` }"
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
        <div class="m-[24px] flex flex-1 flex-col justify-center max-w-[480px] mx-auto">
            <div class="nested-card mt-[16px]">
              <template v-if="activeStep==1">
                <BalLoadingBlock
                v-if="loadingPool || !transfersAllowed || !sorReady"
                class="h-96"
                />
                <BalCard  exposeOverflow noBorder noPad  v-else>
                <template #header>
                    <div class="w-full">
                    <div class="flex items-center justify-between">
                        <h4 class="title ml-[18px] mt-[10px]" >{{ $t('investInPool') }}</h4>
                        <TradeSettingsPopover :context="TradeSettingsContext.invest" />
                    </div>
                    </div>
                </template>
                <InvestForm :pool="pool" @submit="handleLPPreview"/>
                </BalCard>
              </template>
              <template v-if="activeStep==2">
                <!-- <InvestPreviewModal
                  :pool="pool"
                  :math="investMath"
                  :tokenAddresses="tokenAddresses"
                  @close="showInvestPreview = false"
                  @show-stake-modal="showStakeModal = true"
                /> -->
              </template>
              <template v-if="activeStep==3">
                <BalLoadingBlock
                v-if="loadingPool || !transfersAllowed || !sorReady"
                class="h-96"
                />
                <BalCard  exposeOverflow noBorder noPad  v-else>
                <template #header>
                    <div class="w-full">
                    <div class="flex items-center justify-between">
                        <h4 class="title ml-[18px] mt-[10px]" >{{ $t('investInPool') }}</h4>
                        <TradeSettingsPopover :context="TradeSettingsContext.invest" />
                    </div>
                    </div>
                </template>
                <InvestForm :pool="pool" />
                </BalCard>
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
</template>
<style scoped>
.layout-header {
  @apply h-16;
  @apply px-4 lg:px-6;
  @apply flex items-center justify-between;
}
.card {
  background-color: #292043;
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