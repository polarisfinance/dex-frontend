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

import useBreakpoints from '@/composables/useBreakpoints';
const { isMobile, isDesktop } = useBreakpoints();

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
const emit = defineEmits(['close']);

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

/**
 * STATE
 */
const blockIcon = ref<HTMLDivElement>();

const navLinks = [
  { label: t('swap'), path: '/trade', img: swapImg },
  { label: t('invest'), path: '/', img: investImg },
  { label: t('portfolio'), path: '/portfolio', img: portfolioImg },
  { label: 'vexPOLAR', path: '/vebal', img: vexpolarImg },
  // { label: t('claim'), path: '/claim' },
];

const ecosystemLinks = [
  { label: t('About'), url: 'https://balancer.fi/build', img: aboutImg },
  {
    label: t('Help Center'),
    url: 'https://medium.com/balancer-protocol',
    img: helpImg,
  },
  { label: t('Discord'), url: 'https://docs.balancer.fi/', img: discordImg },
  { label: t('Docs'), url: 'https://vote.balancer.fi/#/', img: docsImg },
  {
    label: t('Legal & Privacy'),
    url: 'https://dune.xyz/balancerlabs',
    img: legalImg,
  },
  { label: t('KYC'), url: 'https://forum.balancer.fi/', img: kycImg },
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
</script>

<template>
  <div class="opacity-0 fade-in-delay w-full">
    <!-- <div
      class="flex flex-col justify-center px-4 h-20 border-b border-gray-800"
    >
      <AppLogo forceDark />
    </div> -->

    <div class="link-container">
      <div
        v-for="link in navLinks"
        :key="link.label"
        class="side-bar-link flex justify-between"
        @click="navTo(link.path)"
      >
        <div>
          {{ link.label }}
        </div>
        <img :src="link.img" />
      </div>
    </div>

    <div class="link-container mt-[66px]">
      <!-- <span class="px-4 pb-1 font-medium text-secondary">Ecosystem</span> -->
      <BalLink
        v-for="link in ecosystemLinks"
        :key="link.url"
        :href="link.url"
        class="flex items-center side-bar-link justify-between"
        external
        noStyle
      >
        <div>
          {{ link.label }}
        </div>
        <img :src="link.img" />
      </BalLink>
    </div>

    <!-- <div class="px-4 mt-6">
      <div class="mt-2 side-bar-btn" @click="toggleDarkMode">
        <MoonIcon v-if="!darkMode" class="mr-2" />
        <SunIcon v-else class="mr-2" />
        <span>{{ darkMode ? 'Light' : 'Dark' }} mode</span>
      </div>
    </div> -->

    <!-- <div class="grid grid-rows-1 grid-flow-col auto-cols-min gap-2 px-4 mt-4">
      <BalLink
        v-for="link in socialLinks"
        :key="link.component"
        :href="link.url"
        class="social-link"
        noStyle
        external
      >
        <component :is="link.component" />
      </BalLink>
      <BalLink
        href="mailto:contact@balancer.finance"
        class="social-link"
        noStyle
      >
        <EmailIcon />
      </BalLink>
    </div>

    <div class="px-4 mt-6 text-xs">
      <div class="flex items-center">
        <div
          ref="blockIcon"
          class="w-2 h-2 bg-green-500 rounded-full block-icon"
        />
        <span class="ml-2 text-gray-300">
          {{ networkConfig.name }}: Block {{ blockNumber }}
        </span>
      </div>
      <BalLink
        :href="`https://github.com/balancer-labs/frontend-v2/releases/tag/${version}`"
        class="flex items-center mt-2 text-gray-300"
        external
        noStyle
      >
        App: v{{ version }}
        <BalIcon name="arrow-up-right" size="xs" class="ml-1" />
      </BalLink>
    </div> -->
  </div>
  <div class="px-[24px] py-[44px]">
    <AppNavAccountBtn v-if="account" />
    <button class="btn" v-else @click="startConnectWithInjectedProvider">
      Connect Wallet
    </button>
  </div>
</template>

<style scoped>
.link-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.side-bar-link {
  @apply transition duration-300 cursor-pointer;
  padding-left: 24px;
  padding-right: 26px;
  row-gap: 32px;

  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: #ffffff;
}

.side-bar-btn {
  @apply flex items-center bg-gray-850 hover:bg-gray-800 rounded-lg p-2 cursor-pointer transition;
}

.social-link {
  @apply w-11 h-11 xs:w-12 xs:h-12  rounded-full bg-gray-850 hover:bg-gray-800 flex items-center justify-center
    text-white cursor-pointer;
}

.social-link > svg {
  @apply w-6 h-6;

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
