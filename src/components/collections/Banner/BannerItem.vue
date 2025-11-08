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
  padding: 1.8rem;
  border-radius: 1.75rem;
  border: 1px solid rgba(99,180,200,.3);
  background:
    radial-gradient(circle at top right, rgba(99,180,200,.25), transparent 45%),
    linear-gradient(145deg, rgba(16,22,36,.95), rgba(32,48,78,.9));
  text-decoration: none;
  color: #e9f5ff;
  box-shadow: 0 25px 55px rgba(4,9,25,.55);
  backdrop-filter: blur(10px);
  transition: transform .25s, border-color .25s, box-shadow .25s;
}
.banner-card:hover { transform: translateY(-6px); border-color: rgba(99,180,200,.6); box-shadow: 0 30px 70px rgba(4,9,25,.65); }
.content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 170px;
  justify-content: space-between;
}
.eyebrow { font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(233,244,255,.65); }
.name {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  line-height: 1.1;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  
}
.metric { display: flex; flex-direction: column; gap: 0.2rem; }
.metric .label { font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(233,244,255,.6); }
.metric .value { font-size: 1.4rem; font-weight: 600; color: #fff; }
.art { position: relative; }
.art img {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 1.4rem;
  object-fit: cover;
  box-shadow: 0 20px 45px rgba(4,9,25,.45);
}
</style>
