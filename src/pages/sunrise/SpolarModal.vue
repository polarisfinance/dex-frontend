<template>
  <BalModal :show="isVisible" noPad @close="$emit('close')">
    <div class="p-[12px]">
      <div class="header px-[12px]">
        <div v-if="depositBol" class="text-white title">Deposit SPOLAR</div>
        <div v-else class="text-white title">Withdraw SPOLAR</div>
        <button
          class="flex text-polaris-2 hover:text-polaris-white pt-[4px]"
          @click="$emit('close')"
        >
          <BalIcon class="flex" name="x" />
        </button>
      </div>
      <div class="grid justify-items-start pt-[24px]">
        <span
          class="font-medium pl-[12px] text-[14px] leading-[18px] text-pink-third"
          >Available: {{ balance }}</span
        >
        <div
          class="flex justify-between w-full input-container mt-[8px] rounded-[16px] bg-[#2E2433] p-[12px]"
        >
          <button
            class="font-semibold text-white button-style my-[1.5px] rounded-[10px] px-[12px] py-[4px] leading-[20px]"
            @click="maxBalance"
          >
            MAX
          </button>

          <input
            ref="textInput"
            v-model="inputValue"
            placeholder="0.0"
            class="font-medium text-right bg-transparent text-[24px] leading-[31px]"
          />
        </div>
        <button
          v-if="!isApproved && depositBol"
          class="w-full text-white button-style mt-[12px] h-[44px] rounded-[16px]"
          @click="approve()"
        >
          Approve
        </button>
        <button
          v-else
          class="w-full text-white button-style mt-[12px] h-[44px] rounded-[16px]"
          @click="depositBol ? deposit(inputValue) : withdraw(inputValue)"
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
import useSunrise from '../../composables/PolarisFinance/useSunrise';
import { parseFixed } from '@ethersproject/bignumber';

import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';
import useEthers from '../../composables/useEthers';
import { TransactionAction } from '@/composables/useTransactions';

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
    isVisible: Boolean,
    depositBol: Boolean,
    balance: { type: String, default: '0' },
  },

  emits: ['close', 'update'],
  setup(props, { emit }) {
    const { getProvider } = useWeb3();

    const route = useRoute();
    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();
    const tokenName = route.params.id.toString();
    const { submitDeposit, submitWithdraw, getApproval, submitApprove } =
      useSunrise(tokenName);

    const txHandler = (
      tx: TransactionResponse,
      action: TransactionAction,
      summary: string
    ): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: action,
        summary: summary,
      });
    };

    return {
      txListener,
      txHandler,
      submitDeposit,
      submitWithdraw,
      getApproval,
      submitApprove,
      getProvider,
    };
  },

  data() {
    return {
      inputValue: '0',
      isApproved: true,
    };
  },
  watch: {
    async inputValue() {
      await this.fetchApproval();
    },
  },
  methods: {
    async fetchApproval() {
      if (this.inputValue !== '') {
        const formatedAmount = parseFixed(this.inputValue, 18);
        this.isApproved = await this.getApproval(formatedAmount);
      }
    },
    maxBalance() {
      this.inputValue = this.balance;
    },
    async approve() {
      const tx = await this.submitApprove();
      this.txHandler(tx, 'approve', `Approve SPOLAR`);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchApproval();
        },
        onTxFailed: () => {},
      });
    },
    async deposit(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      const tx = await this.submitDeposit(formatedAmount);
      this.txHandler(
        tx,
        'stake',
        `Deposit ${formatedAmount.toString()} SPOLAR`
      );
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.$emit('close');
          this.$emit('update');
        },
        onTxFailed: () => {},
      });
    },
    async withdraw(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      const tx = await this.submitWithdraw(formatedAmount);
      this.txHandler(
        tx,
        'unstake',
        `Withdraw ${formatedAmount.toString()} SPOLAR`
      );
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.$emit('close');
          this.$emit('update');
        },
        onTxFailed: () => {},
      });
    },
  },
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
