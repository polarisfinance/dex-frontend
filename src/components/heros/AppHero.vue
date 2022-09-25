<template>
  <div class="app-hero">
    <div class="mx-auto w-full max-w-2xl">
      <slot />
    </div>
  </div>
</template>

<style>
.app-hero {
  @apply flex items-center justify-center bg-cover bg-center px-4 text-center;

  transition: all 0.3s ease-in-out;
  background-image: url('./index_bg.svg');

  margin-top: 81px;
}
</style>
