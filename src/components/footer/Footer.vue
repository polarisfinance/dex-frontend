<template>
  <footer v-once>
    <div class="xl:container lg:px-4 xl:mx-auto">
      <div
        class="flex flex-col sm:flex-row flex-grow gap-8 justify-evenly md:justify-between py-12 px-4 lg:px-0 mx-auto min-w-min max-w-[1000px] text-primary"
      >
        <router-link
          class="font-medium link"
          :to="{ name: 'home', params: { networkSlug } }"
        >
          <AppLogo class="mb-4" />
        </router-link>

        <!-- <div class="flex md:hidden flex-col gap-2">
            <p>
              <router-link
                class="text-lg font-medium link"
                :to="{ name: 'home', params: { networkSlug } }"
              >
                {{ $t('pool') }}
              </router-link>
            </p>
            <p>
              <router-link
                class="text-lg font-medium link"
                :to="{ name: 'swap', params: { networkSlug } }"
              >
                {{ $t('swap') }}
              </router-link>
            </p>
            <p>
              <router-link
                class="text-lg font-medium link"
                :to="{ name: 'claim', params: { networkSlug } }"
              >
                {{ $t('claim') }}
              </router-link>
            </p>
            <p>
              <router-link
                class="text-lg font-medium link"
                :to="{ name: 'portfolio', params: { networkSlug } }"
              >
                {{ $t('portfolio') }}
              </router-link>
            </p>
            <p>
              <router-link
                class="text-lg font-medium link"
                :to="{ name: 'vebal', params: { networkSlug } }"
              >
                {{ $t('vebal') }}
              </router-link>
            </p>
          </div>
          <div class="flex flex-wrap md:order-3 gap-3 md:gap-4">
            <BalLink
              :href="EXTERNAL_LINKS.Balancer.Home"
              external
              noStyle
              class="group link link--external"
            >
              {{ $t('about') }}
              <BalIcon name="arrow-up-right" size="sm" class="arrow" />
            </BalLink>

            <BalLink
              :href="EXTERNAL_LINKS.Balancer.Docs"
              external
              noStyle
              class="group link link--external"
            >
              {{ $t('docs') }}
              <BalIcon name="arrow-up-right" size="sm" class="arrow" />
            </BalLink>

            <BalLink
              :href="EXTERNAL_LINKS.Balancer.Vote"
              external
              noStyle
              class="group link link--external"
            >
              {{ $t('vote') }}
              <BalIcon name="arrow-up-right" size="sm" class="arrow" />
            </BalLink>
          </div> -->

        <div className="flex w-full sm:justify-evenly space-x-[20px]">
          <div
            className="flex flex-col space-y-[30px] pt-[85px] text-[14px] font-semibold leading-[18px] text-white"
          >
            <span>Protocol</span>
            <div className="flex flex-col space-y-[16px] text-[#5F5564]">
              <a
                href="https://docs.polarisfinance.io"
                target="_blank"
                rel="noopener noreferrer"
                >Docs</a
              >

              <a
                href="https://vote.polarisfinance.io/#/"
                target="_blank"
                rel="noopener noreferrer"
                >Vote</a
              >
              <a
                href="https://oldv1.polarisfinance.io/"
                target="_blank"
                rel="noopener noreferrer"
                >Old v1 Website</a
              >
              <a
                href="https://old.polarisfinance.io/"
                target="_blank"
                rel="noopener noreferrer"
                >Old Website</a
              >
            </div>
          </div>
          <div
            className="flex flex-col space-y-[30px] pt-[85px] text-[14px] font-semibold leading-[18px] text-white"
          >
            <span>Help</span>
            <div className="flex flex-col space-y-[16px] text-[#5F5564]">
              <a
                href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/"
                target="_blank"
                rel="noopener noreferrer"
              >
                KYC
              </a>
            </div>
          </div>
          <div
            className="flex flex-col space-y-[30px] pt-[85px] text-[14px] font-semibold leading-[18px] text-white"
          >
            <span>Social media</span>
            <div className="flex flex-col space-y-[16px] text-[#5F5564]">
              <div class="flex gap-3 md:justify-end">
                <BalLink
                  :href="EXTERNAL_LINKS.Balancer.Social.Twitter"
                  external
                  noStyle
                >
                  <IconTwitter />
                </BalLink>
                <BalLink
                  :href="EXTERNAL_LINKS.Balancer.Social.Discord"
                  external
                  noStyle
                >
                  <IconDiscord />
                </BalLink>
                <BalLink
                  :href="EXTERNAL_LINKS.Balancer.Social.Medium"
                  external
                  noStyle
                >
                  <IconMedium />
                </BalLink>
                <BalLink
                  :href="EXTERNAL_LINKS.Balancer.Social.Github"
                  external
                  noStyle
                >
                  <IconGithub />
                </BalLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-[1000px] pb-[139px] pt-[60px]">
      <span className="text-[13px] font-medium leading-[14px] text-[#5F5564]">
        Copyright © {{ year }} Polaris Finance. All rights reserved.
      </span>
    </div>
  </footer>
</template>

<script>
import { useI18n } from 'vue-i18n';

import { isThirdPartyServicesModalVisible } from '@/App.vue';
import IconDiscord from '@/components/icons/IconDiscord.vue';
import IconGithub from '@/components/icons/IconGithub.vue';
import IconLinkedin from '@/components/icons/IconLinkedin.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconMedium from '@/components/icons/IconMedium.vue';
import IconTwitter from '@/components/icons/IconTwitter.vue';
import IconYoutube from '@/components/icons/IconYoutube.vue';
import { EXTERNAL_LINKS } from '@/constants/links';

import useNetwork from '@/composables/useNetwork';

import AppLogo from '../images/AppLogo.vue';

export default {
  components: {
    IconTwitter,
    IconDiscord,
    IconMedium,
    IconYoutube,
    IconGithub,
    IconMail,
    IconLinkedin,
    AppLogo,
  },
  setup() {
    const { t } = useI18n();
    const { networkSlug } = useNetwork();

    return {
      EXTERNAL_LINKS,
      t,
      networkSlug,
      isThirdPartyServicesModalVisible,
    };
  },
};
</script>

<style scoped>
footer {
  @apply bg-gray-50 dark:bg-polaris-back-main;
}

footer :deep(.logotype) {
  @apply origin-top-left;

  transform: scale(1.5);
}

.link {
  @apply text-black text-sm font-semibold dark:text-[#5F5564] transition-colors flex items-center no-underline hover:text-purple-600;
}

.link--external {
  @apply text-sm;
}

.link:hover,
.link:focus-visible {
  @apply text-purple-600 dark:text-polaris-white no-underline;
}

.link:focus:not(:focus-visible) {
  outline: none;
}

.policy {
  @apply text-sm text-gray-600 dark:text-[#5F5564] hover:text-purple-600 dark:hover:text-polaris-white font-semibold;
}

.arrow {
  @apply text-gray-300 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-yellow-500;
}

.router-link-active {
  @apply text-blue-600 dark:text-blue-400;
}
</style>
