import config from '@/lib/config/aurora.json';

import { uniswapABI, spolarABI } from './ABI';
import { pools, segnioragePools, SPOLAR, BigNumberToString } from './utils';

import Web3 from 'web3';

import { Contract } from '@ethersproject/contracts';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';

export default function useTokens() {
  const w3 = new Web3(config.rpc);

  const provider = rpcProviderService.getJsonProvider(Network.AURORA);

  const getSpolarBalance = async (account: string) => {
    const spolarContract = new Contract(SPOLAR, spolarABI, provider);
    const balance = await spolarContract.balanceOf(account);
    return BigNumberToString(balance, 14, 4);
  };

  const getSpolarPrice = async () => {
    const nearPriceContract = new w3.eth.Contract(uniswapABI, pools['near_usdc']);
    const nearReserves = await nearPriceContract.methods.getReserves().call();
    const near_price = 1 / (nearReserves[1] / nearReserves[0] / 10 ** (24 - 6));
    const spolarPriceContract = new w3.eth.Contract(uniswapABI, pools['spolar_near']);
    const polarReserves = await spolarPriceContract.methods.getReserves().call();
    const polar_price = 1 / (polarReserves[0] / polarReserves[1] / 10 ** (18 - 24));

    const spolarPrice = polar_price * near_price;

    return spolarPrice;
  };

  const getTokenPriceInUSD = async tokenName => {
    if (tokenName == 'binaris') {
      const uniswapPriceContractAddress = '0x0444eD96DccB0bA4b47908E144026cbA7355E454';
      const uniswapPriceContract = new w3.eth.Contract(uniswapABI, uniswapPriceContractAddress);
      const res = await uniswapPriceContract.methods.getReserves().call();
      const pr = res[0] / res[1];

      const uspPoolAddr = '0xa984B8062316AFE25c86576b0478E76E65FdF564';
      const uspPoolContract = new w3.eth.Contract(uniswapABI, uspPoolAddr);
      const uspReserves = await uspPoolContract.methods.getReserves().call();
      const uspPriceRes = uspReserves[1] / uspReserves[0];
      const uspPrice = uspPriceRes / 10 ** (6 - 18);
      return uspPrice * pr;
    } else if (tokenName == 'ethernal') {
      const contractAddr = '0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7';
      const contract = new w3.eth.Contract(uniswapABI, contractAddr);
      const reserves = await contract.methods.getReserves().call();
      const price_eth = reserves[1] / reserves[0];
      const contractAddr2 = '0x2F41AF687164062f118297cA10751F4b55478ae1';
      const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
      const reserves2 = await contract2.methods.getReserves().call();
      const price = reserves2[1] / reserves2[0];
      const usdc_price = 1 / (price / 10 ** (18 - 6));
      tokenName = (usdc_price * price_eth).toString();
    } else if (tokenName == 'orbital') {
      const contractAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
      const contract = new w3.eth.Contract(uniswapABI, contractAddr);
      const reserves = await contract.methods.getReserves().call();
      const price = reserves[1] / reserves[0];
      const near_price = 1 / (price / 10 ** (24 - 6));
      const contractAddr2 = '0xbc8A244e8fb683ec1Fd6f88F3cc6E565082174Eb';
      const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
      const reserves2 = await contract2.methods.getReserves().call();
      const price2 = reserves2[1] / reserves2[0];
      const btc_near_price = 1 / (price2 / 10 ** (8 - 24));
      const contractAddr3 = '0x7243cB5DBae5921c78A022110645a23a38ffBA5D';
      const contract3 = new w3.eth.Contract(uniswapABI, contractAddr3);
      const reserves3 = await contract3.methods.getReserves().call();
      const price3 = reserves3[1] / reserves3[0];
      const orbital_btc_price = price3 / 10 ** (8 - 18);
      return near_price * btc_near_price * orbital_btc_price;
    } else if (tokenName == 'polar') {
      const contractAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
      const contract = new w3.eth.Contract(uniswapABI, contractAddr);
      const reserves = await contract.methods.getReserves().call();
      const near_res = reserves[1] / reserves[0];
      const near_price = 1 / (near_res / 10 ** (24 - 6));
      const contractAddr2 = '0x3fa4d0145a0b6Ad0584B1ad5f61cB490A04d8242';
      const contract2 = new w3.eth.Contract(uniswapABI, contractAddr2);
      const reserves2 = await contract2.methods.getReserves().call();
      const polar_res = reserves2[1] / reserves2[0];
      const polar_price = 1 / (polar_res / 10 ** (18 - 24));
      return near_price * polar_price;
    } else if (tokenName == 'tripolar') {
      const tri_nearAddr = '0x84b123875F0F36B966d0B6Ca14b31121bd9676AD';
      const tri_near = new w3.eth.Contract(uniswapABI, tri_nearAddr);
      const tri_near_reserves = await tri_near.methods.getReserves().call();
      const tri_near_priceRes = tri_near_reserves[0] / tri_near_reserves[1];
      const tri_near_price = tri_near_priceRes / 10 ** (24 - 18);

      const near_usdcAddr = '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0';
      const near_usdc = new w3.eth.Contract(uniswapABI, near_usdcAddr);
      const near_usdc_reserves = await near_usdc.methods.getReserves().call();
      const near_usdc_priceRes = near_usdc_reserves[1] / near_usdc_reserves[0];
      const near_usdc_price = 1 / (near_usdc_priceRes / 10 ** (24 - 6));

      const contractAddr = '0x51488c4BcEEa96Ee530bC6093Bd0c00F9461fbb5';
      const contract = new w3.eth.Contract(uniswapABI, contractAddr);
      const reserves = await contract.methods.getReserves().call();
      const priceRes = reserves[1] / reserves[0];
      return priceRes * tri_near_price * near_usdc_price;
    } else {
      const uspPoolAddr = '0xa984B8062316AFE25c86576b0478E76E65FdF564';
      const uspPoolContract = new w3.eth.Contract(uniswapABI, uspPoolAddr);
      const uspReserves = await uspPoolContract.methods.getReserves().call();
      const uspPriceRes = uspReserves[1] / uspReserves[0];
      return uspPriceRes / 10 ** (6 - 18);
    }

    return 0;
  };

  const getTokenPeg = async tokenName => {
    const contractAddress = segnioragePools[tokenName];
    const contract = new w3.eth.Contract(uniswapABI, contractAddress);
    const reserves = contract.methods.getReserves().call();
    const price = reserves[1] / reserves[0];

    if (tokenName == 'polar') {
      return 1 / (price / 10 ** (18 - 24));
    } else if (tokenName == 'orbital') {
      return price / 10 ** (8 - 18);
    } else if (tokenName == 'usp') {
      return price / 10 ** (6 - 18);
    }
    return price / Math.pow(10, 18);
  };

  return { getSpolarPrice, getTokenPriceInUSD, getTokenPeg, getSpolarBalance };
}
