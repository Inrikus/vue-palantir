<script setup>
import { watch, ref, onMounted } from 'vue'
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

const getCardsList = async () => {
  try {
    let [traits, sortBy, orderType, status, sources, tradeType] = [...filterStore.getAllFilters]
    const { data: data } = await axios.post(
      `/api/nfts/${queryName[route.name]}`,
      {
        status: status,
        page: page.value,
        rows: 30,
        tradeType: tradeType,
        orderBy: sortBy,
        orderType: orderType,
        traits: traits,
        sources: sources
      }
    )

    return data
  } catch (e) {
    console.log(e)
  }
}

function debounce(fn, delay) {
  let timer
  return async function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const debouncedLoadMoreCards = debounce(async () => {
  if (!hasNextPage.value) {
    return
  }
  page.value += 1

  const { nfts: data, has_next_page: allowed } = await getCardsList()

  cardStore.addCards(data)

  hasNextPage.value = allowed
}, 200)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    debouncedLoadMoreCards()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onMounted(async () => {
  page.value = 1
  window.addEventListener('scroll', handleScroll)
  const { nfts: data, has_next_page: allowed } = await getCardsList()

  cardStore.changeCards(data)

  hasNextPage.value = allowed
})

watch(
  filterStore,
  async () => {
    page.value = 1
    const { nfts: data, has_next_page: allowed } = await getCardsList()

    cardStore.changeCards(data)

    hasNextPage.value = allowed
  },
  { deep: true }
)

watch(route, () => {
  page.value = 1
  window.addEventListener('scroll', handleScroll)
  hasNextPage.value = true
})
</script>

<template>
  <div
    class="w-full grid auto-fill-grid gap-4 gap-y-5 justify-between content-start justify-items-top pb-5"
    v-auto-animate
  >
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