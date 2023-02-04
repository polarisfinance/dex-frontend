<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

import useNumbers from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';

import { InvestMathResponse } from '../../composables/useInvestMath';
import useInvestState from '../../composables/useInvestState';
import InvestPreviewActions from './InvestPreviewActions.vue';
import InvestSummary from './InvestSummary.vue';
import TokenAmounts from '../InvestPreviewModal/components/TokenAmounts.vue';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  math: InvestMathResponse;
  tokenAddresses: string[];
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
  (e: 'showStakeModal'): void;
  (e: 'confirmInvestment'): void;
}>();

/**
 * STATE
 */
const investmentConfirmed = ref(false);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { getToken } = useTokens();
const { toFiat } = useNumbers();
const { fullAmounts, priceImpact, highPriceImpact, rektPriceImpact } = toRefs(
  props.math
);
const { resetAmounts } = useInvestState();

/**
 * COMPUTED
 */
const title = computed((): string =>
  investmentConfirmed.value
    ? t('investment.preview.titles.confirmed')
    : t('investment.preview.titles.default')
);

const amountMap = computed((): AmountMap => {
  const amountMap = {};
  fullAmounts.value.forEach((amount, i) => {
    amountMap[props.tokenAddresses[i]] = amount;
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
function onSuccess(): void {
  emit('confirmInvestment');
}
</script>

<template>
    <div class="content-container">
        <BalCard
        noPad
        noBorder
        >
        <div>
            <TokenAmounts
                :amountMap="amountMap"
                :tokenMap="tokenMap"
                :fiatAmountMap="fiatAmountMap"
                :fiatTotal="fiatTotal"
            />

            <InvestSummary
                :pool="pool"
                :fiatTotal="fiatTotal"
                :priceImpact="priceImpact"
                :highPriceImpact="highPriceImpact"
            />

            <BalAlert
                v-if="rektPriceImpact"
                type="error"
                :title="$t('investment.error.rektPriceImpact.title')"
                :description="$t('investment.error.rektPriceImpact.description')"
                class="mt-6 mb-2"
            />

            <InvestPreviewActions
                :pool="pool"
                :math="math"
                :tokenAddresses="tokenAddresses"
                :disabled="rektPriceImpact"
                @success="onSuccess"
                class="mt-4"
            />
        </div>
        </BalCard>
    </div>



    
</template>
