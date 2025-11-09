<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderSection from "./components/HeaderSection.vue"
import FooterSection from './components/FooterSection.vue'

const route = useRoute()
const useGlassShell = computed(() => !!route.meta?.glassShell)
</script>

<template>
  <HeaderSection />
  <main
    :class="[
      'w-full min-h-[90vh] lg:px-12 sm:pt-10 pb-10 pt-5 px-3',
      useGlassShell ? 'page-shell' : 'page-wide'
    ]"
  >
    <router-view />
  </main>
  <FooterSection />
</template>


<style scoped>
:global(body) {
  background:
    radial-gradient(circle at 18% 15%, rgba(255,255,255,.18), rgba(126,162,201,.2) 32%, rgba(5,7,14,.3) 60%),
    linear-gradient(135deg, #05070f 0%, #060b17 45%, #05060c 100%);
  color: #f1f5ff;
}
:global(.glass-panel) {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 1.5rem;
  backdrop-filter: blur(30px);
  box-shadow: 0 25px 60px rgba(3,6,19,.35);
}
.page-shell {
  width: 100%;
  background: rgba(15,18,29,0.6);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(40px);
  box-shadow: 0 35px 90px rgba(3,6,19,.45);
}
.page-wide {
  width: 100%;
  max-width: none;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
}
</style>
