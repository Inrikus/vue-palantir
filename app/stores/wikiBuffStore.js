// src/stores/wikiBuffStore.js
import { defineStore } from 'pinia'
import { fetchWikiBuffs } from '@/utils/api'

/**
 * @typedef {Object} WikiBuff
 * @property {number} id
 * @property {number} Buff_LV
 * @property {string} englishName
 * @property {string[]} Buff_Label
 * @property {string} Icon
 * @property {{name:{[k:string]:string},desc:{[k:string]:string}}} i18n
 */

export const useWikiBuffStore = defineStore('wikiBuffs', {
  state: () => ({
    loading: false,
    error: '',
    loadedLocale: 'en',
    items /** @type {WikiBuff[]} */: [],
    byId: /** @type {Record<number, WikiBuff>} */ ({})
  }),

  actions: {
    async load(locale = 'en') {
      if (this.loading) return
      if (this.items.length && this.loadedLocale === locale) return
      this.loading = true
      this.error = ''
      try {
        const { data } = await fetchWikiBuffs(locale)
        const buffs = Array.isArray(data?.buffs) ? data.buffs : []
        this.items = buffs
        this.byId = Object.fromEntries(buffs.map(b => [b.id, b]))
        this.loadedLocale = locale
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || 'Buffs fetch failed'
        this.items = []
        this.byId = {}
      } finally {
        this.loading = false
      }
    }
  }
})
