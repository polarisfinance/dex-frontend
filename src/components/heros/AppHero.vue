<template>
  <div class="app-hero">
    <div class="mx-auto w-full max-w-3xl">
      <slot />
    </div>
  </div>
</template>

<style>
.app-hero {
  @apply bg-cover bg-center flex items-center justify-center text-center px-4;
}
</style>
