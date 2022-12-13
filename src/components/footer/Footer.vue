<template>
  <footer>
    <!-- <div class="flex justify-center gap-[24px] pb-[44px]">
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Discord" external noStyle>
        <IconDiscord />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Telegram" external noStyle>
        <IconTelegram />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Twitter" external noStyle>
        <IconTwitter />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Medium" external noStyle>
        <IconMedium />
      </BalLink>
      <BalLink :href="EXTERNAL_LINKS.Balancer.Social.Github" external noStyle>
        <IconGithub />
      </BalLink>
    </div> -->
    <div className="min-w-screen px-[20px] ">
      <div
        className=" mx-auto flex min-w-min max-w-[1000px] flex-col justify-between text-[18px] font-semibold text-[#676671] sm:flex-row"
      >
        <div className="flex min-w-max pt-[51px] sm:self-start">
          <img
            src="../images/Logo.svg"
            alt="logo-no-bg"
            height="62"
            width="62"
            className=" "
          />
          <span className="colored-logo self-center text-[20px] font-medium">
            POLARIS&nbsp;
          </span>
          <span className="colored-logo self-center text-[20px] font-semibold">
            D&nbsp;E&nbsp;X
          </span>
        </div>
        <div
          className="flex min-w-max flex-grow flex-col-reverse justify-evenly sm:flex-row"
        >
          <div className="flex w-full sm:justify-evenly space-x-[20px]">
            <div
              className="flex flex-col space-y-[30px] pt-[67px] text-[14px] font-semibold leading-[18px] text-white"
            >
              <span>Protocol</span>
              <div className="flex flex-col space-y-[16px] text-[#5F5564]">
                <a href="https://docs.polarisfinance.io">Docs</a>

                <a href="https://vote.polarisfinance.io/#/">Vote</a>
                <a href="https://polarisfinance.io/">Old Website</a>
              </div>
            </div>
            <div
              className="flex flex-col space-y-[30px] pt-[67px] text-[14px] font-semibold leading-[18px] text-white"
            >
              <span>Help</span>
              <div className="flex flex-col space-y-[16px] text-[#5F5564]">
                <a
                  href="https://www.apeoclock.com/launch/polaris-finance-genesis-pools-launch/"
                >
                  KYC
                </a>
              </div>
            </div>
          </div>

          <div
            className="flex min-w-max flex-col space-y-[30px] pt-[67px] text-[14px] font-semibold leading-[18px] text-white"
          >
            <span>Social media</span>
            <div className="flex space-x-[28px] text-[#5F5564]">
              <a href="https://discord.gg/polaris-finance">
                <IconDiscord />
              </a>
              <a href="https://t.me/polarisfinance">
                <IconTelegram />
              </a>
              <a href="https://twitter.com/PolarisFinance_">
                <IconTwitter />
              </a>
              <a href="https://medium.com/@PolarisFinance">
                <IconMedium />
              </a>
              <a href="https://github.com/polarisfinance">
                <IconGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1000px] pb-[139px] pt-[60px]">
        <span className="text-[12px] font-medium leading-[14px] text-[#5F5564]">
          Copyright © {{ year }} Polaris Finance. All rights reserved.
        </span>
      </div>
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
import IconTelegram from '@/components/icons/IconTelegram.vue';
import { EXTERNAL_LINKS } from '@/constants/links';

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
    IconTelegram,
    AppLogo,
  },
  setup() {
    const { t } = useI18n();
    const year = new Date().getFullYear();
    return {
      EXTERNAL_LINKS,
      t,
      isThirdPartyServicesModalVisible,
      year,
    };
  },
};
</script>

<style scoped>
footer {
  /* @apply bg-gray-50 dark:bg-gray-900; */
}

footer :deep(.logotype) {
  @apply origin-top-left;

  transform: scale(1.5);
}

.link {
  @apply flex items-center text-black no-underline transition-colors hover:text-purple-600 dark:text-white;
}

.link--external {
  @apply text-sm;
}

.link:hover,
.link:focus-visible {
  @apply text-purple-600 no-underline dark:text-yellow-500;
}

.link:focus:not(:focus-visible) {
  outline: none;
}

.policy {
  @apply text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-yellow-500;
}

.arrow {
  @apply text-gray-300 group-hover:text-purple-600 dark:text-gray-600 dark:group-hover:text-yellow-500;
}

.router-link-active,
.dark .router-link-active {
  @apply text-blue-600 dark:text-blue-400;
}

.colored-logo {
  background: linear-gradient(180deg, #4b5e98 23.08%, #403a4e 73.08%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  display: inline-block;
}
</style>
