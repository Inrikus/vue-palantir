<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  hasNextPage: { type: Boolean, default: true },
})

const emit = defineEmits(['load-more'])

const sentinel = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !props.isLoading && props.hasNextPage) {
      emit('load-more')
    }
  })
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div ref="sentinel" style="height: 1px"></div>
</template>
