import { BalancerSDK } from '@balancer-labs/sdk';
import { configService } from '@/services/config/config.service';
import { ref } from 'vue';
import { isTestMode } from '@/plugins/modes';

export const balancer = new BalancerSDK({
  network: configService.network.chainId,
  rpcUrl: configService.rpc,
  customSubgraphUrl: configService.network.subgraph || undefined,
});

export const hasFetchedPoolsForSor = ref(false);

export async function fetchPoolsForSor() {
  if (hasFetchedPoolsForSor.value) return;

  console.time('fetchPoolsForSor');

  // Check if subgraph is available
  const subgraphUrl = configService.network.subgraph;
  if (!subgraphUrl) {
    // No subgraph available (Aurora case)
    // Set flag to true to unblock UI - SOR won't work but direct exits will
    console.log('[fetchPoolsForSor] No subgraph configured, SOR disabled');
    hasFetchedPoolsForSor.value = true;
    console.timeEnd('fetchPoolsForSor');
    return;
  }

  try {
    await balancer.swaps.fetchPools();
    hasFetchedPoolsForSor.value = true;
  } catch (error) {
    // If pool fetch fails, still set flag to true to unblock UI
    console.warn('[fetchPoolsForSor] Failed to fetch pools:', error);
    hasFetchedPoolsForSor.value = true;
  }
  console.timeEnd('fetchPoolsForSor');
}

if (!isTestMode()) fetchPoolsForSor();
