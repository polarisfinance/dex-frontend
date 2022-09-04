import useWeb3 from '@/services/web3/useWeb3';
import { watch, ref, computed } from 'vue';
import usePF, { pf } from './usePF';

export default function usePolarisFinance() {
  const web3 = useWeb3();
  const { setWeb3 } = usePF();

  watch(web3.isWalletReady, () => {
    console.log(web3.isWalletReady.value);
    console.log('Wallet is ready ' + web3.isWalletReady.value);
    setWeb3(web3);
    console.log('TEST');
    console.log(pf.value);
    console.log('TEST');
  });
}
