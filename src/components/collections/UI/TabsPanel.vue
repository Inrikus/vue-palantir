<script setup>
defineProps({
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="tabs">
    <button
      :class="['tab', modelValue === 'Cards' && 'active']"
      @click="$emit('update:modelValue', 'Cards')"
    >
      NFTs
    </button>
    <button
      :class="['tab', modelValue === 'Activity' && 'active']"
      @click="$emit('update:modelValue', 'Activity')"
    >
      Activity
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: inline-flex;
  gap: 0.5rem;
  padding: 0.4rem;
  /* Removed container styling */
  justify-content: center;
}
.tab {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,.6);
  background: transparent;
  transition: color .2s, background .2s;
}
.tab:hover { color: white; }
.tab.active {
  background: linear-gradient(120deg, rgba(99,180,200,.3), rgba(80,125,255,.3));
  color: white;
}
</style>
