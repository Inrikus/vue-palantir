<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  isLoading:   { type: Boolean, default: false },
  hasNextPage: { type: Boolean, default: false },
  // Насколько раньше триггерить подгрузку (снизу)
  rootMargin:  { type: String,  default: '0px 0px 200px 0px' },
  disabled:    { type: Boolean, default: false },
  // Показать финальную плашку «конец списка»
  showEnd:     { type: Boolean, default: true },
})

const emit = defineEmits(['load-more'])

const sentinel = ref(null)
let io = null

function setupObserver() {
  if (io) io.disconnect()
  if (!sentinel.value) return

  // Если IntersectionObserver недоступен (очень старые браузеры)
  if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
    // fallback: просто один раз попробуем дернуть догрузку
    if (!props.disabled && !props.isLoading && props.hasNextPage) {
      emit('load-more')
    }
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry || !entry.isIntersecting) return
      if (props.disabled || props.isLoading || !props.hasNextPage) return
      emit('load-more')
    },
    { root: null, rootMargin: props.rootMargin, threshold: 0 }
  )

  io.observe(sentinel.value)
}

onMounted(setupObserver)
onBeforeUnmount(() => { if (io) io.disconnect() })

watch(
  () => [props.isLoading, props.hasNextPage, props.rootMargin, props.disabled],
  () => setupObserver()
)
</script>

<template>
  <div ref="sentinel" class="w-full flex items-center justify-center py-6">
    <div v-if="isLoading" class="text-sm opacity-80">Loading…</div>
    <div v-else-if="!hasNextPage && showEnd" class="text-xs opacity-50">— end of list —</div>
    <div v-else class="text-xs opacity-50">scroll to load more…</div>
  </div>
</template>

<style scoped>
/* без стилей — компонент-сторож */
</style>
