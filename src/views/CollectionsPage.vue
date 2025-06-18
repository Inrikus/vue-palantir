<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

import CardsList from '@/components/Cards/CardsList.vue'
import FiltersPanel from '@/components/Filters/FiltersPanel.vue'
import ActivityPanel from '@/components/Activity/ActivityPanel.vue'
import TabsPanel from '@/components/UI/TabsPanel.vue' // 👈 Новый компонент

import { useCardStore } from '@/stores/cardStore'
import { useFilterStore } from '@/stores/filterStore'
import { pageNames } from '@/utils/dictsList.js'

const route = useRoute()
const cardStore = useCardStore()
const filterStore = useFilterStore()

const currentPanel = ref('Cards')

const handleToggleFilter = () => {
  const filterPanel = document.querySelector('#filter-panel')
  filterPanel?.classList.toggle('hidden')

  if (window.innerWidth <= 768) {
    document.body.classList.toggle('hidden-scroll', !filterPanel.classList.contains('hidden'))
  }
}

watch(route, () => {
  currentPanel.value = 'Cards'
})
</script>

<template>
  <div>
    <!-- Заголовок -->
    <div class="flex gap-2">
      <img :src="pageNames[route.name]?.link" class="w-10 h-10 rounded-full" alt="icon" />
      <h2 class="text-3xl font-bold tracking-[4px] text-[#63B4C8]">
        {{ pageNames[route.name]?.name }}
      </h2>
    </div>

    <!-- TabsPanel вместо кнопок -->
    <TabsPanel v-model="currentPanel" />

    <!-- Контент: либо Cards, либо Activity -->
    <div v-if="currentPanel === 'Cards'">
      <div class="mt-4 flex justify-between flex-col sm:flex-row gap-2 sticky sm:static top-0 left-0 z-10 bg-[#1a1a1a] py-2">
        <div class="flex gap-4 items-center">
          <button
            @click="handleToggleFilter"
            class="border-2 border-[#63B4C8] text-[#63B4C8] rounded-md p-2 flex gap-2 text-xl font-semibold items-center hover:bg-gray-700 sticky sm:static top-0 left-0 justify-center max-sm:w-full z-10 bg-[#232228]"
          >
            <img src="../assets/filter-1.svg" class="w-6" alt="filter" /> Filter
          </button>
        </div>

        <div class="relative flex justify-between">
          <div :class="'text-l font-bold tracking-[4px] text-[#63B4C8] ' + (cardStore.getMaxCards ? 'circle circle-active' : 'circle')">
            {{ cardStore.getMaxCards }} results
          </div>
          <select
            v-model="filterStore.order"
            class="w-full font-semibold text-center text-xl bg-transparent border-2 border-[#63B4C8] text-[#63B4C8] rounded-md appearance-none focus:outline-none focus:ring-0 focus:bg-gray-700 hover:bg-gray-700 cursor-pointer peer p-2"
          >
            <option value="priceDesc" class="bg-[#232228]">Price: High to low</option>
            <option value="priceAsc" class="bg-[#232228]">Price: Low to high</option>
            <option value="rarityDesc" class="bg-[#232228]">Rarity: High to low</option>
            <option value="rarityAsc" class="bg-[#232228]">Rarity: Low to high</option>
            <option value="tokenIdDesc" class="bg-[#232228]">Token id: High to low</option>
            <option value="tokenIdAsc" class="bg-[#232228]">Token id: Low to high</option>
          </select>
        </div>
      </div>

      <div class="mt-10 flex flex-col sm:flex-row gap-4 h-full items-stretch">
        <FiltersPanel />
        <CardsList />
      </div>
    </div>

    <div v-else>
      <ActivityPanel />
    </div>
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
    box-shadow: 0px 0px 5px 0px rgba(99, 180, 200, 0.6);
  }
  to {
    box-shadow: 0px 0px 5px 10px rgba(99, 180, 200, 0.6);
  }
}

@media (max-width: 768px) {
  .hidden-scroll {
    overflow: hidden;
  }
}
</style>