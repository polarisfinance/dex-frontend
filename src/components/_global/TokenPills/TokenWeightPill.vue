<script setup lang="ts">
import { computed } from 'vue';

import useNumbers from '@/composables/useNumbers';
import useTokens from '@/composables/useTokens';
import { includesAddress } from '@/lib/utils';
import { PoolToken } from '@/services/pool/types';

import HiddenTokensPills from './HiddenTokensPills.vue';
import StableTokenPill from './StableTokenPill.vue';
import WeightedTokenPill from './WeightedTokenPill.vue';
import { bool } from 'prop-types';

type Props = {
  tokens: PoolToken[];
  boosted: Boolean;
};

const props = withDefaults(defineProps<Props>(), {});

const { fNum2 } = useNumbers();
const { getToken } = useTokens();

/**
 * COMPUTED
 */
const visibleTokens = computed(() => props.tokens.slice(0, MAX_PILLS));

const hiddenTokens = computed(() => props.tokens.slice(MAX_PILLS));

/**
 * METHODS
 */
function symbolFor(token: PoolToken): string {
  return token.symbol || getToken(token.address)?.symbol || '---';
}

function weightFor(token: PoolToken): string {
  return fNum2(token.weight, {
    style: 'percent',
    maximumFractionDigits: 0,
  });
}
function getTitle(tokens: PoolToken[]): string {
  if (tokens.length == 3) return 'Tripool';
  else if (isBalanced(tokens)) return 'Balanced';
  else return 'Unbalanced';
}
function isBalanced(tokens: PoolToken[]): boolean {
  var perc = tokens[0].weight;
  var out = true;
  tokens.forEach(token => {
    if (perc != token.weight) out = false;
    return;
  });
  return out;
}
function getBgClass(tokens: PoolToken[], boosted: Boolean): string {
  if (boosted != undefined && boosted) return 'bg-red';
  else if (tokens.length == 3) return 'bg-green';
  else if (isBalanced(tokens)) return 'bg-grey';
  else return 'bg-blue';
}

const MAX_PILLS = 11;
</script>

<template>
  <div class="weight flex" :class="getBgClass(tokens, boosted)">
    <div class="title">{{ getTitle(tokens) }}</div>
    <div v-for="(token, idx) in visibleTokens" class="text-center"><template v-if="idx != 0">:</template>{{ token.weight * 100 }}</div>
  </div>
</template>

<style scoped>
.bg-red {
  background-color: rgba(255, 95, 109, 0.8);
}
.bg-green {
  background-color: rgba(39, 174, 96, 0.8);
}
.bg-pink {
  background-color: #d04fb8;
}
.bg-blue {
  background-color: rgba(47, 128, 237, 0.8);
}
.bg-grey {
  background-color: #41365e;
}
.weight {
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #fdfdfd;
  padding: 3px 12px 1px 12px;
}
.weight .title::after {
  content: '\00a0';
}
</style>
