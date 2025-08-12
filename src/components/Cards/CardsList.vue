<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import CardItem from '@/components/Cards/CardItem.vue'
import InfinitePager from './InfinitePager.vue'
import { useCardStore } from '@/stores/cardStore'
import { useFilterStore } from '@/stores/filterStore'
import { fetchCardsList } from '@/utils/api'

const props = defineProps({
  endpoint: { type: String, required: true }, // например: 'fusionist_planet'
})

const cardStore = useCardStore()
const filterStore = useFilterStore()

// формируем полезную нагрузку для бэка из стора фильтров
const payload = computed(() => ({
  sources: filterStore.sources,
  status: filterStore.status,
  traits: filterStore.traits,
  order: filterStore.order,
  tradeType: filterStore.tradeType,
  priceRangeMax: filterStore.priceRangeMax,
  page: filterStore.page,
  rows: filterStore.rows,
}))

// защита от гонок: актуальный id запроса
const reqId = ref(0)

async function load(firstPage = true) {
  const id = ++reqId.value
  try {
    cardStore.setLoading(true)
    if (firstPage) {
      if (filterStore.page !== 1) filterStore.changePage(1)
      cardStore.setCards([])
      // стартово считаем, что догрузки нет, пока бэк не скажет обратное
      cardStore.setMeta({ maxCards: 0, hasNextPage: false })
    }
    const { data } = await fetchCardsList(props.endpoint, payload.value)
    if (id !== reqId.value) return
    firstPage ? cardStore.setCards(data?.nfts || []) : cardStore.appendCards(data?.nfts || [])
    cardStore.setMeta({ maxCards: data?.total_items ?? 0, hasNextPage: !!data?.has_next_page })
  } finally {
    if (id === reqId.value) {
      cardStore.setLoading(false)
      filterStore.setNeedsUpdate(false)
    }
  }
}

async function loadMore() {
  if (cardStore.isLoading || !cardStore.hasNextPage) return
  filterStore.changePage(filterStore.page + 1)
  await load(false)
}

//onMounted(() => load(true))

// Перезагружаем данные если:
// 1) сменился endpoint (другая коллекция) — грузим независимо от needsUpdate
// 2) кто-то попросил обновить (Apply/Reset/роут-хук выставил needsUpdate)
onMounted(() => load(true))
watch(
  () => [filterStore.order, filterStore.needsUpdate],
  ([order, needsUpdate], [prevOrder, prevNeedsUpdate]) => {
    // Смена сортировки
    if (order !== prevOrder) {
      filterStore.changePage(1)
      load(true)
      return
    }

    // Apply / Reset — только при переходе в true
    if (needsUpdate && !prevNeedsUpdate) {
      filterStore.changePage(1)
      load(true)
    }
  }, 
)
</script>

<template>
  <div class="w-full grid auto-fill-grid gap-4 gap-y-5 justify-between content-start justify-items-top pb-5" v-auto-animate>
    <!-- Пусто -->
    <div v-if="!cardStore.isLoading && !cardStore.cards.length" class="col-span-full text-center text-[#63B4C8]/80">
      No items found
    </div>

    <!-- Карточки -->
    <CardItem
      v-for="card in cardStore.cards"
      :key="card._id || card.id || card.token_id || card.nft_name"
      :card="card"
    />

    <!-- Пейджер-инфинит -->
    <InfinitePager
      :is-loading="cardStore.isLoading"
      :has-next-page="cardStore.hasNextPage"
      @load-more="loadMore"
    />
  </div>
</template>

<style scoped>
.auto-fill-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
@media (max-width: 767px) { .auto-fill-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); } }
@media (max-width: 480px) { .auto-fill-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); } }
</style>
