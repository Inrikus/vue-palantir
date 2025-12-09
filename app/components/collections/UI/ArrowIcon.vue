<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const arrowClasses = computed(() => [
  'w-2.5 h-2.5 ms-3 transition-all',
  { 'rotate-180': props.isOpen }
])
</script>

<template>
  <svg :class="arrowClasses" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
  </svg>
</template>

<style>
path {
  pointer-events: none;
}
</style>