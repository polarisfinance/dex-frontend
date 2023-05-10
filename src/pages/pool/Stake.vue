<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
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
  components: {},
  props: {
    balance: { type: String, default: '0' },
    token: String,
    address: { type: String, default: '' },
    unstake: { type: Boolean, default: false },
  },

  emits: ['close', 'stakeConfirmed', 'unstakeConfirmed'],
  setup(props, { emit }) {
    const { getProvider } = useWeb3();
    const { addTransaction } = useTransactions();

    const address = props.address;
    const { account } = useWeb3();
    const { txListener } = useEthers();
    return {
      txListener,
      getProvider,
      addTransaction,
      emit,
      account,
    };
  },
  data() {
    return {
      inputValue: '0.0',
      stakedBalance: '0',
      poolAddress: this.address,
      confirming: false,
    };
  },
  computed: {},
  async beforeMount() {
    const { balance } = useStake();
    this.stakedBalance = await balance(this.poolAddress, this.account);
  },
  methods: {
    maxUnstake() {
      this.inputValue = this.stakedBalance;
    },
    maxBalance() {
      this.inputValue = this.balance;
    },
    async confirm(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      console.log(formatedAmount);
      const { withdraw, deposit } = useStake();
      console.log(this.poolAddress);

      this.confirming = true;

      if (this.unstake) {
        const tx = await withdraw(
          this.poolAddress,
          formatedAmount,
          this.getProvider()
        );
        const txHandler = (tx: TransactionResponse): void => {
          this.addTransaction({
            id: tx.hash,
            type: 'tx',
            action: 'stake',
            summary: 'unstake lp from xpolarRewardPool',
          });
        };
        txHandler(tx);
        this.txListener(tx, {
          onTxConfirmed: () => {
            this.confirming = false;
            this.emit('close');
            this.emit('unstakeConfirmed');
          },
          onTxFailed: () => {
            this.confirming = false;
          },
        });
      } else {
        const tx = await deposit(
          this.poolAddress,
          formatedAmount,
          this.getProvider()
        );
        const txHandler = (tx: TransactionResponse): void => {
          this.addTransaction({
            id: tx.hash,
            type: 'tx',
            action: 'stake',
            summary: 'deposit lp to xpolarRewardPool',
          });
        };
        txHandler(tx);
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
      }
    },
  },
});
</script>

<template>
  <div class="flex flex-col mt-8 stake-card">
    <div v-if="unstake == true" class="flex available px-[22px] py-[22px]">
      <div class="flex flex-col flex-1">
        <div class="main">LP Tokens to unstake</div>
        <div>Amount of staked LP tokens in pool</div>
      </div>

      <div class="flex-1 text-right main">{{ stakedBalance }}</div>
    </div>
    <div v-else class="flex available px-[22px] py-[22px]">
      <div class="flex flex-col flex-1">
        <div class="main">LP Tokens to stake</div>
        <div>Amount of available LP tokens on your wallet</div>
      </div>
      <div class="flex-1 text-right main">{{ balance }}</div>
    </div>

    <div class="flex flex-col total px-[12px] pb-[12px] pt-[22px]">
      <div v-if="unstake == true" class="flex px-[10px]">
        <div class="flex-1">Total to unstake</div>
        <div class="flex-1 text-right">
          <input
            ref="textInput"
            v-model="inputValue"
            class="inline text-right bg-transparent total"
          />
          <button class="inline max" @click="maxUnstake">MAX</button>
        </div>
      </div>
      <div v-else class="flex px-[10px]">
        <div class="flex-1">Total to stake</div>
        <div class="flex-1 text-right">
          <input
            ref="textInput"
            v-model="inputValue"
            class="inline text-right bg-transparent total"
          />
          <button class="inline max" @click="maxBalance">MAX</button>
        </div>
      </div>

      <button
        v-if="confirming == true"
        class="mt-8 w-full confirm-btn"
        disabled
      >
        Confirming...
      </button>
      <button
        v-else
        class="mt-8 w-full confirm-btn"
        @click="confirm(inputValue)"
      >
        Confirm
      </button>
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
