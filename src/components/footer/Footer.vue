<template>
  <footer>
    <div class="flex justify-center gap-[24px] pb-[44px]">
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
    return {
      EXTERNAL_LINKS,
      t,
      isThirdPartyServicesModalVisible,
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
</style>
