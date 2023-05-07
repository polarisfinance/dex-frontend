<script lang="ts">
import { ref, defineComponent, computed, toRef, toRefs, reactive } from 'vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import {
  isStableLike,
  isStablePhantom,
  usePoolHelpers,
} from '@/composables/usePoolHelpers';
import useInvestState from '@/components/forms/pool_actions/InvestForm/composables/useInvestState';
import { forChange } from '@/lib/utils';
// import TradeSettingsPopover, {
//   TradeSettingsContext,
// } from '@/components/popovers/TradeSettingsPopover.vue';
// import PoolUserStats from '@/components/contextual/pages/pool/PoolUserStats.vue';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { useRoute, useRouter } from 'vue-router';
import InvestForm from '@/components/forms/pool_actions/InvestForm/InvestForm.vue';
import InvestPreviewModal from '@/components/forms/pool_actions/InvestForm/components/InvestPreviewModal/InvestPreviewModal.vue';
import useWeb3 from '@/services/web3/useWeb3';
import ArrowLeftIcon from '@/components/_global/icons/polaris/ArrowLeftIcon.vue';
import CloseIcon from '@/components/_global/icons/polaris/CloseIcon.vue';
import StakeView from './Stake.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import { TransactionResponse } from '@ethersproject/providers';
import useTransactions from '@/composables/useTransactions';
import useEthers from '@/composables/useEthers';
import useTokens from '@/composables/useTokens';
import useBreakpoints from '@/composables/useBreakpoints';
import InvestPage from '@/components/contextual/pages/pool/invest/InvestPage.vue';
import { providePoolStaking } from '@/providers/local/pool-staking.provider';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import StakePreview, { StakeAction } from './StakePreview.vue';
import { trackLoading } from '@/lib/utils';
import useTokenApprovalActions from '@/composables/approvals/useTokenApprovalActions';
import useTokenApprovals, {
  ApprovalStateMap,
} from '@/composables/approvals/useTokenApprovals';
import { ApprovalAction } from '@/composables/approvals/types';

import steps from '@/components/contextual/pages/pool/invest/ProcessSteps.json';

export default defineComponent({
  components: {
    // PoolUserStats,
    InvestForm,
    InvestPreviewModal,
    StakeView,
    InvestPage,
    StakePreview,
  },
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
  emits: ['active-step-updated'],
  setup(props, { emit }) {
    const { isMobile, isDesktop } = useBreakpoints();

    const route = useRoute();
    const id = (route.params.id as string).toLowerCase();
    providePoolStaking(id);

    const { transfersAllowed } = usePoolTransfers();
    // const poolQuery = usePoolQuery(route.params.id as string);
    // const pool = computed(() => poolQuery.data.value);
    const poolQuery = usePoolQuery(id, undefined, undefined);
    const pool = computed(() => poolQuery.data.value);

    const { isStablePhantomPool } = usePoolHelpers(pool);
    const { tokenAddresses, amounts, sor, sorReady } = useInvestState();

    const {
      account,
      isWalletReady,
      getProvider,
      startConnectWithInjectedProvider,
      isMismatchedNetwork,
    } = useWeb3();
    const { balanceFor } = useTokens();

    const { addTransaction } = useTransactions();

    const investmentTokens = computed((): string[] => {
      if (isStablePhantom(pool.value!.poolType)) {
        return pool.value!.mainTokens || [];
      }
      return pool.value!.tokensList;
    });

    const poolQueryLoading = computed(
      () => poolQuery.isLoading.value || Boolean(poolQuery.error.value)
    );
    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    return {
      id,
      account,
      transfersAllowed,
      sorReady,
      sor,
      pool,
      // TradeSettingsContext,
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
  data() {
    return {
      activeStep: this.$props.step,
      tokenAddresses: [] as string[],
      poolApproved: false,
      stakedBalance: '0',
    };
  },
  watch: {
    isWalletReady(newValue, oldValue) {
      if (newValue == true) this.activeStep = 2;
    },
    async account() {
      const { isApproved } = useStake();
      this.poolApproved = await isApproved(this.pool?.address!, this.account);
      if (this.activeStep == 4) {
        this.activeStep = 5;
      }
    },
    async pool() {
      const { isApproved } = useStake();
      this.poolApproved = await isApproved(this.pool?.address!, this.account);
      if (this.activeStep == 4) {
        this.activeStep = 5;
      }
    },
  },
  async mounted() {
    if (this.pool != undefined && this.isStablePhantomPool) {
      // Initialise SOR for batch swap queries
      this.sorReady = await this.sor.fetchPools();
    } else {
      this.sorReady = true;
    }
    const { balance, isApproved } = useStake();
    const { setCurrentPool } = usePoolStaking();

    setCurrentPool(this.id);
    // const approval = await isApproved(this.pool?.address!, this.account);
    // this.poolApproved = approval;
    // this.stakedBalance = await balance(this.pool?.address!, this.account);
  },
  beforeMount() {
    if (this.isWalletReady && this.activeStep == 1) {
      this.setActiveStep(2);
    }
  },
  updated() {},
  methods: {
    setActiveStep(step) {
      if (this.poolApproved == true && step == 4) {
        this.activeStep = step + 1;
      } else if (step <= steps.length) this.activeStep = step;

      this.$emit('active-step-updated', this.activeStep);
    },
    clickActiveStep(step) {
      if (step != steps.length) this.setActiveStep(step);
    },
    handleLPPreview() {
      this.setActiveStep(this.activeStep + 1); //THIS WILL BE OK. TESTING BELOW

      // this.handleStakeConfirmed();
      // this.activeStep = 3;
      // if(this.poolApproved){
      //   this.activeStep = this.activeStep+2;
      // }else{
      //   this.approvePool();
      //   this.activeStep = this.activeStep+1;
      // }
    },
    handleInvestConfirm() {
      // const poolApproved = false;      //TESTING
      if (this.poolApproved) {
        this.setActiveStep(this.activeStep + 2);
      } else {
        this.setActiveStep(this.activeStep + 1);
        // this.approvePool();
      }
    },
    handleStakeConfirmed() {
      this.setActiveStep(this.activeStep + 1);
      //this.$router.push({ name: 'pool', params: { id: this.pool?.id }});
    },
    approvePool() {},
  },
});
</script>
<template>
  <template v-if="activeStep <= 3">
    <BalLoadingBlock v-if="loadingPool || !pool" class="h-96" />
    <BalCard v-else exposeOverflow noBorder noPad>
      <template #header>
        <div class="w-full">
          <div class="flex justify-between items-center">
            <!-- <h4 class="title ml-[18px] mt-[10px]" >{{ $t('investInPool') }}</h4> -->
            <!-- <TradeSettingsPopover
                          :context="TradeSettingsContext.invest"
                        /> -->
          </div>
        </div>
      </template>
      <InvestForm
        ref="investForm"
        :pool="pool"
        :step="activeStep"
        @preview="handleLPPreview"
        @confirm-investment="handleInvestConfirm"
      />
    </BalCard>
  </template>
  <transition name="fade">
    <template v-if="activeStep == 4 && false">
      <div class="text-center finished">
        <h1>Pool staking approval</h1>
        <h3>Please, approve staking for this pool in your wallet!</h3>
        <button class="inline-block exit mt-[20px]" @click="approvePool">
          Approve staking
        </button>
      </div>
    </template>
  </transition>
  <transition name="fade">
    <template v-if="activeStep == 4 || activeStep == 5">
      <StakePreview
        :pool="pool"
        action="stake"
        @success="handleStakeConfirmed"
      />
    </template>
  </transition>
  <transition name="fade">
    <template v-if="activeStep == 6">
      <div class="text-center finished">
        <svg
          class="mx-auto mb-5 mt-[70px]"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M62.5 32C62.5 36.0053 61.7111 39.9714 60.1783 43.6718C58.6456 47.3723 56.3989 50.7346 53.5668 53.5668C50.7346 56.3989 47.3723 58.6456 43.6718 60.1783C39.9714 61.7111 36.0053 62.5 32 62.5C27.9947 62.5 24.0286 61.7111 20.3282 60.1783C16.6277 58.6456 13.2654 56.3989 10.4332 53.5668C7.60106 50.7346 5.35444 47.3723 3.82167 43.6718C2.28891 39.9714 1.5 36.0053 1.5 32C1.5 27.9947 2.28891 24.0286 3.82168 20.3282C5.35444 16.6277 7.60106 13.2654 10.4332 10.4332C13.2654 7.60105 16.6277 5.35444 20.3282 3.82167C24.0286 2.2889 27.9947 1.5 32 1.5C36.0053 1.5 39.9714 2.28891 43.6718 3.82168C47.3723 5.35444 50.7346 7.60106 53.5668 10.4332C56.3989 13.2654 58.6456 16.6277 60.1783 20.3282C61.7111 24.0286 62.5 27.9947 62.5 32L62.5 32Z"
            stroke="#BDB2DD"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path
            d="M32.5 20C32.1867 20 31.8984 20.1422 31.6602 20.4007L23.3384 28.9822C23.1002 29.2536 23 29.525 23 29.8223C23 30.4685 23.4511 30.9596 24.0778 30.9596C24.366 30.9596 24.6669 30.8433 24.8674 30.6365L27.7249 27.7544L31.5726 23.3861L31.372 26.5267V42.8626C31.372 43.5347 31.8483 44 32.5 44C33.1517 44 33.6155 43.5347 33.6155 42.8626V26.5267L33.4275 23.399L37.2751 27.7544L40.12 30.6365C40.3331 30.8563 40.6214 30.9596 40.9222 30.9596C41.5363 30.9596 42 30.4685 42 29.8223C42 29.525 41.8872 29.2407 41.624 28.9564L33.3397 20.4007C33.089 20.1422 32.8008 20 32.5 20Z"
            fill="#BDB2DD"
          />
        </svg>

        <h1>Good job!</h1>
        <h3>Now, you are earning!</h3>
        <router-link
          class="inline-block exit mt-[20px]"
          :to="{ name: 'pool', params: { id: id } }"
        >
          Return to pool
        </router-link>
      </div>
    </template>
  </transition>
</template>

<style scoped>
.layout-header {
  @apply h-16;
  @apply px-4 lg:px-6;
  @apply flex items-center justify-between;
}

.break {
  flex-basis: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgb(151 71 255 / 40%),
    rgb(59 68 189 / 40%)
  );
}

.finished h1 {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #fdfdfd;
}

.actions:hover {
  color: #fdfdfd;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  height: 0;
}

.fade-leave {
  height: 0;
}
</style>
