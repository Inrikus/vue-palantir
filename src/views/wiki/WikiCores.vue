<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useWikiCoreStore } from '@/stores/wikiCoreStore'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'

import CoreCard from '@/components/wiki/CoreCard.vue'
import WikiCoreFilterPanel from '@/components/wiki/WikiCoreFilterPanel.vue'
import LocalePicker from '@/components/wiki/LocalePicker.vue'
import ActiveFiltersBar from '@/components/wiki/ActiveFiltersBar.vue'
import InfinitePager from '@/components/wiki/InfinitePager.vue'
import { buildJobCardList } from '@/components/wiki/filters/dicts'
import WikiDetailModal from '@/components/wiki/WikiDetailModal.vue'
import { useWikiListingPage } from '@/composables/useWikiListingPage'

const route = useRoute()
const router = useRouter()

const store      = useWikiCoreStore()
const labelStore = useWikiLabelStore()
const buffStore  = useWikiBuffStore()

const JOBS = buildJobCardList('All Cores')
const selectedJob = ref(0)

async function load(targetLocale = locale.value) {
  const lang = targetLocale ?? locale.value
  await Promise.all([
    store.load(lang),
    labelStore.load(lang),
    buffStore.load(lang),
  ])
  syncFiltersFromStore()
}

const {
  locale,
  search,
  isMobile,
  showFilterPanel,
  modalOpen,
  toggleFilterPanel,
  setFilterPanelOpen,
  setModalOpen,
} = useWikiListingPage({
  initialLocale: route.query.locale ?? 'en',
  loadResources: load,
  onSearchChange: () => {
    store.page = 1
  },
})

// Локальная форма фильтров (массивы + uniq toggle)
function buildFilterState (source = {}) {
  return {
    rares: Array.isArray(source.rares) ? [...source.rares] : [],
    jobs: Array.isArray(source.jobs) ? [...source.jobs] : [],
    labels: Array.isArray(source.labels) ? [...source.labels] : [],
    uniq: !!source.uniq,
  }
}
const filters = ref(buildFilterState())
let syncingFilters = false
function syncFiltersFromStore () {
  syncingFilters = true
  filters.value = buildFilterState(store.filters || {})
  syncingFilters = false
}

/* Применяем сразу при изменении модели */
watch(filters, (val) => {
  if (syncingFilters) return
  store.applyFilters(val)
}, { deep: true })
watch(() => filters.value.jobs, (jobs) => {
  const arr = Array.isArray(jobs) ? jobs : []
  selectedJob.value = arr.length === 1 ? arr[0] : 0
})

// Счётчик выбранных фильтров (без строки поиска)
const selectedFiltersCount = computed(() => {
  const f = store.filters || {}
  let c = 0
  if (Array.isArray(f.rares))  c += f.rares.length
  if (Array.isArray(f.jobs))   c += f.jobs.length
  if (Array.isArray(f.labels)) c += f.labels.length
  if (f.uniq)                  c += 1
  if (f.hasBuffId != null)     c += 1
  return c
})

/* ---------- Карта лейблов для чипов ---------- */
const labelMap = computed(() => {
  const map = Object.create(null)
  const ids = filters.value?.labels || []
  for (const id of ids) {
    const l = labelStore.byId?.[id]
    if (!l) continue
    map[id] = {
      id,
      text: l.i18n?.[locale.value] || l.Name?.text || String(id),
      colorHex: l.LabelImageColor || '5E5E5E',
    }
  }
  return map
})

/* ---------- Загрузка / перезагрузка ---------- */
function selectJob (job) {
  selectedJob.value = job
  filters.value.jobs = job === 0 ? [] : [job]
}

function handleReload () {
  // Reload явно сбрасывает и поиск, и фильтры
  search.value = ''
  store.resetFilters()
  syncFiltersFromStore()
  load()
}

function handleResetFromPanel () {
  // Reset из панели — дополнительно чистим строку поиска
  search.value = ''
  store.resetFilters()
  syncFiltersFromStore()
}

/* ---------- Навигация / query ---------- */
// Локаль остаётся в query, поиск — нет
watch(locale, (val) => {
  router.replace({ query: { ...route.query, locale: val || undefined } })
})

watch(() => route.query.locale, (next) => {
  const normalized = next ?? 'en'
  if (normalized !== locale.value) {
    locale.value = normalized
  }
})


/* ---------- Mount lifecycle ---------- */
// Общий ресайз/загрузка/scroll-lock обрабатываются в useWikiListingPage

/* ---------- Грид / модалка ---------- */
const searchTerm = computed(() => String(search.value || '').trim().toLowerCase())
const normalizeText = (val) => String(val || '').toLowerCase()

function matchesCoreSearch(core) {
  if (!searchTerm.value) return true
  const term = searchTerm.value
  const locKey = String(locale.value || 'en')

  const english = normalizeText(core?.englishName)
  const name = normalizeText(core?.i18n?.name?.[locKey])
  const desc = normalizeText(core?.i18n?.desc?.[locKey])
  if (english.includes(term) || name.includes(term) || desc.includes(term)) return true

  const buffEntries = Array.isArray(core?.Buff_Display) ? core.Buff_Display : []
  for (const entry of buffEntries) {
    const buff = buffStore.byId?.[entry?.BuffId]
    if (!buff) continue
    const buffName = normalizeText(buff?.i18n?.name?.[locKey] || buff?.englishName)
    const buffDesc = normalizeText(buff?.i18n?.desc?.[locKey])
    if (buffName.includes(term) || buffDesc.includes(term)) return true
  }
  return false
}

const filteredCores = computed(() => {
  const base = store.sorted
  if (!Array.isArray(base)) return []
  if (!searchTerm.value) return base
  return base.filter(matchesCoreSearch)
})

const items = computed(() => filteredCores.value.slice(0, store.page * store.pageSize))
function iconSrc (core) { return `/wiki/Cores/${core?.Icon}.png` }

function coreTitle (core) {
  const loc = String(locale.value || 'en')
  return core?.i18n?.name?.[loc] || core?.englishName || `ID ${core?.id}`
}

function findByIdLevel (id, lv) {
  return store.items.find(c => c.id === id && c.CoreLv === lv) ||
         store.items.find(c => c.id === id) || null
}

const modalLevel   = ref(1)
const selectedId   = ref(null)
const selectedCore = ref(null)

function openModal (core) {
  selectedId.value   = core.id
  modalLevel.value   = core.CoreLv || 1
  selectedCore.value = findByIdLevel(core.id, modalLevel.value) || core
  setModalOpen(true)
}

function closeModal () {
  setModalOpen(false)
  selectedId.value   = null
  selectedCore.value = null
}

watch(modalLevel, (lv) => {
  const v = Math.min(10, Math.max(1, Number(lv || 1)))
  if (v !== lv) modalLevel.value = v
  if (modalOpen.value && selectedId.value != null) {
    const next = findByIdLevel(selectedId.value, v)
    if (next) selectedCore.value = next
  }
})

/* ---------- Items counter (после фильтров) ---------- */
const totalMatched = computed(() => filteredCores.value.length)
const hasNextPage = computed(() => store.page * store.pageSize < filteredCores.value.length)
const isLoading = computed(() => store.loading)

function handleLoadMore () {
  if (!hasNextPage.value) return
  store.nextPage()
}
</script>


<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4">
    <!-- HEADER -->
    <header class="space-y-3">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Wiki - Cores</h1>
        <LocalePicker v-model="locale" />
      </div>

      <div
        class="grid gap-3"
        :class="isMobile ? 'grid-cols-3' : 'grid-cols-6'"
      >
        <button
          v-for="m in JOBS"
          :key="m.id"
          class="job-card group"
          :class="[isMobile ? 'h-24' : 'h-28', selectedJob === m.id ? 'is-active' : '']"
          @click="selectJob(m.id)"
          :title="m.label"
        >
          <img :src="m.img" class="absolute inset-0 h-full w-full object-cover opacity-90" alt="" />
          <div class="absolute inset-0" style="background-image:url('/wiki/Mechs/Img_BigScreenBG.png'); background-size:cover; opacity:.25" />
          <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent transition-opacity group-hover:opacity-60" />
          <span class="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            {{ m.label }}
          </span>
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="order-1 sm:order-1">
          <button
            @click="toggleFilterPanel"
            class="filter-toggle"
          >
            <img src="@/assets/filter-1.svg" class="w-5 sm:w-6" alt="filter" />
            Filters
            <span v-if="selectedFiltersCount" class="text-xs sm:text-sm opacity-70">({{ selectedFiltersCount }})</span>
          </button>
        </div>

        <div class="order-2 sm:order-3 ml-auto text-sm opacity-80 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Items: <span class="font-medium">{{ totalMatched }}</span></span>
        </div>

        <div class="order-4 sm:order-2 basis-full sm:basis-auto w-full sm:w-auto sm:flex-1 flex items-center gap-3">
          <div class="relative flex-1 min-w-[240px]">
            <input
              v-model.trim="search"
              type="text"
              inputmode="search"
              placeholder="Search by name or description..."
              class="search-input"
            />
            <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 104.472 10.028l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"/>
            </svg>
            <button
              v-if="search"
              @click="search = ''"
              class="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/15"
              title="Clear"
            >
              <svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.225 4.811L4.811 6.225 9.586 11l-4.775 4.775 1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z"/>
              </svg>
            </button>
          </div>

          <button
            @click="handleReload"
            class="ghost-btn shrink-0"
          >
            Reload
          </button>
        </div>
      </div>
    </header>

    <!-- ACTIVE FILTERS -->
    <ActiveFiltersBar
      :locale="locale"
      :rares="filters.rares"
      :jobs="filters.jobs"
      :labels="filters.labels"
      :uniq="filters.uniq"
      :label-map="labelMap"
      @remove:rarity="val => filters.rares = filters.rares.filter(v => v !== val)"
      @remove:job="val => filters.jobs = filters.jobs.filter(v => v !== val)"
      @remove:label="val => filters.labels = filters.labels.filter(v => v !== val)"
      @unset:uniq="filters.uniq = false"
    />

    <!-- ГРИД -->
    <div v-if="store.loading" class="text-sm opacity-80">Loading...</div>
    <div v-else-if="store.error" class="text-sm text-red-400">Error: {{ store.error }}</div>


    <div v-else>
      <div class="hidden sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <button
          v-for="core in items"
          :key="`${core.id}-${core.CoreLv}`"
          @click="openModal(core)"
          class="wiki-card group"
          :title="`ID ${core.id} - Lv.${core.CoreLv}`"
        >
          <div class="absolute inset-0 relative overflow-hidden">
            <img
              src="/wiki/Mechs/Img_BigScreenBG.png"
              alt=""
              class="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none select-none"
              draggable="false"
            />
            <img class="w-full h-full object-contain relative z-10" :src="iconSrc(core)" alt="" loading="lazy" draggable="false" />
            <img
              src="/wiki/Cards/Img_CoreBGFX.png"
              alt=""
              class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow"
              aria-hidden="true"
              draggable="false"
            />
          </div>
          <div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] bg-black/40 backdrop-blur-sm">
            <div class="flex items-center justify-center text-center">
              <span class="opacity-90 text-sm font-medium truncate max-w-[90%]" :title="coreTitle(core)">
                {{ coreTitle(core) }}
              </span>
            </div>
          </div>
        </button>
      </div>
      <div class="flex flex-col gap-3 sm:hidden">
        <button
          v-for="core in items"
          :key="`mobile-${core.id}-${core.CoreLv}`"
          @click="openModal(core)"
          class="wiki-card-mobile"
        >
          <div class="mobile-art">
            <img src="/wiki/Mechs/Img_BigScreenBG.png" alt="" class="mobile-bg" aria-hidden="true" draggable="false" />
            <img
              :src="iconSrc(core)"
              alt=""
              class="mobile-thumb"
              loading="lazy"
              draggable="false"
            />
          </div>
          <div class="mobile-copy">
            <p class="mobile-title">
              {{ coreTitle(core) }}
            </p>
          </div>
        </button>
      </div>
      <InfinitePager
        :is-loading="isLoading"
        :has-next-page="hasNextPage"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- МОДАЛКА -->
    <WikiDetailModal
      :open="modalOpen"
      :mobile="isMobile"
      aria-label="Core details"
      @close="closeModal"
    >
      <template #header-left>
        <div v-if="modalOpen && selectedCore" class="level-control level-control--header">
          <span class="level-label">Level</span>
          <input
            class="level-range"
            type="range"
            min="1"
            max="10"
            step="1"
            v-model.number="modalLevel"
            aria-label="Core level"
          />
          <span class="level-value">{{ modalLevel }}</span>
        </div>
      </template>
      <CoreCard
        v-if="selectedCore"
        :core="selectedCore"
        :locale="locale"
      />
    </WikiDetailModal>


    <!-- ПАНЕЛЬ ФИЛЬТРОВ -->
    <WikiCoreFilterPanel
      :open="showFilterPanel"
      :locale="locale"
      v-model:rares="filters.rares"
      v-model:jobs="filters.jobs"
      v-model:labels="filters.labels"
      v-model:uniq="filters.uniq"
      @close="() => setFilterPanelOpen(false)"
      @reset="handleResetFromPanel"
    />
  </section>
</template>

<style scoped>
.core-glow {
  opacity: 0.2;
  mix-blend-mode: screen;
  filter: drop-shadow(0 2px 6px rgba(255,255,255,.15));
}
@media (prefers-color-scheme: light) {
  .core-glow { opacity: .5; }
}

/* глобалка для блокировки скролла подложки при открытых оверлеях/модалках */
:global(.hidden-scroll) { overflow: hidden !important; }

.filter-toggle {
  @apply inline-flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200 shadow-lg shadow-sky-900/30 transition hover:border-sky-300 hover:text-white;
}

.search-input {
  @apply w-full rounded-2xl border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none;
}

.ghost-btn {
  @apply rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white;
}

.job-card {
  @apply relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white shadow-lg shadow-slate-900/40 transition duration-300;
}
.job-card.is-active {
  @apply border-sky-400/60 shadow-sky-900/60;
}

.wiki-card {
  @apply relative aspect-square overflow-hidden rounded-3xl border border-white/5 text-left shadow-xl shadow-black/40 transition hover:border-white/30 hover:shadow-sky-900/40;
  background:
    radial-gradient(circle at 0% 0%, rgba(147,206,233,.12), transparent 70%),
    linear-gradient(135deg, #05060c, #0f1016 65%, #05060c);
}

.wiki-card-mobile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(255,255,255,.12);
  background:
    radial-gradient(circle at 0% 0%, rgba(147,206,233,.25), transparent 100%),
    rgba(15,20,34,.85);
  box-shadow: 0 18px 35px rgba(3,6,19,.4);
  backdrop-filter: blur(18px);
  text-align: left;
  overflow: hidden;
}

.mobile-art {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 0.95rem;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.08);
}
.mobile-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
}
.mobile-thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.mobile-copy {
  flex: 1;
  min-width: 0;
}

.level-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}
.level-control--header {
  flex-wrap: nowrap;
  gap: 0.75rem;
}
.level-label {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(157, 209, 222, 0.7);
  white-space: nowrap;
}
.level-range {
  flex: 0 1 280px;
  accent-color: #4fd1c5;
  min-width: 120px;
}
.level-value {
  width: 3rem;
  text-align: center;
  font-weight: 600;
}
</style>
