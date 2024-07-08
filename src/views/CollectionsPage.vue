<script setup>
import { watch, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useFilterStore } from '@/stores/filterStore'
import { useCardStore } from '@/stores/cardStore'

import FiltersPanel from '@/components/Filters/FiltersPanel.vue'
import CardsList from '@/components/Cards/CardsList.vue'

import { pageNames } from '@/utils/dictsList.js'

const route = useRoute()
const filterStore = useFilterStore()
const cardStore = useCardStore()

const tmpFunct = ref(null)

const setFunction = (func) => {
  tmpFunct.value = func
}

const currentSort = ref({
  orderBy: 'price',
  orderType: 1
})

const handleToggleFilter = () => {
  document.querySelector('#filter-panel').classList.toggle('hidden')
}

watch(route, () => {
  filterStore.clearFilter()
  currentSort.value = {
    orderBy: 'price',
    orderType: 1
  }
})

watch(currentSort, () => {
  filterStore.changeSort(currentSort.value)
}, { deep: true })

provide('tmpFunct', tmpFunct)
provide('setFunction', setFunction)
</script>

<template>
  <div class="">
    <div class='flex gap-2'>
      <img :src='pageNames[route.name].link' class='w-10 rounded-full'>
      <h2 class="text-3xl font-bold tracking-[4px] text-[#63B4C8]">{{ pageNames[route.name].name }}</h2>
    </div>
  </div>

  <div class="mt-4 flex justify-between">
    <div class="flex gap-4 items-center">
    <button @click='handleToggleFilter' class='border-2 border-[#63B4C8] text-[#63B4C8] rounded-md p-2 flex gap-2 text-xl font-semibold items-center hover:bg-gray-700 fixed sm:static bottom-0 left-0 justify-center w-full z-10 bg-[#232228]'>
        <img src='../assets/filter-1.svg' class='w-6'> Filter
    </button>

    <div :class="'text-l font-bold tracking-[4px] text-[#63B4C8] ' + (cardStore.getMaxCards ? 'circle circle-active' : 'circle')">
      {{ cardStore.getMaxCards }} results
    </div>
  </div>

    <div class="relative">
        <select 
          v-model="currentSort"
          class="w-[100%] font-semibold text-center text-xl bg-transparent border-2 border-[#63B4C8] text-[#63B4C8] rounded-md appearance-none focus:outline-none focus:ring-0 focus:bg-gray-700 hover:bg-gray-700 cursor-pointer peer p-2"
        >
        <option :value="{
          orderBy: 'price',
          orderType: -1
        }"
        class='bg-[#232228]'>
          Price: High to low
        </option>
        <option :value="{
          orderBy: 'price',
          orderType: 1
        }" 
        class='bg-[#232228]'>Price: Low to high</option>
        <option :value="{
          orderBy: 'rarity',
          orderType: -1
        }"
        class='bg-[#232228]'>Rarity: High to low</option>
        <option :value="{
          orderBy: 'rarity',
          orderType: 1
        }"
        class='bg-[#232228]'>Rarity: Low to high</option>
        <option :value="{
          orderBy: 'token_id',
          orderType: -1
        }"
        class='bg-[#232228]'>Token id: High to low</option>
        <option :value="{
          orderBy: 'token_id',
          orderType: 1
        }"
        class='bg-[#232228]'>Token id: Low to high</option>

      </select>
      <!-- <span class="absolute top-2 right-[-5px] flex items-center pr-2 pointer-events-none">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </span> -->
    </div>
  </div>

  <div class="mt-10 flex flex-col sm:flex-row gap-4">
    <FiltersPanel />
    <CardsList :sort="currentSort" />
  </div>
</template>

<style>
.circle::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: gray;
  display: inline-block;
  margin-right: 14px;
  vertical-align: middle;
}

.circle-active::before {
  background: #63B4C8;
  vertical-align: middle;
  animation: shadow-anim 1s infinite alternate;
}

@keyframes shadow-anim {
  from {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(99, 180, 200, 0.6);
    -moz-box-shadow: 0px 0px 5px 0px rgba(99, 180, 200, 0.6);
    box-shadow: 0px 0px 5px 0px rgba(99, 180, 200, 0.6);
  }

  to {
    -webkit-box-shadow: 0px 0px 5px 10px rgba(99, 180, 200, 0.6);
    -moz-box-shadow: 0px 0px 5px 10px rgba(99, 180, 200, 0.6);
    box-shadow: 0px 0px 5px 10px rgba(99, 180, 200, 0.6);
  }
}
</style>