<script setup>
import { ref, computed, watch } from 'vue'
import ActiveFiltersBar from '@/components/wiki/ActiveFiltersBar.vue'
import WikiWeaponFilterPanel from '@/components/wiki/WikiWeaponFilterPanel.vue'
import WeaponCard from '@/components/wiki/WeaponCard.vue'
import WikiDetailModal from '@/components/wiki/WikiDetailModal.vue'
import InfinitePager from '@/components/wiki/InfinitePager.vue'
import { useWikiListingPage } from '@/composables/useWikiListingPage'

import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiLocaleStore } from '@/stores/wikiLocaleStore'
import { buildJobCardList } from '@/components/wiki/filters/dicts'

/* ---------- stores ---------- */
const weaponStore = useWikiWeaponStore()
const skillStore  = useWikiSkillStore()
const labelStore  = useWikiLabelStore()
const wikiLocaleStore = useWikiLocaleStore()

definePageMeta({
  glassShell: false
})

useHead({ title: 'Wiki — Weapons' })

async function loadAll(targetLocale = locale.value) {
  const lang = targetLocale ?? locale.value
  await Promise.all([
    weaponStore.load(lang),
    skillStore.load(lang),
    labelStore.load(lang),
  ])
  syncFiltersFromStore()
}

const localeRef = computed({
  get: () => wikiLocaleStore.locale,
  set: (val) => wikiLocaleStore.setLocale(val),
})

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
  localeRef,
  loadResources: loadAll,
  onSearchChange: () => {
    weaponStore.page = 1
  },
})

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

/* ---------- load ---------- */

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

/* ---------- items / helpers ---------- */
const skillMap = computed(() => {
  const map = Object.create(null)
  for (const skill of skillStore.items || []) {
    map[skill.id] = skill
  }
  return map
})

const searchTerm = computed(() => String(search.value || '').trim().toLowerCase())
const normalizeText = (val) => String(val || '').toLowerCase()

function matchesWeaponSearch(weapon) {
  if (!searchTerm.value) return true
  const term = searchTerm.value
  const locKey = String(locale.value || 'en')

  const english = normalizeText(weapon?.englishName)
  const name = normalizeText(weapon?.i18n?.name?.[locKey])
  const desc = normalizeText(weapon?.i18n?.desc?.[locKey])
  if (english.includes(term) || name.includes(term) || desc.includes(term)) return true

  const skills = Array.isArray(weapon?.skills) ? weapon.skills : []
  for (const sid of skills) {
    const skill = skillMap.value?.[sid]
    if (!skill) continue
    const skillName = normalizeText(skill?.i18n?.name?.[locKey] || skill?.englishName)
    const skillDesc = normalizeText(skill?.i18n?.desc?.[locKey])
    if (skillName.includes(term) || skillDesc.includes(term)) return true
  }
  return false
}

const filteredWeapons = computed(() => {
  const base = weaponStore.sorted
  if (!Array.isArray(base)) return []
  if (!searchTerm.value) return base
  return base.filter(matchesWeaponSearch)
})

const FALLBACK_ICON = '/wiki/fallback/icon_missing.png'

const items = computed(() => filteredWeapons.value.slice(0, weaponStore.page * weaponStore.pageSize))
const totalMatched = computed(() => filteredWeapons.value.length)
const hasNextPage = computed(() => weaponStore.page * weaponStore.pageSize < filteredWeapons.value.length)
const isLoading = computed(() => weaponStore.loading)

function handleLoadMore() {
  if (!hasNextPage.value) return
  weaponStore.nextPage()
}

function iconSrc(w) {
  const icon = w?.Icon
  if (!icon) return FALLBACK_ICON
  return `/wiki/Weapons/${icon}.png`
}
function handleImgError(e) {
  const img = e?.target
  if (!img || img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = '1'
  img.src = FALLBACK_ICON
}

/* ---------- modal ---------- */
const selectedWeapon   = ref(null)

function openModal(w) {
  selectedWeapon.value = w
  setModalOpen(true)
}
function closeModal() {
  setModalOpen(false)
  selectedWeapon.value = null
}

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
    <section class="space-y-3" aria-label="Weapons navigation and filters">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Wiki - Weapons</h1>
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
    </section>

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
      <div class="hidden sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <button
          v-for="w in items"
          :key="w.id"
          @click="openModal(w)"
          class="wiki-card group"
          :title="w.i18n?.name?.[locale] || w.englishName || `ID ${w.id}`"
        >
          <div class="absolute inset-0">
            <img
              :src="iconSrc(w)"
              class="absolute inset-0 w-full h-full object-contain z-10"
              alt=""
              draggable="false"
              loading="lazy"
              @error="handleImgError"
            />
            <img
              src="/wiki/Mechs/Img_BigScreenBG.png"
              alt=""
              class="absolute inset-0 w-full h-full object-cover opacity-75"
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
      <div class="flex flex-col gap-3 sm:hidden">
        <button
          v-for="w in items"
          :key="`mobile-${w.id}`"
          @click="openModal(w)"
          class="wiki-card-mobile"
        >
          <div class="mobile-art">
            <img src="/wiki/Mechs/Img_BigScreenBG.png" alt="" class="mobile-bg" aria-hidden="true" draggable="false" />
            <img
              :src="iconSrc(w)"
              alt=""
              class="mobile-thumb"
              loading="lazy"
              draggable="false"
              @error="handleImgError"
            />
          </div>
          <div class="mobile-copy">
            <p class="mobile-title">
              {{ w.i18n?.name?.[locale] || w.englishName || `ID ${w.id}` }}
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

    <WikiDetailModal
      :open="modalOpen"
      :mobile="isMobile"
      aria-label="Weapon details"
      @close="closeModal"
    >
      <WeaponCard
        v-if="selectedWeapon"
        :weapon="selectedWeapon"
        :locale="locale"
      />
    </WikiDetailModal>


    <WikiWeaponFilterPanel
      :open="showFilterPanel"
      :locale="locale"
      v-model:jobs="filters.jobs"
      v-model:labels="filters.labels"
      v-model:positions="filters.positions"
      v-model:positions-uniq="filters.positionsUniq"
      v-model:uniq="filters.uniq"
      @close="() => setFilterPanelOpen(false)"
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
.mobile-title {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mobile-sub {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(157,209,222,.75);
}

</style>
