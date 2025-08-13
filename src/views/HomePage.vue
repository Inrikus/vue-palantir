<script setup>
import BannerPanel from '../components/Banner/BannerPanel.vue'
</script>

<template> 
  <BannerPanel /> 
</template>

<style scoped>
.grid-banner {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .grid-banner {
    grid-template-columns: 1fr;
  }
}
</style>