<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCardsList } from '@/utils/api'; // Импортируем метод

import CardItem from './CardItem.vue'

import { useCardStore } from '@/stores/cardStore'
import { useFilterStore } from '@/stores/filterStore'
import { queryName } from '@/utils/dictsList.js'

const filterStore = useFilterStore()
const cardStore = useCardStore()
const route = useRoute()

const getCardsList = async () => {
  try {
    const { data } = await fetchCardsList(queryName[route.name], {
      sources: filterStore.sources,
      status: filterStore.status,
      tradeType: filterStore.tradeType,
      order: filterStore.order,
      priceRangeMax: filterStore.priceRangeMax,
      page: filterStore.page,
      rows: filterStore.rows,
      traits: filterStore.traits,
    });
    return data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    return { nfts: [], has_next_page: false, total_items: 0 };
  }
};

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
  if (!cardStore.hasNextPage || cardStore.isLoading) {
    return
  }
  try {
  cardStore.changeIsLoading(true)
  filterStore.changePage(filterStore.page + 1)
  const { nfts: data, has_next_page: allowed } = await getCardsList()
  cardStore.addCards(data)
  cardStore.changeHasNextPage(allowed)
  } catch (error) {
    console.error("Error fetching cards:", error);
  } finally {
    cardStore.changeIsLoading(false);
  }
}, 150)

const debouncedApply = debounce(async () => {
  if (cardStore.isLoading) {
    return;
  }
  try {
    cardStore.changeIsLoading(true);
    filterStore.changePage(1); // Сброс страницы
    const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList();
    cardStore.changeCards(data, maxCards)
    cardStore.changeHasNextPage(allowed);
  } catch (error) {
    console.error("Error fetching cards:", error);
  } finally {
    cardStore.changeIsLoading(false);
    filterStore.setNeedsUpdate(false);
  }
}, 75)

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    debouncedLoadMoreCards()
  }
}

//onMounted(async () => {
//  console.log('hasNextPage:', cardStore.hasNextPage, 'isLoading:', cardStore.isLoading);
//  filterStore.clearFilter()
//  debouncedApply()
//})

onMounted(async () => {
  try {
    //console.log('hasNextPage:', cardStore.hasNextPage, 'isLoading:', cardStore.isLoading);
    filterStore.clearFilter()
    const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()
    cardStore.changeCards(data, maxCards)
    cardStore.changeHasNextPage(allowed)
  }
  catch (error) {
    console.error("Error fetching cards:", error);
  }
  finally {
    cardStore.changeIsLoading(false);
    filterStore.setNeedsUpdate(false);
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  cardStore.changeCards([], 0) //Зануление карточек после выхода в главное меню
})

watch(route, async () => {
  try {
    //console.log('hasNextPage:', cardStore.hasNextPage, 'isLoading:', cardStore.isLoading);
    filterStore.clearFilter()
    const { nfts: data, has_next_page: allowed, total_items: maxCards } = await getCardsList()
    cardStore.changeCards(data, maxCards)
    cardStore.changeHasNextPage(allowed)
  }
  catch (error) {
    console.error("Error fetching cards:", error);
  }
  finally {
    cardStore.changeIsLoading(false);
    filterStore.setNeedsUpdate(false);
  }
})

watch(() => filterStore.needsUpdate,
  async (flagValue) => {
    //console.log('needsUpdate changed:', 'flag:', flagValue, 'hasNextPage:', cardStore.hasNextPage, 'isLoading:', cardStore.isLoading);
    if (flagValue) {
      debouncedApply()
    }
  },
  { deep: true })

watch(() => filterStore.order,
  async () => {
    debouncedApply()
  },
  { deep: true })

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