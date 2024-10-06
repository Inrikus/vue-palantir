//import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// Определяем глобальный стор для фильтров
export const useFilterStore = defineStore('filter', {
  state: () => ({
    status: [],
    sources: [],
    order: 'priceAsc',
    tradeType: 1,
    priceRangeMax: 0,
    page: 1,
    rows: 30,
    traits: [],
    needsUpdate: false // Флаг для отслеживания обновлений
  }),

  getters: {
    getAllFilters: (state) => {
      return [
        state.sources,
        state.status,
        state.tradeType,
        state.order,
        state.priceRangeMax,
        state.page,
        state.rows,
        state.traits
      ]
    }
  },

  actions: {
    setNeedsUpdate(value) {
      this.needsUpdate = value;
    },
    changeTraits(item, filterKey) {
      if (item.target.checked) {
        this.traits.push({
          trait_type: filterKey,
          value: item.target.value
        })
        return
      }

      const index = this.traits.findIndex((el) => el.value === item.target.value)
      this.traits.splice(index, 1)
    },

    changeStatus(item) {
      if (item.target.checked) {
        this.status.push(item.target.value)
        return
      }

      const index = this.status.findIndex((el) => el === item.target.value)
      this.status.splice(index, 1)
    },

    changeSources(item) {
      if (item.target.checked) {
        this.sources.push(item.target.value)
        return
      }

      const index = this.sources.findIndex((el) => el === item.target.value)
      this.sources.splice(index, 1)
    },

    changeTradeType(item) {
      this.tradeType = item.target.checked ? 1 : 0
    },

    changeOrder(item) {
      this.order = item
    },

    changePage(item) {
      this.page = item
    },

    changeRows(item) {
      this.rows = item
    },

    changeMaxPrice(price) {
      this.maxPrice = price
    },

    clearFilter() {
      this.status = []
      this.sources = []
      this.order = 'priceAsc'
      this.tradeType = 1
      this.priceRangeMax = 0
      this.page = 1
      this.rows = 30
      this.traits = []
      this.needsUpdate = false
    }
  }
})
