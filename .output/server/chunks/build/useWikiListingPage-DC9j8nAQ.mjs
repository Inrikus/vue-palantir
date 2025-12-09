import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { defineStore } from 'pinia';
import { d as fetchWikiLabels, e as fetchWikiBuffs } from './api-DjRwVJCC.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { ref, watch, computed, nextTick, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';

const _imports_1 = publicAssetsURL("/wiki/Mechs/Img_BigScreenBG.png");
const useWikiLabelStore = defineStore("wikiLabels", {
  state: () => ({
    loading: false,
    error: "",
    loadedLocale: "en",
    items: [],
    byId: (
      /** @type {Record<number, WikiLabel>} */
      {}
    )
  }),
  actions: {
    async load(locale = "en") {
      if (this.loading) return;
      if (this.items.length && this.loadedLocale === locale) return;
      this.loading = true;
      this.error = "";
      try {
        const { data } = await fetchWikiLabels(locale);
        const labels = Array.isArray(data?.labels) ? data.labels : [];
        this.items = labels;
        this.byId = Object.fromEntries(labels.map((l) => [l.ID, l]));
        this.loadedLocale = locale;
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || "Labels fetch failed";
        this.items = [];
        this.byId = {};
      } finally {
        this.loading = false;
      }
    }
  }
});
const useWikiBuffStore = defineStore("wikiBuffs", {
  state: () => ({
    loading: false,
    error: "",
    loadedLocale: "en",
    items: [],
    byId: (
      /** @type {Record<number, WikiBuff>} */
      {}
    )
  }),
  actions: {
    async load(locale = "en") {
      if (this.loading) return;
      if (this.items.length && this.loadedLocale === locale) return;
      this.loading = true;
      this.error = "";
      try {
        const { data } = await fetchWikiBuffs(locale);
        const buffs = Array.isArray(data?.buffs) ? data.buffs : [];
        this.items = buffs;
        this.byId = Object.fromEntries(buffs.map((b) => [b.id, b]));
        this.loadedLocale = locale;
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || "Buffs fetch failed";
        this.items = [];
        this.byId = {};
      } finally {
        this.loading = false;
      }
    }
  }
});
function formatValueDiv100(n) {
  if (n == null) return "";
  const v = Number(n) / 100;
  return Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/\.?0+$/, "");
}
function createRichTextFormatter(cfg) {
  const state = {
    locale: cfg?.locale || "en",
    findBuff: cfg?.findBuff || (() => null)
  };
  function setLocale(locale) {
    state.locale = locale || state.locale;
  }
  function applyUpgradePlaceholders(text, upVals = []) {
    if (!text) return "";
    return text.replace(/\{(\d+)\}(%?)/g, (_m, idxStr, pct) => {
      const idx = Number(idxStr);
      const v = formatValueDiv100(upVals[idx]);
      return pct ? `${v}%` : v;
    });
  }
  function replaceSpecialTags(text) {
    if (!text) return "";
    let out = text;
    out = out.replace(/<color=#([0-9a-fA-F]{6})>/g, (_m, hex) => `<span style="color:#${hex}">`).replace(/<\/color(?:=#?[0-9a-fA-F]{6})?>/gi, "</span>");
    out = out.replace(/<buff=(\d+),(\d+)>/g, (_m, idStr, lvStr) => {
      const id = Number(idStr);
      const lv = Number(lvStr);
      const b = state.findBuff(id, lv);
      if (!b) return `<span class="opacity-70">(Unknown Buff ${id})</span>`;
      const name = b.i18n?.name?.[state.locale] || b.englishName || `Buff ${id}`;
      const iconSrc = `/wiki/Buffs/${b.Icon || "Icon_Buff_Unknown"}.png`;
      return `
        <span class="inline-flex items-center gap-[0.25em] align-baseline not-prose inline-buff-wrap">
          <img src="${iconSrc}" alt="" class="inline-buff-icon" />
          <span class="inline-block text-[#63B4C8] leading-none">${name}</span>
        </span>
      `;
    });
    return out;
  }
  function format(text, upVals = []) {
    return replaceSpecialTags(applyUpgradePlaceholders(text, upVals));
  }
  return { format, setLocale };
}
const _sfc_main$4 = {
  __name: "WikiFilterPanelFrame",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: "Filters" },
    count: { type: [Number, String], default: null }
  },
  emits: ["close", "reset"],
  setup(__props) {
    const props = __props;
    const isMobile = computed(
      () => false
    );
    function toggleScrollLock(locked) {
      if (!isMobile.value) return;
      const html = (void 0).documentElement;
      const body = (void 0).body;
      html.classList.toggle("hidden-scroll", !!locked);
      body.classList.toggle("hidden-scroll", !!locked);
    }
    watch(() => props.open, (val) => {
      toggleScrollLock(val);
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="filter-overlay" data-v-155b6cdb></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (__props.open) {
          _push2(`<aside class="${ssrRenderClass([[
            "fixed z-[1001] overflow-hidden text-white",
            "sm:inset-y-0 sm:left-0 sm:w-[740px] sm:max-w-[92vw]",
            "inset-x-0 bottom-0 top-0 sm:inset-auto"
          ], "filter-shell glass-surface glass-surface--radial"])}" role="dialog" aria-modal="true" data-v-155b6cdb><header class="panel-header" data-v-155b6cdb><div class="panel-headings" data-v-155b6cdb><p class="panel-eyebrow" data-v-155b6cdb>Filters</p><h3 class="panel-title" data-v-155b6cdb>${ssrInterpolate(__props.title)} `);
          if (__props.count !== null) {
            _push2(`<span class="panel-count" data-v-155b6cdb>(${ssrInterpolate(__props.count)})</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</h3></div><div class="panel-actions" data-v-155b6cdb><button class="ghost-btn" type="button" data-v-155b6cdb> Reset </button><button class="ghost-btn" type="button" data-v-155b6cdb> Close </button></div></header><div class="panel-body" data-v-155b6cdb>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></aside>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/WikiFilterPanelFrame.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const WikiFilterPanelFrame = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-155b6cdb"]]), { __name: "WikiFilterPanelFrame" });
const _sfc_main$3 = {
  __name: "WikiLocalePicker",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "en" },
    options: { type: Array, default: void 0 },
    // если не задано — берём INTERNAL_LOCALES
    useTeleport: { type: Boolean, default: true },
    placementOffset: { type: Number, default: 8 }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const INTERNAL_LOCALES = [
      { value: "en", native: "English", flag: "/flags/Icon_Flag_English.png" },
      { value: "ru", native: "Русский", flag: "/flags/Icon_Flag_Russia.png" },
      { value: "ch", native: "中文", flag: "/flags/Icon_Flag_Chinese.png" },
      { value: "jp", native: "日本語", flag: "/flags/Icon_Flag_Japanese.png" },
      { value: "kr", native: "한국어", flag: "/flags/Icon_Flag_Korean.png" },
      { value: "vn", native: "Tiếng Việt", flag: "/flags/Icon_Flag_Vietnamese.png" },
      { value: "id", native: "Bahasa Indonesia", flag: "/flags/Icon_Flag_Indonesian.png" },
      { value: "tr", native: "Türkçe", flag: "/flags/Icon_Flag_Turkish.png" }
    ];
    const props = __props;
    const open = ref(false);
    const btnRef = ref(null);
    const allOptions = computed(() => props.options?.length ? props.options : INTERNAL_LOCALES);
    const current = computed(
      () => allOptions.value.find((o) => o.value === props.modelValue) || allOptions.value[0] || { native: props.modelValue, flag: "" }
    );
    const menuStyle = ref({ top: "0px", left: "0px", minWidth: "14rem" });
    function placeMenu() {
      if (!btnRef.value) return;
      const rect = btnRef.value.getBoundingClientRect();
      const vw = (void 0).documentElement.clientWidth;
      const desiredLeft = rect.left;
      const desiredTop = rect.bottom + props.placementOffset;
      const menuWidth = 224;
      let left = desiredLeft;
      if (left + menuWidth > vw - 8) left = Math.max(8, vw - menuWidth - 8);
      menuStyle.value = {
        position: "fixed",
        top: `${Math.round(desiredTop)}px`,
        left: `${Math.round(left)}px`,
        minWidth: `${menuWidth}px`,
        zIndex: 1e3
      };
    }
    watch(open, async (v) => {
      if (v) {
        await nextTick();
        placeMenu();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative inline-block" }, _attrs))}><button class="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 ring-1 ring-white/10 hover:ring-white/20 bg-neutral-900/50" aria-haspopup="listbox"${ssrRenderAttr("aria-expanded", open.value ? "true" : "false")}>`);
      if (current.value.flag) {
        _push(`<img${ssrRenderAttr("src", current.value.flag)}${ssrRenderAttr("alt", current.value.native)} class="w-5 h-5 rounded-sm object-contain">`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-sm font-medium">${ssrInterpolate(current.value.native)}</span><svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"></path></svg></button>`);
      if (__props.useTeleport) {
        ssrRenderTeleport(_push, (_push2) => {
          _push2(`<div id="locale-menu" class="rounded-md bg-[#232228] ring-1 ring-white/10 shadow-lg overflow-hidden" style="${ssrRenderStyle([
            menuStyle.value,
            open.value ? null : { display: "none" }
          ])}" role="listbox"><!--[-->`);
          ssrRenderList(allOptions.value, (opt) => {
            _push2(`<button class="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5" role="option"${ssrRenderAttr("aria-selected", opt.value === __props.modelValue)}><div class="flex items-center gap-2">`);
            if (opt.flag) {
              _push2(`<img${ssrRenderAttr("src", opt.flag)}${ssrRenderAttr("alt", opt.native)} class="w-5 h-5 rounded-sm object-contain">`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="text-sm">${ssrInterpolate(opt.native)}</span></div><span class="text-xs opacity-70 uppercase">${ssrInterpolate(opt.value)}</span></button>`);
          });
          _push2(`<!--]--></div>`);
        }, "body", false, _parent);
      } else {
        _push(`<div id="locale-menu" class="absolute z-40 mt-2 w-56 rounded-md bg-[#232228] ring-1 ring-white/10 shadow-lg overflow-hidden" role="listbox" style="${ssrRenderStyle(open.value ? null : { display: "none" })}"><!--[-->`);
        ssrRenderList(allOptions.value, (opt) => {
          _push(`<button class="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5" role="option"${ssrRenderAttr("aria-selected", opt.value === __props.modelValue)}><div class="flex items-center gap-2">`);
          if (opt.flag) {
            _push(`<img${ssrRenderAttr("src", opt.flag)}${ssrRenderAttr("alt", opt.native)} class="w-5 h-5 rounded-sm object-contain">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="text-sm">${ssrInterpolate(opt.native)}</span></div><span class="text-xs opacity-70 uppercase">${ssrInterpolate(opt.value)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/LocalePicker.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const RARITY_NAME = { 1: "Common", 2: "Elite", 4: "Epic", 8: "Legend", 16: "Mythical" };
const JOB_NAME = { 1: "Striker", 2: "Keystone", 4: "Buster", 8: "Bullseye", 16: "Apostle" };
const POSITION_NAME = {
  64: "Body (T)",
  128: "Bag L",
  256: "Bag R",
  512: "Arm L",
  1024: "Arm R",
  2048: "Shoulder L",
  4096: "Shoulder R"
};
const CHIP_COLORS = {
  rarity: "#7aa7ff",
  job: "#63B4C8",
  position: "#f97316",
  uniq: "#eab308"
};
const JOB_CARD_BASE = [
  { id: 1, img: "/wiki/Mechs/Img_Pic_1.png", label: "Striker" },
  { id: 2, img: "/wiki/Mechs/Img_Pic_2.png", label: "Keystone" },
  { id: 4, img: "/wiki/Mechs/Img_Pic_4.png", label: "Buster" },
  { id: 8, img: "/wiki/Mechs/Img_Pic_8.png", label: "Bullseye" },
  { id: 16, img: "/wiki/Mechs/Img_Pic_16.png", label: "Apostle" }
];
function buildJobCardList(allLabel = "All") {
  const head = { id: 0, img: "/wiki/Mechs/Img_Pic_0.png", label: allLabel };
  return [head, ...JOB_CARD_BASE.map((item) => ({ ...item }))];
}
const _sfc_main$2 = {
  __name: "WikiActiveFiltersBar",
  __ssrInlineRender: true,
  props: {
    locale: { type: String, default: "en" },
    rares: { type: Array, default: () => [] },
    jobs: { type: Array, default: () => [] },
    labels: { type: Array, default: () => [] },
    positions: { type: Array, default: () => [] },
    positionsUniq: { type: Boolean, default: false },
    uniq: { type: Boolean, default: false },
    labelMap: { type: Object, default: () => ({}) }
  },
  emits: [
    "remove:rarity",
    "remove:job",
    "remove:label",
    "remove:position",
    "unset:uniq",
    "unset:positions-uniq"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const chips = computed(() => {
      const list = [];
      for (const r of props.rares) {
        list.push({ kind: "rarity", value: r, label: RARITY_NAME[r] || `Rarity ${r}`, color: CHIP_COLORS.rarity });
      }
      for (const j of props.jobs) {
        list.push({ kind: "job", value: j, label: JOB_NAME[j] || `Job ${j}`, color: CHIP_COLORS.job });
      }
      if (props.uniq) {
        list.push({ kind: "uniq", value: true, label: "Unique only", color: CHIP_COLORS.uniq });
      }
      for (const pos of props.positions) {
        const label = POSITION_NAME[pos] || `Slot ${pos}`;
        list.push({ kind: "position", value: pos, label, color: CHIP_COLORS.position });
      }
      if (props.positionsUniq) {
        list.push({ kind: "positions-uniq", value: true, label: "Exact slots", color: CHIP_COLORS.position });
      }
      for (const id of props.labels) {
        const l = props.labelMap[id];
        if (l) list.push({ kind: "label", value: id, label: l.text, color: `#${l.colorHex || "5E5E5E"}` });
      }
      return list;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-2" }, _attrs))} data-v-588683bf>`);
      if (chips.value.length) {
        _push(`<div class="flex flex-wrap items-center gap-2" data-v-588683bf><!--[-->`);
        ssrRenderList(chips.value, (chip, i) => {
          _push(`<button class="chip group" style="${ssrRenderStyle({ "--chip": chip.color })}" title="Remove filter" data-v-588683bf><span class="chip-dot" aria-hidden="true" data-v-588683bf></span><span class="chip-label" data-v-588683bf>${ssrInterpolate(chip.label)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/ActiveFiltersBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ActiveFiltersBar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-588683bf"]]);
const _sfc_main$1 = {
  __name: "WikiInfinitePager",
  __ssrInlineRender: true,
  props: {
    isLoading: { type: Boolean, default: false },
    hasNextPage: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** необязательно: CSS-селектор корневого скролл-контейнера; по умолчанию окно */
    rootSelector: { type: String, default: "" },
    /** включить запасной режим на scroll/resize (рекомендуется для десктопа/ультрашироких) */
    useScrollFallback: { type: Boolean, default: true },
    /** «зона подгрузки» в px от нижнего края контента для fallback */
    fallbackOffset: { type: Number, default: 800 },
    /** настройки IO */
    rootMargin: { type: String, default: "800px 0px 600px 0px" },
    threshold: { type: Number, default: 0.01 }
  },
  emits: ["load-more"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const sentinel = ref(null);
    let observer = null;
    let rootEl = null;
    function canLoad() {
      return props.hasNextPage && !props.isLoading && !props.disabled;
    }
    function createObserver() {
      if (!sentinel.value) return;
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && canLoad()) {
            emit("load-more");
          }
        },
        {
          root: rootEl instanceof Element ? rootEl : null,
          rootMargin: props.rootMargin,
          threshold: props.threshold
        }
      );
      observer.observe(sentinel.value);
    }
    let rafId = 0;
    let lastFiredAt = 0;
    function nearBottom() {
      const scrollTop = rootEl instanceof Element ? rootEl.scrollTop : (void 0).scrollY || (void 0).pageYOffset;
      const viewportH = rootEl instanceof Element ? rootEl.clientHeight : (void 0).innerHeight;
      const scrollHeight = rootEl instanceof Element ? rootEl.scrollHeight : Math.max(
        (void 0).body.scrollHeight,
        (void 0).documentElement.scrollHeight
      );
      return scrollTop + viewportH + props.fallbackOffset >= scrollHeight;
    }
    function onScrollOrResize() {
      if (!props.useScrollFallback) return;
      if (!canLoad()) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (nearBottom()) {
          const now = performance.now();
          if (now - lastFiredAt > 300) {
            lastFiredAt = now;
            emit("load-more");
          }
        }
      });
    }
    function addFallbackListeners() {
      if (!props.useScrollFallback) return;
      const target = rootEl instanceof Element ? rootEl : void 0;
      target.addEventListener("scroll", onScrollOrResize, { passive: true });
      (void 0).addEventListener("resize", onScrollOrResize, { passive: true });
    }
    function removeFallbackListeners() {
      const target = rootEl instanceof Element ? rootEl : void 0;
      target.removeEventListener("scroll", onScrollOrResize);
      (void 0).removeEventListener("resize", onScrollOrResize);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
    watch(
      () => [props.isLoading, props.hasNextPage, props.disabled, props.rootSelector, props.rootMargin, props.threshold],
      () => {
        const nextRoot = props.rootSelector ? (void 0).querySelector(props.rootSelector) : null;
        if (nextRoot !== rootEl) {
          removeFallbackListeners();
          rootEl = nextRoot;
          addFallbackListeners();
        }
        createObserver();
        onScrollOrResize();
      },
      { flush: "post" }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center items-center py-6" }, _attrs))}><div class="w-px h-px opacity-0"></div>`);
      if (__props.hasNextPage && !__props.isLoading) {
        _push(`<button class="text-sm px-4 py-2 ring-1 ring-white/10 hover:ring-white/20 rounded-md bg-neutral-800/40"> Load more </button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.isLoading) {
        _push(`<div class="text-xs opacity-70 animate-pulse"> Loading... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/InfinitePager.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "WikiDetailModal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    ariaLabel: { type: String, default: "Detail modal" }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.open) {
          _push2(`<div class="modal-root" data-v-45d307ed><div class="modal-overlay" data-v-45d307ed></div><template><div class="${ssrRenderClass([{ "modal-panel--mobile": __props.mobile }, "modal-panel"])}" role="dialog" aria-modal="true"${ssrRenderAttr("aria-label", __props.ariaLabel)} data-v-45d307ed><div class="${ssrRenderClass([{ "modal-header--mobile": __props.mobile }, "modal-header"])}" data-v-45d307ed><div class="header-left" data-v-45d307ed>`);
          ssrRenderSlot(_ctx.$slots, "header-left", {}, null, _push2, _parent);
          _push2(`</div><button class="modal-close" type="button" data-v-45d307ed> Close </button></div><div class="modal-body" data-v-45d307ed>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div></div></template></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/WikiDetailModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const WikiDetailModal = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-45d307ed"]]);
function useWikiListingPage(options = {}) {
  const {
    initialLocale = "en",
    loadResources,
    onSearchChange,
    mobileQuery = "(max-width: 640px)"
  } = options;
  const locale = ref(initialLocale);
  const search = ref("");
  const isMobile = ref(false);
  const showFilterPanel = ref(false);
  const modalOpen = ref(false);
  const updateIsMobile = () => {
    {
      isMobile.value = false;
      return;
    }
  };
  const toggleFilterPanel = () => {
    showFilterPanel.value = !showFilterPanel.value;
  };
  const setFilterPanelOpen = (val) => {
    showFilterPanel.value = !!val;
  };
  const setModalOpen = (val) => {
    modalOpen.value = !!val;
  };
  const runLoad = (targetLocale) => {
    if (typeof loadResources !== "function") return null;
    return Promise.resolve(loadResources(targetLocale ?? locale.value));
  };
  const invokeLoad = (targetLocale) => {
    const maybe = runLoad(targetLocale);
    if (maybe && typeof maybe.then === "function") {
      maybe.catch(() => {
      });
    }
  };
  watch(locale, (next) => {
    invokeLoad(next);
  });
  watch(search, (val) => {
    if (typeof onSearchChange === "function") {
      onSearchChange(val ?? "");
    }
  });
  watch(modalOpen, (locked) => {
  });
  return {
    locale,
    search,
    isMobile,
    showFilterPanel,
    modalOpen,
    toggleFilterPanel,
    setFilterPanelOpen,
    setModalOpen,
    setSearch: (val) => {
      search.value = val;
    },
    setLocale: (val) => {
      locale.value = val;
    },
    updateIsMobile
  };
}

export { ActiveFiltersBar as A, WikiDetailModal as W, _sfc_main$3 as _, useWikiBuffStore as a, buildJobCardList as b, useWikiListingPage as c, _imports_1 as d, _sfc_main$1 as e, createRichTextFormatter as f, WikiFilterPanelFrame as g, useWikiLabelStore as u };
//# sourceMappingURL=useWikiListingPage-DC9j8nAQ.mjs.map
