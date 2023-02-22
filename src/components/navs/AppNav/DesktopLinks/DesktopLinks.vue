<script lang="ts" setup>
import { useRoute } from 'vue-router';

import useWeb3 from '@/services/web3/useWeb3';

const { isGoerli } = useWeb3();

import DesktopLinkItem from './DesktopLinkItem.vue';
import ArrowDown from './arrowdown.svg';
import Arrow from './arrow.svg';

/**
 * COMPOSABLES
 */
const route = useRoute();

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
    <DesktopLinkItem to="/trade" :active="isActive('trade')">
      {{ $t('Swap') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/" :active="isActive('home')">
      {{ $t('Earn') }}
    </DesktopLinkItem>
    <!-- <DesktopLinkItem v-if="isGoerli" to="/faucet" :active="isActive('faucet')">
      Faucet
    </DesktopLinkItem> -->
    <DesktopLinkItem to="/sunrise" :active="isActive('sunrise')">
      {{ $t('Sunrise') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/bond" :active="isActive('bond')">
      Bond
    </DesktopLinkItem>
    <!--DesktopLinkItem to="/vebal" :active="isActive('vebal')">
      Portfolio
    </DesktopLinkItem -->
    <DesktopLinkItem to="/airdrop" :active="isActive('airdrop')">
      Airdrop
    </DesktopLinkItem>
    <DesktopLinkItem to="/vexpolar" :active="isActive('vexpolar')">
      vexPolar
    </DesktopLinkItem>

    <div class="dropdown">
      <div class="dropdown-title flex w-full gap-[12px]">
        Bridges <img :src="ArrowDown" />
      </div>
      <div class="dropdown-content w-full">
        <a
          href="https://synapseprotocol.com/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>Synapse</div>
            <img src="./arrow.svg" />
          </div>
        </a>
        <a
          href="https://multichain.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>Multichain</div>
            <img src="./arrow.svg" /></div
        ></a>
        <a
          href="https://allbridge.io/classic/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>Allbridge</div>
            <img src="./arrow.svg" /></div
        ></a>
        <a
          href="https://cbridge.celer.network/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>CBridge</div>
            <img src="./arrow.svg" /></div
        ></a>
        <a
          href="https://rainbowbridge.app/"
          target="_blank"
          rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>Rainbow Bridge</div>
            <img src="./arrow.svg" /></div
        ></a>
        <a href="https://meson.fi/" target="_blank" rel="noopener noreferrer"
          ><div class="flex w-full justify-between">
            <div>Meson</div>
            <img src="./arrow.svg" /></div
        ></a>
      </div>
    </div>

    <!-- <DesktopLinkItem to="/claim" :active="isActive('claim')">
      <div class="flex items-center">
        {{ $t('claim') }}
        <StarsIcon class="ml-0.5 w-3.5 h-5" />
      </div>
    </DesktopLinkItem> -->
  </div>
</template>

<style scoped>
.desktop-links {
  @apply grid h-full w-[600px] grid-flow-col grid-rows-1 content-center justify-between font-semibold;
}

.dropdown-title {
  display: flex;
  align-items: center;
  vertical-align: middle;
  height: 100%;
}

.dropbtn {
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
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
  color: #ffffff;
  padding: 10px 16px;
}

/* Links inside the dropdown */
.dropdown-content a {
  padding: 6px 0px;
  text-decoration: none;
  display: block;
  color: white;
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
