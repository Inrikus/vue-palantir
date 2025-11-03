<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

/**
 * Универсальная фильтр-панель для Wiki-разделов
 * 
 * Props:
 *  - open: Boolean — показать/скрыть
 *  - filtersConfig: [{
 *       key: string,           // имя фильтра (ключ в объекте filters)
 *       title: string,         // заголовок секции
 *       options: [{ label, value }]
 *    }]
 *  - filters: Object — объект состояния фильтров { key: Array<any> }
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  filtersConfig: { type: Array, default: () => [] },
  filters: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'reset', 'update:filters'])

// Мобильный режим — bottom sheet
const isMobile = computed(() =>
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
)

// Scroll lock (на мобиле)
function toggleScrollLock(locked) {
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}
watch(() => props.open, (v) => { if (isMobile.value) toggleScrollLock(v) })
onBeforeUnmount(() => toggleScrollLock(false))

// --- Работа с фильтрами ---
const modelFor = (key) => props.filters?.[key] || []

function toggleVal(key, val) {
  const next = new Set(modelFor(key))
  next.has(val) ? next.delete(val) : next.add(val)
  emit('update:filters', { ...props.filters, [key]: Array.from(next) })
}

function handleReset() {
  const empty = {}
  for (const sec of props.filtersConfig) empty[sec.key] = []
  emit('update:filters', empty)
  emit('reset')
}

// Счётчик выбранных значений (всех секций)
const selectedCount = computed(() => {
  const f = props.filters || {}
  return Object.values(f).reduce((acc, arr) => acc + (arr?.length || 0), 0)
})
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
          // desktop/tablet — слева
          'sm:inset-y-0 sm:left-0 sm:w-80 sm:max-w-[85vw]',
          // mobile — fullscreen снизу
          'inset-x-0 bottom-0 top-0 sm:inset-auto'
        ]"
        role="dialog" aria-modal="true"
      >
        <!-- Header -->
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

        <!-- Sections -->
        <div class="p-4 space-y-6">
          <section v-for="sec in filtersConfig" :key="sec.key">
            <h4 class="text-sm uppercase tracking-wide opacity-80 mb-2">{{ sec.title }}</h4>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="opt in sec.options"
                :key="`${sec.key}-${String(opt.value)}`"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-white/10 hover:ring-white/20 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  class="accent-[#63B4C8]"
                  :checked="modelFor(sec.key).includes(opt.value)"
                  @change="toggleVal(sec.key, opt.value)"
                />
                <span class="text-sm">{{ opt.label }}</span>
              </label>
            </div>
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
.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 250ms ease, opacity 250ms ease;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.8;
}

/* mobile: slide from bottom */
@media (max-width: 640px) {
  .slide-up-enter-active, .slide-up-leave-active {
    transition: transform 250ms ease, opacity 250ms ease;
  }
  .slide-up-enter-from, .slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0.8;
  }
}

/* временно — лучше в globals */
:global(.hidden-scroll) { overflow: hidden !important; }
</style>
