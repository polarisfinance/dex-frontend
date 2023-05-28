<script lang="ts">
import { computed, defineComponent, PropType, toRef, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import { shortenLabel } from '@/lib/utils';
import BalAsset from '@/components/_global/BalAsset/BalAsset.vue';
import useTokens from '@/composables/useTokens';
import PoolCalculator from '@/services/pool/calculator/calculator.sevice';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { bnum } from '@/lib/utils';
import { getAddress } from '@ethersproject/address';
import { Pool, PoolToken } from '@/services/pool/types';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';

export default defineComponent({
  components: {
    BalAsset,
  },
  props: {
    pool: {
      type: Object as PropType<Pool>,
      default: null,
    },
  },
  emits: ['click'],
  setup(props) {
    const { isMobile, isDesktop } = useBreakpoints();

    /**
     * COMPOSABLES
     */
    const { tokens, balances, balanceFor, getTokens } = useTokens();
    const { fNum, toFiat } = useNumbers();

    const unstakedTokens = computed((): string =>
      balanceFor(props.pool.address)
    );

    function symbolFor(address: string) {
      if (!props.pool) return '-';
      const symbol = props.pool.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }
    // const walletFreeTokens = computed(() =>
    //   tokenAddresses.value
    //     .map((address, i) => propTokenAmounts.value[i], address)
    //     .reduce((total, value) => bnum(total).plus(value).toString())
    // );

    /**
     * COMPUTED
     */

    const tokenAddresses = computed((): string[] => {
      return props.pool.tokensList;
    });

    /*
     * PoolBalances
     */

    const { isWalletReady } = useWeb3();

    const poolCalculator = new PoolCalculator(
      props.pool,
      tokens,
      balances,
      'exit',
      ref(false)
    );
    const bptBalance = computed((): string => balanceFor(props.pool.address));
    const { stakedShares } = usePoolStaking();
    const totalUserPoolSharePct = ref(
      bnum(
        bnum(stakedShares.value).plus(
          balanceFor(getAddress(props.pool.address))
        )
      )
        .div(props.pool.totalShares)
        .toString()
    );

    const currentShares = computed(() => {
      return balanceFor(getAddress(props.pool.address));
    });

    /**
     * METHODS
     */

    function weightFor(token: PoolToken): string {
      return fNum(token.weight * 100 || '0', {
        maximumFractionDigits: 2,
      });
    }

    return {
      props,
      isMobile,
      isDesktop,
      symbolFor,
      unstakedTokens,
      isWalletReady,
      fNum,
      FNumFormats,
      tokenAddresses,
      weightFor,
      currentShares,
      stakedShares,
      totalUserPoolSharePct,
    };
  },
  data() {
    return {
      poolData: this.$props.pool,
    };
  },

  watch: {
    poolData(newVal, oldVal) {},
  },
  created() {},
  beforeUpdate() {},
  beforeMount() {},
  mounted() {},
  updated() {},
  methods: {},
});
</script>

<template>
  <div class="mt-[12px]">
    <div v-for="(token, idx) in pool.tokens" :key="idx" class="flex py-[12px]">
      <div class="flex flex-1">
        <BalAsset :address="token.address" :size="33" class="mr-[12px]" />
        <div class="flex flex-col">
          <div class="token">{{ symbolFor(token.address) }}</div>
          <div>{{ weightFor(token) }}%</div>
        </div>
      </div>
      <div class="flex flex-col flex-1 text-right token-value">
        <div>-</div>
        <div>-</div>
      </div>
    </div>
  </div>
  <div class="break my-[12px]"></div>
  <div class="grid grid-cols-2 mt-[24px] gap-[8px]">
    <div class="">Pool Share</div>
    <div class="text-right">
      {{ fNum(totalUserPoolSharePct, FNumFormats.percent) }}
    </div>
    <div class="">Staked LP Tokens</div>
    <div class="text-right">{{ stakedShares }}</div>
    <div class="">Unstaked LP Tokens</div>
    <div class="text-right">{{ currentShares }}</div>
    <div class="">Daily earning</div>
    <div class="text-right">$</div>
    <div class="">xPolar to Claim</div>
    <div class="text-right claim"></div>
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
