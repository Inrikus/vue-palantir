<script setup>
import { watch, ref, onMounted, onBeforeUnmount, inject } from 'vue'
import { useFilterStore } from '@/stores/filterStore'
import { useCardStore } from '@/stores/cardStore'
import { useRoute } from 'vue-router'
import { queryName } from '@/utils/dictsList.js'
import axios from 'axios'

import CardItem from './CardItem.vue'

const filterStore = useFilterStore()
const cardStore = useCardStore()
const route = useRoute()

const page = ref(1)
const hasNextPage = ref(true)
const isLoading = ref(false)
const setFunction = inject('setFunction')

const props = defineProps({
  sort: Object
})

const getCardsList = async () => {
  try {
    const [traits, sortBy, orderType, status, sources, tradeType, maxPrice] = [...filterStore.getAllFilters]
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/nfts/${queryName[route.name]}`,
      {
        status,
        page: page.value,
        rows: 30,
        tradeType,
        orderBy: sortBy,
        orderType,
        traits,
        sources,
        priceRangeMax: maxPrice,
      }
    )

    return data
  } catch (e) {
    console.log(e)
    return { nfts: [], has_next_page: false, total_items: 0 }
  }
}

function debounce(fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const debouncedLoadMoreCards = debounce(async () => {
  if (!hasNextPage.value || isLoading.value) {
    return
  }
  isLoading.value = true
  page.value += 1

  const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()

  cardStore.addCards(data, maxCards)

  hasNextPage.value = allowed
  isLoading.value = false
}, 200)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    debouncedLoadMoreCards()
  }
}

const handleSetFilter = async () => {
  page.value = 1
  const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()

  cardStore.changeCards(data, maxCards)

  hasNextPage.value = allowed
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

onMounted(async () => {
  page.value = 1
  filterStore.clearFilter()
  const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()

  setFunction(handleSetFilter)

  cardStore.changeCards(data, maxCards)

  hasNextPage.value = allowed
})

watch(
  props,
  async () => {
    page.value = 1
    const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()

    cardStore.changeCards(data, maxCards)

    hasNextPage.value = allowed
  },
  { deep: true }
)

watch(route, () => {
  page.value = 1
  filterStore.clearFilter()
  hasNextPage.value = true
})
</script>

<template>
  <div class="w-full grid auto-fill-grid gap-4 gap-y-5 justify-between content-start justify-items-top pb-5"
    v-auto-animate>
    <CardItem v-for="card in cardStore.cards" :key="card.nft_name" :card="card" />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.auto-fill-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

@media (max-width: 767px) {
  .auto-fill-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 480px) {
  .auto-fill-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>