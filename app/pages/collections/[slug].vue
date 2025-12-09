<script setup>
import { onBeforeUnmount, watch, ref, computed } from 'vue'
import CardsList from '~/components/collections/Cards/CardsList.vue'
import FiltersPanel from '~/components/collections/Filters/FiltersPanel.vue'
import ActivityPanel from '~/components/collections/Activity/ActivityPanel.vue'
import TabsPanel from '~/components/collections/UI/TabsPanel.vue'

import { useCardStore } from '@/stores/cardStore'
import { useFilterStore } from '@/stores/filterStore'
import { collections } from '@/utils/dictsList.js'
import { toggleScrollLock } from '@/utils/scrollLock'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const cardStore = useCardStore()
const filterStore = useFilterStore()
const showFilterPanel = ref(false)

const currentPanel = ref('Cards')
const isMobile = computed(() => (typeof window !== 'undefined') && window.innerWidth <= 768)

const sortOrder = computed({
  get: () => filterStore.order,
  set: (val) => filterStore.setOrder(val)
})

const currentCollection = computed(() => collections[route.params.slug] || null)
const endPoint = computed(() => currentCollection.value?.queryName || '')

const selectedFiltersCount = computed(() => {
  const traits = filterStore.traits?.length || 0
  const statuses = filterStore.status?.length || 0
  const sources = filterStore.sources?.length || 0
  const buys = filterStore.tradeType ? 1 : 0
  const price = filterStore.priceRangeMax ? 1 : 0
  return traits + statuses + sources + buys + price
})

const handleToggleFilter = () => {
  showFilterPanel.value = !showFilterPanel.value
  if (isMobile.value) toggleScrollLock(showFilterPanel.value)
}
onBeforeUnmount(() => toggleScrollLock(false))

watch(() => route.params.slug, () => {
  currentPanel.value = 'Cards'
  showFilterPanel.value = false
})

useHead(() => ({
  title: currentCollection.value ? `${currentCollection.value.page.name} — Collections` : 'Collections'
}))
</script>

<template>
  <div class="min-h-screen space-y-2" v-if="currentCollection">
    <section class="collections-header" aria-label="Collection overview and controls">
      <div class="head-left">
        <img :src="currentCollection.page.image" class="logo" alt="collection logo" />
        <div>
          <p class="eyebrow">Fusionist collection</p>
          <h2 class="title">{{ currentCollection.page.name }}</h2>
        </div>
      </div>
      
      <div class="controls-row">
        <div class="filters-inline">
          <div class="filter-row">
            <button
              @click="handleToggleFilter"
              class="filter-toggle"
            >
              <img src="@/assets/filter-1.svg" class="w-5 sm:w-6" alt="filter" />
              Filters
              <span v-if="selectedFiltersCount" class="count">({{ selectedFiltersCount }})</span>
            </button>

            <div class="indicator">
              <span class="dot"></span>
              <span>Items: <span class="font-medium">{{ cardStore.maxCards }}</span></span>
            </div>
          </div>

          <div class="tabs-wrap">
            <TabsPanel v-model="currentPanel" />
          </div>

          <div class="sort-area">
            <label for="sort-select" class="sort-label">Sort by</label>
            <div class="select-wrapper">
              <select
                id="sort-select"
                v-model="sortOrder"
                class="sort-select"
              >
                <option value="priceDesc">Price: High to low</option>
                <option value="priceAsc">Price: Low to high</option>
                <option value="rarityDesc">Rarity: High to low</option>
                <option value="rarityAsc">Rarity: Low to high</option>
                <option value="tokenIdDesc">Token id: High to low</option>
                <option value="tokenIdAsc">Token id: Low to high</option>
              </select>
              <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      
    </section>

    <div v-if="currentPanel === 'Cards'">
      <div class="mt-8 relative h-full">
        <FiltersPanel :is-filter-panel-open="showFilterPanel" @toggle="handleToggleFilter" />
        <CardsList :endpoint="endPoint" :key="endPoint" />
      </div>
    </div>

    <div v-else>
      <ActivityPanel :endpoint="endPoint" />
    </div>
  </div>

  <div v-else class="text-center py-10 text-white/80">
    Unknown collection.
  </div>
</template>

<style scoped>
.collections-header {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  backdrop-filter: blur(18px);
}
.head-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.head-left .meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.logo {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  object-fit: cover;
}
.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,.75);
}
.title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #63B4C8;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.tabs-wrap {
  display: flex;
  justify-content: center;
  grid-area: tabs;
}

.filters-inline {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "filters tabs sort";
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.filter-row {
  grid-area: filters;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  justify-self: start;
}
@media (max-width: 640px) {
  .collections-header {
    padding: 1.25rem 1rem;
    gap: 1rem;
    align-items: center;
    text-align: center;
  }
  .head-left {
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .head-left .meta {
    align-items: center;
  }
  .logo {
    width: 72px;
    height: 72px;
  }

  .controls-row { justify-content: center; width: 100%; }
  .filters-inline {
    grid-template-columns: 1fr;
    grid-template-areas:
      "tabs"
      "filters"
      "sort";
    width: 100%;
    gap: 0.85rem;
  }
  .filter-row {
    width: 100%;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .tabs-wrap {
    width: 100%;
    justify-content: center;
  }
  .indicator {
    width: auto;
    justify-content: center;
  }
  .sort-area { width: 100%; }
}

.filter-toggle {
  @apply inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition;
  background: rgba(99,180,200,.15);
  border: 1px solid rgba(99,180,200,.35);
  color: #e5f6ff;
  box-shadow: 0 10px 25px rgba(8,20,40,.3);
}
.filter-toggle:hover {
  border-color: rgba(99,180,200,.7);
  color: #fff;
}
.filter-toggle .count {
  font-size: 0.85em;
  opacity: 0.8;
}

.indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255,255,255,.85);
}
.indicator .dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: #34d399;
  animation: pulse 1.2s infinite;
}
@keyframes pulse {
  0% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0.3; transform: scale(0.9); }
}

.sort-area {
  grid-area: sort;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 220px;
  text-align: center;
}
.sort-label {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,.68);
}
@media (max-width: 640px) {
  .sort-area { flex: 1; }
}
.select-wrapper {
  position: relative;
  text-align: center;
}
.sort-select {
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(99,180,200,.35);
  background: rgba(255,255,255,.92);
  padding: 0.65rem 2.5rem 0.65rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  appearance: none;
  color: #07122b;
  text-align: center;
  box-shadow: 0 10px 25px rgba(6,18,43,.15);
}
.sort-select:focus {
  outline: none;
  border-color: rgba(99,180,200,.85);
  box-shadow: 0 0 0 2px rgba(99,180,200,.25), 0 15px 35px rgba(6,18,43,.2);
  background: rgba(255,255,255,.98);
}
.chevron {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  transform: translateY(-50%);
  color: rgba(7,18,43,.5);
}
</style>
