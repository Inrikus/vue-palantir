// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtI18nOptions } from '@nuxtjs/i18n';

const i18nOptions: NuxtI18nOptions & { lazy: true } = {
  locales: [
    { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
    { code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru.json' }
  ],
  defaultLocale: 'en',
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: 'locales',
  detectBrowserLanguage: false,
  vueI18n: './i18n/i18n.config.ts'
};

const gtagId = process.env.NUXT_PUBLIC_GTAG_ID;

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-gtag'
  ],

  css: ['~/assets/main.css'],

  tailwindcss: {
    viewer: false
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      gtagId: gtagId || ''
    }
  },

  gtag: {
    enabled: !!gtagId,
    id: gtagId
  },

  routeRules: {},

  i18n: i18nOptions,

  content: {
    // highlight: {
      // theme: 'github-dark'
    // }
  }
})