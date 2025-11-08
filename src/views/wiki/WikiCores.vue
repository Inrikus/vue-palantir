<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useWikiCoreStore } from '@/stores/wikiCoreStore'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'

import CoreCard from '@/components/wiki/CoreCard.vue'
import WikiCoreFilterPanel from '@/components/wiki/WikiCoreFilterPanel.vue'
import LocalePicker from '@/components/wiki/LocalePicker.vue'
import ActiveFiltersBar from '@/components/wiki/ActiveFiltersBar.vue'
import InfinitePager from '@/components/wiki/InfinitePager.vue'
import { buildJobCardList } from '@/components/wiki/filters/dicts'

const route = useRoute()
const router = useRouter()

const store      = useWikiCoreStore()
const labelStore = useWikiLabelStore()

const JOBS = buildJobCardList('All Cores')
const selectedJob = ref(0)

/* ---------- Locale ---------- */
const locale = ref(route.query.locale ?? 'en')

/* ---------- Поиск ---------- */
// Больше не читаем поиск из query и не сохраняем туда
const search = ref('')

/* ---------- Фильтр-панель ---------- */
const showFilterPanel = ref(false)
const isMobile = ref(false)
function updateIsMobile () {
  isMobile.value = typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
}
const handleToggleFilter = () => { showFilterPanel.value = !showFilterPanel.value }

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
async function load () {
  await store.load(locale.value)
  await labelStore.load(locale.value)

  // Поиск — только локальный стейт/стор, без URL
  store.setSearch(String(search.value || ''))

  // Синхроним локальные фильтры со стором
  syncFiltersFromStore()
}

function selectJob (job) {
  selectedJob.value = job
  filters.value.jobs = job === 0 ? [] : [job]
}

function handleReload () {
  // Reload явно сбрасывает и поиск, и фильтры
  search.value = ''
  store.resetFilters()
  syncFiltersFromStore()
  store.setSearch('')
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
  load()
})

// Поиск — только в стор, без router.replace
watch(search, (q) => {
  store.setSearch(String(q || ''))
})

/* ---------- Mount lifecycle ---------- */
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  load()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  toggleScrollLock(false)
})

/* ---------- Грид / модалка ---------- */
const items = computed(() => store.pageItems)
function iconSrc (core) { return `/wiki/Cores/${core?.Icon}.png` }

function coreTitle (core) {
  const loc = String(locale.value || 'en')
  return core?.i18n?.name?.[loc] || core?.englishName || `ID ${core?.id}`
}

function findByIdLevel (id, lv) {
  return store.items.find(c => c.id === id && c.CoreLv === lv) ||
         store.items.find(c => c.id === id) || null
}

const modalOpen    = ref(false)
const modalLevel   = ref(1)
const selectedId   = ref(null)
const selectedCore = ref(null)

function openModal (core) {
  selectedId.value   = core.id
  modalLevel.value   = core.CoreLv || 1
  selectedCore.value = findByIdLevel(core.id, modalLevel.value) || core
  modalOpen.value    = true
}

function closeModal () {
  modalOpen.value    = false
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

/* ---------- ЛОК СКРОЛЛА фона при модалке ---------- */
function toggleScrollLock (locked) {
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}
watch(modalOpen, (v) => toggleScrollLock(v))

/* ---------- Items counter (после фильтров) ---------- */
const totalMatched = computed(() => store.filteredTotal)
const hasNextPage = computed(() => store.hasNextPage)
const isLoading = computed(() => store.loading)

function handleLoadMore () {
  if (!store.hasNextPage) return
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
            @click="handleToggleFilter"
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
      <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
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
              class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
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
      <InfinitePager
        :is-loading="isLoading"
        :has-next-page="hasNextPage"
        @load-more="handleLoadMore"
      />
    </div>

    <!-- МОДАЛКА -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.esc="closeModal">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal" />
          <transition name="modal-scale" appear>
            <div class="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#05060c]/95 text-white shadow-2xl backdrop-blur">
              <div class="flex flex-col gap-4 border-b border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-xs uppercase tracking-[0.4em] text-white/60">Level</span>
                  <input type="range" min="1" max="10" step="1" v-model.number="modalLevel" class="w-48" />
                  <span class="text-lg font-semibold w-10 text-center">{{ modalLevel }}</span>
                </div>
                <button @click="closeModal" class="ghost-btn shrink-0">
                  Close
                </button>
              </div>
            
              <div class="max-h-[calc(90vh-96px)] overflow-y-auto p-6">
                <CoreCard
                  v-if="selectedCore"
                  :core="selectedCore"
                  :locale="locale"
                  @close="closeModal"
                  @level-change="v => modalLevel = v"
                />
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </Teleport>


    <!-- ПАНЕЛЬ ФИЛЬТРОВ -->
    <WikiCoreFilterPanel
      :open="showFilterPanel"
      :locale="locale"
      v-model:rares="filters.rares"
      v-model:jobs="filters.jobs"
      v-model:labels="filters.labels"
      v-model:uniq="filters.uniq"
      @close="handleToggleFilter"
      @reset="handleResetFromPanel"
    />
  </section>
</template>

<style scoped>
.core-glow {
  opacity: 0.3;
  mix-blend-mode: screen;
  filter: drop-shadow(0 2px 6px rgba(255,255,255,.15));
}
@media (prefers-color-scheme: light) {
  .core-glow { opacity: .7; }
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
  @apply relative aspect-square overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#05060c] via-[#0f1016] to-[#05060c] text-left shadow-xl shadow-black/40 transition hover:border-white/30 hover:shadow-sky-900/40;
}

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-scale-enter-active,
.modal-scale-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-scale-enter-from,
.modal-scale-leave-to { transform: scale(0.9); opacity: 0; }
</style>
