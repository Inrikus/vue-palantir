// stores/wikiSkillStore.js
import { defineStore } from 'pinia'
import { fetchWikiSkills } from '@/utils/api'

/**
 * @typedef {Object} WikiSkillItem
 * @property {string} [_id]
 * @property {number} id
 * @property {number} Skill_LV
 * @property {string} englishName
 * @property {number} CombatPower
 * @property {number[]} [Tips_Label]
 * @property {number} [Damage_Type]          // 1 = physical, др. значения по игре
 * @property {number} [WeaponTypeLimit]      // битовая маска/категория типа оружия
 * @property {number} [SkillCost]
 * @property {number} [Cooldown]
 * @property {number[]} [Upgrade_Value]
 * @property {{BuffId:number,BuffLv:number}[]} [Buff_Display]
 * @property {string} Icon
 * @property {{name:{key:string,[k:string]:string},desc:{key:string,[k:string]:string}}} i18n
 */

const DEFAULT_SORT = { by: 'id', dir: 'asc' }

export const useWikiSkillStore = defineStore('wikiSkill', {
  state: () => ({
    items /** @type {WikiSkillItem[]} */: [],
    count: 0,

    loading: false,
    error: '',
    loadedLocale: 'en',

    /** Фильтры для навыков */
    filters: {
      search: '',                         // englishName (case-insensitive)
      levels: /** @type {number[]} */ ([]),        // Skill_LV in []
      damageTypes: /** @type {number[]} */ ([]),   // Damage_Type in []
      weaponTypes: /** @type {number[]} */ ([]),   // WeaponTypeLimit in []
      tips: /** @type {number[]} */ ([]),          // Tips_Label содержит любой из выбранных
      hasBuffId: /** @type {number|null} */ (null),// искать по Buff_Display
      cooldownMax: /** @type {number|null} */ (null), // <= value
      costMax: /** @type {number|null} */ (null),     // <= value
    },

    sort: { ...DEFAULT_SORT },            // id | name | CombatPower | Cooldown | Skill_LV
    page: 1,
    pageSize: 30,

    rawText: '',
  }),

  getters: {
    /** Удобные локализаторы */
    makeLocalizers: (state) => (locale) => ({
      nameOf: (s) => (s?.i18n?.name?.[locale] ?? s?.englishName ?? ''),
      descOf: (s) => (s?.i18n?.desc?.[locale] ?? ''),
    }),

    /** Фасеты (уровни, типы урона, типы оружия) */
    facets(state) {
      const lv = new Set()
      const dmg = new Set()
      const wtypes = new Set()
      for (const s of state.items) {
        if (s.Skill_LV != null) lv.add(s.Skill_LV)
        if (s.Damage_Type != null) dmg.add(s.Damage_Type)
        if (s.WeaponTypeLimit != null) wtypes.add(s.WeaponTypeLimit)
      }
      return {
        levels: Array.from(lv).sort((a,b)=>a-b),
        damageTypes: Array.from(dmg).sort((a,b)=>a-b),
        weaponTypes: Array.from(wtypes).sort((a,b)=>a-b),
      }
    },

    /** Фильтрация */
    filtered(state) {
      const f = state.filters
      const s = (f.search || '').trim().toLowerCase()

      const needLv   = new Set(f.levels || [])
      const needDmg  = new Set(f.damageTypes || [])
      const needWT   = new Set(f.weaponTypes || [])
      const needTips = new Set(f.tips || [])

      const buffId   = f.hasBuffId
      const cdMax    = Number.isFinite(f.cooldownMax) ? Number(f.cooldownMax) : null
      const costMax  = Number.isFinite(f.costMax)     ? Number(f.costMax)     : null

      const { nameOf, descOf } = this.makeLocalizers(state.loadedLocale)

      return state.items.filter((it) => {
        if (needLv.size   && !needLv.has(it.Skill_LV)) return false
        if (needDmg.size  && !needDmg.has(it.Damage_Type)) return false
        if (needWT.size   && !needWT.has(it.WeaponTypeLimit)) return false

        if (needTips.size) {
          const arr = Array.isArray(it.Tips_Label) ? it.Tips_Label : []
          const hasAny = arr.some(id => needTips.has(id))
          if (!hasAny) return false
        }

        if (buffId != null) {
          const arr = Array.isArray(it.Buff_Display) ? it.Buff_Display : []
          if (!arr.some(b => b?.BuffId === Number(buffId))) return false
        }

        if (cdMax != null && Number(it.Cooldown ?? 0) > cdMax) return false
        if (costMax != null && Number(it.SkillCost ?? 0) > costMax) return false

        // поиск по имени + локализованному описанию
        if (s) {
          const name = (nameOf(it) || '').toLowerCase()
          const desc = (descOf(it)  || '').toLowerCase()
          const eng  = (it.englishName || '').toLowerCase()
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
          case 'CombatPower': va = a.CombatPower; vb = b.CombatPower; break
          case 'Cooldown':    va = a.Cooldown;    vb = b.Cooldown;    break
          case 'Skill_LV':    va = a.Skill_LV;    vb = b.Skill_LV;    break
          case 'name':        va = nameOf(a);     vb = nameOf(b);     break
          default:            va = a.id;          vb = b.id;          break
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

    /** Постраничка */
    pageItems() {
      const end = this.page * this.pageSize
      return this.sorted.slice(0, end)
    },
    filteredTotal() { return this.sorted.length },
    hasNextPage()   { return this.page * this.pageSize < this.filteredTotal },
    totalPages()    { return Math.max(1, Math.ceil(this.sorted.length / this.pageSize)) },
  },

  actions: {
    /** Загрузка */
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
        const { data } = await fetchWikiSkills(locale)
        this.items = Array.isArray(data?.skills) ? data.skills : []
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

    /** Частичное применение фильтров */
    applyFilters(payload = {}) {
      if ('search'      in payload) this.filters.search      = payload.search ?? ''
      if ('levels'      in payload) this.filters.levels      = Array.isArray(payload.levels)      ? payload.levels      : []
      if ('damageTypes' in payload) this.filters.damageTypes = Array.isArray(payload.damageTypes) ? payload.damageTypes : []
      if ('weaponTypes' in payload) this.filters.weaponTypes = Array.isArray(payload.weaponTypes) ? payload.weaponTypes : []
      if ('tips'        in payload) this.filters.tips        = Array.isArray(payload.tips)        ? payload.tips        : []
      if ('hasBuffId'   in payload) {
        const v = payload.hasBuffId
        this.filters.hasBuffId = (v === null || v === undefined || v === '') ? null : Number(v)
      }
      if ('cooldownMax' in payload) {
        const v = Number(payload.cooldownMax)
        this.filters.cooldownMax = Number.isFinite(v) ? v : null
      }
      if ('costMax' in payload) {
        const v = Number(payload.costMax)
        this.filters.costMax = Number.isFinite(v) ? v : null
      }
      this.page = 1
    },

    /** Хелперы — совместимое API */
    nextPage()      { if (this.hasNextPage) this.page += 1 },
    setPage(p)      { this.page = Math.max(1, Number(p || 1)) },
    setPageSize(ps) { this.pageSize = Math.min(200, Math.max(5, Number(ps || 30))); this.page = 1 },
    setSort(by, dir){ this.sort.by = by || this.sort.by; this.sort.dir = dir || this.sort.dir; this.page = 1 },

    setSearch(v)      { this.filters.search = v ?? ''; this.page = 1 },
    setLevels(arr)    { this.filters.levels = Array.isArray(arr) ? arr : []; this.page = 1 },
    setDamageTypes(a) { this.filters.damageTypes = Array.isArray(a) ? a : []; this.page = 1 },
    setWeaponTypes(a) { this.filters.weaponTypes = Array.isArray(a) ? a : []; this.page = 1 },
    setTips(a)        { this.filters.tips = Array.isArray(a) ? a : []; this.page = 1 },
    setBuffId(id)     { this.filters.hasBuffId = (id==null||id==='')?null:Number(id); this.page = 1 },
    setCooldownMax(v) { this.filters.cooldownMax = Number.isFinite(+v) ? +v : null; this.page = 1 },
    setCostMax(v)     { this.filters.costMax     = Number.isFinite(+v) ? +v : null; this.page = 1 },

    resetFilters() {
      this.filters = {
        search: '',
        levels: [],
        damageTypes: [],
        weaponTypes: [],
        tips: [],
        hasBuffId: null,
        cooldownMax: null,
        costMax: null,
      }
      this.page = 1
    },
  }
})
