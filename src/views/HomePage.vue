<script setup>
import BannerPanel from '../components/Banner/BannerPanel.vue'
</script>

<template>
  <h1 class="text-3xl font-bold tracking-[8px] text-[#63b4c8]">HOME</h1>
  <BannerPanel />
</template>

<style>
  .grid-banner {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    .grid-banner {
      grid-template-columns: repeat(1, 1fr);
    }
  }
</style>
