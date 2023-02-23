<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, toRef, watch } from 'vue';
// Composables
import { useI18n } from 'vue-i18n';

import WrapStEthLink from '@/components/contextual/pages/pool/invest/WrapStEthLink.vue';
import StakePreviewModal from '@/components/contextual/stake/StakePreviewModal.vue';
// Components
import TokenInput from '@/components/inputs/TokenInput/TokenInput.vue';
import usePoolTransfers from '@/composables/contextual/pool-transfers/usePoolTransfers';
import { isStableLike, isStablePhantom, usePool } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { LOW_LIQUIDITY_THRESHOLD } from '@/constants/poolLiquidity';
import { bnum, findByAddress, isSameAddress } from '@/lib/utils';
import { isRequired } from '@/lib/utils/validations';
import StakingProvider from '@/providers/local/staking/staking.provider';
// Types
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import InvestFormTotals from './components/InvestFormTotals.vue';
import InvestPreviewModal from './components/InvestPreviewModal/InvestPreviewModal.vue';
import InvestPreview from './components/InvestPreview/InvestPreview.vue';
import useInvestMath from './composables/useInvestMath';
import useInvestState from './composables/useInvestState';
import { array } from 'prop-types';

/**
 * TYPES
 */
enum NativeAsset {
  wrapped = 'wrapped',
  unwrapped = 'unwrapped',
}

type Props = {
  pool: Pool;
  step:number;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emits = defineEmits(['preview','confirmInvestment']);

/**
 * STATE
 */
// const showInvestPreview = ref(false);
const showStakeModal = ref(false);
/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { balanceFor, nativeAsset, wrappedNativeAsset } = useTokens();
const { useNativeAsset } = usePoolTransfers();
const {
  tokenAddresses,
  amounts,
  validInputs,
  highPriceImpactAccepted,
  resetAmounts,
  sor,
} = useInvestState();

const investMath = useInvestMath(
  toRef(props, 'pool'),
  tokenAddresses,
  amounts,
  useNativeAsset,
  sor
);

const {
  fiatTotal,
  hasAmounts,
  highPriceImpact,
  maximizeAmounts,
  optimizeAmounts,
  proportionalAmounts,
  batchSwapLoading,
} = investMath;

let maxInvestTotal="0";


const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();

const { managedPoolWithTradingHalted, isWethPool, isStableLikePool } = usePool(
  toRef(props, 'pool')
);

/**
 * COMPUTED
 */
const hasValidInputs = computed(
  (): boolean =>
    validInputs.value.every(validInput => validInput === true) &&
    hasAcceptedHighPriceImpact.value
);

const getMaxInvestTotal = computed(
  (): string => maxInvestTotal
);

const hasAcceptedHighPriceImpact = computed((): boolean =>
  highPriceImpact.value ? highPriceImpactAccepted.value : true
);

const forceProportionalInputs = computed(
  (): boolean => managedPoolWithTradingHalted.value
);

const poolHasLowLiquidity = computed((): boolean =>
  bnum(props.pool.totalLiquidity).lt(LOW_LIQUIDITY_THRESHOLD)
);

const investmentTokens = computed((): string[] => {
  if (isStablePhantom(props.pool.poolType)) {
    return props.pool.mainTokens || [];
  }
  return props.pool.tokensList;
});

/**
 * METHODS
 */
function handleAmountChange(value: string, index: number): void {
  amounts.value[index] = value;
  // console.log(amounts);
  nextTick(() => {
    if (forceProportionalInputs.value) {
      amounts.value = [...proportionalAmounts.value];
    }
  });
}

function handleAddressChange(newAddress: string): void {
  useNativeAsset.value = isSameAddress(newAddress, nativeAsset.address);
}

function tokenWeight(address: string): number {
  if (isStableLike(props.pool.poolType)) return 0;
  if (!props.pool?.onchain?.tokens) return 0;

  if (isSameAddress(address, nativeAsset.address)) {
    return (
      findByAddress(props.pool.onchain.tokens, wrappedNativeAsset.value.address)
        ?.weight || 1
    );
  }

  return findByAddress(props.pool.onchain.tokens, address)?.weight || 1;
}

function propAmountFor(index: number): string {
  if (isStableLikePool.value) return '0.0';

  return bnum(proportionalAmounts.value[index]).gt(0)
    ? proportionalAmounts.value[index]
    : '0.0';
}
function hint(index: number): string {
  return bnum(propAmountFor(index)).gt(0) ? t('proportionalSuggestion') : '';
}

function tokenOptions(index: number): string[] {
  return isSameAddress(
    props.pool.tokensList[index],
    wrappedNativeAsset.value.address
  )
    ? [wrappedNativeAsset.value.address, nativeAsset.address]
    : [];
}

// If ETH has a higher balance than WETH then use it for the input.
function setNativeAssetByBalance(): void {
  const nativeAssetBalance = balanceFor(nativeAsset.address);
  const wrappedNativeAssetBalance = balanceFor(
    wrappedNativeAsset.value.address
  );

  if (bnum(nativeAssetBalance).gt(wrappedNativeAssetBalance)) {
    setNativeAsset(NativeAsset.unwrapped);
    useNativeAsset.value = true;
  }
}

function setNativeAsset(to: NativeAsset): void {
  const fromAddress =
    to === NativeAsset.wrapped
      ? nativeAsset.address
      : wrappedNativeAsset.value.address;
  const toAddress =
    to === NativeAsset.wrapped
      ? wrappedNativeAsset.value.address
      : nativeAsset.address;

  const indexOfAsset = tokenAddresses.value.indexOf(fromAddress);

  if (indexOfAsset >= 0) {
    tokenAddresses.value[indexOfAsset] = toAddress;
  }
}

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  maximizeAmounts();
  maxInvestTotal = fiatTotal.value;
  resetAmounts();
  
  tokenAddresses.value = [...investmentTokens.value];
  if (isWethPool.value) setNativeAssetByBalance();
});
onMounted(()=>{
  
});

/**
 * METHODS
 */
 function onConfirmInvestment(): void {
  emits('confirmInvestment');
}

/**
 * WATCHERS
 */
watch(useNativeAsset, shouldUseNativeAsset => {
  if (shouldUseNativeAsset) {
    setNativeAsset(NativeAsset.unwrapped);
  } else {
    setNativeAsset(NativeAsset.wrapped);
  }
});
</script>

<template>
  <div class="grid">
  <transition name="fade" >
    <div v-if="props.step==3" class="preview">
      <StakingProvider :poolAddress="pool.address" >
          <InvestPreview  class="preview"
            :pool="pool"
            :math="investMath"
            :tokenAddresses="tokenAddresses"
            @confirmInvestment="onConfirmInvestment"
          />
      </StakingProvider>
    </div>
  </Transition>
  <transition name="fade">
    <div v-if="props.step<=2" class="invest">
      <BalAlert
        v-if="forceProportionalInputs"
        type="warning"
        :title="$t('investment.warning.managedPoolTradingHalted.title')"
        :description="
          $t('investment.warning.managedPoolTradingHalted.description')
        "
        class="mb-4"
      />

      <BalAlert
        v-if="poolHasLowLiquidity"
        type="warning"
        :title="$t('investment.warning.lowLiquidity.title')"
        :description="$t('investment.warning.lowLiquidity.description')"
        class="mb-4"
      />
      <div class="tokens mx-[12px] ">
      <TokenInput
        v-for="(n, i) in tokenAddresses.length"
        :key="i"
        v-model:address="tokenAddresses[i]"
        v-model:amount="amounts[i]"
        v-model:isValid="validInputs[i]"
        :name="tokenAddresses[i]"
        :weight="tokenWeight(tokenAddresses[i])"
        :hintAmount="propAmountFor(i)"
        :hint="hint(i)"
        class="mb-1"
        fixedToken
        :options="tokenOptions(i)"
        @update:amount="handleAmountChange($event, i)"
        @update:address="handleAddressChange($event)"
      />
      </div>
      <div class="footer">
        <InvestFormTotals
          :math="investMath"
          :maxFiatValue="getMaxInvestTotal"
          @maximize="maximizeAmounts"
          @optimize="optimizeAmounts"
        />

        <div
          v-if="highPriceImpact"
          class="mt-4 px-6"
        >
          <BalCheckbox
            v-model="highPriceImpactAccepted"
            :rules="[isRequired($t('priceImpactCheckbox'))]"
            name="highPriceImpactAccepted"
            size="sm"
            :label="$t('priceImpactAccept', [$t('depositing')])"
          />
        </div>

        <WrapStEthLink :pool="pool" class="mt-4" />

        <div class=" mx-[16px]">
          <button class="btn active w-full mb-[12px]"
            v-if="!isWalletReady"
            @click="startConnectWithInjectedProvider"
            >{{ $t('connectWallet') }}
          </button>

          <button class="btn active w-full mb-[12px]"
            v-else
            @click=" emits('preview')"
            :disabled="
              !hasAmounts ||
              !hasValidInputs ||
              isMismatchedNetwork ||
              batchSwapLoading
            "
            >{{ $t('preview')}}
          </button>

        </div>
      </div>

      <!-- <StakingProvider :poolAddress="pool.address">
        <teleport to="#modal">
          <InvestPreviewModal
            v-if="showInvestPreview"
            :pool="pool"
            :math="investMath"
            :tokenAddresses="tokenAddresses"
            @close="showInvestPreview = false"
            @show-stake-modal="showStakeModal = true"
          />
          <StakePreviewModal
            :pool="pool"
            :isVisible="showStakeModal"
            action="stake"
            @close="showStakeModal = false"
          />
        </teleport>
      </StakingProvider> -->
    </div>
  </Transition>
</div>
</template>
<style scoped>
.tokens{

}
.footer{
  background-color: #50456E;
}
.btn{
  border-radius: 12px;
  padding:10px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
}
.btn.active{
  background: linear-gradient(92.92deg, #C004FE 4.85%, #7E02F5 95.15%);
  color: #FDFDFD;
}
.btn.inactive{
  background:#41365E;
}

.invest, .preview{
  grid-area: 1 / 1 / 2 / 2;
}
.preview{
  width: 100%!important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0; height: 0px;
}
.fade-leave{
  height: 0px;
}
</style>