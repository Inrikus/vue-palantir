<script setup>
import { computed } from 'vue'

const props = defineProps({ card: Object })

const findTrait = (type) => props.card.traits?.find(t => t.trait_type === type)?.value || ''

const gradeRaw = computed(() => findTrait('GRADE'))
const gradeKey = computed(() => {
  const g = gradeRaw.value
  if (!g) return 'Common'
  const normalized = g.toLowerCase()
  const map = {
    common: 'Common',
    elite: 'Elite',
    epic: 'Epic',
    legend: 'Legend',
    legendary: 'Legend',
    mythical: 'Mythical'
  }
  return map[normalized] || g
})

const className = computed(() => {
  const cls = findTrait('Class')
  if (!cls) return ''
  return cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase()
})

const classIcon = computed(() => {
  const cls = className.value
  return cls ? `/cards/mechs/Icon_${cls}.png` : ''
})

const weaponCount = computed(() => findTrait('Weapons') || '0')
const gradeClass = computed(() => `grade-${(gradeKey.value || 'Common').toLowerCase()}`)
</script>

<template>
  <div class="mech-badge" :class="gradeClass" aria-hidden="true">
    <div class="glow"></div>
    <div class="class-icon" v-if="classIcon">
      <img :src="classIcon" :alt="className || 'Class icon'" />
    </div>
    <div class="meta">
      <span class="grade-label">{{ gradeKey }}</span>
      <span class="weapon-label">Weapons {{ weaponCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.mech-badge {
  width: 100%;
  max-width: 320px;
  height: 36px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: relative;
  overflow: hidden;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.62rem;
}
.glow {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  pointer-events: none;
  background: radial-gradient(circle at 5% 50%, rgba(255,255,255,.8), transparent 55%);
}
.class-icon {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(0,0,0,.45);
  display: grid;
  place-items: center;
  padding: 0.25rem;
  margin-right: 0.6rem;
}
.class-icon img { width: 100%; height: 100%; object-fit: contain; }
.meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  line-height: 1;
}
.grade-label { font-size: 0.58rem; }
.weapon-label { font-size: 0.62rem; letter-spacing: 0.18em; }

.grade-common  { background: linear-gradient(90deg, #0b1118, #2e2e2e); }
.grade-elite    { background: linear-gradient(90deg, #0f2f1b, #3a853f); }
.grade-epic     { background: linear-gradient(90deg, #0f1f44, #2c68c0); }
.grade-legend   { background: linear-gradient(90deg, #2b1142, #7c3db1); }
.grade-mythical { background: linear-gradient(90deg, #3f2406, #b88627); }
</style>
