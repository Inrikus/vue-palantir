<script setup>
import { computed } from 'vue'
import { RARITY_NAME, JOB_NAME, CHIP_COLORS } from '@/components/wiki/filters/dicts'

// Простой, переиспользуемый бар. Он ничего не знает о store — только о входных данных.
const props = defineProps({
  // текущая локаль — нужна, чтобы подписать labels (если текст отдаётся снаружи) — не обязателен
  locale: { type: String, default: 'en' },

  // активные фильтры
  rares:  { type: Array, default: () => [] },   // [1,2,4,8,16]
  jobs:   { type: Array, default: () => [] },   // [1,2,4,8,16]
  labels: { type: Array, default: () => [] },   // [id, ...]
  uniq:   { type: Boolean, default: false },

  // карта лейблов: { [id]: { id, text, colorHex } }
  // чтобы не тянуть стор внутрь, прокидываем готовую карту из родителя.
  labelMap: { type: Object, default: () => ({}) },
})

const emit = defineEmits([
  'remove:rarity', 'remove:job', 'remove:label', 'unset:uniq'
])

const chips = computed(() => {
  const list = []

  // рарности
  for (const r of props.rares) {
    list.push({
      kind: 'rarity',
      value: r,
      label: RARITY_NAME[r] || `Rarity ${r}`,
      color: CHIP_COLORS.rarity
    })
  }

  // классы
  for (const j of props.jobs) {
    list.push({
      kind: 'job',
      value: j,
      label: JOB_NAME[j] || `Job ${j}`,
      color: CHIP_COLORS.job
    })
  }

  // уникальный режим
  if (props.uniq) {
    list.push({
      kind: 'uniq',
      value: true,
      label: 'Unique only',
      color: CHIP_COLORS.uniq
    })
  }

  // labels
  for (const id of props.labels) {
    const l = props.labelMap[id]
    if (!l) continue
    list.push({
      kind: 'label',
      value: id,
      label: l.text,
      color: `#${l.colorHex || '5E5E5E'}`
    })
  }

  return list
})

function onRemove(chip) {
  if (chip.kind === 'rarity') emit('remove:rarity', chip.value)
  else if (chip.kind === 'job') emit('remove:job', chip.value)
  else if (chip.kind === 'label') emit('remove:label', chip.value)
  else if (chip.kind === 'uniq') emit('unset:uniq')
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Chips -->
    <div v-if="chips.length" class="flex flex-wrap items-center gap-2">
      <button
        v-for="(chip, i) in chips"
        :key="i"
        class="group flex items-center gap-2 px-2.5 py-1 rounded-full ring-1 ring-white/10 hover:ring-white/20"
        :style="{ backgroundColor: `${chip.color}22`, borderColor: `${chip.color}44` }"
        @click="onRemove(chip)"
        title="Remove filter"
      >
        <span class="text-xs">{{ chip.label }}</span>
        <span
          class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >✕</span>
      </button>
    </div>
  </div>
</template>
