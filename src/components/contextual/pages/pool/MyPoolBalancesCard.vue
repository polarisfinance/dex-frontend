<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';

import { POOL_MIGRATIONS_MAP } from '@/components/forms/pool_actions/MigrateForm/constants';
import { PoolMigrationType } from '@/components/forms/pool_actions/MigrateForm/types';
import useStaking from '@/composables/staking/useStaking';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { lpTokensFor, usePool } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { MIN_FIAT_VALUE_POOL_MIGRATION } from '@/constants/pools';
import { bnum, isSameAddress } from '@/lib/utils';
import PoolCalculator from '@/services/pool/calculator/calculator.sevice';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import useWithdrawMath from '@/components/forms/pool_actions/WithdrawForm/composables/useWithdrawMath';

const { isDesktop, isMobile } = useBreakpoints();

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

const { account, connector, startConnectWithInjectedProvider } = useWeb3();

/**
 * COMPOSABLES
 */
const { tokens, balances, balanceFor, getTokens } = useTokens();
const { fNum2, toFiat } = useNumbers();
const { isWalletReady } = useWeb3();
const { isStableLikePool, isStablePhantomPool, isMigratablePool } = usePool(
  toRef(props, 'pool')
);
// const {
//   userData: { stakedSharesForProvidedPool },
// } = useStaking();
const router = useRouter();

/**
 * SERVICES
 */
const poolCalculator = new PoolCalculator(
  toRef(props, 'pool'),
  tokens,
  balances,
  'exit',
  ref(false)
);

/**
 * COMPUTED
 */
const bptBalance = computed((): string => balanceFor(props.pool.address));

const poolTokens = computed(() =>
  Object.values(getTokens(props.pool.tokensList))
);

const propTokenAmounts = computed((): string[] => {
  const { receive } = poolCalculator.propAmountsGiven(
    bnum(bptBalance.value).toString(),
    0,
    'send'
  );

  if (isStablePhantomPool.value) {
    // Return linear pool's main token balance using the price rate.
    // mainTokenBalance = linearPoolBPT * priceRate
    return props.pool.tokensList.map((address, i) => {
      if (!props.pool?.onchain?.linearPools) return '0';

      const priceRate = props.pool.onchain.linearPools[address].priceRate;

      return bnum(receive[i]).times(priceRate).toString();
    });
  }

  return receive;
});

const tokenAddresses = computed((): string[] => {
  if (isStablePhantomPool.value) {
    // We're using mainToken balances for StablePhantom pools
    // so return mainTokens here so that fiat values are correct.
    return props.pool.mainTokens || [];
  }
  return props.pool.tokensList;
});

const fiatValue = computed(() =>
  tokenAddresses.value
    .map((address, i) => toFiat(propTokenAmounts.value[i], address))
    .reduce((total, value) => bnum(total).plus(value).toString())
);

const showMigrateButton = computed(
  () =>
    bnum(bptBalance.value).gt(0) &&
    isMigratablePool(props.pool) &&
    // TODO: this is a temporary solution to allow only big holders to migrate due to gas costs.
    bnum(fiatValue.value).gt(MIN_FIAT_VALUE_POOL_MIGRATION)
);
/**
 * METHODS
 */
function weightLabelFor(address: string): string {
  if (!props.pool || !props.pool) return '-';
  const weight = props.pool?.onchain?.tokens?.[address]?.weight;
  return weight
    ? fNum2(weight, {
        style: 'percent',
        maximumFractionDigits: 0,
      })
    : '-';
}

function fiatLabelFor(index: number, address: string): string {
  const fiatValue = toFiat(propTokenAmounts.value[index], address);
  return fNum2(fiatValue, FNumFormats.fiat);
}

function navigateToPoolMigration(pool: Pool) {
  router.push({
    name: 'migrate-pool',
    params: {
      from: pool.id,
      to: POOL_MIGRATIONS_MAP[PoolMigrationType.AAVE_BOOSTED_POOL].toPoolId,
    },
    query: {
      returnRoute: 'pool',
      returnParams: JSON.stringify({ id: pool.id }),
    },
  });
}

const { hasBpt } = useWithdrawMath(toRef(props, 'pool'));
const { nativeAsset, wrappedNativeAsset } = useTokens();

const fiatTotal = computed(() => {
  const fiatValue = lpTokensFor(props.pool)
    .map(address => {
      let tokenBalance = '0';

      if (isSameAddress(address, wrappedNativeAsset.value.address)) {
        const wrappedBalance = balanceFor(address);
        const nativeBalance = balanceFor(nativeAsset.address);
        tokenBalance = bnum(nativeBalance).gt(wrappedBalance)
          ? nativeBalance
          : wrappedBalance;
      } else {
        tokenBalance = balanceFor(address);
      }

      return toFiat(tokenBalance, address);
    })
    .reduce((total, value) => bnum(total).plus(value).toString());

  return fNum2(fiatValue, FNumFormats.fiat);
});
</script>

<template>
  <div class="my-pool-container" v-if="isDesktop">
    <div class="my-pool-upper">
      <div class="flex justify-between">
        <div>My pool balance</div>
        <div>
          {{ isWalletReady ? fNum2(fiatValue, FNumFormats.fiat) : '-' }}
        </div>
      </div>
      <div class="my-[12px] border" />
      <div>
        <div
          v-for="(address, idx) in tokenAddresses"
          :key="idx"
          class="token-name mb-[12px] flex items-center justify-between"
        >
          <div class="flex items-center">
            <BalAsset :address="address" :size="32" class="mr-[12px]" />
            <div class="flex-column">
              <div>
                <!-- {{ symbolFor(address) }} -->
                {{ poolTokens[idx].symbol }}
              </div>
              <div class="token-subtitle">
                <!-- {{ symbolFor(address) }} -->
                {{ poolTokens[idx].symbol }}
              </div>
            </div>
          </div>
          <div>
            <span class="flex flex-grow flex-col text-right">
              {{
                isWalletReady
                  ? fNum2(propTokenAmounts[idx], FNumFormats.token)
                  : '-'
              }}
              <span class="text-secondary text-sm">
                {{ isWalletReady ? fiatLabelFor(idx, address) : '-' }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#2E2433] p-[12px]">
      <div class="small-text">Based on pool tokens in your wallet</div>
      <div class="mb-[12px] flex justify-between">
        <div>You can invest</div>
        <div>{{ fiatTotal }}</div>
      </div>
      <button
        v-if="!account"
        @click="startConnectWithInjectedProvider"
        class="connect-btn-pool w-full"
      >
        Connect Wallet
      </button>
      <div v-else>
        <div class="flex w-full gap-[8px]">
          <router-link
            class="invest-btn w-full text-center"
            :to="'/pool/' + pool.id + '/invest'"
            >Invest</router-link
          >
          <router-link
            class="withdraw-btn w-full text-center"
            :to="'/pool/' + pool.id + '/withdraw'"
            >Withdraw</router-link
          >
        </div>
      </div>
    </div>
  </div>
  <div class="my-pool-container" v-if="isMobile">
    <div class="my-pool-upper">
      <div class="flex justify-between">
        <div>My pool balance</div>
        <div>
          {{ isWalletReady ? fNum2(fiatValue, FNumFormats.fiat) : '-' }}
        </div>
      </div>
      <div class="my-[12px] border" />
      <div>
        <div
          v-for="(address, idx) in tokenAddresses"
          :key="idx"
          class="token-name mb-[12px] flex items-center justify-between"
        >
          <div class="flex items-center">
            <BalAsset :address="address" :size="32" class="mr-[12px]" />
            <div class="flex-column">
              <div>
                {{ poolTokens[idx].symbol }}
              </div>
              <div class="token-subtitle">
                {{ poolTokens[idx].symbol }}
              </div>
            </div>
          </div>
          <div>
            <span class="flex flex-grow flex-col text-right">
              {{
                isWalletReady
                  ? fNum2(propTokenAmounts[idx], FNumFormats.token)
                  : '-'
              }}
              <span class="text-secondary text-sm">
                {{ isWalletReady ? fiatLabelFor(idx, address) : '-' }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#2E2433] p-[12px]">
      <div class="small-text">Based on pool tokens in your wallet</div>
      <div class="mb-[12px]">You can invest</div>
      <button
        class="connect-btn-pool w-full"
        @click="startConnectWithInjectedProvider"
      >
        Connect Wallet
      </button>
    </div>
  </div>
  <!-- <BalCard shadow="2xl" noPad class="rounded-xl">
    <template #header>
      <div class="card-header">
        <h5>
          {{ $t('poolTransfer.myPoolBalancesCard.title') }}
        </h5>
        <h5>
          {{ isWalletReady ? fNum2(fiatValue, FNumFormats.fiat) : '-' }}
        </h5>
      </div>
    </template>
    <div class="py-2 px-4">
      <div
        v-for="(address, index) in tokenAddresses"
        :key="address"
        class="asset-row"
      >
        <div class="flex items-center">
          <BalAsset
            :address="poolTokens[index].address"
            :size="36"
            class="mr-4"
          />
          <div class="flex flex-col">
            <span>
              <span v-if="!isStableLikePool">
                {{ weightLabelFor(address) }}
              </span>
              {{ poolTokens[index].symbol }}
            </span>
            <span class="text-sm text-secondary">
              {{ poolTokens[index].name }}
            </span>
          </div>
        </div>

        <span class="flex flex-col flex-grow text-right">
          {{
            isWalletReady
              ? fNum2(propTokenAmounts[index], FNumFormats.token)
              : '-'
          }}
          <span class="text-sm text-secondary">
            {{ isWalletReady ? fiatLabelFor(index, address) : '-' }}
          </span>
        </span>
      </div>
      <BalBtn
        v-if="showMigrateButton"
        color="blue"
        class="mt-4"
        block
        @click.prevent="navigateToPoolMigration(props.pool)"
      >
        {{ $t('migratePool.migrateToBoostedPool') }}
      </BalBtn>
    </div>
    <template #footer>
      <PoolActionsCard :pool="pool" :missingPrices="missingPrices" />
    </template>
  </BalCard> -->
</template>

<style scoped>
.card-header {
  @apply flex w-full items-center justify-between p-4;
  @apply border-b dark:border-gray-700;
}

.asset-row {
  @apply flex items-center justify-between py-3 text-lg;
}

.pool-actions-card {
  @apply relative;
}

@media (min-width: 768px) and (min-height: 600px) {
  .pool-actions-card {
    @apply sticky top-24;
  }
}

.staking-incentives :deep(.active-section) {
  @apply border-transparent;
}

.table-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}

.pool-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;

  color: #ffffff;
}

.pool-subtitle {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.token-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.my-pool-balance {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
}

.my-pool-container {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.my-pool-upper {
  padding: 12px;
}

.border {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
}

.token-subtitle {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  color: rgba(245, 225, 255, 0.7);
}

.small-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.connect-btn-pool {
  background: #7b307f;
  border-radius: 12px;
  padding: 12px 0px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
}

.connect-btn-pool:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.connect-btn-pool:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}

.AC-container {
  background: linear-gradient(#180a1e, #180a1e) padding-box,
    linear-gradient(to bottom left, #fbaaff, #ea8d3a, #734a79) border-box;
  border: 1px solid transparent;
  border-radius: 22px;

  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;

  padding: 12px 24px;
}

.brd {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
}

.deposit {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.approve-btn {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  background: linear-gradient(
    90.64deg,
    #fbaaff -20.45%,
    #f89c35 36.77%,
    #7b307f 100.27%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}

.approve-btn-placeholder {
  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
}

.invest-btn {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    #7b307f 0%,
    rgba(123, 48, 127, 0.81) 100%
  );
  border-radius: 12px;
  padding: 12px 0px;
  color: #fdfdfd;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}

.withdraw-btn {
  padding: 12px 0px;
  background: #231928;
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: rgba(245, 225, 255, 0.7);
}
</style>
