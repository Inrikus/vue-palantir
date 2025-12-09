import axios from 'axios'
import { useRuntimeConfig } from '#imports'

let cachedBase = ''
let cachedApi = null

const getApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase || process.env.NUXT_PUBLIC_API_BASE || ''

  if (!cachedApi || cachedBase !== baseURL) {
    cachedBase = baseURL
    cachedApi = axios.create({
      baseURL,
      withCredentials: true
    })
  }
  return cachedApi
}

// Методы для конкретных запросов
export const fetchCardsList = (endpoint, filters) => {
  return getApi().post(`/api/nfts/${endpoint}`, filters)
}

export const fetchBanners = () => {
  return getApi().get(`/api/nfts/home`)
}

export const fetchActivities = (endpoint) => {
  return getApi().get(`/api/nfts/activity/${endpoint}`)
}

export const fetchCryptocurrencies = () => {
  return getApi().get(`/api/nfts/cryptocurrencies`)
}

export const fetchWikiCores = (locale = 'en') => {
  return getApi().get(`/api/wiki/export/cores`, { params: { locale } })
}

export const fetchWikiLabels = (locale = 'en') => {
  return getApi().get(`/api/wiki/export/labels`, { params: { locale } })
}

export const fetchWikiBuffs = (locale = 'en') => {
  return getApi().get(`/api/wiki/export/buffs`, { params: { locale } })
}

export const fetchWikiWeapons = (locale = 'en') => {
  return getApi().get(`/api/wiki/export/weapons`, { params: { locale } })
}

export const fetchWikiSkills = (locale = 'en') => {
  return getApi().get(`/api/wiki/export/skills`, { params: { locale } })
}

export default getApi
