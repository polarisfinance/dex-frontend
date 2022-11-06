<template>
  <div v-if="routes.length > 0" shadow="none" class="title p-[9px]">
    <div
      class="flex cursor-pointer items-center text-[14px] font-semibold text-[#CAC7CC]"
    >
      <div class="mr-2">
        {{ $t('tradeRoute') }}
      </div>
      <!-- <BalIcon v-if="visible" name="chevron-up" size="sm" />
      <BalIcon v-else name="chevron-down" size="sm" /> -->
    </div>
    <div class="mt-2">
      <div
        v-if="routes.length === 0"
        class="text-secondary mt-5 text-sm"
        v-text="$t('noData')"
      />
      <div v-else>
        <div>
          <div class="flex justify-between text-xs">
            <div>
              <div class="token-amount">
                {{ input.amount }}
              </div>
              <div class="token-symbol">
                {{ input.symbol }}
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="token-amount">
                {{ output.amount }}
              </div>
              <div class="token-symbol">
                {{ output.symbol }}
              </div>
            </div>
          </div>
          <div class="relative mt-2">
            <div class="pair-line dotted-border absolute mx-9 h-1/2 border-b" />
            <div class="relative z-10 flex justify-between">
              <BalAsset :address="input.address" :size="36" />
              <BalAsset :address="output.address" :size="36" />
            </div>
          </div>
        </div>
        <div
          class="flex justify-between"
          :style="{ margin: `8px ${12 + routes.length}px` }"
        >
          <!-- <BalIcon
            name="triangle"
            size="xxs"
            :filled="true"
            class="transform rotate-180 text-secondary"
          /> -->
          <ArrowDown />
          <ArrowUp />
          <!-- <BalIcon
            name="triangle"
            size="xxs"
            :filled="true"
            class="text-secondary"
          /> -->
        </div>
        <div class="relative my-1.5 mx-4">
          <div
            v-for="(route, index) in routes"
            :key="index"
            :style="{
              height: `${18 + 70 * index}px`,
              width: `calc(100% - ${4 * (routes.length - index - 1)}px + 1px)`,
              margin: `0 ${2 * (routes.length - index - 1) - 1}px`,
            }"
            class="border-design absolute"
          />
          <div class="relative z-10">
            <div
              v-for="route in routes"
              :key="route.hops[0]?.pool?.address"
              class="mt-9 flex justify-between first:mt-0"
            >
              <div class="ml-4 flex w-4 items-center">
                <!-- <BalIcon
                  name="triangle"
                  size="xxs"
                  :filled="true"
                  class="transform rotate-90 text-secondary"
                /> -->
              </div>
              <div class="flex">
                <div
                  v-for="hop in route.hops"
                  :key="hop?.pool?.address"
                  class="route ml-4 flex first:ml-0"
                >
                  <a
                    class="flex"
                    :href="getPoolLink(hop.pool.id)"
                    target="_blank"
                  >
                    <BalAsset
                      v-for="token in hop.pool.tokens"
                      :key="token.address"
                      class="ml-1.5 h-24 w-24 first:ml-0"
                      :address="token.address"
                      :size="24"
                    />
                  </a>
                </div>
              </div>
              <div class="percentage mr-4 w-10 text-right text-xs">
                {{ formatShare(route.share) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SubgraphPoolBase, SwapV2 } from '@balancer-labs/sdk';
import { Network } from '@balancer-labs/sdk';
import { Pool } from '@balancer-labs/sor/dist/types';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { NATIVE_ASSET_ADDRESS } from '@/constants/tokens';
import { isSameAddress } from '@/lib/utils';
import { SorReturn } from '@/lib/utils/balancer/helpers/sor/sorManager';
import useWeb3 from '@/services/web3/useWeb3';
import Check from './check.vue';
import ArrowUp from './ArrowUp.vue';
import ArrowDown from './ArrowDown.vue';

interface Route {
  share: number;
  hops: Hop[];
}

interface Hop {
  pool: {
    id: string;
    tokens: Asset[];
  };
  tokenIn: string;
  tokenOut: string;
  amount: BigNumber;
}

interface Asset {
  address: string;
  share: number;
}

export default defineComponent({
  components: {
    Check,
    ArrowUp,
    ArrowDown,
  },
  props: {
    addressIn: {
      type: String,
      required: true,
    },
    amountIn: {
      type: String,
      required: true,
    },
    addressOut: {
      type: String,
      required: true,
    },
    amountOut: {
      type: String,
      required: true,
    },
    pools: {
      type: Array as PropType<(Pool | SubgraphPoolBase)[]>,
      required: true,
    },
    sorReturn: {
      type: Object as PropType<SorReturn>,
      required: true,
    },
  },
  setup(props) {
    const { fNum2 } = useNumbers();

    const { appNetworkConfig } = useWeb3();
    const { getToken } = useTokens();

    const visible = ref(false);

    function toggleVisibility(): void {
      visible.value = !visible.value;
    }

    const input = computed(() => {
      const symbol = getToken(props.addressIn).symbol;
      return {
        amount: props.amountIn,
        address: props.addressIn,
        symbol,
      };
    });

    const output = computed(() => {
      const symbol = getToken(props.addressOut).symbol;
      return {
        amount: props.amountOut,
        address: props.addressOut,
        symbol,
      };
    });

    const routes = computed(() => {
      const { sorReturn } = props;

      if (!sorReturn.hasSwaps) {
        return [];
      }

      const pools = props.pools as SubgraphPoolBase[];
      const swaps = sorReturn.result.swaps;
      const addresses = sorReturn.result.tokenAddresses;
      const addressIn = props.addressIn as string;
      const addressOut = props.addressOut as string;

      return getV2Routes(addressIn, addressOut, pools, swaps, addresses);
    });

    function getV2Routes(
      addressIn: string,
      addressOut: string,
      pools: SubgraphPoolBase[],
      swaps: SwapV2[],
      addresses: string[]
    ) {
      const { addresses: constants } = appNetworkConfig;

      addressIn =
        addressIn === NATIVE_ASSET_ADDRESS
          ? constants.weth
          : getAddress(addressIn);
      addressOut =
        addressOut === NATIVE_ASSET_ADDRESS
          ? constants.weth
          : getAddress(addressOut);

      if (
        !pools.length ||
        !swaps.length ||
        !addresses.length ||
        addresses.length === 1
      ) {
        return [];
      }

      // To get total amount we can use all swaps because multihops have a value of 0
      const totalSwapAmount = swaps.reduce((total, rawHops) => {
        return total.plus(rawHops.amount || '0');
      }, new BigNumber(0));

      // Contains direct and multihops
      const routes: Route[] = [];
      // Contains every token > token hop
      const allHops: Hop[] = [];
      for (let i = 0; i < swaps.length; i++) {
        const swap = swaps[i];
        const rawPool = pools.find(pool => pool.id === swap.poolId);

        if (!rawPool) {
          return {};
        }

        const tokenIn =
          addresses[swap.assetInIndex] === AddressZero
            ? constants.weth
            : getAddress(addresses[swap.assetInIndex]);
        const tokenOut =
          addresses[swap.assetOutIndex] === AddressZero
            ? constants.weth
            : getAddress(addresses[swap.assetOutIndex]);

        const isDirectSwap =
          tokenIn === addressIn && tokenOut === addressOut ? true : false;

        const pool = {
          id: rawPool.id,
          tokens: rawPool.tokens
            .map(token => {
              return {
                address: getAddress(token.address),
                share:
                  parseFloat(token.weight || '') || 1 / rawPool.tokens.length,
              };
            })
            .sort((a, b) => {
              if (
                isSameAddress(a.address, tokenIn) ||
                isSameAddress(b.address, tokenOut)
              ) {
                return -1;
              }
              if (
                isSameAddress(a.address, tokenOut) ||
                isSameAddress(b.address, tokenIn)
              ) {
                return 1;
              }
              return a.share - b.share;
            })
            .filter((_token, index, tokens) => {
              // Show first 2 and last 2 tokens
              return index < 2 || index > tokens.length - 3;
            }),
        };

        const hop = {
          pool,
          tokenIn,
          tokenOut,
          amount: new BigNumber(swap.amount || '0'),
        };

        allHops.push(hop);

        if (isDirectSwap) {
          // Direct swaps are pushed to routes array immediately
          const share = hop.amount.div(totalSwapAmount).toNumber();
          const route = {
            share,
            hops: [hop],
          } as Route;
          routes.push(route);
        } else {
          // Only multihops that have a previous partner in sequence are pushed to routes
          if (tokenOut === addressOut && swap.amount === '0') {
            // TokenOut with amount of 0 for multihop means it's a swapExactIn and previous swap is partner of hop
            const swapAmount = new BigNumber(allHops[i - 1].amount);
            const share = swapAmount.div(totalSwapAmount).toNumber();
            const route = {
              share,
              hops: [allHops[i - 1], hop],
            } as Route;
            routes.push(route);
          } else if (tokenIn === addressIn && swap.amount === '0') {
            // TokenIn with amount of 0 for multihop means it's a swapExactOut and previous swap is partner of hop
            const swapAmount = new BigNumber(allHops[i - 1].amount);
            const share = swapAmount.div(totalSwapAmount).toNumber();
            const route = {
              share,
              hops: [hop, allHops[i - 1]],
            } as Route;
            routes.push(route);
          }
        }
      }

      return routes;
    }

    function formatShare(share: number): string {
      return fNum2(share, FNumFormats.percent);
    }

    function getPoolLink(id: string): string {
      const chainId = appNetworkConfig.chainId;
      const prefixMap = {
        [Network.MAINNET]: 'app.',
        [Network.KOVAN]: 'kovan.',
        [Network.GOERLI]: 'goerli.',
        [Network.POLYGON]: 'polygon.',
        [Network.ARBITRUM]: 'arbitrum.',
      };
      const prefix = prefixMap[chainId] || '';

      return `/#/pool/${id}`;
    }
    console.log('routes', routes);
    return {
      visible,
      toggleVisibility,

      input,
      output,
      routes,

      formatShare,
      getPoolLink,
    };
  },
});
</script>

<style scoped>
.pair-line {
  width: calc(100% - 72px);
}

.title {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #b9babb;
}

.token-amount {
  @apply text-text-white;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}

.token-symbol {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #cac7cc;
}

.dotted-border {
  background: linear-gradient(#160d22, #160d22) padding-box,
    linear-gradient(94.84deg, #9747ff 6.12%, #3b44bd 100%) border-box;
  border-bottom: 0.5px dotted #160d22;
  opacity: 0.7;
}

.border-design {
  background: linear-gradient(#160d22, #160d22) padding-box,
    linear-gradient(94.84deg, #9747ff 6.12%, #3b44bd 100%) border-box;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom: 1px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  opacity: 0.7;
}

.percentage {
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  color: #b9babb;
}

.route {
  padding: 4px 6px;
  gap: 6px;

  background: #261737;
  box-shadow: inset 0px 0px 1px rgba(0, 0, 0, 0.25);
  border-radius: 99px;
}
</style>
