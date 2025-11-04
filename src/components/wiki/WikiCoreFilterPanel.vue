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
        class="fixed inset-0 z-[1000] bg-black/60"
        @click="$emit('close')"
      />
    </transition>

    <!-- panel -->
    <transition :name="isMobile ? 'slide-up' : 'slide-left'">
      <aside
        v-if="open"
        class="fixed z-[1001] bg-[#232228] ring-1 ring-white/10 shadow-2xl overflow-y-auto m-0"
        :class="[
          'sm:inset-y-0 sm:left-0 sm:w-[720px] sm:max-w-[90vw]',   // шире, чтобы уместились «кирпичи»
          'inset-x-0 bottom-0 top-0 sm:inset-auto'
        ]"
        role="dialog" aria-modal="true"
      >
        <!-- TOP BAR -->
        <div class="p-4 flex items-center justify-between border-b border-white/10">
          <h3 class="text-lg font-semibold text-[#63B4C8]">
            Filters <span class="opacity-70 text-sm">({{ selectedCount }})</span>
          </h3>
          <div class="flex items-center gap-2">
            <button
              @click="handleReset"
              class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20"
              title="Reset all filters"
            >Reset</button>
            <button
              @click="$emit('close')"
              class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20"
            >Close</button>
          </div>
        </div>

        <div class="p-4 space-y-7">
          <!-- RARITY -->
          <section>
            <h4 class="sec-title">Rarity</h4>
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
          <section>
            <div class="flex items-center justify-between">
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

            <p class="mt-2 text-xs opacity-70 leading-relaxed">
              <template v-if="uniq">
                Shows only cores available to <b>exactly one</b> class (JobLimit = 1 / 2 / 4 / 8 / 16),
                or to the <b>exact sum</b> of the selected classes (e.g., Striker + Keystone → JobLimit = 3).
              </template>
              <template v-else>
                A core matches if its JobLimit contains <i>any</i> of the selected class flags.
              </template>
            </p>
          </section>

          <!-- DYNAMIC LABEL GROUPS -->
          <section v-for="grp in labelGroups" :key="grp.key">
            <h4 class="sec-title">{{ grp.title }}</h4>
            <div class="tiles-grid">
              <label
                v-for="opt in grp.options"
                :key="`label-${grp.key}-${opt.value}`"
                class="tile"
                :class="{ 'is-active': isChecked(labels, opt.value) }"
                :style="{
                  // лёгкий тон в фоне для группы
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
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Заголовки секций */
.sec-title {
  @apply text-sm uppercase tracking-wide opacity-80 mb-2;
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
  height: 44px;                /* фиксированная высота */
  padding: 0 14px;
  border-radius: 8px;
  background: rgba(0,0,0,.25);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
  cursor: pointer;
  user-select: none;
  transition: box-shadow .15s ease, background-color .15s ease, transform .06s ease;
}
.tile:hover {
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
  background: rgba(255,255,255,.04);
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
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.22),
    0 0 0 1px rgba(99,180,200,.35);
  background:
    linear-gradient(0deg, rgba(99,180,200,.14), rgba(99,180,200,.14));
}

/* Анимации появления панели */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); opacity: 0.8; }

@media (max-width: 640px) {
  .slide-up-enter-active, .slide-up-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
  .slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0.8; }
}

/* глобальная блокировка прокрутки под панелью */
:global(.hidden-scroll) { overflow: hidden !important; }
</style>
