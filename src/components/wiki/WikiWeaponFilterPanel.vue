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
          'sm:inset-y-0 sm:left-0 sm:w-[720px] sm:max-w-[90vw]',
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
                Shows only weapons available to <b>exactly one</b> class or to the <b>combination</b> of the selected classes.
              </template>
              <template v-else>
                A weapon matches if it's available to <i>any</i> of the selected classes.
              </template>
            </p>
          </section>

          <!-- DYNAMIC LABELS (from Weapons Tips) -->
          <section v-if="skillLabelOptions.length">
            <h4 class="sec-title">Labels</h4>
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
          <section>
            <div class="flex items-center justify-between">
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

            <p class="mt-2 text-xs opacity-70 leading-relaxed">
              <template v-if="positionsUniq">
                Shows only weapons whose slot mask matches <b>exactly</b> the selected flags.
              </template>
              <template v-else>
                A weapon matches if its slot mask contains <i>any</i> of the selected flags.
              </template>
            </p>
          </section>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
/* section titles */
.sec-title {
  @apply text-sm uppercase tracking-wide opacity-80 mb-2;
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
  height: 44px;
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
  font-size: 0.875rem; /* Tailwind text-sm */
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
}

/* active state */
.tile.is-active {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.22),
    0 0 0 1px rgba(99,180,200,.35);
  background:
    linear-gradient(0deg, rgba(99,180,200,.14), rgba(99,180,200,.14));
}

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); opacity: 0.8; }

@media (max-width: 640px) {
  .slide-up-enter-active, .slide-up-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
  .slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0.8; }
}

/* global helper for scroll lock */
:global(.hidden-scroll) { overflow: hidden !important; }
</style>
