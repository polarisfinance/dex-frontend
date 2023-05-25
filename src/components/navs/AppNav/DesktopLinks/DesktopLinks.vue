<script lang="ts" setup>
import { useRoute } from 'vue-router';
import useWeb3 from '@/services/web3/useWeb3';
import DesktopLinkItem from './DesktopLinkItem.vue';
import useNetwork from '@/composables/useNetwork';
import { Goals, trackGoal } from '@/composables/useFathom';

const { isGoerli } = useWeb3();

/**
 * COMPOSABLES
 */
const route = useRoute();
const { networkSlug } = useNetwork();

/**
 * METHODS
 */
function isActive(page: string): boolean {
  if (route.name === page) return true;
  return false;
}
</script>

<template>
  <div class="desktop-links">
    <DesktopLinkItem
      :to="{ name: 'home', params: { networkSlug } }"
      :active="isActive('home')"
      prefetch
      @click="trackGoal(Goals.ClickNavPools)"
    >
      {{ $t('earn') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'swap', params: { networkSlug } }"
      :active="isActive('swap')"
      prefetch
      @click="trackGoal(Goals.ClickNavSwap)"
    >
      {{ $t('swap') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/sunrise" :active="isActive('sunrise')">
      {{ $t('Sunrise') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/bond" :active="isActive('bond')">
      {{ $t('Bond') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/airdrop" :active="isActive('airdrop')">
      Airdrop
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'claim', params: { networkSlug } }"
      :active="isActive('claim')"
      prefetch
      @click="trackGoal(Goals.ClickNavClaim)"
    >
      <div class="flex items-center">
        {{ $t('claim') }}
      </div>
    </DesktopLinkItem>
    <DesktopLinkItem
      v-if="isGoerli"
      :to="{ name: 'faucet', params: { networkSlug } }"
      :active="isActive('faucet')"
    >
      Faucet
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'portfolio', params: { networkSlug } }"
      :active="isActive('portfolio')"
      prefetch
      @click="trackGoal(Goals.ClickNavPortfolio)"
    >
      {{ $t('portfolio') }}
    </DesktopLinkItem>
    <DesktopLinkItem
      :to="{ name: 'vexpolar', params: { networkSlug } }"
      :active="isActive('vexpolar')"
      prefetch
      @click="trackGoal(Goals.ClickNavVebal)"
    >
      veXPOLAR
    </DesktopLinkItem>
    <div class="dropdown mt-[30px]">
      <div class="flex w-full dropdown-title gap-[12px]">
        Bridges
        <BalIcon name="chevron-down" size="sm" />
      </div>
      <div class="w-full dropdown-content">
        <a
          href="https://synapseprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>Synapse</div>
            <BalIcon name="arrow-up-right" size="sm" />
          </div>
        </a>
        <a
          href="https://multichain.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>Multichain</div>
            <BalIcon name="arrow-up-right" size="sm" /></div
        ></a>
        <a
          href="https://allbridge.io/classic/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>Allbridge</div>
            <BalIcon name="arrow-up-right" size="sm" /></div
        ></a>
        <a
          href="https://cbridge.celer.network/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>CBridge</div>
            <BalIcon name="arrow-up-right" size="sm" /></div
        ></a>
        <a
          href="https://rainbowbridge.app/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>Rainbow Bridge</div>
            <BalIcon name="arrow-up-right" size="sm" /></div
        ></a>
        <a href="https://meson.fi/" target="_blank" rel="noopener noreferrer"
          ><div class="flex justify-between w-full">
            <div>Meson</div>
            <BalIcon name="arrow-up-right" size="sm" /></div
        ></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.desktop-links {
  @apply grid gap-6 grid-flow-col grid-rows-1 h-full content-center;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  @apply dark:text-polaris-white font-semibold;
  position: relative;
  display: inline-block;
  vertical-align: bottom;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  border-radius: 22px;
  background: #292043;
  min-width: 200px;
  z-index: 1;
  padding: 10px 16px;
}

/* Links inside the dropdown */
.dropdown-content a {
  padding: 6px 0px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  /* background-color: #f1f1f1; */
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
}
</style>
