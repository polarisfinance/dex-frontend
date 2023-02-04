<template>
    <div class="stake-card flex flex-col mt-8">
      <div class="flex available px-[22px] py-[22px]">
        <div class="flex-1 flex flex-col">
          <div class="main">LP Tokens to stake</div>
          <div>Amount of available LP tokens on your wallet</div>
        </div>
        <div class="flex-1 text-right main">{{ balance }}</div>
      </div>
      <div class="flex total px-[12px] pb-[12px] pt-[22px] flex-col">
        <div class="flex px-[10px]">
          <div class="flex-1">Total to stake</div>
          <div class="flex-1 text-right">
            <input
              ref="textInput"
              class="bg-transparent total text-right inline"
              v-model="inputValue"
            />
            <button
              class="max inline"
              @click="maxBalance"
            >
              MAX
            </button>
          </div>
        </div>
        <button class="confirm-btn mt-8  w-full" @click="deposit(inputValue)">
          Confirm
        </button>
      </div>

      
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import X from '@/components/web3/x.vue';
import useTokens from '../../composables/PolarisFinance/useTokens';
import { useRoute } from 'vue-router';
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
    const route = useRoute();
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

    async function deposit(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      console.log(formatedAmount);
      const { deposit } = useStake();
      console.log(props.address);
      const tx = await deposit(props.address, formatedAmount, getProvider());
      txHandler(tx);
      txListener(tx, {
        onTxConfirmed: () => {
          emit('close');
          emit('stakeConfirmed');
        },
        onTxFailed: () => {},
      });
    }

    return {
      deposit,
    };
  },

  data() {
    return {
      inputValue: '0.0',
    };
  },
  methods: {
    maxBalance() {
      this.inputValue = this.balance;
    },
  },

  emits: ['close', 'stakeConfirmed'],
});
</script>
<style scoped>
.title {
  color: #ffffff !important;
}
.button-style {
  background: linear-gradient(94.4deg, #9747ff 6.17%, #3b44bd 137.17%);
}

.available{
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #BDB2DD;
}
.available .main{
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FDFDFD;
}
.confirm-btn{
  background: linear-gradient(92.92deg, #C004FE 4.85%, #7E02F5 95.15%);
  border-radius: 12px;
  padding: 12px 0px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #FDFDFD;
}
.stake-card{
  background:#41365E;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  border-radius: 22px;
  overflow: hidden;
}
.total{
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #FDFDFD;
  background: #50456E;
}
.max{
  background: linear-gradient(92.92deg, #C004FE 4.85%, #7E02F5 95.15%);
  border-radius: 20px;
  padding: 0px 8px;
  gap: 10px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #FDFDFD;
}
</style>
