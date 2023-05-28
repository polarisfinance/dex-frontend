<template>
  <BalModal :show="isVisible" noPad @close="$emit('close')">
    <div class="p-[12px]">
      <div class="header px-[12px]">
        <div v-if="purchaseBol" class="text-white title">
          Purchase {{ name }}
        </div>
        <div v-else class="text-white title">Redeem {{ name }}</div>
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
          v-if="!isApproved"
          class="w-full text-white button-style mt-[12px] h-[44px] rounded-[16px]"
          @click="approve()"
        >
          Approve
        </button>
        <button
          v-else
          class="w-full text-white button-style mt-[12px] h-[44px] rounded-[16px]"
          @click="submit(inputValue)"
        >
          Confirm
        </button>
      </div>
    </div>
  </BalModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import useTokens from '@/composables/PolarisFinance/useTokens';
import { useRoute } from 'vue-router';
import useWeb3 from '@/services/web3/useWeb3';
import { parseFixed } from '@ethersproject/bignumber';
import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';
import useEthers from '@/composables/useEthers';
import useBonds from '@/composables/PolarisFinance/useBonds';
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
    purchaseBol: Boolean,
    balance: { type: String, default: '0' },
    name: { type: String, default: '' },
    account: { type: String, default: '' },
    sunriseName: { type: String, default: '' },
  },

  emits: ['close', 'update'],
  setup(props, { emit }) {
    const { getProvider } = useWeb3();
    const {
      purchase,
      redeem,
      isApprovedPurchase,
      approvePurchase,
      isApprovedRedeem,
      approveRedeem,
    } = useBonds(props.sunriseName);

    const route = useRoute();
    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();

    const txHandler = (
      tx: TransactionResponse,
      action: TransactionAction
    ): void => {
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

      purchase,
      redeem,
      isApprovedPurchase,
      approvePurchase,
      isApprovedRedeem,
      approveRedeem,
    };
  },

  data() {
    return {
      inputValue: '',
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
        if (this.purchaseBol) {
          this.isApproved = await this.isApprovedPurchase(formatedAmount);
        } else {
          this.isApproved = await this.isApprovedRedeem(formatedAmount);
        }
      }
    },
    maxBalance() {
      this.inputValue = this.balance;
    },
    async approve() {
      let tx;
      if (this.purchaseBol) {
        tx = await this.approvePurchase();
      } else {
        tx = await this.approveRedeem();
      }
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchApproval();
          this.emit('update');
        },
        onTxFailed: () => {},
      });
    },
    async submit(amount: string) {
      let tx;
      if (this.purchaseBol) {
        const formatedAmount = parseFixed(amount, 18);
        tx = await this.purchase(formatedAmount);
      } else {
        const formatedAmount = parseFixed(amount, 18);
        tx = await this.redeem(formatedAmount);
      }
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
