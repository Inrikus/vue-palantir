<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import LocalePicker from '@/components/wiki/LocalePicker.vue'
import ActiveFiltersBar from '@/components/wiki/ActiveFiltersBar.vue'
import WikiWeaponFilterPanel from '@/components/wiki/WikiWeaponFilterPanel.vue'
import WeaponCard from '@/components/wiki/WeaponCard.vue'

import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'

/* ---------- stores ---------- */
const weaponStore = useWikiWeaponStore()
const skillStore  = useWikiSkillStore()

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

/* ---------- top “class” switcher ---------- */
const JOBS = [
  { id: 0,  img: '/wiki/Mechs/Img_Pic_0.png',  label: 'All Weapons' },
  { id: 1,  img: '/wiki/Mechs/Img_Pic_1.png',  label: 'Striker'  },
  { id: 2,  img: '/wiki/Mechs/Img_Pic_2.png',  label: 'Keystone' },
  { id: 4,  img: '/wiki/Mechs/Img_Pic_4.png',  label: 'Buster'   },
  { id: 8,  img: '/wiki/Mechs/Img_Pic_8.png',  label: 'Bullseye' },
  { id: 16, img: '/wiki/Mechs/Img_Pic_16.png', label: 'Apostle'  },
]
const selectedJob = ref(0) // 0 = All Weapons

function selectJob(job) {
  selectedJob.value = job
  // для “All Weapons” — снимаем фильтр по классам
  if (job === 0) weaponStore.applyFilters({ jobs: [] })
  else weaponStore.applyFilters({ jobs: [job], uniq: false })
  // перезапускаем «раскатку» как в WikiCores.vue
  startProgressiveFill()
}

/* ---------- chips (используем существующий ActiveFiltersBar) ---------- */
const filters = computed(() => weaponStore.filters)
const labelMap = computed(() => ({})) // пока лейблов для оружия нет

/* ---------- search (локальный, без query) ---------- */
watch(search, (q) => {
  weaponStore.applyFilters({ search: q ?? '' })
  // перезапуск автомата — как в WikiCores.vue
  startProgressiveFill()
})

/* ---------- load ---------- */
async function loadAll() {
  await Promise.all([
    weaponStore.load(locale.value),
    skillStore.load(locale.value),
  ])
  // по умолчанию — “All Weapons”
  selectJob(0)
  // Запускаем прогрессивную догрузку до максимума
  startProgressiveFill()
}

watch(locale, async (loc) => {
  await Promise.all([weaponStore.load(loc), skillStore.load(loc)])
  // сохраняем выбранный класс и перезапускаем «раскатку»
  selectJob(selectedJob.value || 0)
  startProgressiveFill()
})

/* ---------- Прогрессивная «раскатка» до максимума ---------- */
let timer = null
function stopProgressiveFill () { if (timer) { clearInterval(timer); timer = null } }
function startProgressiveFill () {
  stopProgressiveFill()
  if (!weaponStore.hasNextPage) return
  timer = setInterval(() => {
    if (!weaponStore.hasNextPage) { stopProgressiveFill(); return }
    weaponStore.nextPage()
  }, 500)
}

// Лёгкий «подпиныватель», как в WikiCores.vue
watch(
  () => [weaponStore.filters.jobs, weaponStore.filters.uniq, weaponStore.filteredTotal],
  () => startProgressiveFill(),
  { deep: true }
)

/* удобный обработчик для Reload */
function handleReloadClick() {
  search.value = ''
  weaponStore.resetFilters()
  selectJob(0)
  startProgressiveFill()
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
  loadAll()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
  stopProgressiveFill()
  toggleScrollLock(false)
})

/* ---------- items / helpers ---------- */
const items = computed(() => weaponStore.pageItems)
const totalMatched = computed(() => weaponStore.filteredTotal)

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
</script>

<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4">
    <!-- строка 1: заголовок + локаль -->
    <header class="space-y-3">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Wiki — Weapons</h1>
        <LocalePicker v-model="locale" />
      </div>

      <!-- переключатель классов (6 картинок) -->
      <div
        class="grid gap-3"
        :class="isMobile ? 'grid-cols-3' : 'grid-cols-6'"
      >
        <button
          v-for="m in JOBS"
          :key="m.id"
          class="relative rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-white/20 bg-[#0d0f14] group"
          :class="isMobile ? 'h-24' : 'h-28'"
          @click="selectJob(m.id)"
          :title="m.label"
        >
          <img :src="m.img" class="absolute inset-0 w-full h-full object-cover opacity-70" alt="" />
          <div class="absolute inset-0"
               style="background-image:url('/wiki/Mechs/Img_BigScreenBG.png'); background-size:cover; mix-blend:screen; opacity:.25" />
          <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          <div class="absolute inset-x-2 bottom-2 text-center text-sm font-semibold">
            <span :class="selectedJob === m.id ? 'text-[#63B4C8]' : 'opacity-90'">{{ m.label }}</span>
          </div>
        </button>
      </div>

      <!-- Управляющая полоса как в cores -->
      <!-- Мобилка:
           row 1: [Filters]                    [Items]
           row 2: [Search.....................][Reload]
           Десктоп:
           row 1: [Filters] [Search.............] [Items] -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Filters -->
        <div class="order-1 sm:order-1">
          <button
            @click="handleToggleFilter"
            class="border-2 border-[#63B4C8] text-[#63B4C8] rounded-md px-3 py-1.5 flex gap-2 text-base sm:text-lg font-semibold items-center hover:bg-gray-700 bg-[#232228]"
          >
            <img src="@/assets/filter-1.svg" class="w-5 sm:w-6" alt="filter" />
            Filters
          </button>
        </div>

        <!-- Items counter -->
        <div class="order-2 sm:order-3 ml-auto text-sm opacity-80 flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Items: <span class="font-medium">{{ totalMatched }}</span></span>
        </div>

        <!-- Search + Reload -->
        <div class="order-4 sm:order-2 basis-full sm:basis-auto w-full sm:w-auto sm:flex-1 flex items-center gap-3">
          <div class="relative flex-1 min-w-[240px]">
            <input
              v-model.trim="search"
              type="text"
              inputmode="search"
              placeholder="Search by name or description…"
              class="w-full bg-neutral-900/60 rounded-md pl-9 pr-8 py-2 ring-1 ring-white/10 focus:ring-white/20 placeholder:opacity-60"
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

          <button
            @click="handleReloadClick"
            class="shrink-0 rounded px-3 py-1.5 ring-1 ring-white/10 hover:ring-white/20"
          >
            Reload
          </button>
        </div>
      </div>
    </header>

    <!-- Chips -->
    <ActiveFiltersBar
      :locale="locale"
      :rares="filters.rares"       
      :jobs="filters.jobs"
      :labels="filters.labels"
      :uniq="filters.uniq"
      :label-map="labelMap"
      @remove:job="val => weaponStore.applyFilters({ jobs: (filters.jobs || []).filter(v => v !== val) })"
      @remove:rarity="() => {}"
      @remove:label="() => {}"
      @unset:uniq="weaponStore.applyFilters({ uniq:false })"
    />

    <!-- GRID: только карточки оружия -->
    <div v-if="weaponStore.loading" class="text-sm opacity-80">Loading…</div>
    <div v-else-if="weaponStore.error" class="text-sm text-red-400">Error: {{ weaponStore.error }}</div>

    <div v-else>
      <div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        <button
          v-for="w in items"
          :key="w.id"
          @click="openModal(w)"
          class="group relative aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-white/25 bg-neutral-900/40"
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
    </div>

    <!-- MODAL -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" @keydown.esc="closeModal">
      <div class="absolute inset-0 bg-black/70" @click="closeModal" />
      <!-- Внешний контейнер панели: фон/бордер/скругление, без скролла -->
      <div class="relative max-w-3xl w-full rounded-xl bg-[#1C1B20] ring-1 ring-white/10 shadow-2xl overflow-hidden">
        <!-- НЕскроллируемая верхняя панель -->
        <div class="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <h3 class="text-sm font-medium opacity-90 truncate">
            {{ (selectedWeapon?.i18n?.name?.[locale] || selectedWeapon?.englishName) ?? '—' }}
          </h3>
          <button @click="closeModal" class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20">
            Close
          </button>
        </div>
      
        <!-- Скроллируемая зона содержимого -->
        <div class="max-h-[calc(85vh-44px)] overflow-y-auto p-4">
          <WeaponCard
            v-if="selectedWeapon"
            :weapon="selectedWeapon"
            :locale="locale"
          />
        </div>
      </div>
    </div>


    <!-- FILTER PANEL (заглушка) -->
    <WikiWeaponFilterPanel
      :open="showFilterPanel"
      :locale="locale"
      :jobs="filters.jobs"
      :uniq="filters.uniq"
      @close="handleToggleFilter"
      @update:jobs="val => { weaponStore.applyFilters({ jobs: val }); startProgressiveFill() }"
      @update:uniq="val => { weaponStore.applyFilters({ uniq: val }); startProgressiveFill() }"
      @reset="() => { weaponStore.resetFilters(); selectJob(0); startProgressiveFill() }"
    />

    
  </section>
</template>

<style scoped>
/* глобалка для блокировки скролла подложки при открытых оверлеях/модалках */
:global(.hidden-scroll) { overflow: hidden !important; }
</style>
