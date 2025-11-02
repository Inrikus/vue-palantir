// src/stores/wikiLabelStore.js
import { defineStore } from 'pinia'
import { fetchWikiLabels } from '@/utils/api' // убедись в корректном пути

/**
 * @typedef {Object} WikiLabel
 * @property {number} ID
 * @property {{key:string,text?:string}} Name
 * @property {string} CoreFilter
 * @property {number} CoreTips
 * @property {number} SkillTips
 * @property {number} BuffTips
 * @property {string} LabelImageColor // HEX без '#', например "5E5E5E"
 * @property {{key:string,[k:string]:string}} i18n
 */

export const useWikiLabelStore = defineStore('wikiLabels', {
  state: () => ({
    loading: false,
    error: '',
    loadedLocale: 'en',
    items /** @type {WikiLabel[]} */: [],
    byId: /** @type {Record<number, WikiLabel>} */ ({})
  }),

  actions: {
    async load(locale = 'en') {
      if (this.loading) return
      // если уже загружали для этой локали — не перезагружаем
      if (this.items.length && this.loadedLocale === locale) return
      this.loading = true
      this.error = ''
      try {
        const { data } = await fetchWikiLabels(locale)
        const labels = Array.isArray(data?.labels) ? data.labels : []
        this.items = labels
        this.byId = Object.fromEntries(labels.map(l => [l.ID, l]))
        this.loadedLocale = locale
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || 'Labels fetch failed'
        this.items = []
        this.byId = {}
      } finally {
        this.loading = false
      }
    }
  }
})
