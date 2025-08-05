<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFilterStore } from '@/stores/filterStore'
import { filterList, filterSource, platformIcon } from '@/utils/dictsList.js'
import ArrowIcon from '@/components/UI/ArrowIcon.vue'

const props = defineProps({
  isFilterPanelOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const filterStore = useFilterStore()
const route = useRoute()
const openSections = ref({ Status: true }) // Status открыт по умолчанию
const isMobile = computed(() => window.innerWidth <= 768)
const isRouteChange = ref(false) // Флаг для отслеживания смены маршрута

const panelClasses = computed(() => ({
  'fixed top-0 left-0 w-full h-full z-50 bg-[#1A1A1A] bg-opacity-90': true,
  'translate-x-0': props.isFilterPanelOpen && !isMobile.value,
  '-translate-x-full': !props.isFilterPanelOpen && !isMobile.value,
  'translate-y-0': props.isFilterPanelOpen && isMobile.value,
  'translate-y-full': !props.isFilterPanelOpen && isMobile.value
}))

// Проверка состояния чекбоксов
const isTraitChecked = (filter, option) => {
  return filterStore.traits.some(trait => trait.trait_type === filter && trait.value === option)
}

const isStatusChecked = (status) => {
  return filterStore.status?.includes(status) || false
}

const isSourceChecked = (source) => {
  return filterStore.sources?.includes(source) || false
}

const isTradeTypeChecked = () => {
  return filterStore.tradeType === 1
}

// Синхронизация чекбоксов при монтировании
onMounted(() => {
  // Синхронизация для tradeType
  const onlyBuyNowCheckbox = document.querySelector('#only-buy-now');
  if (onlyBuyNowCheckbox) {
    onlyBuyNowCheckbox.checked = isTradeTypeChecked();
  }

  // Синхронизация для status
  document.querySelectorAll('input[name="status"]').forEach((el) => {
    el.checked = isStatusChecked(el.value);
  });

  // Синхронизация для sources
  document.querySelectorAll('input[name="source"]').forEach((el) => {
    el.checked = isSourceChecked(el.value);
  });

  // Синхронизация для traits
  document.querySelectorAll('input[name="trait"]').forEach((el) => {
    const [filter, option] = el.value.split(':');
    el.checked = isTraitChecked(filter, option);
  });
})

const handleClick = (item) => {
  if (!item.target) return;
  const [currentFilter, currentValue] = item.target.value.split(':');
  filterStore.changeTraits(item, currentFilter, currentValue);
}

const handleStatusClick = (item) => {
  filterStore.changeStatus(item)
}

const handleSourcesClick = (item) => {
  filterStore.changeSources(item)
}

const handleTradeTypeClick = (item) => {
  filterStore.changeTradeType(item)
}

const handleToggleShow = (section) => {
  openSections.value[section] = !openSections.value[section]; // Сворачиваем/разворачиваем все секции, включая Status
}

const handleToggleFilter = () => {
  emit('toggle') // Только отправляем событие
}

const handleOutsideClick = (event) => {
  const panel = document.querySelector('#filter-panel');
  const innerPanel = document.querySelector('#filter-inner-panel');
  if (panel && innerPanel && panel.contains(event.target) && !innerPanel.contains(event.target)) {
    handleToggleFilter();
  }
}

const handleApplyFilter = () => {
  filterStore.setNeedsUpdate(true);
  emit('toggle') // Закрываем панель после применения
}

const handleResetFilter = () => {
  filterStore.clearFilter();
  document.querySelectorAll('input[type="checkbox"]').forEach((el) => {
    el.checked = false;
  });
  const onlyBuyNowCheckbox = document.querySelector('#only-buy-now');
  if (onlyBuyNowCheckbox) {
    onlyBuyNowCheckbox.checked = true;
  }
  filterStore.setNeedsUpdate(true);
  // Закрываем панель только если сброс вызван пользователем (не сменой маршрута)
  if (!isRouteChange.value) {
    emit('toggle');
  }
}

watch(() => route.fullPath, () => {
  isRouteChange.value = true; // Устанавливаем флаг перед сбросом
  handleResetFilter();
  isRouteChange.value = false; // Сбрасываем флаг после сброса
});
</script>

<template>
  <div
    id="filter-panel"
    v-if="isFilterPanelOpen"
    class="flex justify-center items-center transform transition-transform duration-300"
    :class="panelClasses"
    @click="handleOutsideClick"
  >
    <div id="filter-inner-panel" class="w-full max-w-lg p-6 gap-6 flex flex-col bg-[#1A1A1A] text-[#63B4C8] border-2 border-[#63B4C8] rounded-xl mx-4 shadow-panel">
      <div class="overflow-y-auto scroll-hide max-h-[calc(100vh-140px)]">
        <div class="section-container">
          <div class="section-header" @click="handleToggleShow('Status')">
            <h4 class="text-xl font-bold">Status</h4>
            <ArrowIcon :is-open="openSections.Status" />
          </div>
          <div :class="['section-content', { open: openSections.Status }]">
            <label class="checkbox-label">
              <input type="checkbox" class="custom-checkbox" id="only-buy-now"
                name="tradeType" :checked="isTradeTypeChecked()" @click="handleTradeTypeClick" />
              <span class="text-lg font-medium">Only Buy Now</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" class="custom-checkbox" value="Normal"
                name="status" :checked="isStatusChecked('Normal')" @click="handleStatusClick" />
              <span class="text-lg font-medium">Normal</span>
            </label>
            <label class="checkbox-label" v-if="['qp', 'peace'].includes(route.name)">
              <input type="checkbox" class="custom-checkbox" value="Uncreated"
                name="status" :checked="isStatusChecked('Uncreated')" @click="handleStatusClick" />
              <span class="text-lg font-medium">Uncreated</span>
            </label>
          </div>
        </div>

        <div v-for="(filter, index) in Object.keys(filterList[route.name] || {})" :key="index" class="section-container">
          <div class="section-header" @click="handleToggleShow(filter)">
            <h4 class="text-xl font-bold">{{ filter }}</h4>
            <ArrowIcon :is-open="openSections[filter]" />
          </div>
          <div :class="['section-content', { open: openSections[filter] }]">
            <label v-for="(option, index) in filterList[route.name][filter] || []" :key="index" class="checkbox-label">
              <input type="checkbox" class="custom-checkbox"
                :value="`${filter}:${option}`" name="trait" :checked="isTraitChecked(filter, option)" @click="handleClick" />
              <span class="text-lg font-medium">{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="section-container">
          <div class="section-header" @click="handleToggleShow('Sources')">
            <h4 class="text-xl font-bold">Sources</h4>
            <ArrowIcon :is-open="openSections.Sources" />
          </div>
          <div :class="['section-content', { open: openSections.Sources }]">
            <label v-for="(option, index) in filterSource[route.name] || []" :key="index" class="checkbox-label">
              <input type="checkbox" class="custom-checkbox" :value="option"
                name="source" :checked="isSourceChecked(option)" @click="handleSourcesClick" />
              <img :src="platformIcon[option]" class="w-5 h-5 ms-2 mr-2" />
              <span class="text-lg font-medium">{{ option }}</span>
            </label>
            <button class="close-button" @click="handleToggleFilter">Close</button>
          </div>
        </div>
      </div>

      <div class="flex justify-between gap-2 section-container">
        <button class="action-button" @click="handleResetFilter">Reset</button>
        <button class="action-button" @click="handleApplyFilter">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-container {
  max-width: 24rem; /* Tailwind max-w-sm = 384px */
  margin-left: auto;
  margin-right: auto;
}

.section-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem; /* Tailwind gap-3 = 12px */
  cursor: pointer;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Tailwind gap-4 = 16px */
  margin-top: 1rem; /* Tailwind mt-4 = 16px */
  padding-left: 0.5rem; /* Tailwind px-2 = 8px */
  padding-right: 0.5rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 400ms ease-in;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  gap: 0.75rem; /* Tailwind gap-3 = 12px */
}

.custom-checkbox {
  width: 1.5rem; /* Tailwind w-6 = 24px */
  height: 1.5rem; /* Tailwind h-6 = 24px */
  color: #2563eb; /* Tailwind text-blue-600 */
  background-color: #e5e7eb; /* Tailwind bg-gray-200 */
  border-color: #d1d5db; /* Tailwind border-gray-300 */
  border-radius: 0.25rem; /* Tailwind rounded */
}

.action-button {
  font-size: 1.125rem; /* Tailwind text-lg = 18px */
  font-weight: 600; /* Tailwind font-semibold */
  border: 2px solid #63B4C8; /* Tailwind border-2 border-[#63B4C8] */
  padding: 0.75rem; /* Tailwind p-3 = 12px */
  border-radius: 0.75rem; /* Tailwind rounded-xl */
  width: 100%;
}

.action-button:hover {
  background-color: #4b5563; /* Tailwind hover:bg-gray-700 */
}

.close-button {
  position: absolute;
  top: 1.5rem; /* Tailwind top-6 = 24px */
  right: 1.5rem; /* Tailwind right-6 = 24px */
  font-size: 1rem; /* Tailwind text-base = 16px */
  font-weight: 600; /* Tailwind font-semibold */
  color: #63B4C8;
  border: 2px solid #63B4C8;
  padding: 0.5rem 1rem; /* Tailwind p-2 */
  border-radius: 0.5rem; /* Tailwind rounded-lg */
  background: none;
  cursor: pointer;
  transition: all 0.2s ease; /* Анимация для ховера */
}

.close-button:hover {
  background-color: #4b5563; /* Tailwind hover:bg-gray-700 */
}

.shadow-panel {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.scroll-hide::-webkit-scrollbar {
  width: 0;
}

.open {
  max-height: 1000px;
}

label {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>