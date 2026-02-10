<script setup>
import { computed, nextTick, ref, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useFilterStore } from '@/stores/filterStore'
import { useCardStore } from '@/stores/cardStore'
import { collections, platformIcon } from '@/utils/dictsList.js'

const props = defineProps({
  isFilterPanelOpen: { type: Boolean, required: true }
})
const emit = defineEmits(['toggle'])

const route = useRoute()
const filterStore = useFilterStore()
const cardStore = useCardStore()

const currentSlug = computed(() => route.params.slug)
const currentCollection = computed(() => collections[currentSlug.value] || null)

// Mobile/desktop анимация панели
const isMobile = computed(() => (typeof window !== 'undefined') && window.innerWidth <= 768)

// checked-состояния читаем из стора
const isTraitChecked = (filter, option) =>
  filterStore.traits.some(t => t.trait_type === filter && t.value === option)
const isStatusChecked = (status) => filterStore.status?.includes(status) || false
const isSourceChecked = (source) => filterStore.sources?.includes(source) || false
const isTradeTypeChecked = () => filterStore.tradeType === 1
const showSearch = computed(() => currentSlug.value === 'battle_mech')

const searchValue = ref(filterStore.search || '')
const isSearchPending = ref(false)
let searchTimer = null

const scheduleSearchApply = (value) => {
  if (searchTimer) clearTimeout(searchTimer)
  const term = String(value || '').trim()
  if (term && term.length < 3) {
    isSearchPending.value = false
    return
  }
  isSearchPending.value = true
  searchTimer = setTimeout(async () => {
    await requestApply()
  }, 1000)
}

watch(searchValue, (val) => {
  filterStore.setSearch(val)
  scheduleSearchApply(val)
})

watch(() => filterStore.search, (val) => {
  if (val !== searchValue.value) searchValue.value = val || ''
})

watch(currentSlug, (slug) => {
  if (slug !== 'battle_mech' && filterStore.search) {
    filterStore.setSearch('')
    searchValue.value = ''
    requestApply()
  }
})

watch(() => cardStore.isLoading, (loading) => {
  if (!loading) {
    isSearchPending.value = false
  }
})

const searchStatus = computed(() => {
  if (!showSearch.value) return ''
  const term = String(searchValue.value || '').trim()
  if (!term || term.length < 3) return ''
  if (isSearchPending.value || cardStore.isLoading) return 'Searching…'
  return `${cardStore.maxCards} results`
})

const gradeKey = (val) => {
  const raw = String(val || '').toLowerCase()
  if (raw === 'legendary') return 'legend'
  return raw
}
const gradeGradientMap = {
  common: 'var(--grad-rarity-common)',
  elite: 'var(--grad-rarity-elite)',
  epic: 'var(--grad-rarity-epic)',
  legend: 'var(--grad-rarity-legend)',
  mythical: 'var(--grad-rarity-mythical)',
}
const gradeTileStyle = (filter, option, active) => {
  if (filter !== 'GRADE') return null
  const key = gradeKey(option)
  const bg = gradeGradientMap[key]
  if (!bg) return null
  return {
    background: bg,
    color: '#ffffff',
    borderColor: active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)',
    boxShadow: active
      ? '0 10px 22px rgba(5,10,20,0.5), inset 0 0 0 1px rgba(255,255,255,0.4)'
      : 'none',
  }
}

// handlers
const handleToggleFilter = () => emit('toggle')

const requestApply = async () => {
  if (filterStore.needsUpdate) {
    filterStore.setNeedsUpdate(false)
    await nextTick()
  }
  filterStore.setNeedsUpdate(true)
}

const toggleTradeType = async () => {
  filterStore.changeTradeType({ target: { checked: !isTradeTypeChecked() } })
  await requestApply()
}
const toggleStatus = async (status) => {
  filterStore.changeStatus({ target: { value: status, checked: !isStatusChecked(status) } })
  await requestApply()
}
const toggleSource = async (source) => {
  filterStore.changeSources({ target: { value: source, checked: !isSourceChecked(source) } })
  await requestApply()
}
const toggleTrait = async (trait, option) => {
  filterStore.changeTraits({ target: { checked: !isTraitChecked(trait, option) } }, trait, option)
  await requestApply()
}

const handleApplyFilter = () => {
  requestApply()
}

const handleResetFilter = () => {
  filterStore.clearFilter()
  requestApply()
}

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition name="fade" appear>
      <div
        v-show="props.isFilterPanelOpen"
        class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        role="presentation"
        @click.self="handleToggleFilter"
      />
    </transition>

    <!-- Drawer -->
    <transition :name="isMobile ? 'slide-up' : 'slide-left'" appear>
      <aside
        v-show="props.isFilterPanelOpen"
        id="filter-inner-panel"
        class="fixed top-0 left-0 z-[9999] flex h-full w-full flex-col overflow-hidden text-white shadow-2xl sm:w-[720px] sm:max-w-[92vw] sm:rounded-none panel-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        <!-- Header -->
        <div class="panel-header">
          <div class="panel-headings">
            <p class="panel-eyebrow">Filters</p>
            <h2 id="filters-title" class="panel-title">Collection control</h2>
          </div>
          <div class="panel-actions">
            <button
              type="button"
              class="close-btn close-btn--ghost"
              @click="handleResetFilter"
              aria-label="Reset filters"
            >
              Reset
            </button>
            <button
              type="button"
              class="close-btn"
              @click="handleToggleFilter"
              aria-label="Close filters"
            >
              <img src="@/assets/cross.svg" alt="Close" class="close-icon" />
              Close
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="panel-body">
          <section v-if="showSearch" class="filter-card">
            <div class="section-head">
              <div>
                <h4 class="sec-title">Search</h4>
              </div>
            </div>
            <div class="search-wrap">
              <span class="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="M20 20l-3.5-3.5"></path>
                </svg>
              </span>
              <input
                v-model.trim="searchValue"
                id="traits-search"
                name="traits-search"
                type="search"
                inputmode="search"
                class="search-input"
                placeholder="Search skills (e.g. Repair Support)"
              />
              <span v-if="searchStatus" class="search-status">{{ searchStatus }}</span>
            </div>
          </section>
          <!-- Status -->
          <section class="filter-card">
            <div class="section-head">
              <div>
                <h4 class="sec-title">Status</h4>
              </div>
            </div>
            <div class="tiles-grid">
              <button
                type="button"
                class="tile"
                :class="{ 'is-active': isTradeTypeChecked() }"
                @click="toggleTradeType"
              >
                <span class="tile-label">Only Buy Now</span>
              </button>
              <button
                type="button"
                class="tile"
                :class="{ 'is-active': isStatusChecked('Normal') }"
                @click="toggleStatus('Normal')"
              >
                <span class="tile-label">Normal</span>
              </button>
              <button
                v-if="['quartan_primes', 'primeace'].includes(currentSlug)"
                type="button"
                class="tile"
                :class="{ 'is-active': isStatusChecked('Uncreated') }"
                @click="toggleStatus('Uncreated')"
              >
                <span class="tile-label">Uncreated</span>
              </button>
            </div>
          </section>

          <!-- Traits -->
          <section
            v-for="(filter, i) in Object.keys(currentCollection?.filters || {})"
            :key="i"
            class="filter-card"
          >
            <div class="section-head">
              <div>
                <h4 class="sec-title">{{ filter }}</h4>
              </div>
            </div>
            <div class="tiles-grid">
              <button
                v-for="(option, idx) in currentCollection?.filters?.[filter] || []"
                :key="idx"
                type="button"
                class="tile"
                :class="{ 'is-active': isTraitChecked(filter, option) }"
                :style="gradeTileStyle(filter, option, isTraitChecked(filter, option))"
                @click="toggleTrait(filter, option)"
              >
                <span class="tile-label">{{ option }}</span>
              </button>
            </div>
          </section>

          <!-- Sources -->
          <section class="filter-card">
            <div class="section-head">
              <div>
                <h4 class="sec-title">Sources</h4>
              </div>
            </div>
            <div class="tiles-grid">
              <button
                v-for="(option, i) in currentCollection?.sources || []"
                :key="i"
                type="button"
                class="tile tile--icon"
                :class="{ 'is-active': isSourceChecked(option) }"
                @click="toggleSource(option)"
              >
                <img :src="platformIcon[option]" class="tile-icon" alt="" />
                <span class="tile-label">{{ option }}</span>
              </button>
            </div>
          </section>
        </div>

      </aside>
    </transition>
  </teleport>
</template>

<style scoped>
/* Backdrop */
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Drawer animations */
.slide-left-enter-active, .slide-left-leave-active { transition: transform 220ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 220ms ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

#filter-inner-panel {
  border: none;
  border-radius: 0;
}

/* Panel shell */
.panel-shell {
  background:
    radial-gradient(circle at 15% 0%, rgba(84,141,194,0.16), rgba(10,16,28,0.78)),
    rgba(10,16,28,0.9);
  border-right: 1px solid rgba(99,180,200,0.12);
  box-shadow: 0 30px 80px rgba(2,6,18,0.7);
}

/* Header */
.panel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(6, 10, 22, 0.82);
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .panel-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.panel-headings {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.panel-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #63B4C8;
}
.panel-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #f4f7ff;
}
.panel-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
.close-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(99,180,200,0.25);
  background: rgba(255,255,255,0.04);
  padding: 0.55rem 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(226,236,255,0.85);
  transition: border-color .2s ease, color .2s ease, background-color .2s ease;
}
.close-btn--ghost {
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.02);
}
.close-btn:hover {
  border-color: rgba(99,180,200,0.6);
  color: #fff;
  background: rgba(99,180,200,0.12);
}
.close-icon { width: 14px; height: 14px; }
@media (max-width: 640px) {
  .close-btn {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
    border-radius: 0.95rem;
    font-size: 0.75rem;
    letter-spacing: 0.22em;
    background: rgba(12,18,28,0.9);
  }
  .panel-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
  }
}

/* Body */
.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.5rem 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Layout */
.filter-card {
  width: 100%;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}
.sec-title {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(99,180,200,0.9);
  font-weight: 700;
}
.sec-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

/* Tiles */
.tiles-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
@media (max-width: 640px) {
  .tiles-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 768px) {
  .tiles-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (min-width: 1100px) {
  .tiles-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
.tile {
  --tile-accent: rgba(99,180,200,0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
  padding: 0 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  user-select: none;
  transition: box-shadow .2s ease, background-color .2s ease, transform .06s ease, border-color .2s ease;
}
.tile:hover {
  box-shadow: 0 12px 28px rgba(6,10,24,0.6);
  background: rgba(255,255,255,0.08);
}
.tile:active { transform: translateY(1px); }
.tile-label {
  font-size: 0.75rem;
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
  color: rgba(233,240,255,0.92);
}
.tile--icon {
  justify-content: flex-start;
}
.tile-icon {
  width: 18px;
  height: 18px;
}
.tile.is-active {
  border-color: var(--tile-accent);
  background: linear-gradient(135deg, rgba(99,180,200,0.16), rgba(12,18,28,0.9));
  box-shadow: 0 12px 30px rgba(7,14,26,0.6), inset 0 0 0 1px rgba(99,180,200,0.35);
}

/* Search */
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 1.1rem;
}
.search-input {
  width: 100%;
  border-radius: 0.9rem;
  border: 1px solid rgba(99,180,200,0.2);
  background: rgba(9,12,20,0.8);
  color: #f2f6ff;
  padding: 0.75rem 1.7rem 0.75rem 2.4rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.search-input::-webkit-search-cancel-button {
  margin-right: 0.15rem;
}
.search-input::-webkit-search-decoration {
  -webkit-appearance: none;
}
.search-input::placeholder {
  color: rgba(226,236,255,0.35);
}
.search-input:focus {
  outline: none;
  border-color: rgba(99,180,200,0.5);
  box-shadow: 0 0 0 2px rgba(99,180,200,0.15);
}
.search-icon {
  position: absolute;
  left: 0.85rem;
  width: 16px;
  height: 16px;
  color: rgba(99,180,200,0.8);
}
.search-icon svg {
  width: 100%;
  height: 100%;
}
.search-status {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(99,180,200,0.85);
  pointer-events: none;
  background: rgba(6,10,18,0.75);
  padding: 0.2rem 0.4rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(99,180,200,0.3);
}
</style>
