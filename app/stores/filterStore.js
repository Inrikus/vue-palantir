// stores/filterStore.js
import { defineStore } from 'pinia'

const initial = () => ({
  status: [],
  sources: [],
  order: 'priceAsc',
  tradeType: 1,
  priceRangeMax: 0,
  page: 1,
  rows: 30,
  traits: [],           // [{ trait_type, value }]
  needsUpdate: false,
})

export const useFilterStore = defineStore('filter', {
  state: initial,
  getters: {
    getAllFilters: (s) => [s.sources, s.status, s.tradeType, s.order, s.priceRangeMax, s.page, s.rows, s.traits],
  },
  actions: {
    setNeedsUpdate(v) { this.needsUpdate = v },

    changeStatus(e) {
      const v = e?.target?.value, checked = !!e?.target?.checked
      if (checked) { if (!this.status.includes(v)) this.status.push(v); return }
      const i = this.status.findIndex(x => x === v); if (i !== -1) this.status.splice(i, 1)
    },
    changeSources(e) {
      const v = e?.target?.value, checked = !!e?.target?.checked
      if (checked) { if (!this.sources.includes(v)) this.sources.push(v); return }
      const i = this.sources.findIndex(x => x === v); if (i !== -1) this.sources.splice(i, 1)
    },
    changeTraits(e, key, value) {
      if (e?.target?.checked) { this.traits.push({ trait_type: key, value }); return }
      const i = this.traits.findIndex(t => t.trait_type === key && t.value === value)
      if (i !== -1) this.traits.splice(i, 1)
    },
    changeTradeType(e) { this.tradeType = e?.target?.checked ? 1 : 0 },

    setOrder(newOrder) {
    if (this.order === newOrder) return
    this.order = newOrder
    this.page = 1
    // не трогаем needsUpdate — список перезагрузится через watch по order
    },
    changePage(v) { this.page = v },
    changeRows(v) { this.rows = v },
    changeMaxPrice(v) { this.priceRangeMax = Number(v) || 0 },

    clearFilter() { // если нужны «кастомные» дефолты вместо $reset()
      this.$patch(initial())
    },
  }
})
