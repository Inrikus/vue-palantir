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
      'w-full min-h-[90vh] lg:px-20 sm:pt-10 pb-10 pt-5 px-2',
      useGlassShell ? 'page-shell' : 'page-wide'
    ]"
  >
    <router-view />
  </main>
  <FooterSection />
</template>


<style scoped>
:global(body) {
  background: radial-gradient(circle at 20% 15%, rgba(255,255,255,.35), rgba(62,83,134,.35) 35%, #060a15 80%);
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
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(15,18,29,0.6);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 2rem;
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
