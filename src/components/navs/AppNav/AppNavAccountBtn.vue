<template v-slot="{ hidePopover }">
  <BalPopover
    noPad
    :align="isMobile ? 'center' : undefined"
    :detached="isMobile ? true : undefined"
  >
    <template #activator>
      <button
        @click="toggleModal"
        class="btn flex flex-row text-base w-full lg:w-auto justify-center"
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
        <!-- <span
          v-if="profile && profile.ens"
          class="hidden pl-2 leading-[20px] lg:inline-block"
          v-text="profile && profile.ens"
        /> -->
        <span
          class="eth-address inline-block pl-2 leading-[20px]"
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
        return 20;
      } else if (['md', 'lg'].includes(bp.value)) {
        return 20;
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

<style scoped>
.btn {
  @apply bg-transparent rounded-[16px] py-[12px] px-[43.5px] text-purple font-semibold;
  border: 1px solid rgba(64, 51, 71, 0.5);
}
.btn:hover {
  border: 1px solid #552162 !important;
}
</style>
