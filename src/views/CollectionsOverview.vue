<script setup>
import BannerPanel from '@/components/collections/Banner/BannerPanel.vue'
</script>

<template>
  <section class="space-y-10">
    <header class="collections-hero">
      <div>
        <p class="eyebrow">Fusionist collections</p>
        <h1 class="title">Browse every drop, track floors and jump into detailed analytics.</h1>
        <p class="subtitle">
          The dashboard syncs with the Palantir API and displays live prices, listings, and activity across all available collections.
        </p>
      </div>
      <router-link to="/wiki" class="cta">Open Wiki</router-link>
    </header>

    <BannerPanel />
  </section>
</template>

<style scoped>
.collections-hero {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(5,6,12,.75);
  backdrop-filter: blur(18px);
}
@media (min-width: 768px) {
  .collections-hero { flex-direction: row; justify-content: space-between; align-items: center; }
}
.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,.6);
}
.title {
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1.2;
  font-weight: 700;
}
.subtitle {
  color: rgba(255,255,255,.7);
  max-width: 60ch;
}
.cta {
  align-self: flex-start;
  padding: 0.8rem 1.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.4);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  text-align: center;
}
:global(.grid-banner) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
