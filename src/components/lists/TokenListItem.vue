<template>
  <div
    ref="animateRef"
    :class="[
      `flex items-center border border-transparent text-base
  leading-2 opacity-0 highlight 
   transition-colors ease-in duration-300`,
      {
        '': focussed,
      },
    ]"
  >
    <BalAsset
      :address="token.address"
      :iconURI="token.logoURI"
      :size="34"
      class="mr-3"
    />
    <div :class="['flex-auto', { '': focussed }]">
      <div
        class="w-40 md:w-60 text-xsm font-medium dark:text-polaris-3 truncate"
      >
        {{ token.name }}
        <span
          v-if="token.address == '0xef3c714c9425a8F3697A9C969Dc1af30ba82e5d4'"
        >
          - CBridge</span
        >
        <span
          v-if="token.address == '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844'"
        >
          - Multichain</span
        >
      </div>
      <div class="text-lg font-semibold dark:text-polaris-white">
        {{ token.symbol }}
      </div>
    </div>
    <span
      v-if="!hideBalance"
      class="flex flex-col items-end font-medium text-right"
    >
      <BalLoadingBlock v-if="balanceLoading" class="w-14 h-4" />
      <template v-else>
        <template v-if="balance > -1">
          <template v-if="balance >= 0.0001">
            <div class="text-lg font-semibold dark:text-polaris-white">
              {{ fNum(balance, FNumFormats.token) }}
            </div>
          </template>
          <template v-else
            ><div class="text-lg font-semibold dark:text-polaris-white">
              &#60; 0.0001
            </div></template
          >
        </template>
        <!-- <div v-if="value > 0" class="text-sm font-normal text-secondary">
          {{ fNum(value, FNumFormats.fiat) }}
        </div> -->
      </template>
    </span>
  </div>
</template>

<script lang="ts">
import anime from 'animejs';
import { computed, onMounted, onUnmounted, PropType, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { TokenInfo } from '@/types/TokenList';

export default {
  name: 'TokenListItem',

  props: {
    token: { type: Object as PropType<TokenInfo>, required: true },
    balanceLoading: { type: Boolean, default: true },
    hideBalance: { type: Boolean, default: false },
    focussed: { type: Boolean, default: false },
  },

  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum } = useNumbers();
    const animateRef = ref();
    const { priceFor, balanceFor } = useTokens();

    /**
     * COMPUTED
     */
    const balance = computed(() => Number(balanceFor(props.token.address)));
    const value = computed(() => balance.value * priceFor(props.token.address));

    /**
     * CALLBACKS
     */
    onMounted(() => {
      anime({
        opacity: 1,
        targets: animateRef.value,
        delay: anime.stagger(100),
      });
    });

    onUnmounted(() => {
      anime({
        opacity: 0,
        targets: animateRef.value,
      });
    });

    return {
      fNum,
      FNumFormats,
      animateRef,
      balance,
      value,
    };
  },
};
</script>
