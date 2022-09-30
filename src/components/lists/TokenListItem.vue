<template>
  <div ref="animateRef" class="flex items-center px-[24px] text-base opacity-0">
    <BalAsset
      :address="token.address"
      :iconURI="token.logoURI"
      :size="34"
      class="mr-[12px]"
    />
    <div class="flex-auto">
      <div class="token-name">
        {{ token.name }}
      </div>
      <div class="token-symbol">
        {{ token.symbol }}
      </div>
    </div>
    <span class="token-amount flex flex-col items-end text-right font-medium">
      <BalLoadingNumber v-if="balanceLoading" type="token" />
      <template v-else>
        <template v-if="balance > 0">
          <template v-if="balance >= 0.0001">
            {{ fNum2(balance, FNumFormats.token) }}
          </template>
          <template v-else> &#60; 0.0001 </template>
        </template>
        <template v-else>0</template>
      </template>

      <!-- <BalLoadingNumber
        v-if="balanceLoading"
        type="fiat"
        numberWidth="2"
        numberHeight="4"
        class="text-sm font-normal"
      />
      <div v-else class="text-sm font-normal text-secondary">
        <template v-if="value > 0">
          {{ fNum2(value, FNumFormats.fiat) }}
        </template>
        <template v-else>0</template>
      </div> -->
    </span>
  </div>
</template>

<script lang="ts">
import anime from 'animejs';
import { computed, onMounted, onUnmounted, PropType, ref } from 'vue';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import useUserSettings from '@/composables/useUserSettings';
import { TokenInfo } from '@/types/TokenList';

export default {
  name: 'TokenListItem',

  props: {
    token: { type: Object as PropType<TokenInfo>, required: true },
    balanceLoading: { type: Boolean, default: true },
  },

  setup(props) {
    /**
     * COMPOSABLES
     */
    const { fNum2 } = useNumbers();
    const animateRef = ref();
    const { balances, prices } = useTokens();
    const { currency } = useUserSettings();

    /**
     * COMPUTED
     */
    const balance = computed(() => Number(balances.value[props.token.address]));
    const price = computed(() =>
      prices.value[props.token.address]
        ? prices.value[props.token.address][currency.value]
        : 0
    );
    const value = computed(() => balance.value * price.value);

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
      fNum2,
      FNumFormats,
      animateRef,
      balance,
      value,
    };
  },
};
</script>

<style scoped>
.token-amount {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}

.token-name {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  color: #b9babb;
}

.token-symbol {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}
</style>
