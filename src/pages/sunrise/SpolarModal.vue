<template>
  <BalModal :show="isVisible" noPad @close="$emit('close')">
    <div class="p-[12px]">
      <div class="header px-[12px]">
        <div v-if="deposit" class="title text-white">Deposit SPOLAR</div>
        <div v-else class="title text-white">Withdraw SPOLAR</div>
        <X class="pt-[4px]" v-on:click="$emit('close')" />
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
          @click="deposit ? deposit(inputValue) : withdraw(inputValue)"
        >
          Confirm
        </button>
      </div>
    </div>
  </BalModal>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import X from '@/components/web3/x.vue';
import useTokens from '../../composables/PolarisFinance/useTokens';
import { useRoute } from 'vue-router';
import useWeb3 from '@/services/web3/useWeb3';
import useSunrise from '../../composables/PolarisFinance/useSunrise';
import { parseFixed } from '@ethersproject/bignumber';


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
  setup() {
    const { account, getProvider } = useWeb3();
    const route = useRoute();

    async function deposit(amount: string) {
      const formatedAmount = parseFixed(amount, 18);
      const tokenName = route.params.id.toString();
      const { deposit } = useSunrise(account.value, getProvider(), tokenName);
      await deposit(formatedAmount);
    }

    async function withdraw(amount) {
      const formatedAmount = parseFixed(amount, 18);
      const tokenName = route.params.id.toString();
      const { withdraw } = useSunrise(account.value, getProvider(), tokenName);
      await withdraw(formatedAmount);
    }

    
    return {
      deposit,
      withdraw,
    };
  },

  data() {
    return {
      balance: '0',
      inputValue: '0',
    };
  },
  methods: {
    maxBalance() {
      this.inputValue = this.balance;
    },
  },

  async created() {
    const { getBalance } = useTokens();
    this.balance = await getBalance();
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    deposit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
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
