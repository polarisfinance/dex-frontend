import PolarisFinance from '@/services/polaris-finance';
import useWeb3 from '@/services/web3/useWeb3';
import { watch, ref, readonly } from 'vue';

export default function usePolarisFinance() {
  const web3 = useWeb3();
  const pf = ref<PolarisFinance>();
  watch(
    () => web3.isWalletReady.value,
    newVal => {
      if (newVal) {
        const polarisFinance = new PolarisFinance(web3);
        console.log(polarisFinance.myAccount);
        pf.value = polarisFinance;
      }
    }
  );

  return { pf };
}
