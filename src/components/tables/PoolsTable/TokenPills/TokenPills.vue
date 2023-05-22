<script setup lang="ts">
import { computed } from 'vue';

import useNumbers from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { includesAddress } from '@/lib/utils';
import { PoolToken } from '@/services/pool/types';

import HiddenTokensPills from './HiddenTokensPills.vue';
import StableTokenPill from './StableTokenPill.vue';
import WeightedTokenPill from './WeightedTokenPill.vue';

type Props = {
  tokens: PoolToken[];
  isStablePool?: boolean;
  selectedTokens?: string[];
  pickedTokens?: string[];
  isOnMigrationCard?: boolean;
  isHovered?: boolean;
  showWeight: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isStablePool: false,
  selectedTokens: () => [],
  pickedTokens: () => [],
  isOnMigrationCard: false,
  isHovered: false,
  showWeight: true,
});

const { fNum } = useNumbers();
const { getToken, hasBalance } = useTokens();

/**
 * COMPUTED
 */
const visibleTokens = computed(() => props.tokens.slice(0, MAX_PILLS));

const hiddenTokens = computed(() => props.tokens.slice(MAX_PILLS));

const hasBalanceInHiddenTokens = computed(() =>
  hiddenTokens.value.some(token => hasBalance(token.address))
);

const isSelectedInHiddenTokens = computed(() =>
  hiddenTokens.value.some(token =>
    includesAddress(props.selectedTokens, token.address)
  )
);

const isSelectedInPickedTokens = computed(() =>
  hiddenTokens.value.some(token =>
    includesAddress(props.pickedTokens, token.address)
  )
);

/**
 * METHODS
 */
function symbolFor(token: PoolToken): string {
  if (token.symbol === 'veXPOLAR') {
    return token.symbol;
  }
  return getToken(token.address)?.symbol || token.symbol || '---';
}

function weightFor(token: PoolToken): string {
  if (props.showWeight === true) {
    return fNum(token.weight || '0', {
      style: 'percent',
      maximumFractionDigits: 0,
    });
  }
  return '';
}

const MAX_PILLS = 8;
</script>

<template>
  <div class="flex flex-wrap -mt-1">
    <template v-if="isStablePool">
      <StableTokenPill
        v-for="(token, idx) in visibleTokens"
        :key="token.address"
        :hasBalance="hasBalance(token.address)"
        :symbol="symbolFor(token)"
        :token="token"
        :isSelected="includesAddress(selectedTokens, token.address)"
        :isPicked="includesAddress(pickedTokens, token.address)"
        :separator="idx == 0 ? false : true"
      />
    </template>
    <template v-else>
      <WeightedTokenPill
        v-for="(token, idx) in visibleTokens"
        :key="token.address"
        :hasBalance="hasBalance(token.address)"
        :symbol="symbolFor(token)"
        :weight="weightFor(token)"
        :token="token"
        :isSelected="includesAddress(selectedTokens, token.address)"
        :isPicked="includesAddress(pickedTokens, token.address)"
        :isOnMigrationCard="isOnMigrationCard"
        :isHovered="isHovered"
        :separator="idx == 0 ? false : true"
      />
      <HiddenTokensPills
        v-if="hiddenTokens.length > 0"
        :tokens="hiddenTokens"
        :hasBalance="hasBalanceInHiddenTokens"
        :isSelected="isSelectedInHiddenTokens"
        :isPicked="isSelectedInPickedTokens"
      />
    </template>
  </div>
</template>
