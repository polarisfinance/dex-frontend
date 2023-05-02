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
  boosted:boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isStablePool: false,
  selectedTokens: () => [],
  pickedTokens: () => [],
  isOnMigrationCard: false,
  isHovered: false,
  boosted:false,
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
  return getToken(token.address)?.symbol || token.symbol || '---';
}

function weightFor(token: PoolToken): string {
  return fNum(token.weight || '0', {
    maximumFractionDigits: 2,
  });
}
function isBalanced(tokens: PoolToken[]):boolean{
    var perc = tokens[0].weight;
    var out = true;
    tokens.forEach(token => {
        if(perc != token.weight)
            out = false;
            return;
    });
    return out;
}

function getTitle(tokens: PoolToken[]): string{
    if(tokens.length==3)
        return 'Tripool';
    else if(isBalanced(tokens))
        return 'Balanced';
    else
        return 'Unbalanced';
}
function getBgClass(tokens: PoolToken[],boosted:Boolean): string{
    if(boosted!=undefined && boosted)
      return 'bg-red';
    else if(tokens.length==3)
      return 'bg-green';
    else if(isBalanced(tokens))
      return 'bg-grey';
    else
      return 'bg-blue';
}

const MAX_PILLS = 8;
</script>
<template>
  <template v-if="!isStablePool">
    <div class="flex flex-wrap -mt-1 weight" :class="getBgClass(tokens,boosted)">
        <div class="title">{{ getTitle(tokens) }}</div>
        <div v-for="(token,idx) in visibleTokens">
          <template v-if="idx!=0">:</template>{{  Number(weightFor(token))*100 }}
        </div>
        <HiddenTokensPills
          v-if="hiddenTokens.length > 0"
          :tokens="hiddenTokens"
          :hasBalance="hasBalanceInHiddenTokens"
          :isSelected="isSelectedInHiddenTokens"
          :isPicked="isSelectedInPickedTokens"
        />
    </div>
  </template>
</template>
<style scoped>
.bg-red {
  background-color: rgba(255, 95, 109, 0.8);;
}
.bg-green{
  background-color: rgba(39, 174, 96, 0.8);
}
.bg-pink{
  background-color:#D04FB8;
}
.bg-blue{
  background-color: rgba(47, 128, 237, 0.8);
}
.bg-grey{
  background-color:#41365E;
}
.weight{
    border-radius: 12px;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    color: #FDFDFD;
    padding: 3px 12px 1px 12px;

}
.weight .title::after{
content: "\00a0";
}
</style>