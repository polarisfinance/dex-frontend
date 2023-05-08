<script setup lang="ts">
/**
 * veBAL page
 */
import Hero from '@/components/contextual/pages/vebal/Hero.vue';
import VexPolarHero from '@/components/contextual/pages/vebal/VexPolarHero.vue';
import LMVoting from '@/components/contextual/pages/vebal/LMVoting/LMVoting.vue';
import MyVeBAL from '@/components/contextual/pages/vebal/MyVeBAL/MyVeBAL.vue';
import { isVeBalSupported } from '@/composables/useVeBAL';
</script>

<template>
  <div>
    <VexPolarHero v-if="isVeBalSupported" v-once />
    <div class="py-16 xl:py-20">
      <div
        v-if="isVeBalSupported"
        class="lg:container py-4 px-10 lg:mx-auto dark:bg-polaris-card-default rounded-small"
      >
        <div class="px-4">
          <MyVeBAL />
        </div>
      </div>
    </div>
    <div
      v-if="isVeBalSupported"
      class="xl:container xl:px-4 pt-16 xl:pt-20 xl:mx-auto"
    >
      <div class="xl:px-0 mb-16">
        <LMVoting />
      </div>
    </div>
    <div v-else class="text-center">
      <div class="text-lg font-semibold">
        {{ $t('veBAL.notSupported.title') }}
      </div>
      <div>{{ $t('veBAL.notSupported.description') }}</div>
    </div>
  </div>
</template>
