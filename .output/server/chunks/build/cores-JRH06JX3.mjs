import { ref, watch, computed, mergeProps, unref, isRef, withCtx, createBlock, createCommentVNode, openBlock, createVNode, withDirectives, vModelText, toDisplayString, Fragment, renderList, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './filter-1-CAGC5e4k.mjs';
import { u as useWikiLabelStore, a as useWikiBuffStore, b as buildJobCardList, c as useWikiListingPage, _ as _sfc_main$3, A as ActiveFiltersBar, d as _imports_1, e as _sfc_main$1$1, W as WikiDetailModal, f as createRichTextFormatter, g as WikiFilterPanelFrame } from './useWikiListingPage-DC9j8nAQ.mjs';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { useRoute, useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { a as fetchWikiCores } from './api-DjRwVJCC.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import 'axios';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _imports_2 = publicAssetsURL("/wiki/Cards/Img_CoreBGFX.png");
const DEFAULT_SORT = { by: "id", dir: "asc" };
const useWikiCoreStore = defineStore("wikiCore", {
  state: () => ({
    items: [],
    count: 0,
    loading: false,
    error: "",
    loadedLocale: "en",
    filters: {
      // поиск теперь по: englishName + i18n.name[locale] + i18n.desc[locale] (case-insensitive)
      search: "",
      rares: (
        /** @type {number[]} */
        []
      ),
      // CoreRare in []
      jobs: (
        /** @type {number[]} */
        []
      ),
      // [1,2,4,8,16]
      labels: (
        /** @type {number[]} */
        []
      ),
      // Tips_Label IDs
      hasBuffId: (
        /** @type {number|null} */
        null
      ),
      uniq: false
      // unique-mode for JobLimit (exact mask)
    },
    sort: { ...DEFAULT_SORT },
    page: 1,
    pageSize: 30,
    rawText: ""
  }),
  getters: {
    facets(state) {
      const rares = /* @__PURE__ */ new Set();
      for (const c of state.items) if (c.CoreRare != null) rares.add(c.CoreRare);
      return { rares: Array.from(rares).sort((a, b) => a - b) };
    },
    makeLocalizers: () => (locale) => ({
      nameOf: (c) => c?.i18n?.name?.[locale] ?? c?.englishName ?? "",
      descOf: (c) => c?.i18n?.desc?.[locale] ?? ""
    }),
    filtered(state) {
      const f = state.filters;
      const s = (f.search || "").trim().toLowerCase();
      const needRares = new Set(f.rares || []);
      const needJobs = new Set(f.jobs || []);
      const needLabels = new Set(f.labels || []);
      const buffId = f.hasBuffId;
      const { nameOf, descOf } = this.makeLocalizers(this.loadedLocale);
      const jobMask = Array.from(needJobs).reduce((mask, bit) => mask | bit, 0);
      return state.items.filter((c) => {
        if (c.CoreLv !== 1) return false;
        if (needRares.size && !needRares.has(c.CoreRare)) return false;
        if (needJobs.size) {
          if (f.uniq) {
            if (c.JobLimit !== jobMask) return false;
          } else {
            if ((c.JobLimit & jobMask) === 0) return false;
          }
        }
        if (needLabels.size) {
          const tl = Array.isArray(c.Tips_Label) ? c.Tips_Label : [];
          const hasAny = tl.some((id) => needLabels.has(id));
          if (!hasAny) return false;
        }
        if (buffId != null) {
          const arr = Array.isArray(c.Buff_Display) ? c.Buff_Display : [];
          if (!arr.some((b) => b?.BuffId === buffId)) return false;
        }
        if (s) {
          const english = (c.englishName || "").toLowerCase();
          const n = String(nameOf(c) || "").toLowerCase();
          const d = String(descOf(c) || "").toLowerCase();
          if (!english.includes(s) && !n.includes(s) && !d.includes(s)) return false;
        }
        return true;
      });
    },
    sorted() {
      const arr = [...this.filtered];
      const { by, dir } = this.sort;
      const mul = dir === "desc" ? -1 : 1;
      const { nameOf } = this.makeLocalizers(this.loadedLocale);
      arr.sort((a, b) => {
        let va, vb;
        switch (by) {
          case "CoreRare":
            va = a.CoreRare;
            vb = b.CoreRare;
            break;
          case "CoreLv":
            va = a.CoreLv;
            vb = b.CoreLv;
            break;
          case "JobLimit":
            va = a.JobLimit;
            vb = b.JobLimit;
            break;
          case "name":
            va = nameOf(a);
            vb = nameOf(b);
            break;
          default:
            va = a.id;
            vb = b.id;
            break;
        }
        if (va == null && vb == null) return 0;
        if (va == null) return -1 * mul;
        if (vb == null) return 1 * mul;
        if (typeof va === "string" && typeof vb === "string") {
          return va.localeCompare(vb) * mul;
        }
        return (va === vb ? 0 : va < vb ? -1 : 1) * mul;
      });
      return arr;
    },
    pageItems() {
      const end = this.page * this.pageSize;
      return this.sorted.slice(0, end);
    },
    filteredTotal() {
      return this.sorted.length;
    },
    hasNextPage() {
      return this.page * this.pageSize < this.filteredTotal;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.sorted.length / this.pageSize));
    }
  },
  actions: {
    async load(locale = "en") {
      if (this.loadedLocale !== locale) {
        this.page = 1;
        this.sort = { ...DEFAULT_SORT };
        this.filters.search = "";
      }
      this.loading = true;
      this.error = "";
      this.rawText = "";
      try {
        const { data } = await fetchWikiCores(locale);
        this.items = Array.isArray(data?.cores) ? data.cores : [];
        this.count = Number(data?.count || this.items.length || 0);
        this.loadedLocale = locale;
        this.rawText = JSON.stringify(data, null, 2);
      } catch (e) {
        this.error = e?.response?.data?.detail || e?.message || "Request failed";
        this.items = [];
        this.count = 0;
      } finally {
        this.loading = false;
      }
    },
    applyFilters(payload = {}) {
      if ("rares" in payload) this.filters.rares = Array.isArray(payload.rares) ? payload.rares : [];
      if ("jobs" in payload) this.filters.jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
      if ("labels" in payload) this.filters.labels = Array.isArray(payload.labels) ? payload.labels : [];
      if ("uniq" in payload) this.filters.uniq = !!payload.uniq;
      if ("search" in payload) this.filters.search = payload.search ?? "";
      if ("hasBuffId" in payload) this.filters.hasBuffId = payload.hasBuffId ?? null;
      this.page = 1;
    },
    nextPage() {
      if (this.hasNextPage) this.page += 1;
    },
    setSearch(v) {
      this.filters.search = v ?? "";
      this.page = 1;
    },
    setRares(arr) {
      this.filters.rares = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setJobs(arr) {
      this.filters.jobs = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setLabels(arr) {
      this.filters.labels = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setUniq(v) {
      this.filters.uniq = !!v;
      this.page = 1;
    },
    setBuffId(idOrNull) {
      const v = idOrNull === null || idOrNull === void 0 || idOrNull === "" ? null : Number(idOrNull);
      this.filters.hasBuffId = Number.isFinite(v) ? v : null;
      this.page = 1;
    },
    setSort(by, dir) {
      this.sort.by = by || this.sort.by;
      this.sort.dir = dir || this.sort.dir;
      this.page = 1;
    },
    setPage(p) {
      this.page = Math.max(1, Number(p || 1));
    },
    setPageSize(ps) {
      this.pageSize = Math.min(200, Math.max(5, Number(ps || 30)));
      this.page = 1;
    },
    resetFilters() {
      this.filters = { search: "", rares: [], jobs: [], labels: [], hasBuffId: null, uniq: false };
      this.page = 1;
    }
  }
});
const _sfc_main$2 = {
  __name: "WikiCoreCard",
  __ssrInlineRender: true,
  props: {
    core: { type: Object, required: true },
    locale: { type: String, default: "en" }
  },
  setup(__props) {
    const props = __props;
    const labelStore = useWikiLabelStore();
    const buffStore = useWikiBuffStore();
    function findBuff(id, lv) {
      const byId = buffStore.byId?.[id];
      if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId;
      const list = Array.isArray(buffStore.items) ? buffStore.items : [];
      return list.find((b) => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null;
    }
    const loc = computed(() => String(props.locale || "en"));
    const formatter = createRichTextFormatter({ locale: loc.value, findBuff });
    watch(loc, (next) => {
      labelStore.load(next);
      buffStore.load(next);
      formatter.setLocale?.(next);
    });
    const nameText = computed(
      () => props.core?.i18n?.name?.[loc.value] || props.core?.englishName || `Core #${props.core?.id}`
    );
    const descHtml = computed(() => {
      const raw = props.core?.i18n?.desc?.[loc.value] || "";
      return formatter.format(raw, props.core?.Upgrade_Value || []);
    });
    const coreIconSrc = computed(() => `/wiki/Cores/${props.core?.Icon}.png`);
    const ALL_JOBS = [1, 2, 4, 8, 16];
    const jobItems = computed(() => {
      const mask = Number(props.core?.JobLimit || 0);
      return ALL_JOBS.map((bit) => ({
        id: bit,
        allowed: (mask & bit) !== 0,
        src: `/wiki/Job/MechClass_${bit}_64.png`
      }));
    });
    const buffs = computed(() => {
      const list = Array.isArray(props.core?.Buff_Display) ? props.core.Buff_Display : [];
      return list.map((pair) => {
        const found = findBuff(pair?.BuffId, pair?.BuffLv);
        const upVals = Array.isArray(found?.Upgrade_Value) && found.Upgrade_Value.length ? found.Upgrade_Value : props.core?.Upgrade_Value || [];
        const nameRaw = found?.i18n?.name?.[loc.value] || found?.englishName || `Buff ${pair?.BuffId}`;
        const descRaw = found?.i18n?.desc?.[loc.value] || "";
        return {
          icon: `/wiki/Buffs/${found?.Icon || "Icon_Buff_Unknown"}.png`,
          nameHtml: formatter.format(nameRaw, upVals),
          descHtml: formatter.format(descRaw, upVals)
        };
      });
    });
    const labels = computed(() => {
      const ids = Array.isArray(props.core?.Tips_Label) ? props.core.Tips_Label : [];
      return ids.map((id) => labelStore.byId?.[id]).filter(Boolean).map((l) => ({
        id: l.ID,
        text: l.i18n?.[loc.value] || l.Name?.text || String(l.ID),
        color: l.LabelImageColor || "5E5E5E"
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "core-card" }, _attrs))} data-v-ed25b18e><div class="hero" data-v-ed25b18e><div class="hero-art" data-v-ed25b18e><img${ssrRenderAttr("src", _imports_1)} alt="" class="hero-bg" aria-hidden="true" draggable="false" data-v-ed25b18e><img${ssrRenderAttr("src", coreIconSrc.value)}${ssrRenderAttr("alt", nameText.value)} class="hero-core" loading="lazy" draggable="false" data-v-ed25b18e><img${ssrRenderAttr("src", _imports_2)} alt="" class="hero-fx" aria-hidden="true" draggable="false" data-v-ed25b18e></div><div class="hero-copy" data-v-ed25b18e><p class="eyebrow" data-v-ed25b18e>Fusion core</p><h2 data-v-ed25b18e>${ssrInterpolate(nameText.value)}</h2></div></div><div class="job-strip" data-v-ed25b18e><!--[-->`);
      ssrRenderList(jobItems.value, (job) => {
        _push(`<div class="${ssrRenderClass([{ "is-off": !job.allowed }, "job-pill"])}" data-v-ed25b18e><img${ssrRenderAttr("src", job.src)} alt="" loading="lazy" data-v-ed25b18e></div>`);
      });
      _push(`<!--]--></div>`);
      if (labels.value.length) {
        _push(`<div class="label-strip" data-v-ed25b18e><!--[-->`);
        ssrRenderList(labels.value, (lab) => {
          _push(`<span class="label-chip" style="${ssrRenderStyle({ borderColor: `#${lab.color}`, backgroundColor: `#${lab.color}22` })}" data-v-ed25b18e>${ssrInterpolate(lab.text)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (descHtml.value) {
        _push(`<section class="section-block" data-v-ed25b18e><h3 class="section-title" data-v-ed25b18e>Overview</h3><div class="richtext text-base leading-relaxed" data-v-ed25b18e>${descHtml.value ?? ""}</div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (buffs.value.length) {
        _push(`<section class="section-block" data-v-ed25b18e><h3 class="section-title" data-v-ed25b18e>Buffs</h3><!--[-->`);
        ssrRenderList(buffs.value, (buff, i) => {
          _push(`<div class="buff-card" data-v-ed25b18e><img${ssrRenderAttr("src", buff.icon)} alt="" loading="lazy" data-v-ed25b18e><div class="buff-copy" data-v-ed25b18e><div class="richtext buff-name" data-v-ed25b18e>${buff.nameHtml ?? ""}</div><div class="richtext buff-desc" data-v-ed25b18e>${buff.descHtml ?? ""}</div></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/CoreCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CoreCard = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ed25b18e"]]);
const _sfc_main$1 = {
  __name: "WikiCoreFilterPanel",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    locale: { type: String, default: "en" },
    rares: { type: Array, default: () => [] },
    jobs: { type: Array, default: () => [] },
    labels: { type: Array, default: () => [] },
    uniq: { type: Boolean, default: false }
  },
  emits: [
    "close",
    "reset",
    "update:rares",
    "update:jobs",
    "update:labels",
    "update:uniq"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const labelStore = useWikiLabelStore();
    const loadLabels = (loc) => labelStore.load(loc);
    watch(() => props.locale, (loc) => loadLabels(loc));
    const RARITY_OPTIONS = [
      { label: "Common", value: 1 },
      { label: "Elite", value: 2 },
      { label: "Epic", value: 4 },
      { label: "Legend", value: 8 },
      { label: "Mythical", value: 16 }
    ];
    const JOB_OPTIONS = [
      { label: "Striker", value: 1 },
      { label: "Keystone", value: 2 },
      { label: "Buster", value: 4 },
      { label: "Bullseye", value: 8 },
      { label: "Apostle", value: 16 }
    ];
    const labelGroups = computed(() => {
      const items = Array.isArray(labelStore.items) ? labelStore.items : [];
      const groups = /* @__PURE__ */ new Map();
      for (const l of items) {
        const cf = (l.CoreFilter || "").trim();
        if (!cf) continue;
        if (!groups.has(cf)) groups.set(cf, []);
        groups.get(cf).push(l);
      }
      const out = [];
      for (const [key, arr] of groups.entries()) {
        const title = key.endsWith("Filter") ? key.slice(0, -6) : key;
        const options = arr.map((l) => ({
          value: l.ID,
          label: l.i18n?.[props.locale] || l.Name?.text || String(l.ID),
          color: l.LabelImageColor || "5E5E5E"
        })).sort((a, b) => a.label.localeCompare(b.label));
        if (options.length) out.push({ key, title, options });
      }
      out.sort((a, b) => a.title.localeCompare(b.title));
      return out;
    });
    const toggleVal = (key, val) => {
      const curr = new Set(
        key === "rares" ? props.rares : key === "jobs" ? props.jobs : key === "labels" ? props.labels : []
      );
      curr.has(val) ? curr.delete(val) : curr.add(val);
      const next = Array.from(curr);
      if (key === "rares") emit("update:rares", next);
      if (key === "jobs") emit("update:jobs", next);
      if (key === "labels") emit("update:labels", next);
    };
    const selectedCount = computed(
      () => (props.rares?.length || 0) + (props.jobs?.length || 0) + (props.labels?.length || 0) + (props.uniq ? 1 : 0)
    );
    function handleReset() {
      emit("update:rares", []);
      emit("update:jobs", []);
      emit("update:labels", []);
      emit("update:uniq", false);
      emit("reset");
    }
    const isChecked = (arr, v) => Array.isArray(arr) && arr.includes(v);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(WikiFilterPanelFrame, mergeProps({
        open: __props.open,
        title: "Core tuning",
        count: selectedCount.value,
        onClose: ($event) => _ctx.$emit("close"),
        onReset: handleReset
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-7 pb-8" data-v-519815ae${_scopeId}><section class="filter-card" data-v-519815ae${_scopeId}><div class="flex items-center justify-between gap-4" data-v-519815ae${_scopeId}><h4 class="sec-title" data-v-519815ae${_scopeId}>Rarity</h4><span class="text-xs text-white/50" data-v-519815ae${_scopeId}>${ssrInterpolate(RARITY_OPTIONS.length)} tiers</span></div><div class="tiles-grid" data-v-519815ae${_scopeId}><!--[-->`);
            ssrRenderList(RARITY_OPTIONS, (opt) => {
              _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.rares, opt.value) }, "tile"])}" data-v-519815ae${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.rares.includes(opt.value)) ? " checked" : ""} data-v-519815ae${_scopeId}><span class="tile-label" data-v-519815ae${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
            });
            _push2(`<!--]--></div></section><section class="filter-card" data-v-519815ae${_scopeId}><div class="flex items-center justify-between gap-4" data-v-519815ae${_scopeId}><h4 class="sec-title" data-v-519815ae${_scopeId}>Jobs</h4><label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs" data-v-519815ae${_scopeId}><input type="checkbox" class="accent-[#63B4C8]"${ssrIncludeBooleanAttr(__props.uniq) ? " checked" : ""} data-v-519815ae${_scopeId}><span class="opacity-80" data-v-519815ae${_scopeId}>Unique only</span></label></div><div class="tiles-grid" data-v-519815ae${_scopeId}><!--[-->`);
            ssrRenderList(JOB_OPTIONS, (opt) => {
              _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.jobs, opt.value) }, "tile"])}" data-v-519815ae${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.jobs.includes(opt.value)) ? " checked" : ""} data-v-519815ae${_scopeId}><span class="tile-label" data-v-519815ae${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
            });
            _push2(`<!--]--></div><p class="mt-3 text-xs leading-relaxed text-white/70" data-v-519815ae${_scopeId}>`);
            if (__props.uniq) {
              _push2(`<!--[--> Shows only cores available to <b data-v-519815ae${_scopeId}>exactly one</b> class or to the <b data-v-519815ae${_scopeId}>combination</b> of the selected classes. <!--]-->`);
            } else {
              _push2(`<!--[--> A core matches if it&#39;s available to <i data-v-519815ae${_scopeId}>any</i> of the selected classes. <!--]-->`);
            }
            _push2(`</p></section><!--[-->`);
            ssrRenderList(labelGroups.value, (grp) => {
              _push2(`<section class="filter-card" data-v-519815ae${_scopeId}><div class="flex items-center justify-between gap-4" data-v-519815ae${_scopeId}><h4 class="sec-title" data-v-519815ae${_scopeId}>${ssrInterpolate(grp.title)}</h4><span class="text-xs text-white/50" data-v-519815ae${_scopeId}>${ssrInterpolate(grp.options.length)} labels</span></div><div class="tiles-grid" data-v-519815ae${_scopeId}><!--[-->`);
              ssrRenderList(grp.options, (opt) => {
                _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.labels, opt.value) }, "tile"])}" style="${ssrRenderStyle({
                  "--tile-accent": `#${opt.color}`
                })}" data-v-519815ae${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.labels.includes(opt.value)) ? " checked" : ""} data-v-519815ae${_scopeId}><span class="tile-label" data-v-519815ae${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
              });
              _push2(`<!--]--></div></section>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-7 pb-8" }, [
                createVNode("section", { class: "filter-card" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("h4", { class: "sec-title" }, "Rarity"),
                    createVNode("span", { class: "text-xs text-white/50" }, toDisplayString(RARITY_OPTIONS.length) + " tiers", 1)
                  ]),
                  createVNode("div", { class: "tiles-grid" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(RARITY_OPTIONS, (opt) => {
                      return createVNode("label", {
                        key: "rares-" + opt.value,
                        class: ["tile", { "is-active": isChecked(__props.rares, opt.value) }]
                      }, [
                        createVNode("input", {
                          type: "checkbox",
                          class: "sr-only",
                          checked: __props.rares.includes(opt.value),
                          onChange: ($event) => toggleVal("rares", opt.value)
                        }, null, 40, ["checked", "onChange"]),
                        createVNode("span", { class: "tile-label" }, toDisplayString(opt.label), 1)
                      ], 2);
                    }), 64))
                  ])
                ]),
                createVNode("section", { class: "filter-card" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("h4", { class: "sec-title" }, "Jobs"),
                    createVNode("label", { class: "inline-flex items-center gap-2 cursor-pointer select-none text-xs" }, [
                      createVNode("input", {
                        type: "checkbox",
                        class: "accent-[#63B4C8]",
                        checked: __props.uniq,
                        onChange: ($event) => _ctx.$emit("update:uniq", $event.target.checked)
                      }, null, 40, ["checked", "onChange"]),
                      createVNode("span", { class: "opacity-80" }, "Unique only")
                    ])
                  ]),
                  createVNode("div", { class: "tiles-grid" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(JOB_OPTIONS, (opt) => {
                      return createVNode("label", {
                        key: "jobs-" + opt.value,
                        class: ["tile", { "is-active": isChecked(__props.jobs, opt.value) }]
                      }, [
                        createVNode("input", {
                          type: "checkbox",
                          class: "sr-only",
                          checked: __props.jobs.includes(opt.value),
                          onChange: ($event) => toggleVal("jobs", opt.value)
                        }, null, 40, ["checked", "onChange"]),
                        createVNode("span", { class: "tile-label" }, toDisplayString(opt.label), 1)
                      ], 2);
                    }), 64))
                  ]),
                  createVNode("p", { class: "mt-3 text-xs leading-relaxed text-white/70" }, [
                    __props.uniq ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" Shows only cores available to "),
                      createVNode("b", null, "exactly one"),
                      createTextVNode(" class or to the "),
                      createVNode("b", null, "combination"),
                      createTextVNode(" of the selected classes. ")
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" A core matches if it's available to "),
                      createVNode("i", null, "any"),
                      createTextVNode(" of the selected classes. ")
                    ], 64))
                  ])
                ]),
                (openBlock(true), createBlock(Fragment, null, renderList(labelGroups.value, (grp) => {
                  return openBlock(), createBlock("section", {
                    key: grp.key,
                    class: "filter-card"
                  }, [
                    createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                      createVNode("h4", { class: "sec-title" }, toDisplayString(grp.title), 1),
                      createVNode("span", { class: "text-xs text-white/50" }, toDisplayString(grp.options.length) + " labels", 1)
                    ]),
                    createVNode("div", { class: "tiles-grid" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(grp.options, (opt) => {
                        return openBlock(), createBlock("label", {
                          key: `label-${grp.key}-${opt.value}`,
                          class: ["tile", { "is-active": isChecked(__props.labels, opt.value) }],
                          style: {
                            "--tile-accent": `#${opt.color}`
                          }
                        }, [
                          createVNode("input", {
                            type: "checkbox",
                            class: "sr-only",
                            checked: __props.labels.includes(opt.value),
                            onChange: ($event) => toggleVal("labels", opt.value)
                          }, null, 40, ["checked", "onChange"]),
                          createVNode("span", { class: "tile-label" }, toDisplayString(opt.label), 1)
                        ], 6);
                      }), 128))
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/WikiCoreFilterPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const WikiCoreFilterPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-519815ae"]]);
const _sfc_main = {
  __name: "cores",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const store = useWikiCoreStore();
    const labelStore = useWikiLabelStore();
    const buffStore = useWikiBuffStore();
    useHead({ title: "Wiki — Cores" });
    const JOBS = buildJobCardList("All Cores");
    const selectedJob = ref(0);
    async function load(targetLocale = locale.value) {
      const lang = targetLocale ?? locale.value;
      await Promise.all([
        store.load(lang),
        labelStore.load(lang),
        buffStore.load(lang)
      ]);
      syncFiltersFromStore();
    }
    const {
      locale,
      search,
      isMobile,
      showFilterPanel,
      modalOpen,
      setFilterPanelOpen,
      setModalOpen
    } = useWikiListingPage({
      initialLocale: route.query.locale ?? "en",
      loadResources: load,
      onSearchChange: () => {
        store.page = 1;
      }
    });
    function buildFilterState(source = {}) {
      return {
        rares: Array.isArray(source.rares) ? [...source.rares] : [],
        jobs: Array.isArray(source.jobs) ? [...source.jobs] : [],
        labels: Array.isArray(source.labels) ? [...source.labels] : [],
        uniq: !!source.uniq
      };
    }
    const filters = ref(buildFilterState());
    let syncingFilters = false;
    function syncFiltersFromStore() {
      syncingFilters = true;
      filters.value = buildFilterState(store.filters || {});
      syncingFilters = false;
    }
    watch(filters, (val) => {
      if (syncingFilters) return;
      store.applyFilters(val);
    }, { deep: true });
    watch(() => filters.value.jobs, (jobs) => {
      const arr = Array.isArray(jobs) ? jobs : [];
      selectedJob.value = arr.length === 1 ? arr[0] : 0;
    });
    const selectedFiltersCount = computed(() => {
      const f = store.filters || {};
      let c = 0;
      if (Array.isArray(f.rares)) c += f.rares.length;
      if (Array.isArray(f.jobs)) c += f.jobs.length;
      if (Array.isArray(f.labels)) c += f.labels.length;
      if (f.uniq) c += 1;
      if (f.hasBuffId != null) c += 1;
      return c;
    });
    const labelMap = computed(() => {
      const map = /* @__PURE__ */ Object.create(null);
      const ids = filters.value?.labels || [];
      for (const id of ids) {
        const l = labelStore.byId?.[id];
        if (!l) continue;
        map[id] = {
          id,
          text: l.i18n?.[locale.value] || l.Name?.text || String(id),
          colorHex: l.LabelImageColor || "5E5E5E"
        };
      }
      return map;
    });
    function handleResetFromPanel() {
      search.value = "";
      store.resetFilters();
      syncFiltersFromStore();
    }
    watch(locale, (val) => {
      router.replace({ query: { ...route.query, locale: val || void 0 } });
    });
    watch(() => route.query.locale, (next) => {
      const normalized = next ?? "en";
      if (normalized !== locale.value) {
        locale.value = normalized;
      }
    });
    const searchTerm = computed(() => String(search.value || "").trim().toLowerCase());
    const normalizeText = (val) => String(val || "").toLowerCase();
    function matchesCoreSearch(core) {
      if (!searchTerm.value) return true;
      const term = searchTerm.value;
      const locKey = String(locale.value || "en");
      const english = normalizeText(core?.englishName);
      const name = normalizeText(core?.i18n?.name?.[locKey]);
      const desc = normalizeText(core?.i18n?.desc?.[locKey]);
      if (english.includes(term) || name.includes(term) || desc.includes(term)) return true;
      const buffEntries = Array.isArray(core?.Buff_Display) ? core.Buff_Display : [];
      for (const entry of buffEntries) {
        const buff = buffStore.byId?.[entry?.BuffId];
        if (!buff) continue;
        const buffName = normalizeText(buff?.i18n?.name?.[locKey] || buff?.englishName);
        const buffDesc = normalizeText(buff?.i18n?.desc?.[locKey]);
        if (buffName.includes(term) || buffDesc.includes(term)) return true;
      }
      return false;
    }
    const filteredCores = computed(() => {
      const base = store.sorted;
      if (!Array.isArray(base)) return [];
      if (!searchTerm.value) return base;
      return base.filter(matchesCoreSearch);
    });
    const items = computed(() => filteredCores.value.slice(0, store.page * store.pageSize));
    function iconSrc(core) {
      return `/wiki/Cores/${core?.Icon}.png`;
    }
    function coreTitle(core) {
      const loc = String(locale.value || "en");
      return core?.i18n?.name?.[loc] || core?.englishName || `ID ${core?.id}`;
    }
    function findByIdLevel(id, lv) {
      return store.items.find((c) => c.id === id && c.CoreLv === lv) || store.items.find((c) => c.id === id) || null;
    }
    const modalLevel = ref(1);
    const selectedId = ref(null);
    const selectedCore = ref(null);
    function closeModal() {
      setModalOpen(false);
      selectedId.value = null;
      selectedCore.value = null;
    }
    watch(modalLevel, (lv) => {
      const v = Math.min(10, Math.max(1, Number(lv || 1)));
      if (v !== lv) modalLevel.value = v;
      if (modalOpen.value && selectedId.value != null) {
        const next = findByIdLevel(selectedId.value, v);
        if (next) selectedCore.value = next;
      }
    });
    const totalMatched = computed(() => filteredCores.value.length);
    const hasNextPage = computed(() => store.page * store.pageSize < filteredCores.value.length);
    const isLoading = computed(() => store.loading);
    function handleLoadMore() {
      if (!hasNextPage.value) return;
      store.nextPage();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4" }, _attrs))} data-v-0dc182ed><header class="space-y-3" data-v-0dc182ed><div class="flex items-center justify-between" data-v-0dc182ed><h1 class="text-2xl font-semibold" data-v-0dc182ed>Wiki - Cores</h1>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        modelValue: unref(locale),
        "onUpdate:modelValue": ($event) => isRef(locale) ? locale.value = $event : null
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isMobile) ? "grid-cols-3" : "grid-cols-6", "grid gap-3"])}" data-v-0dc182ed><!--[-->`);
      ssrRenderList(unref(JOBS), (m) => {
        _push(`<button class="${ssrRenderClass([[unref(isMobile) ? "h-24" : "h-28", selectedJob.value === m.id ? "is-active" : ""], "job-card group"])}"${ssrRenderAttr("title", m.label)} data-v-0dc182ed><img${ssrRenderAttr("src", m.img)} class="absolute inset-0 h-full w-full object-cover opacity-90" alt="" data-v-0dc182ed><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "url('/wiki/Mechs/Img_BigScreenBG.png')", "background-size": "cover", "opacity": ".25" })}" data-v-0dc182ed></div><div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent transition-opacity group-hover:opacity-60" data-v-0dc182ed></div><span class="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/70" data-v-0dc182ed>${ssrInterpolate(m.label)}</span></button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center gap-3" data-v-0dc182ed><div class="order-1 sm:order-1" data-v-0dc182ed><button class="filter-toggle" data-v-0dc182ed><img${ssrRenderAttr("src", _imports_0)} class="w-5 sm:w-6" alt="filter" data-v-0dc182ed> Filters `);
      if (selectedFiltersCount.value) {
        _push(`<span class="text-xs sm:text-sm opacity-70" data-v-0dc182ed>(${ssrInterpolate(selectedFiltersCount.value)})</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div><div class="order-2 sm:order-3 ml-auto text-sm opacity-80 flex items-center gap-2" data-v-0dc182ed><span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" data-v-0dc182ed></span><span data-v-0dc182ed>Items: <span class="font-medium" data-v-0dc182ed>${ssrInterpolate(totalMatched.value)}</span></span></div><div class="order-4 sm:order-2 basis-full sm:basis-auto w-full sm:w-auto sm:flex-1 flex items-center gap-3" data-v-0dc182ed><div class="relative flex-1 min-w-[240px]" data-v-0dc182ed><input${ssrRenderAttr("value", unref(search))} type="text" inputmode="search" placeholder="Search by name or description..." class="search-input" data-v-0dc182ed><svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor" data-v-0dc182ed><path d="M10 4a6 6 0 104.472 10.028l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm-4 6a4 4 0 118 0 4 4 0 01-8 0z" data-v-0dc182ed></path></svg>`);
      if (unref(search)) {
        _push(`<button class="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/15" title="Clear" data-v-0dc182ed><svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="currentColor" data-v-0dc182ed><path d="M6.225 4.811L4.811 6.225 9.586 11l-4.775 4.775 1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z" data-v-0dc182ed></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="ghost-btn shrink-0" data-v-0dc182ed> Reload </button></div></div></header>`);
      _push(ssrRenderComponent(ActiveFiltersBar, {
        locale: unref(locale),
        rares: filters.value.rares,
        jobs: filters.value.jobs,
        labels: filters.value.labels,
        uniq: filters.value.uniq,
        "label-map": labelMap.value,
        "onRemove:rarity": (val) => filters.value.rares = filters.value.rares.filter((v) => v !== val),
        "onRemove:job": (val) => filters.value.jobs = filters.value.jobs.filter((v) => v !== val),
        "onRemove:label": (val) => filters.value.labels = filters.value.labels.filter((v) => v !== val),
        "onUnset:uniq": ($event) => filters.value.uniq = false
      }, null, _parent));
      if (unref(store).loading) {
        _push(`<div class="text-sm opacity-80" data-v-0dc182ed>Loading...</div>`);
      } else if (unref(store).error) {
        _push(`<div class="text-sm text-red-400" data-v-0dc182ed>Error: ${ssrInterpolate(unref(store).error)}</div>`);
      } else {
        _push(`<div data-v-0dc182ed><div class="hidden sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]" data-v-0dc182ed><!--[-->`);
        ssrRenderList(items.value, (core) => {
          _push(`<button class="wiki-card group"${ssrRenderAttr("title", `ID ${core.id} - Lv.${core.CoreLv}`)} data-v-0dc182ed><div class="absolute inset-0 overflow-hidden" data-v-0dc182ed><img${ssrRenderAttr("src", _imports_1)} alt="" class="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none select-none" draggable="false" data-v-0dc182ed><img class="w-full h-full object-contain relative z-10"${ssrRenderAttr("src", iconSrc(core))} alt="" loading="lazy" draggable="false" data-v-0dc182ed><img${ssrRenderAttr("src", _imports_2)} alt="" class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow" aria-hidden="true" draggable="false" data-v-0dc182ed></div><div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] bg-black/40 backdrop-blur-sm" data-v-0dc182ed><div class="flex items-center justify-center text-center" data-v-0dc182ed><span class="opacity-90 text-sm font-medium truncate max-w-[90%]"${ssrRenderAttr("title", coreTitle(core))} data-v-0dc182ed>${ssrInterpolate(coreTitle(core))}</span></div></div></button>`);
        });
        _push(`<!--]--></div><div class="flex flex-col gap-3 sm:hidden" data-v-0dc182ed><!--[-->`);
        ssrRenderList(items.value, (core) => {
          _push(`<button class="wiki-card-mobile" data-v-0dc182ed><div class="mobile-art" data-v-0dc182ed><img${ssrRenderAttr("src", _imports_1)} alt="" class="mobile-bg" aria-hidden="true" draggable="false" data-v-0dc182ed><img${ssrRenderAttr("src", iconSrc(core))} alt="" class="mobile-thumb" loading="lazy" draggable="false" data-v-0dc182ed></div><div class="mobile-copy" data-v-0dc182ed><p class="mobile-title" data-v-0dc182ed>${ssrInterpolate(coreTitle(core))}</p></div></button>`);
        });
        _push(`<!--]--></div>`);
        _push(ssrRenderComponent(_sfc_main$1$1, {
          "is-loading": isLoading.value,
          "has-next-page": hasNextPage.value,
          onLoadMore: handleLoadMore
        }, null, _parent));
        _push(`</div>`);
      }
      _push(ssrRenderComponent(WikiDetailModal, {
        open: unref(modalOpen),
        mobile: unref(isMobile),
        "aria-label": "Core details",
        onClose: closeModal
      }, {
        "header-left": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(modalOpen) && selectedCore.value) {
              _push2(`<div class="level-control level-control--header" data-v-0dc182ed${_scopeId}><span class="level-label" data-v-0dc182ed${_scopeId}>Level</span><input class="level-range" type="range" min="1" max="10" step="1"${ssrRenderAttr("value", modalLevel.value)} aria-label="Core level" data-v-0dc182ed${_scopeId}><span class="level-value" data-v-0dc182ed${_scopeId}>${ssrInterpolate(modalLevel.value)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(modalOpen) && selectedCore.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "level-control level-control--header"
              }, [
                createVNode("span", { class: "level-label" }, "Level"),
                withDirectives(createVNode("input", {
                  class: "level-range",
                  type: "range",
                  min: "1",
                  max: "10",
                  step: "1",
                  "onUpdate:modelValue": ($event) => modalLevel.value = $event,
                  "aria-label": "Core level"
                }, null, 8, ["onUpdate:modelValue"]), [
                  [
                    vModelText,
                    modalLevel.value,
                    void 0,
                    { number: true }
                  ]
                ]),
                createVNode("span", { class: "level-value" }, toDisplayString(modalLevel.value), 1)
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (selectedCore.value) {
              _push2(ssrRenderComponent(CoreCard, {
                core: selectedCore.value,
                locale: unref(locale)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              selectedCore.value ? (openBlock(), createBlock(CoreCard, {
                key: 0,
                core: selectedCore.value,
                locale: unref(locale)
              }, null, 8, ["core", "locale"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(WikiCoreFilterPanel, {
        open: unref(showFilterPanel),
        locale: unref(locale),
        rares: filters.value.rares,
        "onUpdate:rares": ($event) => filters.value.rares = $event,
        jobs: filters.value.jobs,
        "onUpdate:jobs": ($event) => filters.value.jobs = $event,
        labels: filters.value.labels,
        "onUpdate:labels": ($event) => filters.value.labels = $event,
        uniq: filters.value.uniq,
        "onUpdate:uniq": ($event) => filters.value.uniq = $event,
        onClose: () => unref(setFilterPanelOpen)(false),
        onReset: handleResetFromPanel
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wiki/cores.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cores = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0dc182ed"]]);

export { cores as default };
//# sourceMappingURL=cores-JRH06JX3.mjs.map
