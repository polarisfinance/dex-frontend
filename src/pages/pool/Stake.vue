<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import X from '@/components/web3/x.vue';
import useTokens from '../../composables/PolarisFinance/useTokens';
import useWeb3 from '@/services/web3/useWeb3';
import useStake from '../../composables/PolarisFinance/useStake';
import { parseFixed } from '@ethersproject/bignumber';

import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';
import useEthers from '../../composables/useEthers';

/**
 * STATE
 */
const textInput = ref<HTMLInputElement>();
/**
 * LIFECYCLE
 */
onMounted(() => {
  textInput.value?.focus();
});
export default defineComponent({
  components: {
    X,
  },
  props: {
    balance: { type: String, default: '0' },
    token: String,
    address: { type: String, default: '' },
  },
  setup(props, { emit }) {
    const { getProvider } = useWeb3();
    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();

    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'stake',
        summary: 'deposit lp to xpolarRewardPool',
      });
    };
    const address = props.address;

    return {
      txHandler,
      txListener,
      getProvider,
      emit,
    };
  },

  data() {
    return {
      inputValue: '0.0',
      poolAddress: this.address,
      confirming: false,
    };
  },
  computed: {},
  methods: {
    maxBalance() {
      this.inputValue = this.balance;
    },
    async deposit(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      console.log(formatedAmount);
      const { deposit } = useStake();
      console.log(this.poolAddress);

      this.confirming = true;
      const tx = await deposit(this.poolAddress, formatedAmount, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.confirming = false;
          this.emit('close');
          this.emit('stakeConfirmed');
        },
        onTxFailed: () => {
          this.confirming = false;
        },
      });
    },
  },

  emits: ['close', 'stakeConfirmed'],
});
</script>

<template>
  <div class="stake-card mt-8 flex flex-col">
    <div class="available flex px-[22px] py-[22px]">
      <div class="flex flex-1 flex-col">
        <div class="main">LP Tokens to stake</div>
        <div>Amount of available LP tokens on your wallet</div>
      </div>
      <div class="main flex-1 text-right">{{ balance }}</div>
    </div>
    <div class="total flex flex-col px-[12px] pb-[12px] pt-[22px]">
      <div class="flex px-[10px]">
        <div class="flex-1">Total to stake</div>
        <div class="flex-1 text-right">
          <input ref="textInput" class="total inline bg-transparent text-right" v-model="inputValue" />
          <button class="max inline" @click="maxBalance">MAX</button>
        </div>
      </div>

      <button class="confirm-btn mt-8 w-full" disabled v-if="confirming == true">Confirming...</button>
      <button class="confirm-btn mt-8 w-full" @click="deposit(inputValue)" v-else>Confirm</button>
    </div>
  </div>
</template>

<style scoped>
.title {
  color: #ffffff !important;
}
.button-style {
  background: linear-gradient(94.4deg, #9747ff 6.17%, #3b44bd 137.17%);
}

.available {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdb2dd;
}
.available .main {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.confirm-btn {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 12px;
  padding: 12px 0px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #fdfdfd;
}
button.confirm-btn[disabled] {
  background: #41365e;
  color: #a99bc6;
}
.stake-card {
  background: #41365e;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  overflow: hidden;
}
.total {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #fdfdfd;
  background: #50456e;
}
.max {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 20px;
  padding: 0px 8px;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #fdfdfd;
}
</style>
