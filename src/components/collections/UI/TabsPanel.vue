<script setup>
defineProps({
  modelValue: String
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex justify-start gap-4 text-2xl text-[#63B4C8] my-6 font-semibold">
    <button
      :class="['panel', modelValue === 'Cards' ? 'panel-active' : '']"
      @click="$emit('update:modelValue', 'Cards')"
    >
      NFTs
    </button>
    <button
      :class="['panel', modelValue === 'Activity' ? 'panel-active' : '']"
      @click="$emit('update:modelValue', 'Activity')"
    >
      Activity
    </button>
  </div>
</template>

<style scoped>
.panel {
  transition: opacity 0.2s;
}
.panel:hover {
  opacity: 0.5;
}

.panel-active {
  color: #ffffff;
  cursor: default;
}
.panel-active:hover {
  opacity: 1;
}
</style>