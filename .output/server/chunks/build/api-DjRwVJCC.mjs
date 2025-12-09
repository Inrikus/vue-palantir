import axios from 'axios';
import { c as useRuntimeConfig } from './server.mjs';

let cachedBase = "";
let cachedApi = null;
const getApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || process.env.NUXT_PUBLIC_API_BASE || "";
  if (!cachedApi || cachedBase !== baseURL) {
    cachedBase = baseURL;
    cachedApi = axios.create({
      baseURL,
      withCredentials: true
    });
  }
  return cachedApi;
};
const fetchCardsList = (endpoint, filters) => {
  return getApi().post(`/api/nfts/${endpoint}`, filters);
};
const fetchBanners = () => {
  return getApi().get(`/api/nfts/home`);
};
const fetchActivities = (endpoint) => {
  return getApi().get(`/api/nfts/activity/${endpoint}`);
};
const fetchWikiCores = (locale = "en") => {
  return getApi().get(`/api/wiki/export/cores`, { params: { locale } });
};
const fetchWikiLabels = (locale = "en") => {
  return getApi().get(`/api/wiki/export/labels`, { params: { locale } });
};
const fetchWikiBuffs = (locale = "en") => {
  return getApi().get(`/api/wiki/export/buffs`, { params: { locale } });
};
const fetchWikiWeapons = (locale = "en") => {
  return getApi().get(`/api/wiki/export/weapons`, { params: { locale } });
};
const fetchWikiSkills = (locale = "en") => {
  return getApi().get(`/api/wiki/export/skills`, { params: { locale } });
};

export { fetchWikiCores as a, fetchWikiWeapons as b, fetchWikiSkills as c, fetchWikiLabels as d, fetchWikiBuffs as e, fetchBanners as f, fetchCardsList as g, fetchActivities as h };
//# sourceMappingURL=api-DjRwVJCC.mjs.map
