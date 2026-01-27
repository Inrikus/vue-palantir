// src/utils/richtext.js

/**
 * Универсальный форматтер «вики»-текста Fusionist:
 * - подстановка значений из Upgrade_Value: {0}, {1}...
 *   * если после плейсхолдера стоит '%', он сохраняется: "{0}%" → "50%"
 *   * число всегда делим на 100 (игровой формат), 200000 → 2000
 * - <color=#HEX>...</color> и закрывающие </color> или </color=#HEX>
 * - <buff=id,lv> → мини-иконка + имя баффа (через колбэк findBuff)
 */

function formatValueDiv100(n) {
  if (n == null) return ''
  const v = Number(n) / 100
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, '')
}

const LOCALE_ALIASES = {
  zh: 'ch',
  'zh-cn': 'ch',
  'zh-hans': 'ch',
  'zh-hant': 'ch',
  ja: 'jp',
  ko: 'kr',
  vi: 'vn',
}

function normalizeLocale(locale) {
  const raw = String(locale || '').trim().toLowerCase()
  if (!raw) return ''
  if (LOCALE_ALIASES[raw]) return LOCALE_ALIASES[raw]
  const base = raw.split(/[-_]/)[0]
  return LOCALE_ALIASES[base] || base
}

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, '')
}

/**
 * Создаёт форматтер под конкретную локаль и источник баффов.
 * @param {{ locale: string, findBuff:(id:number, lv:number)=>any }} cfg
 */
export function createRichTextFormatter(cfg) {
  const state = {
    locale: normalizeLocale(cfg?.locale) || 'en',
    findBuff: cfg?.findBuff || (() => null),
  }

  /** Обновить локаль на лету */
  function setLocale(locale) {
    const next = normalizeLocale(locale)
    state.locale = next || state.locale
  }

  /**
   * Подставляет Upgrade_Value в {i} с сохранением '%' если он присутствует.
   * Всегда делим значения на 100.
   */
  function applyUpgradePlaceholders(text, upVals = []) {
    if (!text) return ''
    return text.replace(/\{(\d+)\}(%?)/g, (_m, idxStr, pct) => {
      const idx = Number(idxStr)
      const v = formatValueDiv100(upVals[idx])
      return pct ? `${v}%` : v
    })
  }

  /** Заменяем спец-теги: <color>, </color>, <buff=id,lv> */
  function replaceSpecialTags(text) {
    if (!text) return ''
    let out = text

    // <color=#...>...</color> и кривые закрывающие теги вида </color=#FFEEAA>
    out = out
      .replace(/<color=#([0-9a-fA-F]{6})>/g, (_m, hex) => `<span style="color:#${hex}">`)
      .replace(/<\/color(?:=#?[0-9a-fA-F]{6})?>/gi, '</span>')

    // <buff=id,lv> → маленькая иконка + имя баффа
    out = out.replace(/<buff=(\d+),(\d+)>/g, (_m, idStr, lvStr) => {
      const id = Number(idStr)
      const lv = Number(lvStr)
      const b = state.findBuff(id, lv)
      if (!b) return `<span class="opacity-70">(Unknown Buff ${id})</span>`

      const loc = state.locale
      const name = b.i18n?.name?.[loc] || b.i18n?.name?.en || b.englishName || `Buff ${id}`
      const descRaw = b.i18n?.desc?.[loc] || b.i18n?.desc?.en || ''
      let descText = applyUpgradePlaceholders(descRaw, b.Upgrade_Value || [])
      descText = descText
        .replace(/<color=#([0-9a-fA-F]{6})>/g, '')
        .replace(/<\/color(?:=#?[0-9a-fA-F]{6})?>/gi, '')
        .replace(/<buff=(\d+),(\d+)>/g, (_mm, bidStr, blvStr) => {
          const bid = Number(bidStr)
          const blv = Number(blvStr)
          const bb = state.findBuff(bid, blv)
          return bb?.i18n?.name?.[loc] || bb?.i18n?.name?.en || bb?.englishName || `Buff ${bid}`
        })
      descText = stripTags(descText).replace(/\s+/g, ' ').trim()
      const tooltipAttr = descText
        ? ` data-tooltip="${escapeAttr(descText)}" aria-label="${escapeAttr(descText)}"`
        : ''
      const iconSrc = `/wiki/Buffs/${b.Icon || 'Icon_Buff_Unknown'}.png`
      return `
        <span class="inline-flex items-center gap-[0.25em] align-baseline not-prose inline-buff-wrap"${tooltipAttr}>
          <img src="${iconSrc}" alt="" class="inline-buff-icon" />
          <span class="inline-block text-[#63B4C8] leading-none">${name}</span>
        </span>
      `
    })

    return out
  }

  /** Полная обработка строки */
  function format(text, upVals = []) {
    return replaceSpecialTags(applyUpgradePlaceholders(text, upVals))
  }

  return { format, setLocale }
}
