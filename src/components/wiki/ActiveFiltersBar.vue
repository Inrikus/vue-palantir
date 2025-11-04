<script setup>
import { computed } from 'vue'
import { RARITY_NAME, JOB_NAME, CHIP_COLORS } from '@/components/wiki/filters/dicts'

const props = defineProps({
  locale:   { type: String, default: 'en' },
  rares:    { type: Array,  default: () => [] },
  jobs:     { type: Array,  default: () => [] },
  labels:   { type: Array,  default: () => [] },
  uniq:     { type: Boolean, default: false },
  labelMap: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['remove:rarity','remove:job','remove:label','unset:uniq'])

const chips = computed(() => {
  const list = []

  for (const r of props.rares) {
    list.push({ kind:'rarity', value:r, label: RARITY_NAME[r] || `Rarity ${r}`, color: CHIP_COLORS.rarity })
  }
  for (const j of props.jobs) {
    list.push({ kind:'job', value:j, label: JOB_NAME[j] || `Job ${j}`, color: CHIP_COLORS.job })
  }
  if (props.uniq) {
    list.push({ kind:'uniq', value:true, label:'Unique only', color: CHIP_COLORS.uniq })
  }
  for (const id of props.labels) {
    const l = props.labelMap[id]
    if (l) list.push({ kind:'label', value:id, label:l.text, color: `#${l.colorHex || '5E5E5E'}` })
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
    <div v-if="chips.length" class="flex flex-wrap items-center gap-2">
      <button
        v-for="(chip, i) in chips"
        :key="i"
        class="chip group"
        :style="{ '--chip': chip.color }"
        @click="onRemove(chip)"
        title="Remove filter"
      >
        <!-- маленькая цветная «пуля» слева — помогает считывать тип -->
        <span class="chip-dot" aria-hidden="true"></span>

        <span class="chip-label">{{ chip.label }}</span>

        <!-- крестик появляется по hover/focus -->
        <span class="chip-x" aria-hidden="true">✕</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* БАЗА: фиксированная высота → идеальное вертикальное центрирование */
.chip {
  /* layout */
  display: inline-flex;
  align-items: center;
  gap: 8px;

  /* размеры */
  height: 28px;              /* ровная капсула */
  padding-inline: 10px;
  border-radius: 9999px;

  /* фон/бордер */
  background: color-mix(in oklab, var(--chip, #5e5e5e) 12%, transparent);
  border: 1px solid color-mix(in oklab, var(--chip, #5e5e5e) 26%, transparent);

  /* эффекты */
  box-shadow: 0 1px 0 rgba(255,255,255,.06) inset, 0 1px 8px rgba(0,0,0,.25);
  transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;

  /* взаимодействия */
  cursor: pointer;
  backdrop-filter: blur(2px);
}
.chip:hover,
.chip:focus-visible {
  border-color: color-mix(in oklab, var(--chip, #5e5e5e) 46%, transparent);
  background: color-mix(in oklab, var(--chip, #5e5e5e) 18%, transparent);
  box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 2px 12px rgba(0,0,0,.35);
  outline: none;
}

/* текст строго по центру по вертикали благодаря фиксированной высоте + leading */
.chip-label {
  font-size: 12px;           /* ~ Tailwind text-xs */
  font-weight: 600;          /* лучше читается в капсуле */
  line-height: 1;            /* ключ к «по центру» */
  white-space: nowrap;
}

/* мини-индикатор слева (цвет типа/группы) */
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--chip, #5e5e5e) 80%, white 0%);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--chip, #5e5e5e) 28%, transparent);
}

/* крестик выезжает по hover/focus → без «плясок» ширины */
.chip-x {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  display: inline-grid;
  place-items: center;
  font-size: 10px;
  line-height: 1;
  color: rgba(255,255,255,.9);
  background: rgba(255,255,255,.12);
  opacity: 0;
  transform: translateX(-2px);
  transition: opacity .15s ease, transform .15s ease;
}
.chip:hover .chip-x,
.chip:focus-visible .chip-x {
  opacity: 1;
  transform: translateX(0);
}
</style>
