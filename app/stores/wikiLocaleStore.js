import { defineStore } from 'pinia'

export const useWikiLocaleStore = defineStore('wikiLocale', {
  state: () => ({
    locale: 'en',
  }),
  actions: {
    setLocale(locale) {
      this.locale = String(locale || 'en')
    },
  },
})
