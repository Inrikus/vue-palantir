<script setup>
import { useFilterStore } from '@/stores/filterStore'
import { filterList, filterSource } from '@/utils/dictsList.js'
import { useRoute } from 'vue-router'
import { watch, inject, ref } from 'vue'

const filterStore = useFilterStore()
const route = useRoute()

const maxPrice = ref(0)

const tmpFunct = inject('tmpFunct', () => {})

const handleClick = (item) => {
  if (!item.target) return;
  let currentFilter = '';
  for (let filter in filterList[route.name] || {}) {
    if (filterList[route.name][filter].includes(item.target.value)) {
      currentFilter = filter;
      break;
    }
  }
  filterStore.changeTraits(item, currentFilter)
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

const handleToggleShow = async (item) => {
  if (item.target.classList.contains('flex')) {
    if (item.target.nextSibling) {
      item.target.nextSibling.classList.toggle('open');
    }
    return;
  }
  if (item.target.parentNode.nextSibling) {
    item.target.parentNode.nextSibling.classList.toggle('open');
  }
}

const handleToggleFilter = () => {
  const filterPanel = document.querySelector('#filter-panel')
  filterPanel.classList.toggle('hidden')

  if (window.innerWidth <= 768) {
    if (filterPanel.classList.contains('hidden')) {
      document.body.classList.remove('hidden-scroll')
    } else {
      document.body.classList.add('hidden-scroll')
    }
  }
}

const handleResetFilter = () => {
  filterStore.clearFilter()
  maxPrice.value = 0
  document.querySelectorAll('input').forEach((el) => {
    if (el.type === 'checkbox') {
      el.checked = false
    }
  })
  const onlyListedCheckbox = document.querySelector('#only-listed')
  if (onlyListedCheckbox) {
    onlyListedCheckbox.checked = true
  }
  tmpFunct.value()
}

const handleSetFilter = () => {
  filterStore.changeMaxPrice(maxPrice.value)
  tmpFunct.value()
}

watch(() => route.fullPath, () => {
  document.querySelectorAll('input').forEach((el) => {
    if (el.type === 'checkbox') {
      el.checked = false
    }
  })
  const onlyListedCheckbox = document.querySelector('#only-listed')
  if (onlyListedCheckbox) {
    onlyListedCheckbox.checked = true
  }
  maxPrice.value = 0
})
</script>

<template>
  <div id="filter-panel"
    class="md:w-[22%] 2xl:w-[12%] w-full z-[9999999] hidden sm:sticky fixed bottom-0 left-0 sm:top-10 sm:left-0 h-full bg-[#1A1A1A] bg-opacity-90">
    <div
      class="flex absolute sm:sticky bottom-0 sm:bottom-auto sm:top-20 left-0 md:w-full p-4 xl:p-2 gap-2 bg-[#1A1A1A] text-[#63B4C8] flex-col sm:justify-start border-2 border-[#63B4C8] rounded-xl justify-end w-full">
      <div class="md:relative xl:static rounded-t-xl">
        <div class="flex xl:justify-between md:justify-start items-center cursor-pointer" @click="handleToggleShow">
          <h4 class="text-xl font-bold">Status</h4>
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 4 4 4-4" />
          </svg>
        </div>

        <div class="flex flex-col open gap-3 mt-4 collapse-item static px-1 top-6 left-0">
          <label class="inline-flex items-center w-full cursor-pointer">
            <input type="checkbox" class="sr-only peer" id="only-listed" @click="handleTradeTypeClick" checked />
            <div
              class="relative xl:block w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600">
            </div>
            <span class="xl:ms-3 ms-1 font-medium" @click="handleTradeTypeClick">Only Buy Now</span>
          </label>

          <label class="inline-flex items-center w-full cursor-pointer">
            <input type="checkbox" class="sr-only peer" value="Normal" @click="handleStatusClick" />
            <div
              class="relative xl:block w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600">
            </div>
            <span class="xl:ms-3 ms-1 font-medium">Normal</span>
          </label>

          <label class="inline-flex items-center w-full cursor-pointer"
            v-if="['qp', 'peace', 'pf'].includes(route.name)">
            <input type="checkbox" class="sr-only peer" value="Uncreated" @click="handleStatusClick" />
            <div
              class="relative xl:block w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600">
            </div>
            <span class="xl:ms-3 ms-1 font-medium">Uncreated</span>
          </label>
        </div>
      </div>

      <div v-for="(filter, index) in Object.keys(filterList[route.name] || {})" :key="index"
        class="md:relative xl:static">
        <div class="flex xl:justify-between md:justify-start items-center cursor-pointer" @click="handleToggleShow">
          <h4 class="text-xl font-bold">{{ filter }}</h4>
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 4 4 4-4" />
          </svg>
        </div>

        <div class="flex flex-col gap-3 mt-4 collapse-item static px-1 top-6 left-0">
          <label v-for="(option, index) in filterList[route.name][filter] || []" :key="index"
            class="inline-flex items-center w-full cursor-pointer">
            <input type="checkbox" class="sr-only peer" :value="option" @click="handleClick" />
            <div
              class="relative xl:block w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600">
            </div>
            <span class="xl:ms-3 ms-1 font-medium">{{ option }}</span>
          </label>
        </div>
      </div>

      <div class="md:relative xl:static">
        <div class="flex xl:justify-between md:justify-start items-center cursor-pointer md:relative xl:static"
          @click="handleToggleShow">
          <h4 class="text-xl font-bold">Sources</h4>
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 4 4 4-4" />
          </svg>
        </div>

        <div class="flex flex-col gap-3 mt-4 collapse-item static px-1 top-6 left-0">
          <label v-for="(option, index) in filterSource[route.name] || []" :key="index"
            class="inline-flex items-center w-full cursor-pointer">
            <input type="checkbox" class="sr-only peer" :value="option" @click="handleSourcesClick" />
            <div
              class="relative xl:block w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600">
            </div>
            <span class="xl:ms-3 ms-1 font-medium">{{ option }}</span>
          </label>

          <img src='@/assets/cross.svg' class='w-5 sm:hidden absolute top-4 right-4' @click='handleToggleFilter'>
        </div>
      </div>

      <div>
        <label>
          <p class="text-xl font-bold">Max Price</p>
          <input placeholder="Max Price" type="number" min="0" v-model.number="maxPrice"
            class="p-2 rounded-xl w-full bg-[#1F1F1F] text-[#63b4c8] border-2 border-[#63b4c8] placeholder-change mt-2" />
        </label>
      </div>
      <div class="flex justify-between gap-1">
        <button class="text-l font-semibold border-2 border-[#63b4c8] hover:bg-gray-700 p-2 rounded-xl"
          @click="handleResetFilter">Reset</button>
        <button class="text-l font-semibold border-2 border-[#63b4c8] hover:bg-gray-700 p-2 rounded-xl"
          @click="handleSetFilter">Apply</button>
      </div>
    </div>
  </div>
</template>


<style>
.collapse-item {
  max-height: 0px;
  overflow: hidden;
  transition: max-height 400ms ease-in;
}

.open {
  max-height: 1000px;
}

path {
  pointer-events: none;
}
</style>