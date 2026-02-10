// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtI18nOptions } from '@nuxtjs/i18n';
import tailwindcss from '@tailwindcss/vite';

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
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    'nuxt-gtag'
  ],

  css: ['~/assets/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
      videoBase: process.env.NUXT_PUBLIC_VIDEO_BASE || '',
      gtagId: gtagId || ''
    }
  },

  gtag: {
    enabled: !!gtagId,
    id: gtagId
  },

  routeRules: {},

  i18n: i18nOptions,


})
