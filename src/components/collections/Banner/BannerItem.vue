<script setup>
import { collections } from '@/utils/dictsList.js'

defineProps({
  bannerName: String,
  bannerData: Object
})
</script>

<template>
  <router-link
    :to="collections[bannerName].banner.link_to"
    class="banner-card"
  >
    <div class="content">
      <p class="eyebrow">Collection Insight</p>
      <h3 class="name">{{ collections[bannerName].banner.name }}</h3>
      <div class="metrics">
        <div class="metric">
          <span class="label">Floor price</span>
          <span class="value">{{ bannerData.min_price ?? '—' }} USD</span>
        </div>
        <div class="metric">
          <span class="label">Listed items</span>
          <span class="value">{{ bannerData.count_on_sale ?? 0 }}</span>
        </div>
      </div>
    </div>
    <div class="art">
      <img :src="collections[bannerName].banner.image" :alt="collections[bannerName].banner.name" />
    </div>
  </router-link>
</template>

<style scoped>
.banner-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.75rem;
  border: 1px solid rgba(255,255,255,.08);
  background: radial-gradient(circle at top right, rgba(99,180,200,.2), transparent 45%), rgba(15,16,22,.95);
  text-decoration: none;
  color: inherit;
  transition: transform .25s, border-color .25s, box-shadow .25s;
}
.banner-card:hover { transform: translateY(-6px); border-color: rgba(99,180,200,.6); box-shadow: 0 25px 60px rgba(0,0,0,.35); }
.content { display: flex; flex-direction: column; gap: 0.75rem; }
.eyebrow { font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.name { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 700; line-height: 1.1; }
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}
.metric { display: flex; flex-direction: column; gap: 0.2rem; }
.metric .label { font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.metric .value { font-size: 1.4rem; font-weight: 600; }
.art { position: relative; }
.art img {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 1.4rem;
  object-fit: cover;
  box-shadow: 0 20px 45px rgba(0,0,0,.4);
}
</style>
