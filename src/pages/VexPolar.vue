<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import segniorageImg from './segniorage.svg';
import { POOLS } from '@/constants/pools';
import { PoolWithShares } from '@/services/pool/types';

import {
  orderedPoolTokens,
  orderedTokenAddresses,
} from '@/composables/usePool';

import usePoolFilters from '@/composables/pools/usePoolFilters';
import useStreamedPoolsQuery from '@/composables/queries/useStreamedPoolsQuery';

const { isDesktop, isMobile } = useBreakpoints();

const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

console.log(POOLS);

const {
  dataStates,
  result: investmentPools,
  loadMore,
  isLoadingMore,
} = useStreamedPoolsQuery(selectedTokens);

function iconAddresses(pool: PoolWithShares) {
  return POOLS.Metadata[pool.id]?.hasIcon
    ? [pool.address]
    : orderedTokenAddresses(pool);
}
</script>

<template>
  <div :class="{ 'pg-bg': isDesktop }"></div>
  <div :class="{ 'relative': isDesktop }">
    <div class="vex-container">
      <div class="title">
        <img src="./bubble.svg" />
        <div class="title-text">
          <div>Extra earnings <br />& voting power</div>
          <div class="flex gap-[28px] justify-center mt-[16px]">
            <button class="get-btn">Get VexPolar</button>
            <a href="https://medium.com/@PolarisFinance/polaris-dex-917e45c4869c" target="_blank" class="learn-btn">Learn More</a>
          </div>
        </div>
      </div>
      <div class="title mt-[160px]">
      <div class="title-text">
          Comming soon...
      </div>
      </div>
      <div
        :class="{
          'info-container': isDesktop,
          'info-container-mobile': isMobile,
        }"
        class="mt-[160px]"
      >
        <div class="info">
          <div class="info-title">
            Boost liquidity mining<br />
            yield up to 2.5x
          </div>
          <div class="info-token">
            <img class="w-[124px]" src="./xpolar.svg" />
          </div>
          <div class="info-subtitle">XPOLAR</div>
        </div>
        <div class="info">
          <div class="info-title">
            Vote to direct liquidity <br />
            mining emissions
          </div>
          <div class="info-token">
            <img class="w-[124px]" src="./polar-fancy.svg" />
          </div>
          <div class="info-subtitle">SPOLAR</div>
        </div>
        <div class="info">
          <div class="info-title">
            Earn your share of <br />
            protocol revenue
          </div>
          <div class="info-token">
            <img class="w-[124px]" src="./near.svg" />
          </div>
          <div class="info-subtitle">NEAR</div>
        </div>
      </div>

      <div class="my-vexpolar">
        <div class="my-vexpolar-title">My VexPolar</div>
        <div class="border" />
        <div
          :class="{
            'my-vexpolar-table': isDesktop,
            'my-vexpolar-table-mobile': isMobile,
          }"
        >
          <div class="my-vexpolar-element">
            <div class="my-vexpolar-element-title">My VexPolar</div>
            <div class="my-vexpolar-element-price">$ USD</div>
            <div class="my-vexpolar-element-token">My VexPolar</div>
          </div>
          <div class="my-vexpolar-element">
            <div class="my-vexpolar-element-title">My VexPolar</div>
            <div class="my-vexpolar-element-price">$ USD</div>
            <div class="my-vexpolar-element-token">My VexPolar</div>
          </div>
          <div class="my-vexpolar-element">
            <div class="my-vexpolar-element-title">My VexPolar</div>
            <div class="my-vexpolar-element-price">$ USD</div>
            <div class="my-vexpolar-element-token">My VexPolar</div>
          </div>
          <div class="my-vexpolar-element">
            <div class="my-vexpolar-element-title">My VexPolar</div>
            <div class="my-vexpolar-element-price">$ USD</div>
            <div class="my-vexpolar-element-token">My VexPolar</div>
          </div>
        </div>
      </div>

      <div v-if="isMobile" class="mt-[56px] mx-[24px]">
        <div class="pools-eligible">Pools eligible for liquidity mining</div>
        <div class="content mt-[32px]">
          Liquidity incentives are directed by the community of veBAL holders. If
          you hold veBAL, vote below on any pools across Ethereum and Layer 2’s.
          Your vote will persist until you change it and editing a pool can only
          be done once in 10 days.
        </div>
        <div class="pools-subtitle mt-[32px]">My unallocated votes</div>
        <div class="pools-content mt-[24px]">-</div>

        <div class="pools-subtitle mt-[32px]">Voting period ends</div>
        <div class="pools-content mt-[24px">6d : 6h : 56m : 19s</div>
      </div>

      <div class="table mt-[144px]">
        <div class="table-title">Pools</div>
        <div class="table-head" v-if="isDesktop">
          <div class="flex gap-[12px]">
            <img :src="segniorageImg" />
            <div>Tokens</div>
          </div>
          <div>Composition</div>
          <div>Next Period Votes</div>
        </div>
        <div v-if="isMobile" class="table-head-mobile">
          <div class="flex gap-[12px]">
            <img :src="segniorageImg" />
            <div>Tokens & Composition</div>
          </div>
          <div>Next Votes</div>
        </div>
        <div class="border" />
        <div
          class="flex justify-between items-center"
          v-for="(pool, idx) in investmentPools"
          :key="idx"
        >
          <div class="mt-[24px]">
            <BalAssetSet
              :size="36"
              :addresses="iconAddresses(pool)"
              :width="100"
            />
          </div>
          <div v-if="POOLS.Metadata[pool.id]" class="text-left">
            {{ POOLS.Metadata[pool.id].name }}
          </div>
          <div v-else>
            <TokenPills
              :tokens="
                orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
              "
              :isStablePool="false"
              :selectedTokens="selectedTokens"
              :showWeight="pool['poolType'] != 'Stable'"
            />
          </div>
          <div>-</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pg-bg{
  background-image: url(./vexpolar_bg.svg);
  width: 100%;
  height: 100%;
  position: absolute;
  background-repeat: no-repeat;
  top:0px;
  padding-top: 100px;
}
.pools-content {
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;

  color: #fdfdfd;
}

.pools-subtitle {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  color: #d7b3ff;
}

.content {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;

  color: #f5e1ff;
}

.pools-eligible {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;

  color: #fdfdfd;
}

.my-vexpolar-table-mobile {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.table-head-mobile {
  display: flex;
  justify-content: space-between;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #d7b3ff;

  margin-top: 12px;
}

.table-head {
  display: flex;
  justify-content: space-between;
  margin-top: 27px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #d7b3ff;
}

.table-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #fdfdfd;
}

.table {
  background: #261737;
  border-radius: 16px;

  padding-top: 24px;
  padding-left: 60px;
  padding-bottom: 24px;
  padding-right: 60px;

  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  width: 100%;
}

.my-vexpolar-element-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;

  color: #fdfdfd;
}

.my-vexpolar-element-price {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-top: 8px;

  color: #fdfdfd;
}

.my-vexpolar-element-token {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  color: rgba(245, 225, 255, 0.7);
}

.my-vexpolar-element {
  display: flex;
  flex-direction: column;
}

.my-vexpolar-table {
  display: flex;
  justify-content: space-between;
}

.my-vexpolar-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;

  color: #fdfdfd;
}

.my-vexpolar {
  background: #261737;
  border-radius: 16px;

  padding-top: 24px;
  padding-bottom: 24px;

  padding-left: 60px;
  padding-right: 60px;

  margin-top: 100px;

  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
}

.border {
  border: 0.5px solid rgba(59, 68, 189, 0.4);
  width: 100%;
  margin-bottom: 24px;
  margin-top: 24px;
}

.info-token {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  width: 100%;
}

.info-container-mobile {
  display: flex;
  flex-direction: column;
}

.info-subtitle {
  text-align: center;

  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-top: 24px;

  color: #fdfdfd;
}

.info-container {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.info-title {
  color: #d7b3ff;
  text-align: center;

  font-weight: 500;
  font-size: 24px;
  line-height: 31px;
  text-align: center;
}

.info {
  display: flex;
  flex-direction: column;
}
.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}

.get-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #f5f5f5;

  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 50px;
  padding-right: 50px;
}

.learn-btn {
  border: 1px solid rgba(64, 51, 71, 0.5);
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #f5f5f5;

  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 50px;
  padding-right: 50px;
}
</style>
