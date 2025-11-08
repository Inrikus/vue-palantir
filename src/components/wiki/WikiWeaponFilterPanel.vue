<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'

// Props and v-model API aligned with WikiCoreFilterPanel
const props = defineProps({
  open:   { type: Boolean, default: false },
  locale: { type: String,  default: 'en' },

  jobs:   { type: Array,   default: () => [] },
  labels: { type: Array,   default: () => [] },
  positions: { type: Array, default: () => [] },
  positionsUniq: { type: Boolean, default: false },
  uniq:   { type: Boolean, default: false },
})

const emit = defineEmits([
  'close', 'reset',
  'update:jobs', 'update:labels', 'update:positions', 'update:positions-uniq', 'update:uniq'
])

/* -------- stores -------- */
const labelStore = useWikiLabelStore()
const weaponStore = useWikiWeaponStore()
const loadLabels = (loc) => labelStore.load(loc)
onMounted(() => loadLabels(props.locale))
watch(() => props.locale, (loc) => loadLabels(loc))

/* -------- static options (jobs) -------- */
const JOB_OPTIONS = [
  { label: 'Striker',  value: 1  },
  { label: 'Keystone', value: 2  },
  { label: 'Buster',   value: 4  },
  { label: 'Bullseye', value: 8  },
  { label: 'Apostle',  value: 16 },
]

// const SKIN_OPTIONS = [
  // { label: 'Skin_Body',  value: 1  },
  // { label: 'Skin_Legs', value: 2  },
  // { label: 'Skin_Shoulder',   value: 4  },
  // { label: 'Skin_Arm', value: 8  },
  // { label: 'Skin_Rucksack',  value: 16 },
  // { label: 'Skin_Head',  value: 32  },
// ]

const WEAPON_OPTIONS = [
  { label: 'Body', value: 64  },
  { label: 'Bag L',   value: 128  },
  { label: 'Bag R', value: 256  },
  { label: 'Arm L',  value: 512 },  
  { label: 'Arm R',  value: 1024  },
  { label: 'Shoulder L', value: 2048  },
  { label: 'Shoulder R',   value: 4096  },
]



/* -------- dynamic label options (from Weapons.Tips_Label via LabelStore) -------- */
const tipsLabelIds = computed(() => weaponStore.facets?.labels || [])
const skillLabelOptions = computed(() => {
  const ids = Array.isArray(tipsLabelIds.value) ? tipsLabelIds.value : []
  if (!ids.length) return []
  const out = []
  const byId = labelStore.byId || {}
  const loc = props.locale
  for (const id of ids) {
    const l = byId[id]
    if (!l) continue
    out.push({
      value: l.ID,
      label: l.i18n?.[loc] || l.Name?.text || String(l.ID),
      color: l.LabelImageColor || '5E5E5E',
    })
  }
  out.sort((a, b) => a.label.localeCompare(b.label))
  return out
})

/* -------- mobile / scroll lock (parity with core panel) -------- */
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
    key === 'jobs'      ? props.jobs      :
    key === 'labels'    ? props.labels    :
    key === 'positions' ? props.positions : []
  )
  curr.has(val) ? curr.delete(val) : curr.add(val)
  const next = Array.from(curr)
  if (key === 'jobs')   emit('update:jobs',   next)
  if (key === 'labels') emit('update:labels', next)
  if (key === 'positions') emit('update:positions', next)
}

const selectedCount = computed(() =>
  (props.jobs?.length       || 0) +
  (props.labels?.length     || 0) +
  (props.positions?.length  || 0) +
  (props.positionsUniq ? 1 : 0) +
  (props.uniq ? 1 : 0)
)

function handleReset() {
  emit('update:jobs',   [])
  emit('update:labels', [])
  emit('update:positions', [])
  emit('update:positions-uniq', false)
  emit('update:uniq',   false)
  emit('reset')
}

/* helpers */
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
        aria-labelledby="weapon-filter-title"
      >
        <!-- TOP BAR -->
        <header class="sticky top-0 z-10 border-b border-white/10 bg-[#05060c]/95 px-6 py-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.4em] text-white/60">Filters</p>
              <h3 id="weapon-filter-title" class="text-2xl font-semibold text-white">
                Weapons scope <span class="text-sm text-white/60">({{ selectedCount }})</span>
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
                  Shows only weapons available to <b>exactly one</b> class or the <b>combination</b> of the selected classes.
                </template>
                <template v-else>
                  A weapon matches if it's available to <i>any</i> of the selected classes.
                </template>
              </p>
            </section>

            <!-- DYNAMIC LABELS (from Weapons Tips) -->
            <section v-if="skillLabelOptions.length" class="filter-card">
              <div class="flex items-center justify-between gap-4">
                <h4 class="sec-title">Labels</h4>
                <span class="text-xs text-white/50">{{ skillLabelOptions.length }} tags</span>
              </div>
              <div class="tiles-grid">
                <label
                  v-for="opt in skillLabelOptions"
                  :key="`label-${opt.value}`"
                  class="tile"
                  :class="{ 'is-active': isChecked(labels, opt.value) }"
                  :style="{ '--tile-accent': `#${opt.color}` }"
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

            <!-- POSITION FLAGS (bitmask) -->
            <section class="filter-card">
              <div class="flex items-center justify-between gap-4">
                <h4 class="sec-title">Weapon Slots</h4>
                <label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs">
                  <input
                    type="checkbox"
                    class="accent-[#63B4C8]"
                    :checked="positionsUniq"
                    @change="$emit('update:positions-uniq', $event.target.checked)"
                  />
                  <span class="opacity-80">Unique only</span>
                </label>
              </div>

              <div class="tiles-grid">
                <label
                  v-for="opt in WEAPON_OPTIONS"
                  :key="'pos-' + opt.value"
                  class="tile"
                  :class="{ 'is-active': isChecked(positions, opt.value) }"
                >
                  <input
                    type="checkbox"
                    class="sr-only"
                    :checked="positions.includes(opt.value)"
                    @change="toggleVal('positions', opt.value)"
                  />
                  <span class="tile-label">{{ opt.label }}</span>
                </label>
              </div>

              <p class="mt-3 text-xs leading-relaxed text-white/70">
                <template v-if="positionsUniq">
                  Shows only weapons whose slot mask matches <b>exactly</b> the selected flags.
                </template>
                <template v-else>
                  A weapon matches if its slot mask contains <i>any</i> of the selected flags.
                </template>
              </p>
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

/* section titles */
.sec-title {
  @apply mb-2 text-sm uppercase tracking-wide text-white/70;
}

.filter-card {
  @apply rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur;
}

/* responsive tiles grid */
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
@media (max-width: 640px) {
  .tiles-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}

/* tile */
.tile {
  --tile-accent: #5E5E5E;
  display: grid;
  place-items: center;
  min-height: 48px;
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
  font-size: 0.875rem; /* Tailwind text-sm */
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
}

/* active state */
.tile.is-active {
  border-color: rgba(99,180,200,0.7);
  background: linear-gradient(120deg, rgba(99,180,200,0.2), rgba(5,6,12,0.8));
  box-shadow: 0 12px 30px rgba(7,14,26,0.6);
}

/* transitions */
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

/* global helper for scroll lock */
:global(.hidden-scroll) { overflow: hidden !important; }

.ghost-btn {
  @apply rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white;
}
</style>
