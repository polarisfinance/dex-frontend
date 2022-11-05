<template v-slot="{ hidePopover }">
  <button
    @click="toggleMobileWallet"
    class="btn w-full text-center"
    :class="{ btn: upToLargeBreakpoint }"
    :loading="isLoadingProfile"
    :loadingLabel="upToLargeBreakpoint ? '' : $t('connecting')"
    :size="upToLargeBreakpoint ? 'md' : 'sm'"
    :circle="upToLargeBreakpoint"
  >
    <div class="address">{{ _shorten(account) }}</div>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import Avatar from '@/components/images/Avatar.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';

export default defineComponent({
  name: 'AppNavAccountBtn',

  data() {
    return {
      showModal: false,
    };
  },

  components: {
    Avatar,
  },

  setup(props, { emit }) {
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

    const toggleMobileWallet = () => {
      emit('ToggleMobileWallet');
    };

    return {
      // computed
      bp,
      account,
      profile,
      avatarSize,
      upToLargeBreakpoint,
      isLoadingProfile,
      isMobile,
      Avatar,
      toggleMobileWallet,
    };
  },
});
</script>

<style scoped>
.btn {
  border: 1px solid rgba(64, 51, 71, 0.5) !important;
  border-radius: 16px;
  background: #1e0d2c !important;
}

.address {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #d7b3ff;
  text-align: center;
}
</style>
