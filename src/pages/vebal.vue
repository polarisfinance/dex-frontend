<script setup lang="ts">
/**
 * veBAL page
 */
import Hero from '@/components/contextual/pages/vebal/Hero.vue';
import LMVoting from '@/components/contextual/pages/vebal/LMVoting/LMVoting.vue';
import MyVeBAL from '@/components/contextual/pages/vebal/MyVeBAL/MyVeBAL.vue';
import { isVeBalSupported } from '@/composables/useVeBAL';
</script>

<template>
  <div v-if="isVeBalSupported" class="">
    <div>
      <Hero />
    </div>
  </div>
  <div class="bg-gray-50 py-16 dark:bg-gray-900 xl:py-20">
    <div v-if="isVeBalSupported" class="lg:container lg:mx-auto">
      <div class="px-4">
        <MyVeBAL />
      </div>
    </div>
  </div>
  <div
    v-if="isVeBalSupported"
    class="pt-16 xl:container xl:mx-auto xl:px-4 xl:pt-20"
  >
    <div class="mb-16 xl:px-0">
      <LMVoting />
    </div>
  </div>
  <div v-else class="text-center">
    <div class="text-lg font-semibold">
      {{ $t('veBAL.notSupported.title') }}
    </div>
    <div>{{ $t('veBAL.notSupported.description') }}</div>
  </div>
</template>
