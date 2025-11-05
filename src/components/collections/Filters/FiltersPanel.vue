<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFilterStore } from '@/stores/filterStore'
import { collections, platformIcon } from '@/utils/dictsList.js'
import ArrowIcon from '@/components/collections/UI/ArrowIcon.vue'

const props = defineProps({
  isFilterPanelOpen: { type: Boolean, required: true }
})
const emit = defineEmits(['toggle'])

const route = useRoute()
const filterStore = useFilterStore()

// UI-состояние: какие секции раскрыты
const openSections = ref({ Status: true })

// Mobile/desktop анимация панели
const isMobile = computed(() => (typeof window !== 'undefined') && window.innerWidth <= 768)

// checked-состояния читаем из стора
const isTraitChecked = (filter, option) =>
  filterStore.traits.some(t => t.trait_type === filter && t.value === option)
const isStatusChecked = (status) => filterStore.status?.includes(status) || false
const isSourceChecked = (source) => filterStore.sources?.includes(source) || false
const isTradeTypeChecked = () => filterStore.tradeType === 1

// handlers
const handleToggleShow = (section) => { openSections.value[section] = !openSections.value[section] }
const handleToggleFilter = () => emit('toggle')
const handleTradeTypeClick = (e) => filterStore.changeTradeType(e)
const handleStatusClick   = (e) => filterStore.changeStatus(e)
const handleSourcesClick  = (e) => filterStore.changeSources(e)
const handleClick = (e) => {
  if (!e?.target) return
  const [key, val] = e.target.value.split(':')
  filterStore.changeTraits(e, key, val)
}

const handleApplyFilter = () => {
  filterStore.setNeedsUpdate(true)
  emit('toggle')
}

const handleResetFilter = () => {
  filterStore.clearFilter()
  filterStore.setNeedsUpdate(true)
  emit('toggle')
}
</script>

<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition name="fade" appear>
      <div
        v-show="props.isFilterPanelOpen"
        class="fixed inset-0 z-[9998] bg-black/50"
        role="presentation"
        @click.self="handleToggleFilter"
      />
    </transition>

    <!-- Drawer -->
    <transition :name="isMobile ? 'slide-up' : 'slide-left'" appear>
      <aside
        v-show="props.isFilterPanelOpen"
        id="filter-inner-panel"
        class="fixed top-0 left-0 h-full w-full sm:w-[420px] z-[9999] bg-[#1A1A1A] text-[#63B4C8] shadow-xl flex flex-col border-l border-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-white/10">
          <h2 id="filters-title" class="text-2xl font-semibold">Filters</h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            @click="handleToggleFilter"
            aria-label="Close filters"
          >
            <img src="@/assets/cross.svg" alt="Close" class="w-4 h-4" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
          <!-- Status -->
          <section class="section-container">
            <div class="section-header" @click="handleToggleShow('Status')">
              <h4 class="text-xl font-bold">Status</h4>
              <ArrowIcon :is-open="openSections.Status" />
            </div>
            <div :class="['section-content', { open: openSections.Status }]">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  id="only-buy-now"
                  name="tradeType"
                  :checked="isTradeTypeChecked()"
                  @click="handleTradeTypeClick"
                />
                <span class="text-lg font-medium">Only Buy Now</span>
              </label>

              <label class="checkbox-label">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  value="Normal"
                  name="status"
                  :checked="isStatusChecked('Normal')"
                  @click="handleStatusClick"
                />
                <span class="text-lg font-medium">Normal</span>
              </label>

              <label class="checkbox-label" v-if="['quartan_primes', 'primeace'].includes(route.name)">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  value="Uncreated"
                  name="status"
                  :checked="isStatusChecked('Uncreated')"
                  @click="handleStatusClick"
                />
                <span class="text-lg font-medium">Uncreated</span>
              </label>
            </div>
          </section>

          <!-- Traits -->
          <section
            v-for="(filter, i) in Object.keys(collections[route.name]?.filters || {})"
            :key="i"
            class="section-container"
          >
            <div class="section-header" @click="handleToggleShow(filter)">
              <h4 class="text-xl font-bold">{{ filter }}</h4>
              <ArrowIcon :is-open="openSections[filter]" />
            </div>
            <div :class="['section-content', { open: openSections[filter] }]">
              <label
                v-for="(option, idx) in collections[route.name].filters[filter] || []"
                :key="idx"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :value="`${filter}:${option}`"
                  name="trait"
                  :checked="isTraitChecked(filter, option)"
                  @click="handleClick"
                />
                <span class="text-lg font-medium">{{ option }}</span>
              </label>
            </div>
          </section>

          <!-- Sources -->
          <section class="section-container">
            <div class="section-header" @click="handleToggleShow('Sources')">
              <h4 class="text-xl font-bold">Sources</h4>
              <ArrowIcon :is-open="openSections.Sources" />
            </div>
            <div :class="['section-content', { open: openSections.Sources }]">
              <label
                v-for="(option, i) in collections[route.name]?.sources || []"
                :key="i"
                class="checkbox-label"
              >
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :value="option"
                  name="source"
                  :checked="isSourceChecked(option)"
                  @click="handleSourcesClick"
                />
                <img :src="platformIcon[option]" class="w-5 h-5 ms-2 mr-2" />
                <span class="text-lg font-medium">{{ option }}</span>
              </label>
            </div>
          </section>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-white/10 flex items-center justify-between gap-2">
          <button class="action-button" @click="handleResetFilter">Reset</button>
          <button class="action-button" @click="handleApplyFilter">Apply</button>
        </div>
      </aside>
    </transition>
  </teleport>
</template>

<style scoped>
/* Backdrop */
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Drawer animations */
.slide-left-enter-active, .slide-left-leave-active { transition: transform 220ms ease; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 220ms ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* Layout */
.section-container { max-width: 24rem; margin-left: auto; margin-right: auto; }
.section-header { display: flex; justify-content: flex-start; align-items: center; gap: 0.75rem; cursor: pointer; }
.section-content { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; padding: 0 0.5rem; max-height: 0; overflow: hidden; transition: max-height 400ms ease-in; }
.open { max-height: 1000px; }

.checkbox-label { display: inline-flex; align-items: center; width: 100%; cursor: pointer; gap: 0.75rem; }
.custom-checkbox { width: 1.5rem; height: 1.5rem; border-radius: 0.25rem; }

.action-button { font-size: 1.125rem; font-weight: 600; border: 2px solid #63B4C8; padding: 0.75rem; border-radius: 0.75rem; width: 100%; }
.action-button:hover { background-color: #4b5563; }
</style>
