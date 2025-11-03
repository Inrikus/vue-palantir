<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  open:  { type: Boolean, default: false },
  rares: { type: Array,  default: () => [] },
  jobs:  { type: Array,  default: () => [] },
  uniq:  { type: Boolean, default: false } // режим «только уникальные»
})
const emit = defineEmits(['close', 'reset', 'update:rares', 'update:jobs', 'update:uniq'])

// статичные опции
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

// мобильный режим — bottom sheet
const isMobile = computed(() =>
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
)

// scroll lock
function toggleScrollLock(locked) {
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}
watch(() => props.open, (v) => { if (isMobile.value) toggleScrollLock(v) })
onBeforeUnmount(() => toggleScrollLock(false))

// чекбоксы
const toggleVal = (key, val) => {
  const curr = key === 'rares' ? new Set(props.rares) : new Set(props.jobs)
  curr.has(val) ? curr.delete(val) : curr.add(val)
  const next = Array.from(curr)
  if (key === 'rares') emit('update:rares', next)
  if (key === 'jobs')  emit('update:jobs',  next)
}
const selectedCount = computed(() =>
  (props.rares?.length || 0) + (props.jobs?.length || 0) + (props.uniq ? 1 : 0)
)
function handleReset() {
  emit('update:rares', [])
  emit('update:jobs',  [])
  emit('update:uniq',  false)
  emit('reset')
}
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
          'sm:inset-y-0 sm:left-0 sm:w-80 sm:max-w-[85vw]',
          'inset-x-0 bottom-0 top-0 sm:inset-auto'
        ]"
        role="dialog" aria-modal="true"
      >
        <div class="p-4 flex items-center justify-between border-b border-white/10">
          <h3 class="text-lg font-semibold text-[#63B4C8]">
            Filters <span class="opacity-70 text-sm">({{ selectedCount }})</span>
          </h3>
          <button
            @click="$emit('close')"
            class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20"
          >
            Close
          </button>
        </div>

        <div class="p-4 space-y-6">
          <!-- Rarity -->
          <section>
            <h4 class="text-sm uppercase tracking-wide opacity-80 mb-2">Rarity</h4>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="opt in RARITY_OPTIONS"
                :key="'rares-' + opt.value"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-white/10 hover:ring-white/20 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  class="accent-[#63B4C8]"
                  :checked="rares.includes(opt.value)"
                  @change="toggleVal('rares', opt.value)"
                />
                <span class="text-sm">{{ opt.label }}</span>
              </label>
            </div>
          </section>

          <!-- Jobs + Uniq -->
          <section>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm uppercase tracking-wide opacity-80">Jobs</h4>

              <!-- Uniq toggle -->
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

            <div class="flex flex-wrap gap-2">
              <label
                v-for="opt in JOB_OPTIONS"
                :key="'jobs-' + opt.value"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-white/10 hover:ring-white/20 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  class="accent-[#63B4C8]"
                  :checked="jobs.includes(opt.value)"
                  @change="toggleVal('jobs', opt.value)"
                />
                <span class="text-sm">{{ opt.label }}</span>
              </label>
            </div>

            <p class="mt-2 text-xs opacity-70">
              <template v-if="uniq">
                Shows only cores available to <b>exactly one</b> class.
              </template>
              <template v-else>
                A core matches if it includes <i>any</i> of the selected class flags.
              </template>
            </p>

          </section>

          <div class="flex gap-2">
            <button
              @click="handleReset"
              class="px-3 py-2 rounded-lg ring-1 ring-white/10 hover:ring-white/20"
            >
              Reset
            </button>
          </div>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
/* fade */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* desktop/tablet: slide from left */
.slide-left-enter-active, .slide-left-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); opacity: 0.8; }

/* mobile: slide from bottom */
@media (max-width: 640px) {
  .slide-up-enter-active, .slide-up-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
  .slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0.8; }
}

/* глобалка для лок-боди при открытии */
:global(.hidden-scroll) { overflow: hidden !important; }
</style>
