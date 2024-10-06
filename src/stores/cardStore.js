import { defineStore } from 'pinia'

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [], // Список карточек
    maxCards: 0, // Максимальное количество карточек
    hasNextPage: true, // Флаг для проверки наличия следующей страницы
    isLoading: false // Флаг для проверки загрузки данных
  }),

  getters: {
    getCardsList: (state) => {
      return state.cards // Получение списка карточек
    },
    getMaxCards: (state) => {
      return state.maxCards // Получение максимального количества карточек
    }
  },

  actions: {
    addCards(data) {
      this.cards.push(...data) // Добавление карточек в массив
    },

    changeCards(data, cardsCount) {
      this.cards = data // Замена карточек на новые
      this.maxCards = cardsCount // Обновление максимального количества карточек
    },

    changeHasNextPage(data) {
      this.hasNextPage = data // Установка флага наличия следующей страницы
    },

    changeIsLoading(data) {
      this.isLoading = data // Установка флага загрузки
    }
  }
})