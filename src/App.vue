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
    radial-gradient(circle at 10% 10%, rgba(255,255,255,.08), transparent 50%),
    radial-gradient(circle at 90% 20%, rgba(63,125,180,.07), transparent 40%),
    linear-gradient(145deg, #03060c 0%, #050a13 45%, #05070f 100%);
  color: #f1f5ff;
}
:global(.glass-panel) {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 1.5rem;
  backdrop-filter: blur(30px);
  box-shadow: 0 25px 60px rgba(3,6,19,.35);
}

:global(.glass-surface) {
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 1.5rem;
  background: rgba(10,16,28,0.85);
  box-shadow: 0 35px 90px rgba(0,0,0,0.45);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
}

:global(.glass-surface--radial) {
  background:
    radial-gradient(circle at 15% 0%, rgba(84,141,194,0.16), rgba(10,16,28,0.78)),
    rgba(10,16,28,0.9);
}

:global(.glass-chip) {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}
:global(.glass-chip:hover) {
  border-color: rgba(255,255,255,0.35);
  color: #fff;
  background: rgba(255,255,255,0.08);
}
.page-shell {
  width: 100%;
  background: rgba(24,30,48,0.65);
  border: 1px solid rgba(255,255,255,0.16);
  backdrop-filter: blur(42px);
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
