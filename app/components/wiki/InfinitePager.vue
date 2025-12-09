<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isLoading:     { type: Boolean, default: false },
  hasNextPage:   { type: Boolean, default: false },
  disabled:      { type: Boolean, default: false },

  /** необязательно: CSS-селектор корневого скролл-контейнера; по умолчанию окно */
  rootSelector:  { type: String,  default: '' },

  /** включить запасной режим на scroll/resize (рекомендуется для десктопа/ультрашироких) */
  useScrollFallback: { type: Boolean, default: true },

  /** «зона подгрузки» в px от нижнего края контента для fallback */
  fallbackOffset: { type: Number, default: 800 },

  /** настройки IO */
  rootMargin: { type: String,  default: '800px 0px 600px 0px' },
  threshold:  { type: Number,  default: 0.01 },
})

const emit = defineEmits(['load-more'])
const sentinel = ref(null)

let observer = null
let rootEl   = null

function canLoad() {
  return props.hasNextPage && !props.isLoading && !props.disabled
}

/* ---------------- IntersectionObserver ---------------- */
function createObserver() {
  if (!sentinel.value) return
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting && canLoad()) {
        emit('load-more')
      }
    },
    {
      root: (rootEl instanceof Element) ? rootEl : null,
      rootMargin: props.rootMargin,
      threshold: props.threshold,
    }
  )

  observer.observe(sentinel.value)
}

/* ---------------- Scroll/Resize fallback ---------------- */
let rafId = 0
let lastFiredAt = 0

function nearBottom() {
  const scrollTop = (rootEl instanceof Element) ? rootEl.scrollTop : window.scrollY || window.pageYOffset
  const viewportH = (rootEl instanceof Element) ? rootEl.clientHeight : window.innerHeight
  const scrollHeight = (rootEl instanceof Element)
    ? rootEl.scrollHeight
    : Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )

  // если нижняя граница в зоне fallbackOffset — подгружаем
  return (scrollTop + viewportH + props.fallbackOffset) >= scrollHeight
}

function onScrollOrResize() {
  if (!props.useScrollFallback) return
  if (!canLoad()) return

  // throttle через rAF
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    if (nearBottom()) {
      const now = performance.now()
      // защита от лавины вызовов
      if (now - lastFiredAt > 300) {
        lastFiredAt = now
        emit('load-more')
      }
    }
  })
}

function addFallbackListeners() {
  if (!props.useScrollFallback) return
  const target = (rootEl instanceof Element) ? rootEl : window
  target.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })
}

function removeFallbackListeners() {
  const target = (rootEl instanceof Element) ? rootEl : window
  target.removeEventListener('scroll', onScrollOrResize)
  window.removeEventListener('resize', onScrollOrResize)
  if (rafId) cancelAnimationFrame(rafId)
  rafId = 0
}

onMounted(() => {
  rootEl = props.rootSelector ? document.querySelector(props.rootSelector) : null
  createObserver()
  addFallbackListeners()

  // если сразу «низко» (большой вьюпорт), вручную проверить:
  onScrollOrResize()
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  removeFallbackListeners()
})

watch(
  () => [props.isLoading, props.hasNextPage, props.disabled, props.rootSelector, props.rootMargin, props.threshold],
  () => {
    // возможна смена root по селектору — перепривязываем
    const nextRoot = props.rootSelector ? document.querySelector(props.rootSelector) : null
    if (nextRoot !== rootEl) {
      removeFallbackListeners()
      rootEl = nextRoot
      addFallbackListeners()
    }
    createObserver()
    // и сразу ре-оценка
    onScrollOrResize()
  },
  { flush: 'post' }
)
</script>

<template>
  <div class="flex justify-center items-center py-6">
    <!-- невидимый sentinel -->
    <div ref="sentinel" class="w-px h-px opacity-0" />

    <!-- фолбэк-кнопка -->
    <button
      v-if="hasNextPage && !isLoading"
      @click="$emit('load-more')"
      class="text-sm px-4 py-2 ring-1 ring-white/10 hover:ring-white/20 rounded-md bg-neutral-800/40"
    >
      Load more
    </button>

    <div v-if="isLoading" class="text-xs opacity-70 animate-pulse">
      Loading...
    </div>
  </div>
</template>
