<script lang="ts" setup>
import { ref, watch } from 'vue';

import BalCard from '../BalCard/BalCard.vue';
import useBreakpoints from '@/composables/useBreakpoints';

const { upToSmallBreakpoint } = useBreakpoints();

/**
 * TYPES
 */
type Props = {
  show?: boolean;
  title?: string;
  noPad?: boolean;
  noContentPad?: boolean;
  fireworks?: boolean;
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  noPad: false,
  noContentPad: false,
  fireworks: false,
});

defineEmits(['close']);

/**
 * STATE
 */
const showContent = ref(false);

/**
 * METHODS
 */
function hide(): void {
  showContent.value = false;
}

// this causes the scrollbar to hide when modal opens which causes the page to jump to left
// watch(
//   () => props.show,
//   () => {
//     if (props.show) {
//       document.body.classList.add('overflow-hidden');
//     } else {
//       document.body.classList.remove('overflow-hidden');
//     }
//   }
// );

/**
 * EXPOSE
 */
defineExpose({ hide });
</script>

<template>
  <div v-if="show" class="bal-modal" @keyup.esc="hide">
    <transition name="overlay" appear @after-enter="showContent = true">
      <div class="modal-bg" @click="hide">
        <div v-if="fireworks" class="fireworks">
          <div class="before" />
          <div class="after" />
        </div>
      </div>
    </transition>
    <div class="content-container">
      <Transition name="modal" @after-leave="$emit('close')">
        <div
          v-if="showContent"
          :class="{
            contentMobile: upToSmallBreakpoint,
            content: !upToSmallBreakpoint,
          }"
        >
          <BalCard
            :title="title"
            shadow="lg"
            noPad
            :noContentPad="noContentPad"
            class="modal-card"
            noBorder
            overflowYScroll
          >
            <template v-if="$slots.header" #header>
              <slot name="header" />
            </template>
            <slot />
            <template v-if="$slots.footer" #footer>
              <slot name="footer" />
            </template>
          </BalCard>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.bal-modal {
  @apply fixed top-0 left-0 z-40 h-screen w-full;
  overflow: none;
}

.content-container {
  @apply flex h-screen items-end justify-center sm:items-center;
  overflow: none;
}

.content {
  @apply absolute h-3/4 max-h-screen w-full sm:h-auto;

  max-width: 450px;
  transform-style: preserve-3d;
  overflow: none;
}

.contentMobile {
  bottom: 0;
  width: 100%;
  transform-style: preserve-3d;
}

.modal-bg {
  @apply absolute h-full w-full bg-black bg-opacity-70;
  /* box-shadow: inset 0px 0px 2px #130719 !important; */
  overflow: none;
}

.modal-card {
  @apply mx-auto h-full dark:border-0 rounded-t-[22px] rounded-b-none sm:rounded-[22px];
  background-color: #292043;
  overflow: none;
}

.dark .bal-modal .content::before {
  /* background-blend-mode: soft-light, soft-light, normal;
  background: radial-gradient(circle at left, yellow, transparent),
    radial-gradient(circle at bottom right, blue, transparent),
    radial-gradient(circle at top, red, transparent); */
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
  filter: blur(80px);
  transform: translateZ(-1px);
  animation: fadeInMoveUpScaleUp 0.2s ease-out both;
  overflow: none;
}

/* Overlay animation */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.2s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
