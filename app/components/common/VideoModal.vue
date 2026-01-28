<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, default: '' },
  title: { type: String, default: '' },
  error: { type: String, default: '' },
})

const emit = defineEmits(['close', 'error'])

function handleClose() {
  emit('close')
}

function handleError() {
  emit('error')
}

function onKeydown(e) {
  if (e.key === 'Escape') handleClose()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="video-modal-backdrop" @click.self="handleClose">
      <div class="video-modal-panel">
        <div class="video-modal-header">
          <span class="video-modal-title">{{ title }}</span>
          <button class="video-modal-close" type="button" aria-label="Close" @click="handleClose">
            ×
          </button>
        </div>
        <video
          v-if="src"
          class="video-modal-player"
          :src="src"
          controls
          autoplay
          playsinline
          @error="handleError"
        />
        <p v-if="error" class="video-modal-error">{{ error }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.video-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6,10,18,.38);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  z-index: 3000;
}
.video-modal-panel {
  width: min(920px, 92vw);
  background: linear-gradient(135deg, rgba(20,28,38,.72), rgba(10,14,22,.55));
  border-radius: 1.2rem;
  padding: 0.8rem;
  box-shadow: 0 20px 50px rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.12);
}
.video-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.6rem;
}
.video-modal-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2eef6;
}
.video-modal-close {
  border: none;
  background: transparent;
  color: #e2eef6;
  width: 28px;
  height: 28px;
  line-height: 1;
  border-radius: 999px;
  font-size: 1.2rem;
  display: grid;
  place-items: center;
}
.video-modal-player {
  width: 100%;
  max-height: 70vh;
  border-radius: 0.9rem;
  background: transparent;
}
.video-modal-error {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #fca5a5;
}
</style>
