<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  isLoading:    { type: Boolean, default: false },
  hasNextPage:  { type: Boolean, default: false },
  disabled:     { type: Boolean, default: false },
  // можно тонко настроить, если нужно
  rootMargin:   { type: String,  default: '300px 0px 300px 0px' },
  threshold:    { type: Number,  default: 0 },
})
const emit = defineEmits(['load-more'])

const sentinel = ref(null)
let io = null

function tryLoad() {
  if (props.disabled) return
  if (props.isLoading) return
  if (!props.hasNextPage) return
  emit('load-more')
}

function mountObserver() {
  if (!sentinel.value) return
  if (!('IntersectionObserver' in window)) return
  unmountObserver()
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) tryLoad()
    }
  }, { root: null, rootMargin: props.rootMargin, threshold: props.threshold })
  io.observe(sentinel.value)
}
function unmountObserver() {
  if (io) { io.disconnect(); io = null }
}

onMounted(() => mountObserver())
onBeforeUnmount(() => unmountObserver())

// если флаги меняются — переинициализируем наблюдатель (на всякий)
watch(() => [props.isLoading, props.hasNextPage, props.disabled], () => {
  // небольшая задержка — чтобы DOM обновился
  requestAnimationFrame(() => {
    unmountObserver()
    mountObserver()
  })
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-6">
    <!-- sentinel -->
    <div ref="sentinel" class="h-1 w-1 opacity-0" aria-hidden="true"></div>

    <!-- состояние -->
    <div v-if="isLoading" class="text-sm opacity-80 flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      Loading…
    </div>

    <button
      v-else-if="hasNextPage"
      class="mt-2 text-sm rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20"
      @click="tryLoad"
    >
      Load more
    </button>

    <div v-else class="text-xs opacity-50">
      No more items
    </div>
  </div>
</template>
