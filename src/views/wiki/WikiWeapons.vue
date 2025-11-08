<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import LocalePicker from '@/components/wiki/LocalePicker.vue'
import ActiveFiltersBar from '@/components/wiki/ActiveFiltersBar.vue'
import WikiWeaponFilterPanel from '@/components/wiki/WikiWeaponFilterPanel.vue'
import WeaponCard from '@/components/wiki/WeaponCard.vue'
import InfinitePager from '@/components/wiki/InfinitePager.vue'

import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { buildJobCardList } from '@/components/wiki/filters/dicts'

/* ---------- stores ---------- */
const weaponStore = useWikiWeaponStore()
const skillStore  = useWikiSkillStore()
const labelStore  = useWikiLabelStore()

/* ---------- locale ---------- */
const locale = ref('en')

/* ---------- ui state ---------- */
const isMobile = ref(false)
const showFilterPanel = ref(false)
const search = ref('')

function updateIsMobile () {
  isMobile.value = typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
}
const handleToggleFilter = () => { showFilterPanel.value = !showFilterPanel.value }

/* ---------- Top class switcher ---------- */
const JOBS = buildJobCardList('All Weapons')
const selectedJob = ref(0) // 0 = All Weapons

function selectJob(job) {
  selectedJob.value = job
  const next = {
    ...filters.value,
    jobs: job === 0 ? [] : [job],
    uniq: false,
  }
  filters.value = next
}

/* ---------- Local filters (ActiveFiltersBar) ---------- */
const filters = ref({ rares: [], jobs: [], labels: [], uniq: false })

function buildFilterState(source = {}) {
  return {
    rares: [],
    jobs: Array.isArray(source.jobs) ? [...source.jobs] : [],
    labels: Array.isArray(source.labels) ? [...source.labels] : [],
    positions: Array.isArray(source.positions) ? [...source.positions] : [],
    positionsUniq: !!source.positionsUniq,
    uniq: !!source.uniq,
  }
}

filters.value = buildFilterState()

let syncingFilters = false
function syncFiltersFromStore() {
  syncingFilters = true
  filters.value = buildFilterState(weaponStore.filters || {})
  syncingFilters = false
  const jobList = Array.isArray(filters.value.jobs) ? filters.value.jobs : []
  selectedJob.value = jobList.length === 1 ? jobList[0] : 0
}
syncFiltersFromStore()


const labelMap = computed(() => {
  const map = Object.create(null)
  const ids = filters.value.labels || []
  const loc = locale.value
  for (const id of ids) {
    const l = labelStore.byId?.[id]
    if (!l) continue
    map[id] = {
      id,
      text: l.i18n?.[loc] || l.Name?.text || String(id),
      colorHex: l.LabelImageColor || '5E5E5E',
    }
  }
  return map
})

/* ---------- Search (local, no query params) ---------- */

watch(() => filters.value.jobs, (jobs) => {
  const arr = Array.isArray(jobs) ? jobs : []
  selectedJob.value = arr.length === 1 ? arr[0] : 0
})
watch(search, (q) => {
  weaponStore.applyFilters({ search: q ?? '' })
})

/* ---------- load ---------- */
async function loadAll() {
  await Promise.all([
    weaponStore.load(locale.value),
    skillStore.load(locale.value),
    labelStore.load(locale.value),
  ])
  syncFiltersFromStore()
}

watch(locale, async (loc) => {
  await Promise.all([
    weaponStore.load(loc),
    skillStore.load(loc),
    labelStore.load(loc),
  ])
  syncFiltersFromStore()
})

/* ---------- Reload helper ---------- */
function handleReloadClick() {
  search.value = ''
  weaponStore.resetFilters()
  syncFiltersFromStore()
}

function handleResetFromPanel() {
  search.value = ''
  weaponStore.resetFilters()
  syncFiltersFromStore()
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  loadAll()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  toggleScrollLock(false)
})

/* ---------- items / helpers ---------- */
const items = computed(() => weaponStore.pageItems)
const totalMatched = computed(() => weaponStore.filteredTotal)
const hasNextPage = computed(() => weaponStore.hasNextPage)
const isLoading = computed(() => weaponStore.loading)

function handleLoadMore() {
  if (!weaponStore.hasNextPage) return
  weaponStore.nextPage()
}

function weaponIconSrc(w) {
  const icon = w?.Icon || 'weapon_unknown'
  return `/wiki/Weapons/${icon}.png`
}

/* ---------- modal ---------- */
const modalOpen  = ref(false)
const selectedWeapon   = ref(null)

function openModal(w) { selectedWeapon.value = w; modalOpen.value = true }
function closeModal()  { modalOpen.value = false; selectedWeapon.value = null }

function toggleScrollLock (locked) {
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}
watch(modalOpen, v => toggleScrollLock(v))

// apply local filter changes to the store
watch(filters, (val) => {
  if (syncingFilters) return
  weaponStore.applyFilters({
    jobs: Array.isArray(val.jobs) ? [...val.jobs] : [],
    labels: Array.isArray(val.labels) ? [...val.labels] : [],
    positions: Array.isArray(val.positions) ? [...val.positions] : [],
    positionsUniq: !!val.positionsUniq,
    uniq: !!val.uniq,
  })
}, { deep: true })
</script>

<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4">
    <header class="space-y-3">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Wiki - Weapons</h1>
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
            @click="handleReloadClick"
            class="ghost-btn shrink-0"
          >
            Reload
          </button>
        </div>
      </div>
    </header>

    <ActiveFiltersBar
      :locale="locale"
      :rares="filters.rares"
      :jobs="filters.jobs"
      :labels="filters.labels"
      :positions="filters.positions"
      :positions-uniq="filters.positionsUniq"
      :uniq="filters.uniq"
      :label-map="labelMap"
      @remove:rarity="val => filters.rares = filters.rares.filter(v => v !== val)"
      @remove:job="val => filters.jobs = filters.jobs.filter(v => v !== val)"
      @remove:label="val => filters.labels = filters.labels.filter(v => v !== val)"
      @remove:position="val => filters.positions = filters.positions.filter(v => v !== val)"
      @unset:positions-uniq="filters.positionsUniq = false"
      @unset:uniq="filters.uniq = false"
    />

    <div v-if="weaponStore.loading" class="text-sm opacity-80">Loading...</div>
    <div v-else-if="weaponStore.error" class="text-sm text-red-400">Error: {{ weaponStore.error }}</div>

    <div v-else>
      <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <button
          v-for="w in items"
          :key="w.id"
          @click="openModal(w)"
          class="wiki-card group"
          :title="w.i18n?.name?.[locale] || w.englishName || `ID ${w.id}`"
        >
          <div class="absolute inset-0">
            <img
              :src="weaponIconSrc(w)"
              class="absolute inset-0 w-full h-full object-contain z-10"
              alt=""
              draggable="false"
              loading="lazy"
            />
            <img
              src="/wiki/Mechs/Img_BigScreenBG.png"
              alt=""
              class="absolute inset-0 w-full h-full object-cover opacity-20"
              draggable="false"
            />
          </div>

          <div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] bg-black/40 backdrop-blur-sm">
            <div class="flex items-center justify-center text-center">
              <span class="opacity-90 text-sm font-medium truncate max-w-[90%]">
                {{ w.i18n?.name?.[locale] || w.englishName || `ID ${w.id}` }}
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

    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="modalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @keydown.esc="closeModal"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal" />
          <transition name="modal-scale" appear>
            <div
              class="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#05060c]/95 text-white shadow-2xl backdrop-blur"
            >
              <div class="flex flex-col gap-2 border-b border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.4em] text-white/60">Weapon</p>
                  <h3 class="text-xl font-semibold">
                    {{ (selectedWeapon?.i18n?.name?.[locale] || selectedWeapon?.englishName) ?? '-' }}
                  </h3>
                </div>
                <button @click="closeModal" class="ghost-btn shrink-0">
                  Close
                </button>
              </div>

              <div class="max-h-[calc(90vh-96px)] overflow-y-auto p-6">
                <WeaponCard
                  v-if="selectedWeapon"
                  :weapon="selectedWeapon"
                  :locale="locale"
                />
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </Teleport>


    <WikiWeaponFilterPanel
      :open="showFilterPanel"
      :locale="locale"
      v-model:jobs="filters.jobs"
      v-model:labels="filters.labels"
      v-model:positions="filters.positions"
      v-model:positions-uniq="filters.positionsUniq"
      v-model:uniq="filters.uniq"
      @close="handleToggleFilter"
      @reset="handleResetFromPanel"
    />


  </section>
</template>
<style scoped>
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
