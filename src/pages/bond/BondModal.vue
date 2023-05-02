<template>
  <BalModal :show="isVisible" noPad @close="$emit('close')">
    <div class="p-[12px]">
      <div class="header px-[12px]">
        <div v-if="purchaseBol" class="title text-white">
          Purchase {{ name }}
        </div>
        <div v-else class="title text-white">Redeem {{ name }}</div>
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
          @click="purchaseBol ? purchase(inputValue) : redeem(inputValue)"
        >
          Confirm
        </button>
      </div>
    </div>
  </BalModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import useTokens from '../../composables/PolarisFinance/useTokens';
import { useRoute } from 'vue-router';
import useWeb3 from '@/services/web3/useWeb3';
import useBonds from '../../composables/PolarisFinance/useBonds';
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
  },
  props: {
    isVisible: Boolean,
    purchaseBol: Boolean,
    balance: { type: String, default: '0' },
    name: { String, default: '' },
    account: { String, default: '' },
    sunriseName: { String, default: '' },
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
        summary: 'deposit for sunrise',
      });
    };

    return {
      getProvider,
      txListener,
      txHandler,
      emit,
    };
  },

  data() {
    return {
      inputValue: '0',
    };
  },
  methods: {
    maxBalance() {
      this.inputValue = this.balance;
    },
    async purchase(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      const { purchase } = useBonds(this.account, this.sunriseName);
      const tx = await purchase(formatedAmount, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.emit('close');
          this.emit('update');
        },
        onTxFailed: () => {},
      });
    },

    async redeem(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      const { redeem } = useBonds(this.account, this.sunriseName);
      const tx = await redeem(formatedAmount, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.emit('close');
          this.emit('update');
        },
        onTxFailed: () => {},
      });
    },
  },

  emits: ['close', 'update'],
});
</script>
<style scoped>
.title {
  color: #ffffff !important;
}
.button-style {
  background: linear-gradient(94.4deg, #9747ff 6.17%, #3b44bd 137.17%);
}

.input-container {
  box-shadow: inset 0px 0px 1px rgba(255, 251, 251, 0.25);
}
</style>
