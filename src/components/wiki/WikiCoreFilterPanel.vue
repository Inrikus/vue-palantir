<script setup>
import { computed, onBeforeUnmount, watch, onMounted } from 'vue'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'

/**
 * Специализированная панель фильтров для Cores.
 * v-model: rares:number[], jobs:number[], labels:number[], uniq:boolean
 * props:   locale:string
 */

const props = defineProps({
  open:   { type: Boolean, default: false },
  locale: { type: String,  default: 'en' },

  rares:  { type: Array,   default: () => [] },
  jobs:   { type: Array,   default: () => [] },
  labels: { type: Array,   default: () => [] },
  uniq:   { type: Boolean, default: false },
})

const emit = defineEmits([
  'close', 'reset',
  'update:rares', 'update:jobs', 'update:labels', 'update:uniq'
])

/* -------- labels store -------- */
const labelStore = useWikiLabelStore()
const loadLabels = (loc) => labelStore.load(loc)
onMounted(() => loadLabels(props.locale))
watch(() => props.locale, (loc) => loadLabels(loc))

/* -------- static options -------- */
const RARITY_OPTIONS = [
  { label: 'Common',   value: 1  },
  { label: 'Elite',    value: 2  },
  { label: 'Epic',     value: 4  },
  { label: 'Legend',   value: 8  },
  { label: 'Mythical', value: 16 },
]
const JOB_OPTIONS = [
  { label: 'Striker',  value: 1  },
  { label: 'Keystone', value: 2  },
  { label: 'Buster',   value: 4  },
  { label: 'Bullseye', value: 8  },
  { label: 'Apostle',  value: 16 },
]

/* -------- dynamic label groups (by CoreFilter) -------- */
const labelGroups = computed(() => {
  const items = Array.isArray(labelStore.items) ? labelStore.items : []
  const groups = new Map()
  for (const l of items) {
    const cf = (l.CoreFilter || '').trim()
    if (!cf) continue
    if (!groups.has(cf)) groups.set(cf, [])
    groups.get(cf).push(l)
  }
  const out = []
  for (const [key, arr] of groups.entries()) {
    const title = key.endsWith('Filter') ? key.slice(0, -6) : key
    const options = arr
      .map(l => ({
        value: l.ID,
        label: l.i18n?.[props.locale] || l.Name?.text || String(l.ID),
        color: l.LabelImageColor || '5E5E5E',
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
    if (options.length) out.push({ key, title, options })
  }
  out.sort((a, b) => a.title.localeCompare(b.title))
  return out
})

/* -------- mobile / scroll lock -------- */
const isMobile = computed(() =>
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
)
function toggleScrollLock(locked) {
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}
watch(() => props.open, (v) => { if (isMobile.value) toggleScrollLock(v) })
onBeforeUnmount(() => toggleScrollLock(false))

/* -------- toggles -------- */
const toggleVal = (key, val) => {
  const curr = new Set(
    key === 'rares'  ? props.rares  :
    key === 'jobs'   ? props.jobs   :
    key === 'labels' ? props.labels : []
  )
  curr.has(val) ? curr.delete(val) : curr.add(val)
  const next = Array.from(curr)
  if (key === 'rares')  emit('update:rares',  next)
  if (key === 'jobs')   emit('update:jobs',   next)
  if (key === 'labels') emit('update:labels', next)
}

const selectedCount = computed(() =>
  (props.rares?.length || 0) +
  (props.jobs?.length  || 0) +
  (props.labels?.length || 0) +
  (props.uniq ? 1 : 0)
)

function handleReset() {
  emit('update:rares',  [])
  emit('update:jobs',   [])
  emit('update:labels', [])
  emit('update:uniq',   false)
  emit('reset')
}

/* helpers для классов выбранности */
const isChecked = (arr, v) => Array.isArray(arr) && arr.includes(v)
</script>

<template>
  <Teleport to="body">
    <!-- overlay -->
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm"
        @click="$emit('close')"
      />
    </transition>

    <!-- panel -->
    <transition :name="isMobile ? 'slide-up' : 'slide-down'">
      <aside
        v-if="open"
        class="panel-shell fixed z-[1001] overflow-hidden rounded-t-3xl border border-white/10 bg-[#05060c]/95 text-white shadow-2xl backdrop-blur-2xl sm:rounded-none"
        :class="[
          'sm:inset-y-0 sm:left-0 sm:w-[740px] sm:max-w-[92vw]',
          'inset-x-0 bottom-0 top-0 sm:inset-auto'
        ]"
        role="dialog" aria-modal="true"
        aria-labelledby="core-filter-title"
      >
        <!-- TOP BAR -->
        <header class="sticky top-0 z-10 border-b border-white/10 bg-[#05060c]/95 px-6 py-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.4em] text-white/60">Filters</p>
              <h3 id="core-filter-title" class="text-2xl font-semibold text-white">
                Core tuning <span class="text-sm text-white/60">({{ selectedCount }})</span>
              </h3>
            </div>
            <div class="flex items-center gap-3 justify-center mt-2">
              <button
                @click="handleReset"
                class="ghost-btn"
                title="Reset all filters"
              >Reset</button>
              <button
                @click="$emit('close')"
                class="ghost-btn"
              >Close</button>
            </div>
          </div>
        </header>

        <div class="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <div class="space-y-7 pb-8">
            <!-- RARITY -->
            <section class="filter-card">
              <div class="flex items-center justify-between gap-4">
                <h4 class="sec-title">Rarity</h4>
                <span class="text-xs text-white/50">{{ RARITY_OPTIONS.length }} tiers</span>
              </div>
              <div class="tiles-grid">
                <label
                  v-for="opt in RARITY_OPTIONS"
                  :key="'rares-' + opt.value"
                  class="tile"
                  :class="{ 'is-active': isChecked(rares, opt.value) }"
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    :checked="rares.includes(opt.value)"
                    @change="toggleVal('rares', opt.value)"
                  />
                  <span class="tile-label">{{ opt.label }}</span>
                </label>
              </div>
            </section>

            <!-- JOBS + UNIQ -->
            <section class="filter-card">
              <div class="flex items-center justify-between gap-4">
                <h4 class="sec-title">Jobs</h4>
                <label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs">
                  <input
                    type="checkbox"
                    class="accent-[#63B4C8]"
                    :checked="uniq"
                    @change="$emit('update:uniq', $event.target.checked)"
                  />
                  <span class="opacity-80">Unique only</span>
                </label>
              </div>

              <div class="tiles-grid">
                <label
                  v-for="opt in JOB_OPTIONS"
                  :key="'jobs-' + opt.value"
                  class="tile"
                  :class="{ 'is-active': isChecked(jobs, opt.value) }"
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    :checked="jobs.includes(opt.value)"
                    @change="toggleVal('jobs', opt.value)"
                  />
                  <span class="tile-label">{{ opt.label }}</span>
                </label>
              </div>

              <p class="mt-3 text-xs leading-relaxed text-white/70">
                <template v-if="uniq">
                  Shows only cores available to <b>exactly one</b> class or to the <b>combination</b> of the selected classes.
                </template>
                <template v-else>
                  A core matches if it's available to <i>any</i> of the selected classes.
                </template>
              </p>
            </section>

            <!-- DYNAMIC LABEL GROUPS -->
            <section
              v-for="grp in labelGroups"
              :key="grp.key"
              class="filter-card"
            >
              <div class="flex items-center justify-between gap-4">
                <h4 class="sec-title">{{ grp.title }}</h4>
                <span class="text-xs text-white/50">{{ grp.options.length }} labels</span>
              </div>
              <div class="tiles-grid">
                <label
                  v-for="opt in grp.options"
                  :key="`label-${grp.key}-${opt.value}`"
                  class="tile"
                  :class="{ 'is-active': isChecked(labels, opt.value) }"
                  :style="{
                    '--tile-accent': `#${opt.color}`
                  }"
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    :checked="labels.includes(opt.value)"
                    @change="toggleVal('labels', opt.value)"
                  />
                  <span class="tile-label">{{ opt.label }}</span>
                </label>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.panel-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Заголовки секций */
.sec-title {
  @apply mb-2 text-sm uppercase tracking-wide text-white/70;
}

.filter-card {
  @apply rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur;
}

/* Сетка «кирпичей» фиксированной ширины */
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
@media (max-width: 640px) {
  .tiles-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}

/* Плитка-опция */
.tile {
  --tile-accent: #5E5E5E;
  display: grid;
  place-items: center;
  min-height: 48px;                /* фиксированная высота */
  padding: 0 14px;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  user-select: none;
  transition: box-shadow .2s ease, background-color .2s ease, transform .06s ease;
}
.tile:hover {
  box-shadow: 0 10px 25px rgba(5,6,12,0.4);
  background: rgba(255,255,255,0.06);
}
.tile:active { transform: translateY(1px); }

.tile-label {
  font-size: 0.875rem; /* = Tailwind text-sm */
  text-align: center;
  line-height: 1.1;
  white-space: nowrap; /* всё в одну строку */
}

/* Состояние выбора */
.tile.is-active {
  border-color: rgba(99,180,200,0.7);
  background: linear-gradient(120deg, rgba(99,180,200,0.2), rgba(5,6,12,0.8));
  box-shadow: 0 12px 30px rgba(7,14,26,0.6);
}

/* Анимации появления панели */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); opacity: 0.8; }

.slide-down-enter-active, .slide-down-leave-active { transition: transform 280ms ease, opacity 280ms ease; }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-100%); opacity: 0.7; }

@media (max-width: 640px) {
  .slide-up-enter-active, .slide-up-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
  .slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0.8; }
}

/* глобальная блокировка прокрутки под панелью */
:global(.hidden-scroll) { overflow: hidden !important; }

.ghost-btn {
  @apply rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white;
}
</style>
