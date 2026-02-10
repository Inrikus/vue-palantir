<script setup>
import { computed, nextTick } from 'vue'
import { useFilterStore } from '@/stores/filterStore'

const filterStore = useFilterStore()

const requestApply = async () => {
  if (filterStore.needsUpdate) {
    filterStore.setNeedsUpdate(false)
    await nextTick()
  }
  filterStore.setNeedsUpdate(true)
}

const chips = computed(() => {
  const list = []

  for (const t of filterStore.traits || []) {
    list.push({
      key: `trait:${t.trait_type}:${t.value}`,
      label: `${t.trait_type}: ${t.value}`,
      color: '#63B4C8',
      onRemove: async () => {
        const idx = filterStore.traits.findIndex(
          (row) => row.trait_type === t.trait_type && String(row.value) === String(t.value)
        )
        if (idx !== -1) filterStore.traits.splice(idx, 1)
        await requestApply()
      }
    })
  }

  for (const s of filterStore.status || []) {
    list.push({
      key: `status:${s}`,
      label: `Status: ${s}`,
      color: '#94A3B8',
      onRemove: async () => {
        const idx = filterStore.status.findIndex((row) => row === s)
        if (idx !== -1) filterStore.status.splice(idx, 1)
        await requestApply()
      }
    })
  }

  for (const s of filterStore.sources || []) {
    list.push({
      key: `source:${s}`,
      label: `Source: ${s}`,
      color: '#A78BFA',
      onRemove: async () => {
        const idx = filterStore.sources.findIndex((row) => row === s)
        if (idx !== -1) filterStore.sources.splice(idx, 1)
        await requestApply()
      }
    })
  }

  if (filterStore.tradeType === 1) {
    list.push({
      key: 'tradeType',
      label: 'Buy Now',
      color: '#F59E0B',
      onRemove: async () => {
        filterStore.tradeType = 0
        await requestApply()
      }
    })
  }

  if (filterStore.priceRangeMax) {
    list.push({
      key: 'priceMax',
      label: `Price ≤ ${filterStore.priceRangeMax}`,
      color: '#34D399',
      onRemove: async () => {
        filterStore.priceRangeMax = 0
        await requestApply()
      }
    })
  }

  if (filterStore.search?.trim()) {
    list.push({
      key: 'search',
      label: `Search: ${filterStore.search.trim()}`,
      color: '#F472B6',
      onRemove: async () => {
        filterStore.setSearch('')
        await requestApply()
      }
    })
  }

  return list
})

const clearAll = async () => {
  filterStore.clearFilter()
  await requestApply()
}
</script>

<template>
  <div class="chips-bar" v-if="chips.length">
      <div class="chips-row">
        <span class="chips-title">Active filters</span>
        <button
          v-for="chip in chips"
          :key="chip.key"
          type="button"
          class="chip"
          @click="chip.onRemove()"
          :aria-label="`Remove ${chip.label}`"
        >
          <span
            class="chip-dot"
            :style="{ backgroundColor: chip.color }"
            aria-hidden="true"
          />
          <span class="chip-label">{{ chip.label }}</span>
          <span class="chip-x">✕</span>
        </button>
      </div>
      <button type="button" class="chip-clear" @click="clearAll">Clear all</button>
  </div>
</template>

<style scoped>
.chips-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0.5rem 0 0.25rem;
  min-height: 2.5rem;
  padding: 0.25rem 0;
}
.chips-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.chips-title {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(99,180,200,0.85);
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  color: #e9f2ff;
  transition: transform .15s ease, border-color .15s ease, background-color .15s ease;
}
.chip:hover {
  transform: translateY(-1px);
  border-color: rgba(99,180,200,0.4);
  background: rgba(255,255,255,0.08);
}
.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}
.chip-label {
  white-space: nowrap;
}
.chip-x {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.55);
}
.chip-clear {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(99,180,200,0.35);
  background: linear-gradient(120deg, rgba(99,180,200,0.5), rgba(80,125,255,0.5));
  padding: 0.45rem 0.9rem;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #fff;
  box-shadow: 0 10px 20px rgba(6,18,43,.2);
}
</style>
