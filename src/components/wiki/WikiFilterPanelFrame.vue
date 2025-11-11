<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Filters' },
  count: { type: [Number, String], default: null },
})

defineEmits(['close', 'reset'])

const isMobile = computed(() =>
  typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false
)

function toggleScrollLock(locked) {
  if (!isMobile.value) return
  const html = document.documentElement
  const body = document.body
  html.classList.toggle('hidden-scroll', !!locked)
  body.classList.toggle('hidden-scroll', !!locked)
}

watch(() => props.open, (val) => {
  toggleScrollLock(val)
})

onBeforeUnmount(() => toggleScrollLock(false))
</script>

<template>
  <Teleport to="body">
    <transition name="filter-fade">
      <div
        v-if="open"
        class="filter-overlay"
        @click="$emit('close')"
      />
    </transition>

    <transition :name="isMobile ? 'slide-up' : 'slide-down'">
      <aside
        v-if="open"
        class="filter-shell"
        :class="[
          'fixed z-[1001] overflow-hidden rounded-t-3xl border border-white/10 bg-[#05060c]/95 text-white shadow-2xl backdrop-blur-2xl sm:rounded-none',
          'sm:inset-y-0 sm:left-0 sm:w-[740px] sm:max-w-[92vw]',
          'inset-x-0 bottom-0 top-0 sm:inset-auto'
        ]"
        role="dialog"
        aria-modal="true"
      >
        <header class="panel-header">
          <div>
            <p class="panel-eyebrow">Filters</p>
            <h3 class="panel-title">
              {{ title }}
              <span v-if="count !== null" class="panel-count">({{ count }})</span>
            </h3>
          </div>
          <div class="panel-actions">
            <button class="ghost-btn" type="button" @click="$emit('reset')">
              Reset
            </button>
            <button class="ghost-btn" type="button" @click="$emit('close')">
              Close
            </button>
          </div>
        </header>

        <div class="panel-body">
          <slot />
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.filter-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(5, 6, 12, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.filter-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(5, 6, 12, 0.95);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .panel-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.panel-eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.panel-title {
  font-size: 1.75rem;
  font-weight: 600;
}

.panel-count {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin-left: 0.35rem;
}

.panel-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.5rem;
}

.filter-fade-enter-active,
.filter-fade-leave-active { transition: opacity 200ms ease; }
.filter-fade-enter-from,
.filter-fade-leave-to { opacity: 0; }

.slide-down-enter-active,
.slide-down-leave-active { transition: transform 280ms ease, opacity 280ms ease; }
.slide-down-enter-from,
.slide-down-leave-to { transform: translateY(-100%); opacity: 0.7; }

@media (max-width: 640px) {
  .slide-up-enter-active,
  .slide-up-leave-active { transition: transform 250ms ease, opacity 250ms ease; }
  .slide-up-enter-from,
  .slide-up-leave-to { transform: translateY(100%); opacity: 0.8; }
}

.ghost-btn {
  @apply rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white;
}
</style>
