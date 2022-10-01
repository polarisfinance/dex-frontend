import { BigNumber } from 'ethers';

export const BigNumberToString = (number, decimals, fixed) => {
  return (
    Number(number.div(BigNumber.from(10).pow(decimals))) / Math.pow(10, fixed)
  ).toString();
};

export const getDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  fractionDigits = 4,
  isTruncated: boolean = false
) => {
  if (decimals === 0) {
    fractionDigits = 0;
  }
  if (fractionDigits > decimals) {
    fractionDigits = decimals;
  }
  const number = getBalance(balance, decimals - fractionDigits);
  const ret = (number / 10 ** fractionDigits).toFixed(fractionDigits);
  if (ret.length > 12 && isTruncated) {
    return ret.slice(0, 12) + '...';
  }
  return ret;
};

export const getFullDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  isTruncated = false
) => {
  return getDisplayBalance(balance, decimals, 6, isTruncated);
};

export function getBalance(balance: BigNumber, decimals = 18): number {
  return Number(balance.div(BigNumber.from(10).pow(decimals)));
}

export const SPOLAR = '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729';

export const treasuryNameToAddress = {
  orbital: '0xc9f5D8bC7a3E4a01bF6926f99540714027F7fF61',
  polar: '0x2Af7e5b19405A02FC99468Af38a23aa270921781',
  tripolar: '0x116449c7B1d0837439E12216d7b1EbaecbD848FF',
  binaris: '0x4a1678998bd470eeEDb6e82116c05821a2eF2Bc1',
  ethernal: '0x4EB8Be5cFe68710Df61bf53F718CCAb48Da82263',
  usp: '0x58d030Fb9b40ed1245762Fe321FbEd41bb217eEE',
};

export const sunriseNameToAddress = {
  orbital: '0x494E811678f84816878A6e7e333f834Be7d4f21D',
  polar: '0xA452f676F109d34665877B7a7B203f2B445D7DE0',
  tripolar: '0x203a65b3153C55B57f911Ea73549ed0b8EC82B2D',
  binaris: '0x5DB00aeFe6404A08802678480e953ACb32E14Eab',
  ethernal: '0x33Fd42C929769f2C57cD68353Bff0bD7C6c51604',
  usp: '0xF34667Cf79DbFaa77A389e1e23D08E6635Eb01c2',
};

export const pools = {
  near_usdc: '0x20F8AeFB5697B77E0BB835A8518BE70775cdA1b0',
  spolar_near: '0xADf9D0C77c70FCb1fDB868F54211288fCE9937DF',
};

export const segnioragePools = {
  orbital: '0x7243cB5DBae5921c78A022110645a23a38ffBA5D',
  polar: '0x3fa4d0145a0b6ad0584b1ad5f61cb490a04d8242',
  usp: '0xa984B8062316AFE25c86576b0478E76E65FdF564',
  binaris: '0x29A3e2Bb73891f20C6d4A34ecE0c4a6F8020ec32',
  tripolar: '0x60527a2751A827ec0Adf861EfcAcbf111587d748',
  ethernal: '0x81D77f8e86f65b9C0F393afe0FC743D888c2d4d7',
};

export const bondNameToAddress = {
  orbital: '0x192bdcdd7b95A97eC66dE5630a85967F6B79e695',
  polar: '0x3a4773e600086A753862621A26a2E3274610da43',
  tripolar: '0x8200B4F47eDb608e36561495099a8caF3F806198',
  binaris: '0xfa32616447C51F056Db97BC1d0E2D4C0c4D059C9',
  ethernal: '0x266437E6c7500A947012F19A3dE96a3881a0449E',
  usp: '0xcE32b28c19C61B19823395730A0c7d91C671E54b',
};

export const tokenNameToAddress = {
  orbital: '0x3AC55eA8D2082fAbda674270cD2367dA96092889',
  polar: '0xf0f3b9Eee32b1F490A4b8720cf6F005d4aE9eA86',
  tripolar: '0x60527a2751A827ec0Adf861EfcAcbf111587d748',
  binaris: '0xafE0d6ca6AAbB43CDA024895D203120831Ba0370',
  ethernal: '0x17cbd9C274e90C537790C51b4015a65cD015497e',
  usp: '0xa69d9Ba086D41425f35988613c156Db9a88a1A96',
};
