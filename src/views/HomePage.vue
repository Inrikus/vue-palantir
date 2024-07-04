<script setup>
import BannerPanel from '../components/Banner/BannerPanel.vue'
</script>

<template> 
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
