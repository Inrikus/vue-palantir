<script setup>

const { open, mobile, ariaLabel } = defineProps({
  open: { type: Boolean, default: false },
  mobile: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Detail modal' },
})

const emit = defineEmits(['close'])

function handleClose() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="open"
        class="modal-root"
        @keydown.esc.stop.prevent="handleClose"
      >
        <div class="modal-overlay" @click="handleClose" />
        <transition :name="mobile ? 'modal-slide' : 'modal-scale'" appear>
          <div
            class="modal-panel"
            :class="{ 'modal-panel--mobile': mobile }"
            role="dialog"
            aria-modal="true"
            :aria-label="ariaLabel"
          >
            <div class="modal-header" :class="{ 'modal-header--mobile': mobile }">
              <div class="header-left">
                <slot name="header-left" />
              </div>
              <button class="modal-close" type="button" @click="handleClose">
                Close
              </button>
            </div>

            <div class="modal-body">
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  pointer-events: none;
}
@media (min-width: 640px) {
  .modal-root { padding: 1.5rem; }
}
.modal-root > * { pointer-events: auto; }

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5, 8, 18, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: opacity 0.25s ease;
}

.modal-panel {
  position: relative;
  width: min(calc(100vw - 2rem), 960px);
  max-height: min(calc(100vh - 2rem), 920px);
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 15% 0%, rgba(255,255,255,0.08), transparent 55%),
    rgba(18, 26, 48, 0.92);
  border-radius: 32px;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 35px 90px rgba(0,0,0,0.45);
  backdrop-filter: blur(30px);
  overflow: hidden;
}

.modal-panel--mobile {
  width: 100%;
  height: 100%;
  max-height: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.modal-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem 0;
  pointer-events: auto;
}

.modal-header--mobile {
  position: sticky;
  top: 0;
  background: rgba(6, 10, 22, 0.7);
  backdrop-filter: blur(16px);
  padding: calc(env(safe-area-inset-top, 0px) + 0.75rem) 1rem 0.75rem;
  z-index: 5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.modal-close {
  border-radius: 999px;
  border: none;
  background:
    linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05));
  color: #f5f8ff;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.45rem 1.35rem;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.4),
    0 10px 25px rgba(0,0,0,0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  pointer-events: auto;
}
.modal-close:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.5),
    0 12px 30px rgba(0,0,0,0.45);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: clamp(0.5rem, 1.5vw, 1.25rem) clamp(0.85rem, 2vw, 1.75rem) clamp(1.25rem, 2vw, 2rem);
}
.modal-panel--mobile .modal-body {
  padding: 0.75rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
}

.modal-body :deep(.core-card),
.modal-body :deep(.weapon-card) {
  width: min(920px, 100%);
  margin: 0 auto;
}

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-scale-enter-active,
.modal-scale-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-scale-enter-from,
.modal-scale-leave-to { transform: scale(0.92); opacity: 0; }

.modal-slide-enter-active,
.modal-slide-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.modal-slide-enter-from,
.modal-slide-leave-to { transform: translateY(15px); opacity: 0; }
</style>
