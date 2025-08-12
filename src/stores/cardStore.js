// stores/cardStore.js
import { defineStore } from 'pinia'

const initial = () => ({
  cards: [],
  maxCards: 0,
  hasNextPage: false,
  isLoading: false,
})

export const useCardStore = defineStore('card', {
  state: initial,

  actions: {
    // Полная замена списка
    setCards(list = []) {
      this.cards = Array.isArray(list) ? list : []
    },

    // Дозагрузка (для пагинации/инфинит-скролла)
    appendCards(list = []) {
      if (Array.isArray(list) && list.length) this.cards.push(...list)
    },

    // Метаданные страницы: total, hasNextPage и т.п.
    setMeta({ maxCards = 0, hasNextPage = true } = {}) {
      this.maxCards = Number(maxCards) || 0
      this.hasNextPage = !!hasNextPage
    },

    setLoading(v) {
      this.isLoading = !!v
    },
  },
})
