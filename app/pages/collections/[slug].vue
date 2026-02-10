<script setup>
import { onBeforeUnmount, watch, ref, computed } from 'vue'
import CardsList from '~/components/collections/Cards/CardsList.vue'
import FiltersPanel from '~/components/collections/Filters/FiltersPanel.vue'
import ActivityPanel from '~/components/collections/Activity/ActivityPanel.vue'
import TabsPanel from '~/components/collections/UI/TabsPanel.vue'
import ActiveCollectionFiltersBar from '~/components/collections/Filters/ActiveCollectionFiltersBar.vue'

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

const SORT_OPTIONS = [
  { value: 'priceDesc', label: 'Price: High to low' },
  { value: 'priceAsc', label: 'Price: Low to high' },
  { value: 'rarityDesc', label: 'Rarity: High to low' },
  { value: 'rarityAsc', label: 'Rarity: Low to high' },
  { value: 'tokenIdDesc', label: 'Token id: High to low' },
  { value: 'tokenIdAsc', label: 'Token id: Low to high' },
]

const sortLabel = computed(() => {
  const found = SORT_OPTIONS.find((opt) => opt.value === sortOrder.value)
  return found?.label || 'Sort'
})

const sortItems = computed(() => ([
  SORT_OPTIONS.map((opt) => ({
    label: opt.label,
    class: opt.value === sortOrder.value
      ? 'bg-[#5da8ff]/30 text-white'
      : 'text-white/80 hover:bg-white/10',
    onSelect: () => { sortOrder.value = opt.value },
  }))
]))

const sortDropdownUi = {
  content: 'w-[var(--reka-dropdown-menu-trigger-width)] rounded-2xl border border-white/10 bg-[#0b101a]/95 text-white shadow-[0_20px_45px_rgba(2,6,18,0.7)] backdrop-blur',
  item: {
    base: 'text-center text-sm font-semibold',
    rounded: 'rounded-xl',
    padding: 'px-4 py-2',
    inactive: 'text-white/80 hover:bg-white/10',
    active: 'bg-[#5da8ff]/30 text-white',
  },
}


const currentCollection = computed(() => collections[route.params.slug] || null)
const endPoint = computed(() => currentCollection.value?.queryName || '')

const selectedFiltersCount = computed(() => {
  const traits = filterStore.traits?.length || 0
  const statuses = filterStore.status?.length || 0
  const sources = filterStore.sources?.length || 0
  const buys = filterStore.tradeType ? 1 : 0
  const price = filterStore.priceRangeMax ? 1 : 0
  const search = filterStore.search?.trim() ? 1 : 0
  return traits + statuses + sources + buys + price + search
})

const handleToggleFilter = () => {
  showFilterPanel.value = !showFilterPanel.value
  if (isMobile.value) toggleScrollLock(showFilterPanel.value)
}
onBeforeUnmount(() => toggleScrollLock(false))

watch(
  () => route.params.slug,
  () => {
    currentPanel.value = 'Cards'
    showFilterPanel.value = false
    filterStore.clearFilter()
    if (typeof document !== 'undefined') toggleScrollLock(false)
  },
  { immediate: true },
)

useHead(() => ({
  title: currentCollection.value ? `${currentCollection.value.page.name} — Collections` : 'Collections'
}))
</script>

<template>
  <section class="catalog-page" v-if="currentCollection">
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
            <UDropdownMenu :items="sortItems" :ui="sortDropdownUi">
              <button type="button" class="sort-trigger">
                <span>{{ sortLabel }}</span>
                <svg class="sort-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </UDropdownMenu>
          </div>
        </div>
      </div>
      
      
    </section>

    <ActiveCollectionFiltersBar v-if="currentPanel === 'Cards'" />

    <div v-if="currentPanel === 'Cards'" class="catalog-body">
      <FiltersPanel :key="endPoint" :is-filter-panel-open="showFilterPanel" @toggle="handleToggleFilter" />
      <CardsList :endpoint="endPoint" :key="endPoint" />
    </div>

    <div v-else>
      <ActivityPanel :endpoint="endPoint" />
    </div>
  </section>

  <div v-else class="text-center py-10 text-white/80">
    Unknown collection.
  </div>
</template>

<style scoped>
@reference "tailwindcss";
.catalog-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.catalog-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
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
.filter-toggle,
.indicator {
  min-width: 130px;
  justify-content: center;
  text-align: center;
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
  background: linear-gradient(120deg, rgba(99,180,200,.25), rgba(80,125,255,.25));
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
.sort-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, rgba(99,180,200,.3), rgba(80,125,255,.3));
  color: #eaf1ff;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  box-shadow: 0 10px 20px rgba(6,18,43,.2);
}
.sort-trigger:focus-visible {
  outline: none;
  background: linear-gradient(120deg, rgba(120,200,220,.42), rgba(100,140,255,.45));
  box-shadow: 0 14px 26px rgba(6,18,43,.3);
}
.sort-trigger-icon {
  width: 1rem;
  height: 1rem;
  color: rgba(234,241,255,0.8);
}
@media (max-width: 640px) {
  .sort-trigger {
    width: 100%;
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
  }
}
</style>
