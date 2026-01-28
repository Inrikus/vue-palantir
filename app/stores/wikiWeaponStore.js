// stores/wikiWeaponStore.js
import { defineStore } from 'pinia'
import { fetchWikiWeapons } from '@/utils/api'

/**
 * @typedef {Object} WikiWeaponItem
 * @property {string} [_id]
 * @property {number} id
 * @property {string} englishName
 * @property {string} [desc]
 * @property {number} JobLimit              // битовая маска классов [1,2,4,8,16]
 * @property {number} WeaponType            // тип оружия (категория)
 * @property {string} [Module]
 * @property {string} Icon
 * @property {number} [QualityLimit]
 * @property {number} [PositionLimit]       // битовая маска слотов (например, 512 = Arm-Left)
 * @property {number} [Job_MainWeapon]      // основной класс для оружия (если есть)
 * @property {[number, number]|number[]} [CommonSkill] // [skillId, level] или просто [skillId]
 * @property {number[]} [skills]            // дополнительные/встроенные навыки
 * @property {number[]} [Tips_Label]        // Tips-based label IDs
 * @property {{name:{key:string,[k:string]:string}, location?:{key:string,[k:string]:string}, desc?:{key:string,[k:string]:string}}} i18n
 */

const DEFAULT_SORT = { by: 'id', dir: 'asc' }

export const useWikiWeaponStore = defineStore('wikiWeapon', {
  state: () => ({
    items /** @type {WikiWeaponItem[]} */: [],
    count: 0,

    loading: false,
    error: '',
    loadedLocale: 'en',

    /** Фильтры под оружие */
    filters: {
      search: '',                     // englishName (case-insensitive)
      jobs:   /** @type {number[]} */ ([]),   // [1,2,4,8,16]
      uniq: false,                    // exact-маска JobLimit
      types:  /** @type {number[]} */ ([]),   // WeaponType in []
      positions: /** @type {number[]} */ ([]),// PositionLimit — битовые флаги; матч по (mask & any) != 0
      positionsUniq: false,           // exact match for slot mask
      labels: /** @type {number[]} */ ([]),   // Tips_Label IDs
      hasSkillId: /** @type {number|null} */ (null), // искать по skills/CommonSkill
    },

    sort: { ...DEFAULT_SORT },
    page: 1,
    pageSize: 30,

    rawText: '',
  }),

  getters: {
    /** Фасеты (например, список типов) */
    facets(state) {
      const types = new Set()
      const labelIds = new Set()
      for (const w of state.items) {
        if (w?.WeaponType != null) types.add(w.WeaponType)
        const tips = Array.isArray(w?.Tips_Label) ? w.Tips_Label : []
        for (const id of tips) {
          const n = Number(id)
          if (Number.isFinite(n)) labelIds.add(n)
        }
      }
      return {
        types: Array.from(types).sort((a,b)=>a-b),
        labels: Array.from(labelIds).sort((a,b)=>a-b),
      }
    },

    /** Функции локализации для текущей локали */
    makeLocalizers: () => (locale) => ({
      nameOf: (w) => (w?.i18n?.name?.[locale] ?? w?.englishName ?? ''),
      descOf: (w) => (w?.i18n?.desc?.[locale] ?? w?.desc ?? ''),
      locationOf: (w) => (w?.i18n?.location?.[locale] ?? ''),
    }),

    /** Фильтрация */
    filtered(state) {
      const f = state.filters

      const s = (f.search || '').trim().toLowerCase()
      const needJobs = new Set(f.jobs || [])
      const jobMask  = Array.from(needJobs).reduce((m, bit) => (m | bit), 0)

      const needTypes = new Set(f.types || [])
      const needPosFlags = new Set(f.positions || [])
      const needLabels = new Set(f.labels || [])
      const skillId = f.hasSkillId

      const { nameOf, descOf } = this.makeLocalizers(state.loadedLocale)

      return state.items.filter((w) => {
        // jobs (битовая маска)
        if (needJobs.size) {
          if (f.uniq) {
            if (w.JobLimit !== jobMask) return false
          } else {
            if ((Number(w.JobLimit || 0) & jobMask) === 0) return false
          }
        }

        // тип оружия
        if (needTypes.size && !needTypes.has(w.WeaponType)) return false

        // позиция (битовые флаги)
        if (needPosFlags.size) {
          const posMask = Number(w.PositionLimit || 0)
          const anyMatch = Array.from(needPosFlags).some(flag => (posMask & flag) !== 0)
          if (!anyMatch) return false
          // If uniq mode for positions is enabled, require exact mask match
          if (f.positionsUniq) {
            const reqMask = Array.from(needPosFlags).reduce((m, bit) => (m | bit), 0)
            if (posMask !== reqMask) return false
          }
        }

        // наличие навыка
        // Tips_Label filter
        if (needLabels.size) {
          const arr = Array.isArray(w.Tips_Label) ? w.Tips_Label : []
          const any = arr.some(id => needLabels.has(Number(id)))
          if (!any) return false
        }

        if (skillId != null) {
          const list = Array.isArray(w.skills) ? w.skills : []
          const common = Array.isArray(w.CommonSkill) ? w.CommonSkill : []
          const cId = Array.isArray(common) && common.length ? Number(common[0]) : null
          const found = (list.includes(Number(skillId))) || (cId === Number(skillId))
          if (!found) return false
        }

        // поиск по имени + локализованному описанию
        if (s) {
          const name  = (nameOf(w) || '').toLowerCase()
          const desc  = (descOf(w) || '').toLowerCase()
          const eng   = (w.englishName || '').toLowerCase()
          if (!(name.includes(s) || desc.includes(s) || eng.includes(s))) return false
        }

        return true
      })
    },

    /** Сортировка */
    sorted() {
      const arr = [...this.filtered]
      const { by, dir } = this.sort
      const mul = dir === 'desc' ? -1 : 1
      const { nameOf } = this.makeLocalizers(this.loadedLocale)

      arr.sort((a, b) => {
        let va, vb
        switch (by) {
          case 'WeaponType': va = a.WeaponType; vb = b.WeaponType; break
          case 'JobLimit':   va = a.JobLimit;   vb = b.JobLimit;   break
          case 'name':       va = nameOf(a);    vb = nameOf(b);    break
          default:           va = a.id;         vb = b.id;         break
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

    /** Постраничка — как в ядрах */
    pageItems() {
      const end = this.page * this.pageSize
      return this.sorted.slice(0, end)
    },
    filteredTotal() { return this.sorted.length },
    hasNextPage()   { return this.page * this.pageSize < this.filteredTotal },
    totalPages()    { return Math.max(1, Math.ceil(this.sorted.length / this.pageSize)) },
  },

  actions: {
    /** Загрузка списка оружия по локали */
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
        const { data } = await fetchWikiWeapons(locale)
        this.items = Array.isArray(data?.weapons) ? data.weapons : []
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

    /** Применение фильтров (частичное обновление, как в core-сторе) */
    applyFilters(payload = {}) {
      if ('jobs'      in payload) this.filters.jobs      = Array.isArray(payload.jobs)      ? payload.jobs      : []
      if ('uniq'      in payload) this.filters.uniq      = !!payload.uniq
      if ('types'     in payload) this.filters.types     = Array.isArray(payload.types)     ? payload.types     : []
      if ('positions' in payload) this.filters.positions = Array.isArray(payload.positions) ? payload.positions : []
      if ('positionsUniq' in payload) this.filters.positionsUniq = !!payload.positionsUniq
      if ('labels'    in payload) this.filters.labels    = Array.isArray(payload.labels)    ? payload.labels    : []
      if ('search'    in payload) this.filters.search    = payload.search ?? ''
      if ('hasSkillId' in payload) {
        const v = payload.hasSkillId
        this.filters.hasSkillId = (v === null || v === undefined || v === '') ? null : Number(v)
      }
      this.page = 1
    },

    /** Хелперы — то же API, что и в wikiCoreStore */
    nextPage() { if (this.hasNextPage) this.page += 1 },

    setSearch(v)       { this.filters.search    = v ?? ''; this.page = 1 },
    setJobs(arr)       { this.filters.jobs      = Array.isArray(arr) ? arr : []; this.page = 1 },
    setUniq(v)         { this.filters.uniq      = !!v; this.page = 1 },
    setTypes(arr)      { this.filters.types     = Array.isArray(arr) ? arr : []; this.page = 1 },
    setLabels(arr)     { this.filters.labels    = Array.isArray(arr) ? arr : []; this.page = 1 },
    setPositions(arr)  { this.filters.positions = Array.isArray(arr) ? arr : []; this.page = 1 },
    setPositionsUniq(v){ this.filters.positionsUniq = !!v; this.page = 1 },
    setSkillId(id) {
      const v = (id === null || id === undefined || id === '') ? null : Number(id)
      this.filters.hasSkillId = Number.isFinite(v) ? v : null
      this.page = 1
    },

    setSort(by, dir) { this.sort.by = by || this.sort.by; this.sort.dir = dir || this.sort.dir; this.page = 1 },
    setPage(p)       { this.page = Math.max(1, Number(p || 1)) },
    setPageSize(ps)  { this.pageSize = Math.min(200, Math.max(5, Number(ps || 30))); this.page = 1 },

    resetFilters() {
      this.filters = { search: '', jobs: [], uniq: false, types: [], positions: [], positionsUniq: false, labels: [], hasSkillId: null }
      this.page = 1
    }
  }
})
