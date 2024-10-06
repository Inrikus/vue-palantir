<script setup>
import HeaderSection from "./components/HeaderSection.vue"
import FooterSection from './components/FooterSection.vue'

</script>

<template>
<HeaderSection />
<main class="w-full min-h-[90vh] lg:px-20 sm:pt-10 pb-10 pt-5 px-2">
  <router-view />
</main>
<FooterSection />
</template>


<style scoped>

</style>
