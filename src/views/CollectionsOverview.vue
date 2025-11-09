<script setup>
import BannerPanel from '@/components/collections/Banner/BannerPanel.vue'
</script>

<template>
  <section>
    <BannerPanel />
  </section>
</template>

<style scoped>
:global(.grid-banner) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}
</style>
