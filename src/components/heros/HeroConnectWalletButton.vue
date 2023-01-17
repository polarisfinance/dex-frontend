<script lang="ts" setup>
import useDarkMode from '@/composables/useDarkMode';
import useFathom from '@/composables/useFathom';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * COMPOSABLES
 */
const { startConnectWithInjectedProvider } = useWeb3();
const { trackGoal, Goals } = useFathom();
const { darkMode } = useDarkMode();

/**
 * METHODS
 */
function onClickConnect() {
  startConnectWithInjectedProvider();
  trackGoal(Goals.ClickHeroConnectWallet);
}
</script>

<template>
  <button class="connect-wallet-button" @click="onClickConnect">
    {{ $t('connectWallet') }}
  </button>
</template>

<style scoped>
.connect-wallet-button {
  background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
  border-radius: 12px;
  align-items: center;
  padding: 12px 44px;
  gap: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FDFDFD;
}

.connect-wallet-button:hover {
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
}

.connect-wallet-button:active {
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
}
</style>
