<script setup lang="ts">
import FaucetTable from '@/components/tables/FaucetTable/FaucetTable.vue';
</script>

<template>
  <div class="px-2 lg:px-0">
    <div class="py-12 lg:container lg:mx-auto">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h1 class="mb-4">Faucet</h1>
        </div>
      </div>
      <FaucetTable />
    </div>
  </div>
</template>
