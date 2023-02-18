import { PoolWithShares } from '@/services/pool/types';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import BigNumberJs from 'bignumber.js';
import useStake from '@/composables/PolarisFinance/useStake';
import { spolarABI, sunriseABI, xpolarRewardPoolABI, ERC20ABI } from '@/composables/PolarisFinance/ABI';
import { BigNumberToString, sunriseNameToAddress, SPOLAR, getDisplayBalance } from '@/composables/PolarisFinance/utils';
import { Contract } from 'ethers';
import { computed, ComputedRef, InjectionKey, provide, reactive, Ref, toRefs } from 'vue';
import { accountToAddress, Network } from '@balancer-labs/sdk';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import useWeb3 from '@/services/web3/useWeb3';

export interface ClaimType {
  pool: PoolWithShares;
  address: String;
  approved: Boolean;
  stakedBalance: Number;
  xpolarToClaim: String;
}

export class ClaimProviderService {
  private prices = [];
  private account;
  private xpolarPoolQuery;
  private pools: PoolWithShares[] = [];
  private singlePools: any;
  private xpolarRewardPoolAddress = '0x140e8a21d08CbB530929b012581a7C7e696145eF';
  private claims: Array<ClaimType> = [];
  // public claimsReceived?: (claims:any) => void
  public claimReceived?: (claim: ClaimType) => void;

  constructor(pools: any, singlePools: any, prices: any, xpolarPoolQuery, account) {
    this.xpolarPoolQuery = xpolarPoolQuery;
    this.pools = pools;
    this.singlePools = singlePools;
    this.prices = prices;
    this.account = account;
  }

  public init() {}
  async fetchAll() {
    const promises: any[] = [];
    if (!this.pools) return;

    // let allClaims: ClaimType[] = [];
    for (var i = 0; i < this.pools.length; i++) {
      // promises.push(this.fetch(this.pools[i]));
      new Promise((resolve, reject) => {
        resolve(this.fetch(this.pools[i]));
      }).then((val: any) => {
        if (val != undefined) {
          const obj: ClaimType = val;
          if (val.approved && this.claimReceived && val.stakedBalance > 0) {
            this.claimReceived(obj);
          }
          // allClaims.push( obj );
          // if (!this.claimsReceived)
          //   return;
          // this.claimsReceived(allClaims);
        }
      });
    }
    for (var i = 0; i < this.singlePools.length; i++) {
      new Promise((resolve, reject) => {
        resolve(this.fetchSingle(this.singlePools[i].id));
      }).then((val: any) => {
        if (val != undefined) {
          const obj: ClaimType = val;
          if (val.approved && this.claimReceived && val.stakedBalance > 0) {
            this.claimReceived(obj);
          }
        }
      });
    }
  }

  private async fetch(pool: PoolWithShares) {
    const { balance, isApproved, pendingShare } = useStake();
    const approval = await isApproved(pool.address, this.account);
    if (!approval) return { pool: pool, approved: approval, stakedBalance: 0, xpolarToClaim: '' };

    const w3 = rpcProviderService.getJsonProvider(Network.AURORA);

    const xpolarRewardPoolAddress = '0x140e8a21d08CbB530929b012581a7C7e696145eF';
    const xpolarRewardPool = new Contract(xpolarRewardPoolAddress, xpolarRewardPoolABI, w3);

    const PID = {
      '0x0993fa12d3256e85da64866354ec3532f187e178': 0,
      '0xf0b6cf745afe642c4565165922ad62d6a93857c1': 1,
      '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10': 2,
      '0xa83f9fa9b51fc26e9925a07bc3375617b473e051': 3,
      '0xa215a58225b344cbb62fcf762e8e884dbedfbe58': 4,
      '0x293bbbef6087f681a8110f08bbdedadd13599fc3': 5,
      '0xceecce984f498ee00832670e9ca6d372f6ce155a': 6,
      '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb5': 7,
      '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c': 8,
      '0x454adaa07eec2c432c0df4379a709b1fa4c800ed': 9,
      '0xb3a04902b78fbe61185b766866193630db4db8a3': 10,
      '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed': 11,
      '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b': 12,
      '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78': 13,
      '0xf0f3b9eee32b1f490a4b8720cf6f005d4ae9ea86': 14,
      '0x3ac55ea8d2082fabda674270cd2367da96092889': 15,
      '0xafe0d6ca6aabb43cda024895d203120831ba0370': 16,
      '0xa69d9ba086d41425f35988613c156db9a88a1a96': 17,
      '0x17cbd9c274e90c537790c51b4015a65cd015497e': 18,
      '0x3a4773e600086a753862621a26a2e3274610da43': 19,
      '0x266437e6c7500a947012f19a3de96a3881a0449e': 20,
      '0x192bdcdd7b95a97ec66de5630a85967f6b79e695': 21,
      '0xce32b28c19c61b19823395730a0c7d91c671e54b': 22,
      '0xfa32616447c51f056db97bc1d0e2d4c0c4d059c9': 23,
      '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9': 24,
      '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d': 25,
    };

    if (this.xpolarPoolQuery?.data === undefined) {
      await new Promise((resolve, reject) => {
        const loop = () => (this.xpolarPoolQuery?.data !== undefined ? resolve(this.xpolarPoolQuery?.data) : setTimeout(loop, 100));
        loop();
      });
    }
    const xpolarPool = this.xpolarPoolQuery?.data;

    const xpolarBalance = xpolarPool.value?.onchain?.tokens['0xeaf7665969f1daa3726ceada7c40ab27b3245993']?.balance;
    const nearBalance = xpolarPool.value?.onchain?.tokens['0x990e50e781004ea75e2ba3a67eb69c0b1cd6e3a6']?.balance;

    const nearPrice = this.prices['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d']['usd'];

    const xpolarPrice = (Number(nearBalance) / Number(xpolarBalance) / (0.2 / 0.4)) * Number(nearPrice);
    const pid = PID[pool.address.toLowerCase()];
    const depositToken = new Contract(pool.address, ERC20ABI, w3);
    const depositTokenPrice = '0';
    const stakedInPool = BigNumberToString(await depositToken.balanceOf(xpolarRewardPoolAddress), 14, 4);

    const TVL = new BigNumberJs(pool.totalLiquidity || '')
      .div(pool.totalShares || '')
      .times(stakedInPool)
      .toString();
    const xpolarPerSecond = await xpolarRewardPool.xpolarPerSecond();
    const allocPoint = (await xpolarRewardPool.poolInfo(pid)).allocPoint;
    const finalXpolarPerSecond = BigNumberToString(xpolarPerSecond.mul(allocPoint).div(800000), 14, 4);
    const tokenPerHour = Number(finalXpolarPerSecond) * 60 * 60;
    const totalRewardPricePerYear = tokenPerHour * 24 * 365 * xpolarPrice;
    const totalRewardPricePerDay = tokenPerHour * 24 * xpolarPrice;
    const dailyAPR = Math.ceil((totalRewardPricePerDay / Number(TVL)) * 100).toString();
    const yearlyAPR = Math.ceil((totalRewardPricePerYear / Number(TVL)) * 100).toString();

    // const apr = await this.getPoolApr(poolAddress, poolId);
    // this.apr = apr.yearlyAPR;
    if (this.account != '') {
    } else {
      return;
    }
    const stakedBal = await balance(pool.address, this.account);

    // this.apr = (await getPoolApr(poolAddress, poolId, this.prices)).yearlyAPR;
    const xpolToClaim = BigNumberToString(await pendingShare(pool.address, this.account), 14, 4);

    return { address: pool.address, pool: pool, approved: approval, stakedBalance: Number(stakedBal), xpolarToClaim: xpolToClaim };
  }
  private async fetchSingle(id: string) {
    const { balance, isApproved, pendingShare } = useStake();

    console.log('Fetching claim info for SingleStake: ' + id);
    const approval = await isApproved(id, this.account);
    const stakedBal = await balance(id, this.account);
    const xpolToClaim = BigNumberToString(await pendingShare(id, this.account), 14, 4);

    return { address: id, pool: undefined, approved: approval, stakedBalance: Number(stakedBal), xpolarToClaim: xpolToClaim };
  }
}
