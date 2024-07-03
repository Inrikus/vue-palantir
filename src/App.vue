<script setup>
import HeaderSection from "./components/HeaderSection.vue"
import FooterSection from './components/FooterSection.vue'

</script>

<template>
<HeaderSection />
<main class="w-full min-h-[95vh] lg:px-20 sm:pt-10 px-2 bg-[#1A1A1A]">
  <router-view />
</main>
<FooterSection />
</template>

<style scoped>

</style>
