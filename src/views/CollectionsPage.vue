<script setup>
import { watch, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import CardsList from '@/components/Cards/CardsList.vue'
import FiltersPanel from '@/components/Filters/FiltersPanel.vue'
import ActivityPanel from '@/components/Activity/ActivityPanel.vue'
import TabsPanel from '@/components/UI/TabsPanel.vue'

import { useCardStore } from '@/stores/cardStore'
import { useFilterStore } from '@/stores/filterStore'
import { collections } from '@/utils/dictsList.js'

const route = useRoute()
const cardStore = useCardStore()
const filterStore = useFilterStore()
const showFilterPanel = ref(false)

const currentPanel = ref('Cards')
const isMobile = computed(() => window.innerWidth <= 768)

const sortOrder = computed({
  get: () => filterStore.order,
  set: (val) => filterStore.setOrder(val),
})

const endPoint = computed(() => collections[route.name].queryName)

const selectedFiltersCount = computed(() => {
  return filterStore.traits.length; // Считаем только элементы в filterStore.traits
});

const handleToggleFilter = () => {
  showFilterPanel.value = !showFilterPanel.value;
  if (isMobile.value) {
    document.body.classList.toggle('hidden-scroll', showFilterPanel.value);
  }
}

watch(route, () => {
  currentPanel.value = 'Cards'
  showFilterPanel.value = false; // Закрываем панель при смене маршрута
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Заголовок -->
    <div class="flex gap-2">
      <img :src="collections[route.name]?.page.image" class="w-10 h-10 rounded-full" alt="icon" />
      <h2 class="text-3xl font-bold tracking-[4px] text-[#63B4C8]">
        {{ collections[route.name]?.page.name }}
      </h2>
    </div>

    <!-- TabsPanel -->
    <TabsPanel v-model="currentPanel" />

    <!-- Контент: либо Cards, либо Activity -->
    <div v-if="currentPanel === 'Cards'">
      <div class="mt-4 flex justify-between flex-col sm:flex-row gap-2 sticky sm:static top-0 left-0 z-20 bg-[#1a1a1a] py-2">
        <div class="flex gap-4 items-center">
          <button
            @click="handleToggleFilter"
            class="border-2 border-[#63B4C8] text-[#63B4C8] rounded-md p-2 flex gap-2 text-xl font-semibold items-center hover:bg-gray-700 sticky sm:static top-0 left-0 justify-center max-sm:w-full z-30 bg-[#232228]"
          >
            <img src="../assets/filter-1.svg" class="w-6" alt="filter" />
            Filters ({{ selectedFiltersCount }})
          </button>
        </div>

        <div class="relative flex justify-between">
          <div :class="'text-lg font-bold tracking-[4px] text-[#63B4C8] ' + (cardStore.maxCards ? 'circle circle-active' : 'circle')">
            {{ cardStore.maxCards }} results
          </div>
          <select
            v-model="sortOrder"
            class="w-full font-semibold text-center text-xl bg-transparent border-2 border-[#63B4C8] text-[#63B4C8] rounded-md appearance-none focus:outline-none focus:ring-0 focus:bg-gray-700 hover:bg-gray-700 cursor-pointer p-2"
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

      <div class="mt-10 relative h-full">
        <FiltersPanel :is-filter-panel-open="showFilterPanel" @toggle="handleToggleFilter" />
        <CardsList :endpoint="endPoint" :key="endPoint" />
      </div>
    </div>

    <div v-else>
      <ActivityPanel :endpoint="endPoint" />
    </div>
  </div>
</template>

<style scoped>
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