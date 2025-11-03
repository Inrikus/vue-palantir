<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWikiCoreStore } from '@/stores/wikiCoreStore'
import CoreCard from '@/components/wiki/CoreCard.vue'
import WikiFilterPanel from '@/components/wiki/WikiFilterPanel.vue'
import InfinitePager from '@/components/wiki/InfinitePager.vue'

const route = useRoute()
const router = useRouter()
const store  = useWikiCoreStore()

/* ---------- Locale dropdown (с флажками) ---------- */
const LOCALES = [
  { value: 'en', native: 'English',            flag: '/flags/Icon_Flag_English.png'     },
  { value: 'ru', native: 'Русский',            flag: '/flags/Icon_Flag_Russia.png'      },
  { value: 'ch', native: '中文',                flag: '/flags/Icon_Flag_Chinese.png'      },
  { value: 'jp', native: '日本語',              flag: '/flags/Icon_Flag_Japanese.png'     },
  { value: 'kr', native: '한국어',              flag: '/flags/Icon_Flag_Korean.png'       },
  { value: 'vn', native: 'Tiếng Việt',         flag: '/flags/Icon_Flag_Vietnamese.png'  },
  { value: 'id', native: 'Bahasa Indonesia',   flag: '/flags/Icon_Flag_Indonesian.png'  },
  { value: 'tr', native: 'Türkçe',             flag: '/flags/Icon_Flag_Turkish.png'     },
]

const locale = ref(route.query.locale ?? 'en')
const currLocale = computed(() => LOCALES.find(l => l.value === locale.value) || LOCALES[0])
const localeOpen = ref(false)
function toggleLocale() { localeOpen.value = !localeOpen.value }
function chooseLocale(v) { locale.value = v; localeOpen.value = false }

function onClickOutside(e) {
  const el = document.getElementById('locale-dropdown')
  if (el && !el.contains(e.target)) localeOpen.value = false
}

/* ---------- Поиск ---------- */
const search = ref(route.query.q ?? '')

/* ---------- Фильтр-панель (универсальная) ---------- */
const showFilterPanel = ref(false)
const isMobile = ref(false)
function updateIsMobile() {
  isMobile.value = typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
}
const handleToggleFilter = () => { showFilterPanel.value = !showFilterPanel.value }

// Универсальный объект фильтров для панели
const filters = ref({
  rares: [],
  jobs: []
})

// Применяем в стор сразу при изменении
watch(filters, (val) => store.applyFilters(val), { deep: true })

// Счётчик выбранных фильтров (без строки поиска, но с учётом hasBuffId)
const selectedFiltersCount = computed(() => {
  const f = store.filters || {}
  let c = 0
  if (Array.isArray(f.rares)) c += f.rares.length
  if (Array.isArray(f.jobs))  c += f.jobs.length
  if (f.hasBuffId != null)    c += 1
  return c
})

// Человеко-читаемые наборы опций
const RARITY_OPTIONS = [
  { label: 'Common',   value: 1  },
  { label: 'Elite',    value: 2  },
  { label: 'Epic',     value: 4  },
  { label: 'Legend',   value: 8  },
  { label: 'Mythical', value: 16 }
]

// Конфиг секций фильтров для панели
const filtersConfig = computed(() => {
  const jobOpts = (store.facets?.jobs || []).map(j => ({ label: `Job ${j}`, value: j }))
  return [
    { key: 'rares', title: 'Rarity', options: RARITY_OPTIONS },
    { key: 'jobs',  title: 'Jobs',   options: jobOpts }
  ]
})

/* ---------- Загрузка / перезагрузка ---------- */
async function load() {
  await store.load(locale.value)
  // применяем поиск из query
  store.setSearch(String(search.value || ''))
  // синхронизируем локальные фильтры с состоянием стора
  filters.value = { ...store.filters }
}

function handleReload() {
  // Reload должен сбрасывать поиск и фильтры — поведение станет очевидным
  search.value = ''
  store.resetFilters()
  store.setSearch('')         // на всякий случай синхронизируем
  load()
}

function handleResetFromPanel() {
  // панель вызывает reset — дополнительно чистим локальный инпут
  search.value = ''
  store.resetFilters()
}

/* ---------- Навигация / query ---------- */
watch(locale, (val) => {
  router.replace({ query: { ...route.query, locale: val, q: search.value || undefined } })
  load()
})

watch(search, (q) => {
  store.setSearch(String(q || ''))
  router.replace({ query: { ...route.query, locale: locale.value, q: q || undefined } })
})

/* ---------- Mount lifecycle ---------- */
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  document.addEventListener('click', onClickOutside, { passive: true })
  load()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  document.removeEventListener('click', onClickOutside)
})

/* ---------- Грид / модалка / infinite ---------- */
const items        = computed(() => store.pageItems)
const hasNextPage  = computed(() => store.hasNextPage)
const isLoading    = computed(() => store.loading)

function iconSrc(core) { return `/wiki/Cores/${core?.Icon}.png` }
function findByIdLevel(id, lv) {
  return store.items.find(c => c.id === id && c.CoreLv === lv) ||
         store.items.find(c => c.id === id) || null
}

const modalOpen    = ref(false)
const modalLevel   = ref(1)
const selectedId   = ref(null)
const selectedCore = ref(null)

function openModal(core) {
  selectedId.value = core.id
  modalLevel.value = core.CoreLv || 1
  selectedCore.value = findByIdLevel(core.id, modalLevel.value) || core
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
  selectedId.value = null
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

function loadMore() { store.nextPage() }
</script>

<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4">
    <header class="flex flex-col sm:flex-row sm:items-center gap-3">
      <h1 class="text-2xl font-semibold">Wiki — Cores</h1>

      <div class="sm:ml-auto flex flex-wrap items-center gap-3">
        <!-- Локали (кнопка + выпадающий список) -->
        <div id="locale-dropdown" class="relative">
          <button
            @click="toggleLocale"
            class="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 ring-1 ring-white/10 hover:ring-white/20 bg-neutral-900/50"
            aria-haspopup="listbox"
            :aria-expanded="localeOpen ? 'true' : 'false'"
          >
            <img :src="currLocale.flag" :alt="currLocale.native" class="w-5 h-5 rounded-sm ring-1 ring-white/10 object-contain" />
            <span class="text-sm font-medium">{{ currLocale.native }}</span>
            <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/></svg>
          </button>

          <div
            v-if="localeOpen"
            class="absolute z-40 mt-2 w-56 rounded-md bg-[#232228] ring-1 ring-white/10 shadow-lg overflow-hidden"
            role="listbox"
          >
            <button
              v-for="opt in LOCALES"
              :key="opt.value"
              class="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5"
              @click="chooseLocale(opt.value)"
              role="option"
              :aria-selected="opt.value === locale"
            >
              <div class="flex items-center gap-2">
                <img :src="opt.flag" :alt="opt.native" class="w-5 h-5 rounded-sm ring-1 ring-white/10 object-contain" />
                <span class="text-sm">{{ opt.native }}</span>
              </div>
              <span class="text-xs opacity-70 uppercase">{{ opt.value }}</span>
            </button>
          </div>
        </div>

        <!-- Кнопка фильтров -->
        <div class="flex gap-2 items-center">
          <button
            @click="handleToggleFilter"
            class="border-2 border-[#63B4C8] text-[#63B4C8] rounded-md px-3 py-1.5 flex gap-2 text-base sm:text-lg font-semibold items-center hover:bg-gray-700 sticky sm:static top-0 left-0 justify-center max-sm:w-full z-30 bg-[#232228]"
          >
            <img src="@/assets/filter-1.svg" class="w-5 sm:w-6" alt="filter" />
            Filters ({{ selectedFiltersCount }})
          </button>
        </div>

        <!-- Поиск (стилизованный, с очисткой) -->
        <div class="relative">
          <input
            v-model.trim="search"
            type="text"
            inputmode="search"
            placeholder="Search by name…"
            class="bg-neutral-900/60 rounded-md pl-9 pr-8 py-2 ring-1 ring-white/10 focus:ring-white/20 min-w-[220px] placeholder:opacity-60"
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4a6 6 0 104.472 10.028l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"/>
          </svg>
          <button
            v-if="search"
            @click="search = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-white/10 grid place-items-center"
            title="Clear"
          >
            <svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.225 4.811L4.811 6.225 9.586 11l-4.775 4.775 1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z"/>
            </svg>
          </button>
        </div>

        <!-- Reload -->
        <button @click="handleReload" class="rounded px-3 py-1.5 ring-1 ring-white/10 hover:ring-white/20">
          Reload
        </button>
      </div>
    </header>

    <p class="text-sm opacity-80">
      Count (server): <span class="font-medium">{{ store.count }}</span>
      · Items (store): <span class="font-medium">{{ store.items.length }}</span>
      · Filtered page: <span class="font-medium">{{ items.length }}</span>
      · Locale: <span class="font-medium">{{ store.loadedLocale }}</span>
      · Search: <span class="font-medium">{{ search || '—' }}</span>
    </p>

    <!-- ГРИД -->
    <div v-if="store.loading" class="text-sm opacity-80">Loading…</div>
    <div v-else-if="store.error" class="text-sm text-red-400">Error: {{ store.error }}</div>

    <div v-else>
      <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        <button
          v-for="core in items"
          :key="`${core.id}-${core.CoreLv}`"
          @click="openModal(core)"
          class="group relative aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-white/25 bg-neutral-900/40"
          :title="`ID ${core.id} — Lv.${core.CoreLv}`"
        >
          <!-- иконка + свечение -->
          <div class="absolute inset-0 p-1.5 sm:p-2 relative overflow-hidden">
            <img
              class="w-full h-full object-contain relative z-10"
              :src="iconSrc(core)"
              alt=""
              loading="lazy"
              draggable="false"
            />
            <img
              src="/wiki/Cards/Img_CoreBGFX.png"
              alt=""
              class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow"
              aria-hidden="true"
              draggable="false"
            />
          </div>

          <div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] bg-black/40 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <span class="opacity-90">ID {{ core.id }}</span>
              <span class="opacity-90">Lv. {{ core.CoreLv }}</span>
            </div>
          </div>
        </button>
      </div>

      <InfinitePager
        :is-loading="isLoading"
        :has-next-page="hasNextPage"
        @load-more="loadMore"
      />
    </div>

    <!-- МОДАЛКА -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @keydown.esc="closeModal"
    >
      <div class="absolute inset-0 bg-black/70" @click="closeModal" />
      <div class="relative max-w-3xl w-full">
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center gap-3">
            <span class="text-sm opacity-80">Lv.</span>
            <input type="range" min="1" max="10" step="1" v-model.number="modalLevel" class="w-40" />
            <span class="text-sm font-medium w-6 text-center">{{ modalLevel }}</span>
          </div>
          <button @click="closeModal" class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20">
            Close
          </button>
        </div>
        <CoreCard v-if="selectedCore" :core="selectedCore" :locale="locale" />
      </div>
    </div>

    <!-- ПАНЕЛЬ ФИЛЬТРОВ -->
    <WikiFilterPanel
      :open="showFilterPanel"
      :filters-config="filtersConfig"
      v-model:filters="filters"
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
</style>
