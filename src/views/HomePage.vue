<script setup>
import BannerPanel from '@/components/collections/Banner/BannerPanel.vue'
import { computed, ref } from 'vue'
import { fetchBanners } from '@/utils/api'

const stats = ref({ listed: 0 })

async function loadStats () {
  try {
    const { data } = await fetchBanners()
    const total = Object.values(data.collections || {}).reduce((sum, entry) => sum + (entry.count_on_sale || 0), 0)
    stats.value.listed = total
  } catch (e) {
    stats.value.listed = 0
  }
}
loadStats()

const tiles = computed(() => [
  {
    title: 'Wiki',
    description: 'Dive into the encyclopaedia for Cores, Weapons and the upcoming Buffs.',
    hint: 'Knowledge base',
    action: 'Explore wiki',
    to: '/wiki'
  },
  {
    title: 'Collections',
    description: 'Live floor prices, filters and analytics across six Fusionist drops.',
    hint: 'Marketplace',
    action: `${stats.value.listed} items listed`,
    to: '/collections'
  }
])
</script>

<template>
  <section class="home">
    <div class="promo-grid">
      <router-link
        v-for="tile in tiles"
        :key="tile.to"
        :to="tile.to"
        class="promo-card"
      >
        <p class="eyebrow">{{ tile.hint }}</p>
        <h2>{{ tile.title }}</h2>
        <p class="description">{{ tile.description }}</p>
        <span class="action">{{ tile.action }} →</span>
      </router-link>
    </div>

    <BannerPanel />
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
}

.promo-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.9rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(99,180,200,.28);
  background:
    radial-gradient(circle at top right, rgba(99,180,200,.25), transparent 45%),
    linear-gradient(145deg, rgba(18,22,38,.95), rgba(34,48,78,.88));
  color: #eaf4ff;
  box-shadow: 0 20px 45px rgba(4,9,25,.55);
  transition: border-color .2s, transform .2s, box-shadow .2s;
}
.promo-card:hover {
  border-color: rgba(99,180,200,.65);
  transform: translateY(-4px);
  box-shadow: 0 30px 65px rgba(4,9,25,.65);
}
.eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(229,242,255,.65);
}
h2 {
  font-size: 1.9rem;
  font-weight: 600;
  color: #fff;
}
.description { color: rgba(229,242,255,.75); }
.action {
  margin-top: auto;
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #63b4c8;
}

:global(.grid-banner) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}
</style>
