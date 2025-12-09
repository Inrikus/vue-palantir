<script setup>
import { computed } from 'vue'
import BannerPanel from '~/components/collections/Banner/BannerPanel.vue'
import { fetchBanners } from '~/utils/api'

definePageMeta({
  glassShell: true
})

useHead({ title: 'Fusionist — Palantir' })

const { data: bannerCollections, error } = await useAsyncData('home-banners', async () => {
  const { data } = await fetchBanners()
  return data?.collections || {}
}, { server: true })

const listedCount = computed(() => {
  const entries = bannerCollections.value || {}
  return Object.values(entries).reduce((sum, entry) => sum + (entry?.count_on_sale || 0), 0)
})

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
    action: listedCount.value ? `${listedCount.value} items listed` : 'Browse items',
    to: '/collections'
  }
])
</script>

<template>
  <section class="home">
    <div class="promo-grid">
      <NuxtLink
        v-for="tile in tiles"
        :key="tile.to"
        :to="tile.to"
        class="promo-card"
      >
        <p class="eyebrow">{{ tile.hint }}</p>
        <h2>{{ tile.title }}</h2>
        <p class="description">{{ tile.description }}</p>
        <span class="action">{{ tile.action }} →</span>
      </NuxtLink>
    </div>

    <p v-if="error" class="error-text">Failed to load stats. Live data will appear on client.</p>
    <BannerPanel :initial-banners="bannerCollections || {}" />
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
}

.promo-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.9rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(255,255,255,0.08);
  background: var(--grad-card-dark);
  color: #eaf4ff;
  box-shadow: 0 20px 45px rgba(4,9,25,.55);
  transition: border-color .2s, transform .2s, box-shadow .2s;
  text-align: center;
  align-items: center;
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

.error-text {
  margin-top: 0.5rem;
  color: rgba(255,255,255,.7);
  font-size: 0.9rem;
}

:global(.grid-banner) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 1.5rem;
  justify-content: center;
}
</style>
