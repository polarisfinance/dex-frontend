/**
 * Fetches Aurora pool data directly from on-chain.
 *
 * Run with: npx ts-node --esm src/lib/scripts/fetch-aurora-pools.ts
 * Or: npm run fetch:aurora-pools
 */
import { Contract } from '@ethersproject/contracts';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';

// Aurora mainnet RPC
const RPC_URL = 'https://mainnet.aurora.dev';
const CHAIN_ID = 1313161554;

// Aurora contract addresses
const VAULT_ADDRESS = '0x6985436a0E5247A3E1dc29cdA9e1D89C5b59e26b';

// Pool IDs from voting-gauges.json (Aurora network)
const AURORA_POOL_IDS = [
  '0x5f5f57abf920a88e77513a28d41df39a0e0b4b6a000200000000000000000035',
  '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
  '0x2ec560ba933e8994482af76d63378bdc5354402100020000000000000000002a',
  '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d000200000000000000000021',
  '0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005',
  '0xec0fac82d2aac483871874407d25614cf6dd9ce5000200000000000000000030',
  '0x6e7c170f95aba8ffbccaf5155706be0682cc5bd900020000000000000000002b',
  '0xae4d320cc49f57a2bf6f628a749f5aba19d2c7ea000200000000000000000031',
  '0xf53a4381f3a4f08726970bc6bb23c4ee3ef101ed000200000000000000000033',
  '0xa6ac7ce1d7aefd7abd06d93e6b89489aedf03d14000200000000000000000029',
  '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b00020000000000000000000f',
  '0x4652df40de98c20e73d88983a8b74e4aa014bdf3000200000000000000000032',
  '0x3c5b26cde094fe7e5c75651a7ab5e9520ec06e5700020000000000000000002e',
  '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c000200000000000000000002',
  '0x0fb037f35f5a00f66e3fc9a29f2dca59c12bfc5f000200000000000000000027',
  '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9000200000000000000000020',
  '0x454adaa07eec2c432c0df4379a709b1fa4c800ed000200000000000000000016',
  '0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006',
  '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
  '0x435de7d1c13cfec80997510bd38bcb45282e6a0f000200000000000000000034',
  '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a',
  '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed00020000000000000000000c',
  '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
  '0xf0b6cf745afe642c4565165922ad62d6a93857c100020000000000000000000e',
  '0x9127442d0a170cc0efb5d164582948f21c37312e000200000000000000000028',
  '0xe03dc509b05e7d80ee863c0d4144ddc5a03e652300020000000000000000002d',
  '0x20169fb10ca8635f4f5c487f7ce811aa5ae08a7300020000000000000000002f',
  '0xb3a04902b78fbe61185b766866193630db4db8a300020000000000000000000d',
  '0x089352cdc9d23ab490317ad5aa838e4e0780165d00020000000000000000002c',
  '0xceecce984f498ee00832670e9ca6d372f6ce155a000200000000000000000014',
  '0xb615c4febfe88b2c93774bcff32b5a5be25e66ec000200000000000000000037',
  '0x8afc3d8ddbcc76de12a219f6ec7226e7a7c190fc000200000000000000000036',
  '0x80cba127d820f0138d252009b7a073955a4e7d75000200000000000000000039',
  '0x614c884caa52a231d74a3553fdddb0b7be53032300020000000000000000003d',
  '0xc38d30794c44c39fe6077dc80704d2a501f2a75800020000000000000000003b',
  '0xdab85176672835e1efc37729540ebc24e18a742500020000000000000000003c',
  '0xe02e913a4f2e5b87b8b953ee3a26f9b4919a0306000200000000000000000040',
  '0x381d8ba80b9bb2b7ae09b895bcb4b0ec8d54703f000200000000000000000042',
  '0xd2aa7c896eedc8d85a5f46b1c9fc3edbf5a7b91d000100000000000000000043',
  '0x5f8e74ebd221342f17e8c5fb1c50089f51cd863a000200000000000000000045',
  '0xe84e5418432beeeb543bbcdf9fa54fd7ea3aa65b000200000000000000000049',
  '0x46218d1962f39d96b9295a86d01849f36bf52a3e000000000000000000000047',
  '0xf45db6b9ea5a531fbde51e3f2915979e9210246d00020000000000000000004a',
  '0x7c2bb9c37036912228f36449d14f0f7e19c861f200020000000000000000004b',
  '0x6f6b70c5b9731fe5e4b1ade898dbb50a23dcb61600020000000000000000004c',
  '0x1ed3bbef2de9fb1b50827a27ee591f09c1ebda9a00020000000000000000004d',
  '0xde394782872384aec124ffc034c065efe1979d8d00020000000000000000004f',
  '0x01aa7c6ae7d654a669919be766132fe3eafc8ba900020000000000000000004e',
  '0x35ff4a0b0d1bf6550e7c4c548f93afec489ae50e000200000000000000000050',
  '0x23a15f4a31c567619388b3234a73921d72cabe3a000200000000000000000053',
];

// ABIs
const VAULT_ABI = [
  'function getPoolTokens(bytes32 poolId) view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)',
];

const POOL_ABI = [
  'function getSwapFeePercentage() view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function getNormalizedWeights() view returns (uint256[])',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

const ERC20_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
];

function getPoolAddress(poolId: string): string {
  return poolId.slice(0, 42);
}

function getPoolType(poolId: string): string {
  // Pool type is encoded in the last 4 bytes
  // 00 = Weighted, 01 = Stable, etc.
  const typeHex = poolId.slice(-2);
  switch (typeHex) {
    case '00':
      return 'Weighted';
    case '01':
      return 'Stable';
    case '02':
      return 'MetaStable';
    default:
      return 'Weighted';
  }
}

async function main() {
  console.log('Fetching Aurora pool data from chain...\n');

  const provider = new StaticJsonRpcProvider(RPC_URL, { chainId: CHAIN_ID, name: 'aurora' });
  const vault = new Contract(VAULT_ADDRESS, VAULT_ABI, provider);

  const pools: any[] = [];
  const errors: string[] = [];

  for (const poolId of AURORA_POOL_IDS) {
    const poolAddress = getPoolAddress(poolId);
    const poolType = getPoolType(poolId);

    try {
      // Fetch pool tokens and balances from Vault
      const [tokens, balances] = await vault.getPoolTokens(poolId);

      // Fetch pool-specific data
      const pool = new Contract(poolAddress, POOL_ABI, provider);
      const [swapFee, totalSupply] = await Promise.all([
        pool.getSwapFeePercentage().catch(() => '3000000000000000'), // 0.3% default
        pool.totalSupply(),
      ]);

      // Get weights for weighted pools
      let weights: string[] = [];
      if (poolType === 'Weighted') {
        try {
          const rawWeights = await pool.getNormalizedWeights();
          weights = rawWeights.map((w: any) => formatUnits(w, 18));
        } catch {
          // Default equal weights
          weights = tokens.map(() => (1 / tokens.length).toString());
        }
      }

      // Fetch token details
      const tokenData = await Promise.all(
        tokens.map(async (tokenAddress: string, i: number) => {
          const token = new Contract(tokenAddress, ERC20_ABI, provider);
          const [decimals, symbol, name] = await Promise.all([
            token.decimals().catch(() => 18),
            token.symbol().catch(() => 'UNKNOWN'),
            token.name().catch(() => 'Unknown Token'),
          ]);

          return {
            address: tokenAddress,
            balance: formatUnits(balances[i], decimals),
            decimals,
            symbol,
            name,
            weight: weights[i] || null,
            priceRate: '1',
          };
        })
      );

      const poolData = {
        id: poolId,
        address: poolAddress,
        poolType,
        swapFee: formatUnits(swapFee, 18),
        totalShares: formatUnits(totalSupply, 18),
        tokens: tokenData,
        tokensList: tokens,
      };

      pools.push(poolData);
      console.log(`✓ ${poolId.slice(0, 10)}... (${poolType})`);
    } catch (error) {
      errors.push(`Error for pool ${poolId.slice(0, 10)}...: ${error}`);
      console.log(`✗ ${poolId.slice(0, 10)}... -> Error: ${error}`);
    }
  }

  console.log('\n--- STATIC POOL DATA ---\n');
  console.log('// Add this to src/lib/config/aurora/staticPools.ts\n');
  console.log('export const AURORA_STATIC_POOLS = ');
  console.log(JSON.stringify(pools, null, 2));
  console.log(';');

  if (errors.length > 0) {
    console.log('\n--- ERRORS ---');
    errors.forEach(e => console.log(e));
  }

  console.log(`\nTotal: ${pools.length} pools fetched out of ${AURORA_POOL_IDS.length}`);
}

main().catch(console.error);
