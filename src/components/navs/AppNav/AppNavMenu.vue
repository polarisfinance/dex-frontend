<template>
  <BalPopover noPad>
    <template #activator>
      <button
        @click="toggleModal"
        class="text-base btn btn-menu flex flex-row pb-[10px] pt-0"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loadingLabel="upToLargeBreakpoint ? '' : $t('connecting')"
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <span
          class="hidden lg:inline-block eth-address leading-[20px] text-[24px] leading-[31px] text-white"
          v-text="'...'"
        />
      </button>
    </template>
    <div
      class="flex overflow-hidden flex-col w-44 rounded-lg leading-[20px] px-[20px] py-[15px] bg-[#2e2433]"
      :style="{
        'box-shadow': 'inset 0px 0px 2px #fbaaff',
        'border-radius': '22px',
      }"
    >
      <a class="menu-item menu-link">
        <span> About </span>
        <IconAbout />
      </a>
      <a class="menu-item menu-link">
        <span> Help Center </span>
        <HelpCenter />
      </a>
      <a class="menu-item menu-link">
        <span> Discord </span>
        <Discord />
      </a>
      <a class="menu-item menu-link">
        <span> Docs </span>
        <Docs />
      </a>
      <a class="menu-item menu-link">
        <span> Legal & Privacy </span>
        <LegalAndPrivacy />
      </a>
      <a class="menu-item menu-link">
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
<style>
.btn-menu {
  padding-top: 0 !important;
}
.btn-menu:hover {
  padding-top: 0 !important;
}
.menu-item {
  @apply flex justify-between items-center cursor-pointer py-[5px] font-semibold;
}
.menu-link {
  @apply text-white font-semibold leading-[20px];
}

.menu-link > svg {
  @apply text-[#B9BABB];
}

.menu-link > svg {
  @apply text-[#B9BABB];
}

.menu-link:hover,
.menu-link:hover > svg {
  @apply text-[#be95c0] font-semibold leading-[20px] no-underline;
}

.menu-link:focus,
.menu-link:focus > svg {
  @apply text-[#be95c0] font-semibold leading-[20px] no-underline;
}
</style>
