<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useFathom from '@/composables/useFathom';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';

import HeroConnectWalletButton from './HeroConnectWalletButton.vue';
// import step1 from './StepIcons/1.vue'


/**
 * TYPES
 */
 type Props = {
  headline:string;
};

/**
 * PROPS & EMITS
 */
const props = withDefaults(defineProps<Props>(), {
    step: 1,
    headline: "",
});

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { trackGoal, Goals } = useFathom();

/**
 * COMPUTED
 */
const classes = computed(() => ({
  ['h-64']: !isWalletReady.value && !isWalletConnecting.value,
  ['h-44']: isWalletReady.value || isWalletConnecting.value,
}));
const stepIcon = computed(() => import( `./StepIcons/${props.step}.vue`));
</script>

<template>
    <div class="container mx-auto">
        <!-- <component :is="stepIcon"/> -->
        <div class="headline mx-auto my-[55px] text-center">{{headline}}</div>
    </div>
</template>

<style scoped>
.headline{
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #FDFDFD;
}
</style>