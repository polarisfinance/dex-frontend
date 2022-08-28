<template v-slot="{ hidePopover }">
  <BalPopover
    noPad
    :align="isMobile ? 'center' : undefined"
    :detached="isMobile ? true : undefined"
  >
    <template #activator>
      <button
        @click="toggleModal"
        class="text-base btn flex flex-row"
        :class="{ btn: upToLargeBreakpoint }"
        :loading="isLoadingProfile"
        :loadingLabel="upToLargeBreakpoint ? '' : $t('connecting')"
        color="white"
        :size="upToLargeBreakpoint ? 'md' : 'sm'"
        :circle="upToLargeBreakpoint"
      >
        <Avatar
          :iconURI="profile?.avatar"
          :address="account"
          :size="avatarSize"
        />
        <span
          v-if="profile && profile.ens"
          class="hidden lg:inline-block pl-2 leading-[20px]"
          v-text="profile && profile.ens"
        />
        <span
          v-else
          class="hidden lg:inline-block pl-2 eth-address leading-[20px]"
          v-text="_shorten(account)"
        />
      </button>
    </template>
    <AppNavSettings v-if="showModal" :close="closeModal" />
    <div @hide="hidePopover"></div>
  </BalPopover>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import Avatar from '@/components/images/Avatar.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';

import AppNavSettings from './AppNavSettings.vue';

export default defineComponent({
  name: 'AppNavAccountBtn',

  data() {
    return {
      showModal: false,
    };
  },

  methods: {
    toggleModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },

  components: {
    AppNavSettings,
    Avatar,
  },

  setup() {
    const { bp, upToLargeBreakpoint, isMobile } = useBreakpoints();
    const { isLoadingProfile, profile, account } = useWeb3();

    const avatarSize = computed(() => {
      if (bp.value === 'sm') {
        return 35;
      } else if (['md', 'lg'].includes(bp.value)) {
        return 40;
      } else {
        return 20;
      }
    });

    return {
      // computed
      bp,
      account,
      profile,
      avatarSize,
      upToLargeBreakpoint,
      isLoadingProfile,
      isMobile,
    };
  },
});
</script>

<style>
.btn {
  padding: 10px 25px;
  background: #231928;
  border-radius: 16px;
  color: #be95c0;
}
</style>
