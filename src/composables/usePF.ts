import PolarisFinance from '@/services/polaris-finance';
import { ref, computed } from 'vue';

export const pf = ref<PolarisFinance>();

function setWeb3(web3) {
  pf.value = new PolarisFinance(web3);
}

export default function usePF() {
  return {
    setWeb3,
  };
}
