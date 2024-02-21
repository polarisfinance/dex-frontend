import { TransactionResponse } from '@ethersproject/abstract-provider';
import { formatUnits } from '@ethersproject/units';
import { BigNumber, Contract } from 'ethers';
import { zipObject } from 'lodash';

import FeeDistributorABI from '@/lib/abi/FeeDistributor.json';
import FeeDistributorStaticABI from '@/lib/abi/FeeDistributorStatic.json';
import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { BalanceMap } from '@/services/token/concerns/balances.concern';
import { walletService as walletServiceInstance } from '@/services/web3/wallet.service';
import { getOldMulticaller } from '@/dependencies/OldMulticaller';

export class FeeDistributor {
  public claimableTokens: string[] = [
    '0xeAf7665969f1DaA3726CEADa7c40Ab27B3245993', // XPOLAR
    '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802', // USDC
    '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6', // pNEAR
    '0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79', // AURORA
    '0x0f00576d07B594Bdc1caf44b6014A6A02E5AFd48', // SOL
    '0x3b73F4336a33eE36106Bb5C6d697192391db740F', // TLOS
  ];

  constructor(
    public readonly address: string,
    private readonly abi = FeeDistributorABI,
    private readonly staticAbi = FeeDistributorStaticABI,
    private readonly config = configService,
    private readonly walletService = walletServiceInstance,
    private readonly provider = rpcProviderService.jsonProvider
  ) {}

  /**
   * @summary Instantiates a contract instance for the FeeDistributor.
   * @returns Ethers Contract instance
   */
  public getInstance(): Contract {
    return new Contract(this.address, this.abi, this.provider);
  }

  /**
   * @summary Instantiates a multicaller instance of the FeeDistributor
   */
  public getMulticaller() {
    const Multicaller = getOldMulticaller();
    return new Multicaller(this.config.network.key, this.provider, this.abi);
  }

  /**
   * @summary Get claimable protocol fee reward balances
   * @descrition To get claimable balances we have to simulate a transaction to
   * the claimTokens method by modifing the ABI to make it a view function.
   */
  public async getClaimableBalances(userAddress: string): Promise<BalanceMap> {
    const balances = await this.walletService.txBuilder.contract.callStatic<
      BigNumber[]
    >({
      contractAddress: this.address,
      abi: this.staticAbi,
      action: 'claimTokens',
      params: [userAddress, this.claimableTokens],
    });
    const stringBalances = balances.map(balance => balance.toString());

    return zipObject(this.claimableTokens, stringBalances);
  }

  /**
   * @summary Claim all protocol reward token balances.
   */
  public async claimBalances(
    userAddress: string
  ): Promise<TransactionResponse> {
    return await this.walletService.txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: this.abi,
      action: 'claimTokens',
      params: [userAddress, this.claimableTokens],
    });
  }

  /**
   * @summary Claim specific protocol reward token balance.
   */
  public async claimBalance(
    userAddress: string,
    tokenAddress: string
  ): Promise<TransactionResponse> {
    return await this.walletService.txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: this.abi,
      action: 'claimToken',
      params: [userAddress, tokenAddress],
    });
  }

  /**
   * @summary Get total token distribution in week.
   * @param {string} token address to check distribution for, either bb-a-USD or BAL
   * @param {number} timestamp unix timestamp of epoch to check, has to be exact
   * epoch timestamp
   */
  public async getTokensDistributedInWeek(
    token: string,
    timestamp: number,
    instance?: Contract
  ): Promise<string> {
    if (!instance) instance = this.getInstance();
    const amount = await instance.getTokensDistributedInWeek(token, timestamp);

    return formatUnits(amount, 18);
  }

  /**
   * @summary Get total veBAL supply at epoch.
   * @param {number} timestamp unix timestamp of epoch to check, has to be exact
   * epoch timestamp
   */
  public async getTotalSupply(
    timestamp: number,
    instance?: Contract
  ): Promise<string> {
    if (!instance) instance = this.getInstance();
    const amount = await instance.getTotalSupplyAtTimestamp(timestamp);

    return formatUnits(amount, 18);
  }
}
