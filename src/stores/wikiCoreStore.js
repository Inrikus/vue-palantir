import { defineStore } from 'pinia'
import { fetchWikiCores } from '@/utils/api'

/**
 * @typedef {Object} WikiCoreBuffDisplay
 * @property {number} BuffId
 * @property {number} BuffLv
 *
 * @typedef {Object} WikiCoreItem
 * @property {number} id
 * @property {number} CoreLv
 * @property {string} englishName
 * @property {number} CoreRare
 * @property {number} JobLimit
 * @property {string} Icon
 * @property {number[]} [Tips_Label]
 * @property {number[]} [Upgrade_Value]
 * @property {number} combatPower
 * @property {number} cooldown
 * @property {WikiCoreBuffDisplay[]} [Buff_Display]
 * @property {{name:{key:string,[k:string]:string},desc:{key:string,[k:string]:string}}} i18n
 */

const DEFAULT_SORT = { by: 'id', dir: 'asc' }

export const useWikiCoreStore = defineStore('wikiCore', {
  state: () => ({
    // данные
    items /** @type {WikiCoreItem[]} */: [],
    count: 0,

    // служебное
    loading: false,
    error: '',
    loadedLocale: 'en',

    // клиентские фильтры
    filters: {
      search: '',                    // текстовый поиск по englishName
      rares: /** @type {number[]} */ ([]), // CoreRare in []
      jobs:  /** @type {number[]} */ ([]), // JobLimit in []
      hasBuffId: /** @type {number|null} */ (null), // конкретный BuffId (по Buff_Display)
    },

    // сортировка
    sort: { ...DEFAULT_SORT }, // 'id'|'CoreRare'|'CoreLv'|'JobLimit'|'name'

    // пагинация (infinite)
    page: 1,
    pageSize: 30,

    // «сырое» (для отладки)
    rawText: '',
  }),

  getters: {
    // фасеты для UI
    facets(state) {
      const rares = new Set()
      const jobs = new Set()
      for (const c of state.items) {
        if (c.CoreRare != null) rares.add(c.CoreRare)
        if (c.JobLimit != null) jobs.add(c.JobLimit)
      }
      return {
        rares: Array.from(rares).sort((a, b) => a - b),
        jobs: Array.from(jobs).sort((a, b) => a - b),
      }
    },

    // локализаторы
    makeLocalizers: (state) => (locale) => ({
      nameOf: (c) => (c?.i18n?.name?.[locale] ?? c?.englishName ?? ''),
      descOf: (c) => (c?.i18n?.desc?.[locale] ?? ''),
    }),

    // отфильтрованные (CoreLv всегда 1)
    filtered(state) {
      const f = state.filters
      const s = (f.search || '').trim().toLowerCase()
      const needRares = new Set(f.rares || [])
      const needJobs = new Set(f.jobs || [])
      const buffId = f.hasBuffId

      return state.items.filter((c) => {
        // показываем только уровни 1
        if (c.CoreLv !== 1) return false

        if (needRares.size && !needRares.has(c.CoreRare)) return false
        if (needJobs.size && !needJobs.has(c.JobLimit)) return false

        if (buffId != null) {
          const arr = Array.isArray(c.Buff_Display) ? c.Buff_Display : []
          const ok = arr.some((b) => b?.BuffId === buffId)
          if (!ok) return false
        }

        if (s) {
          const english = (c.englishName || '').toLowerCase()
          if (!english.includes(s)) return false
        }
        return true
      })
    },

    // сортированные
    sorted() {
      const arr = [...this.filtered]
      const { by, dir } = this.sort
      const mul = dir === 'desc' ? -1 : 1
      const { nameOf } = this.makeLocalizers(this.loadedLocale)

      arr.sort((a, b) => {
        let va, vb
        switch (by) {
          case 'CoreRare':
            va = a.CoreRare
            vb = b.CoreRare
            break
          case 'CoreLv':
            va = a.CoreLv
            vb = b.CoreLv
            break
          case 'JobLimit':
            va = a.JobLimit
            vb = b.JobLimit
            break
          case 'name':
            va = nameOf(a)
            vb = nameOf(b)
            break
          default:
            va = a.id
            vb = b.id
            break
        }
        if (va == null && vb == null) return 0
        if (va == null) return -1 * mul
        if (vb == null) return 1 * mul
        if (typeof va === 'string' && typeof vb === 'string') {
          return va.localeCompare(vb) * mul
        }
        return (va === vb ? 0 : va < vb ? -1 : 1) * mul
      })
      return arr
    },

    // пагинированные результаты
    pageItems() {
      const end = this.page * this.pageSize
      return this.sorted.slice(0, end)
    },

    filteredTotal() {
      return this.sorted.length
    },

    hasNextPage() {
      return this.page * this.pageSize < this.filteredTotal
    },

    totalPages() {
      return Math.max(1, Math.ceil(this.sorted.length / this.pageSize))
    },
  },

  actions: {
    /** Загрузка всех ядер */
    async load(locale = 'en') {
      if (this.loadedLocale !== locale) {
        this.page = 1
        this.sort = { ...DEFAULT_SORT }
        this.filters.search = ''
      }

      this.loading = true
      this.error = ''
      this.rawText = ''

      try {
        const { data } = await fetchWikiCores(locale)
        this.items = Array.isArray(data?.cores) ? data.cores : []
        this.count = Number(data?.count || this.items.length || 0)
        this.loadedLocale = locale
        this.rawText = JSON.stringify(data, null, 2)
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || 'Request failed'
        this.items = []
        this.count = 0
      } finally {
        this.loading = false
      }
    },

    /** Следующая страница (для infinite scroll) */
    nextPage() {
      if (this.hasNextPage) this.page += 1
    },

    /** Поиск */
    setSearch(v) {
      this.filters.search = v ?? ''
      this.page = 1
    },

    /** Прямое управление фильтрами (универсальный способ) */
    applyFilters(obj) {
      this.filters.rares = Array.isArray(obj.rares) ? obj.rares : []
      this.filters.jobs = Array.isArray(obj.jobs) ? obj.jobs : []
      // возможные дополнительные фильтры (на будущее)
      this.page = 1
    },

    setBuffId(idOrNull) {
      const v =
        idOrNull === null || idOrNull === undefined || idOrNull === ''
          ? null
          : Number(idOrNull)
      this.filters.hasBuffId = Number.isFinite(v) ? v : null
      this.page = 1
    },

    /** Сортировка */
    setSort(by, dir) {
      this.sort.by = by || this.sort.by
      this.sort.dir = dir || this.sort.dir
      this.page = 1
    },

    setPage(p) {
      this.page = Math.max(1, Number(p || 1))
    },

    setPageSize(ps) {
      this.pageSize = Math.min(200, Math.max(5, Number(ps || 30)))
      this.page = 1
    },

    /** Сброс фильтров */
    resetFilters() {
      this.filters = { search: '', rares: [], jobs: [], hasBuffId: null }
      this.page = 1
    },
  },
})
