import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

//api.interceptors.response.use(
//    (response) => response,
//    (error) => {
//      console.error('API error:', error);
//      return Promise.reject(error);
//    }
//  );

// Методы для конкретных запросов
export const fetchCardsList = (endpoint, filters) => {
  return api.post(`/api/nfts/${endpoint}`, filters);
};

export const fetchBanners = () => {
  return api.get(`/api/nfts/home`);
};

export const fetchActivities = (endpoint) => {
  return api.get(`/api/nfts/activity/${endpoint}`);
};

export const fetchCryptocurrencies = () => {
  return api.get(`/api/nfts/cryptocurrencies`);
};

export const fetchWikiCores = (locale = 'en') => {
  return api.get(`/wiki/export/cores`, { params: { locale } });
};

export const fetchWikiLabels = (locale = 'en') => {
  return api.get(`/wiki/export/labels`, { params: { locale } });
};

export const fetchWikiBuffs = (locale = 'en') => {
  return api.get(`/wiki/export/buffs`, { params: { locale } });
};




export default api;