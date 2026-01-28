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
    items /** @type {WikiCoreItem[]} */: [],
    count: 0,

    loading: false,
    error: '',
    loadedLocale: 'en',

    filters: {
      // поиск теперь по: englishName + i18n.name[locale] + i18n.desc[locale] (case-insensitive)
      search: '',
      rares:  /** @type {number[]} */ ([]),  // CoreRare in []
      jobs:   /** @type {number[]} */ ([]),  // [1,2,4,8,16]
      labels: /** @type {number[]} */ ([]),  // Tips_Label IDs
      hasBuffId: /** @type {number|null} */ (null),
      uniq: false, // unique-mode for JobLimit (exact mask)
    },

    sort: { ...DEFAULT_SORT },
    page: 1,
    pageSize: 30,

    rawText: '',
  }),

  getters: {
    facets(state) {
      // оставим только rares как фасет (jobs/labels статичны/из словаря)
      const rares = new Set()
      for (const c of state.items) if (c.CoreRare != null) rares.add(c.CoreRare)
      return { rares: Array.from(rares).sort((a,b)=>a-b) }
    },

    makeLocalizers: () => (locale) => ({
      nameOf: (c) => (c?.i18n?.name?.[locale] ?? c?.englishName ?? ''),
      descOf: (c) => (c?.i18n?.desc?.[locale] ?? ''),
    }),

    filtered(state) {
      const f = state.filters
      const s = (f.search || '').trim().toLowerCase()
      const needRares  = new Set(f.rares || [])
      const needJobs   = new Set(f.jobs  || [])
      const needLabels = new Set(f.labels || [])
      const buffId     = f.hasBuffId

      // локализаторы для текущей загруженной локали
      const { nameOf, descOf } = this.makeLocalizers(this.loadedLocale)

      // целевая маска для jobs
      const jobMask = Array.from(needJobs).reduce((mask, bit) => (mask | bit), 0)

      return state.items.filter((c) => {
        // показываем только уровни 1 на гриде
        if (c.CoreLv !== 1) return false

        if (needRares.size && !needRares.has(c.CoreRare)) return false

        if (needJobs.size) {
          if (f.uniq) {
            // точное равенство суммарной маске выбранных классов
            if (c.JobLimit !== jobMask) return false
          } else {
            // хотя бы один выбранный флаг присутствует в битмаске ядра
            if ((c.JobLimit & jobMask) === 0) return false
          }
        }

        if (needLabels.size) {
          const tl = Array.isArray(c.Tips_Label) ? c.Tips_Label : []
          // требуется пересечение Tips_Label с выбранными
          const hasAny = tl.some(id => needLabels.has(id))
          if (!hasAny) return false
        }

        if (buffId != null) {
          const arr = Array.isArray(c.Buff_Display) ? c.Buff_Display : []
          if (!arr.some(b => b?.BuffId === buffId)) return false
        }

        // ПОИСК: englishName + локализованные name/desc
        if (s) {
          const english = (c.englishName || '').toLowerCase()
          const n = String(nameOf(c) || '').toLowerCase()
          const d = String(descOf(c) || '').toLowerCase()
          if (
            !english.includes(s) &&
            !n.includes(s) &&
            !d.includes(s)
          ) return false
        }

        return true
      })
    },

    sorted() {
      const arr = [...this.filtered]
      const { by, dir } = this.sort
      const mul = dir === 'desc' ? -1 : 1
      const { nameOf } = this.makeLocalizers(this.loadedLocale)

      arr.sort((a, b) => {
        let va, vb
        switch (by) {
          case 'CoreRare': va = a.CoreRare; vb = b.CoreRare; break
          case 'CoreLv':   va = a.CoreLv;   vb = b.CoreLv;   break
          case 'JobLimit': va = a.JobLimit; vb = b.JobLimit; break
          case 'name':     va = nameOf(a);  vb = nameOf(b);  break
          default:         va = a.id;       vb = b.id;       break
        }
        if (va == null && vb == null) return 0
        if (va == null) return -1 * mul
        if (vb == null) return  1 * mul
        if (typeof va === 'string' && typeof vb === 'string') {
          return va.localeCompare(vb) * mul
        }
        return (va === vb ? 0 : (va < vb ? -1 : 1)) * mul
      })
      return arr
    },

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
    async load(locale = 'en') {
      if (this.loading) return
      if (this.items.length && this.loadedLocale === locale) return
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

    applyFilters(payload = {}) {
      // ожидаем: { rares?, jobs?, labels?, uniq?, search?, hasBuffId? }
      if ('rares'  in payload) this.filters.rares  = Array.isArray(payload.rares)  ? payload.rares  : []
      if ('jobs'   in payload) this.filters.jobs   = Array.isArray(payload.jobs)   ? payload.jobs   : []
      if ('labels' in payload) this.filters.labels = Array.isArray(payload.labels) ? payload.labels : []
      if ('uniq'   in payload) this.filters.uniq   = !!payload.uniq
      if ('search'    in payload) this.filters.search    = payload.search ?? ''
      if ('hasBuffId' in payload) this.filters.hasBuffId = payload.hasBuffId ?? null
      this.page = 1
    },

    nextPage() { if (this.hasNextPage) this.page += 1 },

    setSearch(v)   { this.filters.search = v ?? ''; this.page = 1 },
    setRares(arr)  { this.filters.rares  = Array.isArray(arr) ? arr : []; this.page = 1 },
    setJobs(arr)   { this.filters.jobs   = Array.isArray(arr) ? arr : []; this.page = 1 },
    setLabels(arr) { this.filters.labels = Array.isArray(arr) ? arr : []; this.page = 1 },
    setUniq(v)     { this.filters.uniq   = !!v; this.page = 1 },
    setBuffId(idOrNull) {
      const v = (idOrNull === null || idOrNull === undefined || idOrNull === '') ? null : Number(idOrNull)
      this.filters.hasBuffId = Number.isFinite(v) ? v : null
      this.page = 1
    },

    setSort(by, dir) { this.sort.by = by || this.sort.by; this.sort.dir = dir || this.sort.dir; this.page = 1 },
    setPage(p)       { this.page = Math.max(1, Number(p || 1)) },
    setPageSize(ps)  { this.pageSize = Math.min(200, Math.max(5, Number(ps || 30))); this.page = 1 },

    resetFilters() {
      this.filters = { search: '', rares: [], jobs: [], labels: [], hasBuffId: null, uniq: false }
      this.page = 1
    }
  }
})
