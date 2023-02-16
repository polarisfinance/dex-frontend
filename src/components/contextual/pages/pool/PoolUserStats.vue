<script lang="ts">
import { computed, defineComponent, PropType, toRef, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel, usePool } from '@/composables/usePool';
import { APR_THRESHOLD } from '@/constants/pools';
import { Pool } from '@/services/pool/types';
import { TransactionResponse } from '@ethersproject/providers';
import MyPoolInvsetmentFiat, {
  MyPollInvestmentFiatType,
} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import useWeb3 from '@/services/web3/useWeb3';
import { BigNumber } from 'ethers';
import useTransactions from '@/composables/useTransactions';
import { string } from 'prop-types';
import useEthers from '@/composables/useEthers';
import useBreakpoints from '@/composables/useBreakpoints';
import { shortenLabel } from '@/lib/utils';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import useTokens from '@/composables/useTokens';
import PoolCalculator from '@/services/pool/calculator/calculator.sevice';
import { bnum, isSameAddress } from '@/lib/utils';

export default defineComponent({
  data() {
    return {};
  },
  watch: {},
  components: {
    MyPoolInvsetmentFiat,
    BalAsset,
  },
  props: {
    pool: {
      type: Object as PropType<Pool>,
      default: null,
    },
    stakedBalance: {
      type: String,
      default: '',
    },
    xpolarToClaim: {
      type: String,
      default: '',
    },
    dailyAPR: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  methods: {},
  setup(props) {
    const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
    /**
     * COMPOSABLES
     */
    const { tokens, balances, balanceFor, getTokens } = useTokens();
    const { fNum2, toFiat } = useNumbers();
    const { isStableLikePool, isStablePhantomPool, isMigratablePool } = usePool(
      toRef(props, 'pool')
    );

    const unstakedTokens = computed((): string =>
      balanceFor(props.pool.address)
    );

    const totalTokens = computed((): string =>
      bnum(props.stakedBalance).plus(unstakedTokens.value).toString()
    );

    function symbolFor(address: string) {
      if (!props.pool) return '-';
      const symbol = props.pool?.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }

    // const walletFreeTokens = computed(() =>
    //   tokenAddresses.value
    //     .map((address, i) => propTokenAmounts.value[i], address)
    //     .reduce((total, value) => bnum(total).plus(value).toString())
    // );
    const xpolarToClaim = computed(() => props.xpolarToClaim);

    /**
     * COMPUTED
     */

    const tokenAddresses = computed((): string[] => {
      if (isStablePhantomPool.value) {
        // We're using mainToken balances for StablePhantom pools
        // so return mainTokens here so that fiat values are correct.
        return props.pool.mainTokens || [];
      }
      return props.pool.tokensList;
    });

    /*
     * PoolBalances
     */

    const { isWalletReady } = useWeb3();

    const poolCalculator = new PoolCalculator(
      toRef(props, 'pool'),
      tokens,
      balances,
      'exit',
      ref(false)
    );
    const bptBalance = computed((): string => balanceFor(props.pool.address));
    console.log('bptBalance', props.pool.address);
    const propTokenAmounts = computed((): string[] => {
      const { receive } = poolCalculator.propAmountsGiven(
        bnum(totalTokens.value).toString(),
        0,
        'send'
      );

      if (isStablePhantomPool.value) {
        // Return linear pool's main token balance using the price rate.
        // mainTokenBalance = linearPoolBPT * priceRate
        return props.pool.tokensList.map((address, i) => {
          if (!props.pool?.onchain?.linearPools) return '0';

          const priceRate = props.pool.onchain.linearPools[address].priceRate;

          return bnum(receive[i]).times(priceRate).toString();
        });
      }

      return receive;
    });
    function fiatLabelFor(index: number, address: string): string {
      const fiatValue = toFiat(propTokenAmounts.value[index], address);
      return fNum2(fiatValue, FNumFormats.fiat);
    }

    const fiatValue = computed(() => {
      let fiatVal = 0;
      if (props.pool != undefined) {
        props.pool.tokens.forEach(token => {
          fiatVal += Number(toFiat(token.balance, token.address));
        });
        const lpVal = fiatVal / Number(props.pool.totalShares);
        const totalValue = lpVal * Number(props.stakedBalance);

        return fNum2(totalValue, FNumFormats.fiat);
      } else {
        return '-';
      }
    });

    const dailyEarnings = Number(props.dailyAPR) * Number(props.stakedBalance);

    function tokenWeightFor(address: string): string {
      if (!props.pool) return '0';
      const weight = props.pool?.onchain?.tokens?.[address]?.weight;
      return weight ? (weight * 100).toString() : '0';
    }

    /**
     * METHODS
     */

    return {
      isMobile,
      isDesktop,
      xpolarToClaim,
      symbolFor,
      unstakedTokens,

      isWalletReady,
      fNum2,
      propTokenAmounts,
      FNumFormats,
      fiatLabelFor,
      totalTokens,
      dailyEarnings,
      tokenAddresses,
      tokenWeightFor,
    };
  },
  created() {},
  beforeUpdate() {},
  mounted() {},
  updated() {},
});
</script>

<template>
  <div class="mt-[24px]">
    <div
      v-for="(address, idx) in tokenAddresses"
      :key="idx"
      class="my-[12px] flex"
    >
      <div class="flex flex-1">
        <BalAsset :address="address" :size="33" class="mr-[12px]" />
        <div class="flex flex-col">
          <div class="token">{{ symbolFor(address) }}</div>
          <div>{{ tokenWeightFor(address) }}%</div>
        </div>
      </div>
      <div class="token-value flex flex-1 flex-col text-right">
        <div>
          {{
            isWalletReady
              ? fNum2(propTokenAmounts[idx], FNumFormats.token)
              : '-'
          }}
        </div>
        <div>
          {{ isWalletReady ? fiatLabelFor(idx, address) : '-' }}
        </div>
      </div>
    </div>
  </div>
  <div class="break"></div>
  <div class="mt-[24px] grid grid-cols-2">
    <div class="">Pool Share</div>
    <div class="text-right">{{ totalTokens }}</div>
    <div class="">Staked LP Tokens</div>
    <div class="text-right">{{ stakedBalance }}</div>
    <div class="">Unstaked LP Tokens</div>
    <div class="text-right">{{ unstakedTokens }}</div>
    <div class="">Daily earning</div>
    <div class="text-right">{{ dailyEarnings }} $</div>
    <div class="">xPolar to Claim</div>
    <div class="claim text-right">{{ xpolarToClaim }}</div>
  </div>
</template>

<style scoped>
.token-pill {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
}

.title {
  font-weight: 600;
  font-size: 32px;
  color: #fdfdfd;
}
.claim-amount {
  color: #0ce6b5;
}
.singlestake-logo {
  height: 36px;
}
.singlestake-tokenpill {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  padding-left: 40px;
}

.stats .token {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.break {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(151, 71, 255, 0.4),
    rgba(59, 68, 189, 0.4)
  );
}
.token-value > div:first-child {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
</style>
