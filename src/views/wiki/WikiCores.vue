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

// query: locale, q (поиск)
const locale = ref(route.query.locale ?? 'en')
const search = ref(route.query.q ?? '')

// фильтр-панель
const showFilterPanel = ref(false)
const isMobile = ref(false)
function updateIsMobile() {
  isMobile.value = typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
}
const handleToggleFilter = () => { showFilterPanel.value = !showFilterPanel.value }

// локальные модели чекбоксов (панель управляет ими через v-model)
const raresSel  = ref([])
const jobsSel   = ref([])
const levelsSel = ref([])

// применяем фильтры сразу при изменении моделей
watch(raresSel,  (arr) => store.setRares(arr),  { deep: true })
watch(jobsSel,   (arr) => store.setJobs(arr),   { deep: true })
watch(levelsSel, (arr) => store.setLevels(arr), { deep: true })

// счётчик выбранных фильтров для кнопки
const selectedFiltersCount = computed(() => {
  const f = store.filters
  let c = 0
  c += (f.rares?.length || 0)
  c += (f.jobs?.length || 0)
  c += (f.levels?.length || 0)
  if (f.hasBuffId != null) c += 1
  return c
})

// статичные словари — человекочитаемые лейблы
const RARITY_OPTIONS = [
  { label: 'Common',   value: 1  },
  { label: 'Elite',    value: 2  },
  { label: 'Epic',     value: 4  },
  { label: 'Legend',   value: 8  },
  { label: 'Mythical', value: 16 }
]
const LEVEL_OPTIONS = Array.from({ length: 10 }, (_, i) => ({ label: `Lv ${i+1}`, value: i+1 }))

// Конфиг секций фильтрации для панели
const filtersConfig = computed(() => {
  // Jobs берём из стора (могут прийти позже), рендерим «Job N»
  const jobOpts = (store.facets?.jobs || []).map(j => ({ label: `Job ${j}`, value: j }))
  return [
    { key: 'rares',  title: 'Rarity', options: RARITY_OPTIONS },
    { key: 'levels', title: 'Levels', options: LEVEL_OPTIONS },
    { key: 'jobs',   title: 'Jobs',   options: jobOpts }
  ]
})

// первый загрузочный цикл
async function load() {
  await store.load(locale.value)

  // по умолчанию — только CoreLv=1 (на странице; в модалке — свой ползунок)
  store.setLevels([1])

  // первичный поиск из query
  store.setSearch(String(search.value || ''))

  // синхронизация локальных моделей с состоянием стора
  raresSel.value  = [...(store.filters.rares  || [])]
  jobsSel.value   = [...(store.filters.jobs   || [])]
  levelsSel.value = [...(store.filters.levels || [])]
}

// при смене locale — перезагрузка и запись в query
watch(locale, (val) => {
  router.replace({ query: { ...route.query, locale: val, q: search.value || undefined } })
  load()
})

// поиск (регистронезависимый, по englishName — реализовано в сторе)
watch(search, (q) => {
  store.setSearch(String(q || ''))
  router.replace({ query: { ...route.query, locale: locale.value, q: q || undefined } })
})

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  load()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})

// список для грида — берём накопительный (infinite scroll)
const items        = computed(() => store.pageItems)
const hasNextPage  = computed(() => store.hasNextPage)
const isLoading    = computed(() => store.loading)

// пути к иконкам
function iconSrc(core) {
  return `/wiki/Cores/${core?.Icon}.png`
}

// найти запись ядра по id + level
function findByIdLevel(id, lv) {
  return store.items.find(c => c.id === id && c.CoreLv === lv) ||
         store.items.find(c => c.id === id) || null
}

// --- МОДАЛКА (уровень только тут)
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

// смена уровня в модалке
watch(modalLevel, (lv) => {
  const v = Math.min(10, Math.max(1, Number(lv || 1)))
  if (v !== lv) modalLevel.value = v
  if (modalOpen.value && selectedId.value != null) {
    const next = findByIdLevel(selectedId.value, v)
    if (next) selectedCore.value = next
  }
})

// infinite: догружаем следующую порцию
function loadMore() {
  store.nextPage()
}
</script>

<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4">
    <header class="flex flex-col sm:flex-row sm:items-center gap-3">
      <h1 class="text-2xl font-semibold">Wiki — Cores</h1>

      <div class="sm:ml-auto flex flex-wrap items-center gap-3">
        <!-- Кнопка открытия фильтров -->
        <div class="flex gap-4 items-center">
          <button
            @click="handleToggleFilter"
            class="border-2 border-[#63B4C8] text-[#63B4C8] rounded-md p-2 flex gap-2 text-xl font-semibold items-center hover:bg-gray-700 sticky sm:static top-0 left-0 justify-center max-sm:w-full z-30 bg-[#232228]"
          >
            <img src="@/assets/filter-1.svg" class="w-6" alt="filter" />
            Filters ({{ selectedFiltersCount }})
          </button>
        </div>

        <!-- Поиск -->
        <div class="flex items-center gap-2">
          <input
            v-model.trim="search"
            type="text"
            inputmode="search"
            placeholder="Search by name…"
            class="bg-neutral-900/50 rounded px-3 py-2 ring-1 ring-white/10 focus:ring-white/20 min-w-[220px]"
          />
        </div>

        <!-- Locale -->
        <div class="flex items-center gap-2">
          <label class="text-sm opacity-80">locale</label>
          <select v-model="locale" class="bg-neutral-900/50 rounded px-2 py-1 ring-1 ring-white/10">
            <option value="en">en</option>
            <option value="ru">ru</option>
            <option value="ch">ch</option>
            <option value="jp">jp</option>
            <option value="kr">kr</option>
            <option value="vn">vn</option>
            <option value="id">id</option>
            <option value="tr">tr</option>
          </select>
        </div>

        <button @click="load" class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20">
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

    <!-- ГРИД ИКОНКИ + INFINITE -->
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
          <!-- СТАЛО -->
          <div class="absolute inset-0 p-1.5 sm:p-2 relative overflow-hidden">
            <!-- сама иконка -->
            <img
              class="w-full h-full object-contain relative z-10"
              :src="iconSrc(core)"
              alt=""
              loading="lazy"
              draggable="false"
            />
            <!-- свечение поверх -->
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

      <!-- sentinel для infinite-scroll -->
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

    <!-- ПАНЕЛЬ ФИЛЬТРОВ (словарь; рендерится через Teleport) -->
    <WikiFilterPanel
      :open="showFilterPanel"
      :filters-config="filtersConfig"
      v-model:rares="raresSel"
      v-model:jobs="jobsSel"
      v-model:levels="levelsSel"
      @close="handleToggleFilter"
      @reset="store.resetFilters()"
    />
  </section>
</template>

<style scoped>
.core-glow {
  opacity: 0.3;              /* базовая интенсивность */
  mix-blend-mode: screen;     /* «ёмкий» свет поверх иконки */
  filter: drop-shadow(0 2px 6px rgba(255,255,255,.15));
}
@media (prefers-color-scheme: light) {
  .core-glow { opacity: .7; } /* в светлой теме чуть ярче */
}
</style>