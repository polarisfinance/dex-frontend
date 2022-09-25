import { BigNumber } from 'ethers';

export const BigNumberToString = (number, decimals, fixed) => {
  return (
    Number(number.div(BigNumber.from(10).pow(decimals))) / Math.pow(10, fixed)
  ).toString();
};

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

export const SPOLAR = '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729';
