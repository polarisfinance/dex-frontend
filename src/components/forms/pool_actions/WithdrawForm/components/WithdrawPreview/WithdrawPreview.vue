<script setup lang="ts">
import { computed, ref, toRef, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

// Composables
import useNumbers from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';

import useWithdrawalState from '../../composables/useWithdrawalState';
// Types
import { WithdrawMathResponse } from '../../composables/useWithdrawMath';
import TokenAmounts from './components/TokenAmounts.vue';
import WithdrawActions from './components/WithdrawActions.vue';
// Components
import WithdrawSummary from './components/WithdrawSummary.vue';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  math: WithdrawMathResponse;
};

type AmountMap = {
  [address: string]: string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirmWithdraw'): void;
}>();

/**
 * STATE
 */
const withdrawalConfirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { getToken } = useTokens();
const { toFiat } = useNumbers();
const { fullAmounts, priceImpact, resetMath } = toRefs(props.math);
const { tokensOut, maxSlider } = useWithdrawalState(toRef(props, 'pool'));

/**
 * COMPUTED
 */
const title = computed((): string =>
  withdrawalConfirmed.value
    ? t('withdraw.preview.titles.confirmed')
    : t('withdraw.preview.titles.default')
);

const amountMap = computed((): AmountMap => {
  const amountMap = {};
  fullAmounts.value.forEach((amount, i) => {
    if (hasAmount(i)) amountMap[tokensOut.value[i]] = amount;
  });
  return amountMap;
});

const tokenMap = computed((): TokenInfoMap => {
  const tokenMap = {};
  Object.keys(amountMap.value).forEach(address => {
    tokenMap[address] = getToken(address);
  });
  return tokenMap;
});

const fiatAmountMap = computed((): AmountMap => {
  const fiatAmountMap = {};
  Object.keys(amountMap.value).forEach(address => {
    fiatAmountMap[address] = toFiat(amountMap.value[address], address);
  });
  return fiatAmountMap;
});

const fiatTotal = computed((): string =>
  Object.values(fiatAmountMap.value).reduce(
    (total, amount) => bnum(total).plus(amount).toString(),
    '0'
  )
);

/**
 * METHODS
 */
function hasAmount(index: number): boolean {
  return bnum(fullAmounts.value[index]).gt(0);
}

function handleClose(): void {
  if (withdrawalConfirmed.value) {
    resetMath.value();
    maxSlider();
  }
  emit('close');
}
</script>

<template>
  <div class="container">
    <TokenAmounts
      :amountMap="amountMap"
      :tokenMap="tokenMap"
      :fiatAmountMap="fiatAmountMap"
      :fiatTotal="fiatTotal"
    />
    <div class="light-back pt-[16px]">
      <WithdrawSummary
        :pool="pool"
        :fiatTotal="fiatTotal"
        :priceImpact="priceImpact"
      />

      <WithdrawActions
        :pool="pool"
        :math="math"
        class="mt-4"
        @success="emit('confirmWithdraw');"
      />
    </div>
  </div>
</template>

<style scoped>


.container{
  background:#41365E;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  overflow:hidden;
}
.light-back{
  background: #50456E;
}
</style>
