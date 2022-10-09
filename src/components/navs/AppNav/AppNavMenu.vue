<template>
  <BalPopover noPad>
    <template #activator>
      <button
        @click="toggleModal"
        class="btn btn-menu flex flex-row pb-[10px] pt-0 text-base"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loadingLabel="upToLargeBreakpoint ? '' : $t('connecting')"
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <span
          class="eth-address hidden text-[24px] leading-[20px] leading-[31px] text-white lg:inline-block"
          v-text="'...'"
        />
      </button>
    </template>
    <div
      class="flex w-44 flex-col overflow-hidden rounded-lg bg-[#2e2433] px-[20px] py-[15px] leading-[20px]"
      :style="{
        'box-shadow': 'inset 0px 0px 2px #fbaaff',
        'border-radius': '22px',
      }"
    >
      <!-- <a class="menu-item menu-link">
        <span> About </span>
        <IconAbout />
      </a> -->
      <!-- <a class="menu-item menu-link">
        <span> Help Center </span>
        <HelpCenter />
      </a> -->
      <a class="menu-item menu-link" href="https://discord.gg/polaris-finance">
        <span> Discord </span>
        <Discord />
      </a>
      <a class="menu-item menu-link" href="https://docs.polarisfinance.io/">
        <span> Docs </span>
        <Docs />
      </a>
      <!-- <a class="menu-item menu-link">
        <span> Legal & Privacy </span>
        <LegalAndPrivacy />
      </a> -->
      <a class="menu-item menu-link" href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/">
        <span> KYC </span>
        <Kyc />
      </a>
    </div>
  </BalPopover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import IconAbout from '@/components/icons/IconAbout.vue';
import Discord from '@/components/icons/Discord.vue';
import Docs from '@/components/icons/Docs.vue';
import HelpCenter from '@/components/icons/HelpCenter.vue';
import Kyc from '@/components/icons/Kyc.vue';
import LegalAndPrivacy from '@/components/icons/LegalAndPrivacy.vue';

export default defineComponent({
  name: 'AppNavNetworkSelect',
  components: {
    IconAbout,
    Discord,
    Docs,
    HelpCenter,
    Kyc,
    LegalAndPrivacy,
  },
});
</script>
<style scoped>
.btn-menu {
  padding-top: 0 !important;
}
.btn-menu:hover {
  padding-top: 0 !important;
}
.menu-item {
  @apply flex cursor-pointer items-center justify-between py-[5px] font-semibold;
}
.menu-link {
  @apply font-semibold leading-[20px] text-white;
}

.menu-link > svg {
  @apply text-[#B9BABB];
}

.menu-link > svg {
  @apply text-[#B9BABB];
}

.menu-link:hover,
.menu-link:hover > svg {
  @apply font-semibold leading-[20px] text-[#be95c0] no-underline;
}

.menu-link:focus,
.menu-link:focus > svg {
  @apply font-semibold leading-[20px] text-[#be95c0] no-underline;
}
</style>
