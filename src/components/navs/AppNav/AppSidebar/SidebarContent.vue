<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AppLogo from '@/components/images/AppLogo.vue';
import useApp from '@/composables/useApp';
import useConfig from '@/composables/useConfig';
import useDarkMode from '@/composables/useDarkMode';
import { sleep } from '@/lib/utils';
import useWeb3 from '@/services/web3/useWeb3';

import AppNavAccountBtn from '../AppNavAccountBtn.vue';
import MobileWalletBtn from './MobileWalletBtn.vue';

import useBreakpoints from '@/composables/useBreakpoints';

import swapImg from './swap.svg';
import investImg from './invest.svg';
import portfolioImg from './portfolio.svg';
import vexpolarImg from './vexPolar.svg';
import aboutImg from './about.svg';
import helpImg from './help.svg';
import discordImg from './discord.svg';
import docsImg from './docs.svg';
import legalImg from './legal.svg';
import kycImg from './kyc.svg';

/**
 * PROPS & EMITS
 */
const emit = defineEmits(['close', 'ToggleMobileWallet']);

/**
 * COMPOSABLES
 */
const { darkMode, toggleDarkMode } = useDarkMode();
const { blockNumber } = useWeb3();
const { networkConfig } = useConfig();
const { version } = useApp();
const { t } = useI18n();
const router = useRouter();
const { account, connector, startConnectWithInjectedProvider } = useWeb3();
const { isMobile, isDesktop, upToSmallBreakpoint } = useBreakpoints();
console.log(upToSmallBreakpoint);

/**
 * STATE
 */
const blockIcon = ref<HTMLDivElement>();

const navLinks = [
  { label: t('swap'), path: '/trade', img: swapImg },
  { label: 'Earn', path: '/', img: investImg },
  { label: 'Sunrise', path: '/sunrise', img: investImg },
  { label: 'Bond', path: '/bond', img: investImg },
  // { label: t('portfolio'), path: '/vebal', img: portfolioImg },
  { label: 'Airdrop', path: '/airdrop', img: portfolioImg },
  { label: 'vexPOLAR', path: '/vexpolar', img: vexpolarImg },
  // { label: t('claim'), path: '/claim' },
];

const ecosystemLinks = [
  { label: t('About'), url: 'https://home.polarisfinance.io', img: aboutImg },
  // {
  //   label: t('Help Center'),
  //   url: 'https://medium.com/balancer-protocol',
  //   img: helpImg,
  // },
  {
    label: t('Discord'),
    url: 'https://discord.gg/polaris-finance',
    img: discordImg,
  },
  { label: t('Docs'), url: 'https://docs.polarisfinance.io/', img: docsImg },
  // {
  //   label: t('Legal & Privacy'),
  //   url: 'https://dune.xyz/balancerlabs',
  //   img: legalImg,
  // },
  {
    label: t('KYC'),
    url: 'https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/',
    img: kycImg,
  },
  // {
  //   label: t('grants'),
  //   url: 'http://grants.balancer.community',
  // },
];

const socialLinks = [
  // { component: 'TwitterIcon', url: 'https://twitter.com/BalancerLabs' },
  // { component: 'DiscordIcon', url: 'https://discord.balancer.fi/' },
  // { component: 'MediumIcon', url: 'https://medium.com/balancer-protocol' },
  // {
  //   component: 'YoutubeIcon',
  //   url: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow',
  // },
  // { component: 'GithubIcon', url: 'https://github.com/balancer-labs/' },
];

/**
 * METHODS
 */
async function navTo(path: string) {
  router.push(path);
  emit('close');
}

/**
 * WATCHERS
 */
watch(blockNumber, async () => {
  blockIcon.value?.classList.add('block-change');
  await sleep(300);
  blockIcon.value?.classList.remove('block-change');
});

const toggleMobileWallet = () => {
  emit('ToggleMobileWallet');
};
</script>

<template>
  <div class="fade-in-delay w-full opacity-0">
    <!-- <div
      class="flex flex-col justify-center px-4 h-20 border-b border-gray-800"
    >
      <AppLogo forceDark />
    </div> -->

    <div class="link-container">
      <div v-for="link in navLinks" :key="link.label" class="side-bar-link flex justify-between" @click="navTo(link.path)">
        <div>
          {{ link.label }}
        </div>
        <img :src="link.img" />
      </div>
    </div>

    <div class="link-container mt-[66px]">
      <!-- <span class="px-4 pb-1 font-medium text-secondary">Ecosystem</span> -->
      <BalLink v-for="link in ecosystemLinks" :key="link.url" :href="link.url" class="side-bar-link flex items-center justify-between" external noStyle>
        <div>
          {{ link.label }}
        </div>
        <img :src="link.img" />
      </BalLink>
    </div>
  </div>
  <div v-if="upToSmallBreakpoint" class="px-[24px] py-[44px]">
    <div v-if="account">
      <MobileWalletBtn @toggle-mobile-wallet="toggleMobileWallet" />
    </div>
    <button class="btn" v-else @click="startConnectWithInjectedProvider">Connect Wallet</button>
  </div>
</template>

<style scoped>
.link-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.side-bar-link {
  @apply cursor-pointer transition duration-300;
  padding-left: 24px;
  padding-right: 26px;
  row-gap: 32px;

  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: #ffffff;
}

.side-bar-btn {
  @apply flex cursor-pointer items-center rounded-lg bg-gray-850 p-2 transition hover:bg-gray-800;
}

.social-link {
  @apply flex h-11 w-11 cursor-pointer  items-center justify-center rounded-full bg-gray-850 text-white hover:bg-gray-800
    xs:h-12 xs:w-12;
}

.social-link > svg {
  @apply h-6 w-6;

  fill: white;
}

.block-icon {
  box-shadow: 0 0 3px 2px theme('colors.green.500');
  transition: box-shadow 0.3s ease-in-out;
}

.block-change {
  box-shadow: 0 0 6px 4px theme('colors.green.500');
}

.btn {
  background: #7b307f;
  border-radius: 16px;
  padding: 10px 25px;
  color: #ffffff;

  width: 100%;
}
</style>
