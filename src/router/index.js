// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useFilterStore } from '@/stores/filterStore'
import { useCardStore } from '@/stores/cardStore'

// ленивые импорты
const HomePage = () => import('../views/HomePage.vue')
const CollectionsPage = () => import('../views/CollectionsPage.vue')
const ContactsPage = () => import('../views/ContactsPage.vue')
const ErrorPage = () => import('../views/ErrorPage.vue')

const WikiHome   = () => import('../views/wiki/WikiHome.vue')
const WikiCores  = () => import('../views/wiki/WikiCores.vue')
const WikiBuffs  = () => import('../views/wiki/WikiBuffs.vue')
const WikiWeps   = () => import('../views/wiki/WikiWeapons.vue')

// простой плоский роутинг, как у тебя было, только чище
const routes = [
    // WIKI
  {
    path: '/wiki',
    name: 'wiki_home',
    component: WikiHome,
    meta: { title: 'Wiki' }
  },
  {
    path: '/wiki/cores',
    name: 'wiki_cores',
    component: WikiCores,
    meta: { title: 'Wiki — Cores' }
  },
  {
    path: '/wiki/weapons',
    name: 'wiki_weapons',
    component: WikiWeps,
    meta: { title: 'Wiki — Weapons/Skills' }
  },
  {
    path: '/wiki/buffs',
    name: 'wiki_buffs',
    component: WikiBuffs,
    meta: { title: 'Wiki — Buffs' }
  },
  
  {
    path: '/',
    name: 'home',
    component: HomePage,
    alias: ['/home'],
    meta: { title: 'Home' }
  },

  // Коллекции: один компонент, разные статические пути + props для бэкенда
  {
    path: '/fusionist_planet',
    name: 'fusionist_planet',
    component: CollectionsPage,
    meta: { title: 'Fusionist Planet' }
  },
  {
    path: '/bi_mech',
    name: 'bi_mech',
    component: CollectionsPage,
    meta: { title: 'Bi-Mech' }
  },
  {
    path: '/quartan_primes',
    name: 'quartan_primes',
    component: CollectionsPage,
    meta: { title: 'Quartan Primes' }
  },
  {
    path: '/alpha_prestige',
    name: 'alpha_prestige',
    component: CollectionsPage,
    meta: { title: 'Alpha Prestige' }
  },
  {
    path: '/primeace',
    name: 'primeace',
    component: CollectionsPage,
    meta: { title: 'PrimeACE' }
  },
  {
    path: '/pioneer_of_fusionist',
    name: 'pioneer_of_fusionist',
    component: CollectionsPage,
    meta: { title: 'Pioneer of Fusionist' }
  },

  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsPage,
    meta: { title: 'Contacts' }
  },

  // 404 — показываем компонент напрямую
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ErrorPage,
    meta: { title: 'Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-exact-active',

  // Возврат скролла: сохранённая позиция, якоря, иначе вверх
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0, behavior: 'smooth' }
  }
})

// Заголовок вкладки из meta.title
router.afterEach((to) => {
  const filterStore = useFilterStore()
  const cardStore   = useCardStore()
  // при необходимости — условие, когда НЕ чистить (например, пагинация в той же коллекции)
  filterStore.$reset()        // или filterStore.clearFilter() если хотите кастомные дефолты
  cardStore.$reset()          // ← очищаем данные карточек и мету
  
  const base = 'Fusionist'
  const t = (to.meta && to.meta.title) || to.name || ''
  document.title = t ? `${t} — ${base}` : base
})


export default router
