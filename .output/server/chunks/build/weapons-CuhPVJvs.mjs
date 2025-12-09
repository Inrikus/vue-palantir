import { ref, computed, watch, mergeProps, unref, isRef, withCtx, createBlock, createCommentVNode, openBlock, createVNode, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './filter-1-CAGC5e4k.mjs';
import { u as useWikiLabelStore, c as useWikiListingPage, b as buildJobCardList, _ as _sfc_main$3, A as ActiveFiltersBar, d as _imports_1, e as _sfc_main$1$1, W as WikiDetailModal, a as useWikiBuffStore, f as createRichTextFormatter, g as WikiFilterPanelFrame } from './useWikiListingPage-DC9j8nAQ.mjs';
import { defineStore } from 'pinia';
import { b as fetchWikiWeapons, c as fetchWikiSkills } from './api-DjRwVJCC.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import 'better-sqlite3';
import 'axios';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const DEFAULT_SORT$1 = { by: "id", dir: "asc" };
const useWikiWeaponStore = defineStore("wikiWeapon", {
  state: () => ({
    items: [],
    count: 0,
    loading: false,
    error: "",
    loadedLocale: "en",
    /** Фильтры под оружие */
    filters: {
      search: "",
      // englishName (case-insensitive)
      jobs: (
        /** @type {number[]} */
        []
      ),
      // [1,2,4,8,16]
      uniq: false,
      // exact-маска JobLimit
      types: (
        /** @type {number[]} */
        []
      ),
      // WeaponType in []
      positions: (
        /** @type {number[]} */
        []
      ),
      // PositionLimit — битовые флаги; матч по (mask & any) != 0
      positionsUniq: false,
      // exact match for slot mask
      labels: (
        /** @type {number[]} */
        []
      ),
      // Tips_Label IDs
      hasSkillId: (
        /** @type {number|null} */
        null
      )
      // искать по skills/CommonSkill
    },
    sort: { ...DEFAULT_SORT$1 },
    page: 1,
    pageSize: 30,
    rawText: ""
  }),
  getters: {
    /** Фасеты (например, список типов) */
    facets(state) {
      const types = /* @__PURE__ */ new Set();
      const labelIds = /* @__PURE__ */ new Set();
      for (const w of state.items) {
        if (w?.WeaponType != null) types.add(w.WeaponType);
        const tips = Array.isArray(w?.Tips_Label) ? w.Tips_Label : [];
        for (const id of tips) {
          const n = Number(id);
          if (Number.isFinite(n)) labelIds.add(n);
        }
      }
      return {
        types: Array.from(types).sort((a, b) => a - b),
        labels: Array.from(labelIds).sort((a, b) => a - b)
      };
    },
    /** Функции локализации для текущей локали */
    makeLocalizers: () => (locale) => ({
      nameOf: (w) => w?.i18n?.name?.[locale] ?? w?.englishName ?? "",
      descOf: (w) => w?.i18n?.desc?.[locale] ?? w?.desc ?? "",
      locationOf: (w) => w?.i18n?.location?.[locale] ?? ""
    }),
    /** Фильтрация */
    filtered(state) {
      const f = state.filters;
      const s = (f.search || "").trim().toLowerCase();
      const needJobs = new Set(f.jobs || []);
      const jobMask = Array.from(needJobs).reduce((m, bit) => m | bit, 0);
      const needTypes = new Set(f.types || []);
      const needPosFlags = new Set(f.positions || []);
      const needLabels = new Set(f.labels || []);
      const skillId = f.hasSkillId;
      const { nameOf, descOf } = this.makeLocalizers(state.loadedLocale);
      return state.items.filter((w) => {
        if (needJobs.size) {
          if (f.uniq) {
            if (w.JobLimit !== jobMask) return false;
          } else {
            if ((Number(w.JobLimit || 0) & jobMask) === 0) return false;
          }
        }
        if (needTypes.size && !needTypes.has(w.WeaponType)) return false;
        if (needPosFlags.size) {
          const posMask = Number(w.PositionLimit || 0);
          const anyMatch = Array.from(needPosFlags).some((flag) => (posMask & flag) !== 0);
          if (!anyMatch) return false;
          if (f.positionsUniq) {
            const reqMask = Array.from(needPosFlags).reduce((m, bit) => m | bit, 0);
            if (posMask !== reqMask) return false;
          }
        }
        if (needLabels.size) {
          const arr = Array.isArray(w.Tips_Label) ? w.Tips_Label : [];
          const any = arr.some((id) => needLabels.has(Number(id)));
          if (!any) return false;
        }
        if (skillId != null) {
          const list = Array.isArray(w.skills) ? w.skills : [];
          const common = Array.isArray(w.CommonSkill) ? w.CommonSkill : [];
          const cId = Array.isArray(common) && common.length ? Number(common[0]) : null;
          const found = list.includes(Number(skillId)) || cId === Number(skillId);
          if (!found) return false;
        }
        if (s) {
          const name = (nameOf(w) || "").toLowerCase();
          const desc = (descOf(w) || "").toLowerCase();
          const eng = (w.englishName || "").toLowerCase();
          if (!(name.includes(s) || desc.includes(s) || eng.includes(s))) return false;
        }
        return true;
      });
    },
    /** Сортировка */
    sorted() {
      const arr = [...this.filtered];
      const { by, dir } = this.sort;
      const mul = dir === "desc" ? -1 : 1;
      const { nameOf } = this.makeLocalizers(this.loadedLocale);
      arr.sort((a, b) => {
        let va, vb;
        switch (by) {
          case "WeaponType":
            va = a.WeaponType;
            vb = b.WeaponType;
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
    /** Постраничка — как в ядрах */
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
    /** Загрузка списка оружия по локали */
    async load(locale = "en") {
      if (this.loadedLocale !== locale) {
        this.page = 1;
        this.sort = { ...DEFAULT_SORT$1 };
        this.filters.search = "";
      }
      this.loading = true;
      this.error = "";
      this.rawText = "";
      try {
        const { data } = await fetchWikiWeapons(locale);
        this.items = Array.isArray(data?.weapons) ? data.weapons : [];
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
    /** Применение фильтров (частичное обновление, как в core-сторе) */
    applyFilters(payload = {}) {
      if ("jobs" in payload) this.filters.jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
      if ("uniq" in payload) this.filters.uniq = !!payload.uniq;
      if ("types" in payload) this.filters.types = Array.isArray(payload.types) ? payload.types : [];
      if ("positions" in payload) this.filters.positions = Array.isArray(payload.positions) ? payload.positions : [];
      if ("positionsUniq" in payload) this.filters.positionsUniq = !!payload.positionsUniq;
      if ("labels" in payload) this.filters.labels = Array.isArray(payload.labels) ? payload.labels : [];
      if ("search" in payload) this.filters.search = payload.search ?? "";
      if ("hasSkillId" in payload) {
        const v = payload.hasSkillId;
        this.filters.hasSkillId = v === null || v === void 0 || v === "" ? null : Number(v);
      }
      this.page = 1;
    },
    /** Хелперы — то же API, что и в wikiCoreStore */
    nextPage() {
      if (this.hasNextPage) this.page += 1;
    },
    setSearch(v) {
      this.filters.search = v ?? "";
      this.page = 1;
    },
    setJobs(arr) {
      this.filters.jobs = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setUniq(v) {
      this.filters.uniq = !!v;
      this.page = 1;
    },
    setTypes(arr) {
      this.filters.types = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setLabels(arr) {
      this.filters.labels = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setPositions(arr) {
      this.filters.positions = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setPositionsUniq(v) {
      this.filters.positionsUniq = !!v;
      this.page = 1;
    },
    setSkillId(id) {
      const v = id === null || id === void 0 || id === "" ? null : Number(id);
      this.filters.hasSkillId = Number.isFinite(v) ? v : null;
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
      this.filters = { search: "", jobs: [], uniq: false, types: [], positions: [], positionsUniq: false, labels: [], hasSkillId: null };
      this.page = 1;
    }
  }
});
const _sfc_main$2 = {
  __name: "WikiWeaponFilterPanel",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    locale: { type: String, default: "en" },
    jobs: { type: Array, default: () => [] },
    labels: { type: Array, default: () => [] },
    positions: { type: Array, default: () => [] },
    positionsUniq: { type: Boolean, default: false },
    uniq: { type: Boolean, default: false }
  },
  emits: [
    "close",
    "reset",
    "update:jobs",
    "update:labels",
    "update:positions",
    "update:positions-uniq",
    "update:uniq"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const labelStore = useWikiLabelStore();
    const weaponStore = useWikiWeaponStore();
    const loadLabels = (loc) => labelStore.load(loc);
    watch(() => props.locale, (loc) => loadLabels(loc));
    const JOB_OPTIONS = [
      { label: "Striker", value: 1 },
      { label: "Keystone", value: 2 },
      { label: "Buster", value: 4 },
      { label: "Bullseye", value: 8 },
      { label: "Apostle", value: 16 }
    ];
    const WEAPON_OPTIONS = [
      { label: "Body", value: 64 },
      { label: "Bag L", value: 128 },
      { label: "Bag R", value: 256 },
      { label: "Arm L", value: 512 },
      { label: "Arm R", value: 1024 },
      { label: "Shoulder L", value: 2048 },
      { label: "Shoulder R", value: 4096 }
    ];
    const tipsLabelIds = computed(() => weaponStore.facets?.labels || []);
    const skillLabelOptions = computed(() => {
      const ids = Array.isArray(tipsLabelIds.value) ? tipsLabelIds.value : [];
      if (!ids.length) return [];
      const out = [];
      const byId = labelStore.byId || {};
      const loc = props.locale;
      for (const id of ids) {
        const l = byId[id];
        if (!l) continue;
        out.push({
          value: l.ID,
          label: l.i18n?.[loc] || l.Name?.text || String(l.ID),
          color: l.LabelImageColor || "5E5E5E"
        });
      }
      out.sort((a, b) => a.label.localeCompare(b.label));
      return out;
    });
    const toggleVal = (key, val) => {
      const curr = new Set(
        key === "jobs" ? props.jobs : key === "labels" ? props.labels : key === "positions" ? props.positions : []
      );
      curr.has(val) ? curr.delete(val) : curr.add(val);
      const next = Array.from(curr);
      if (key === "jobs") emit("update:jobs", next);
      if (key === "labels") emit("update:labels", next);
      if (key === "positions") emit("update:positions", next);
    };
    const selectedCount = computed(
      () => (props.jobs?.length || 0) + (props.labels?.length || 0) + (props.positions?.length || 0) + (props.positionsUniq ? 1 : 0) + (props.uniq ? 1 : 0)
    );
    function handleReset() {
      emit("update:jobs", []);
      emit("update:labels", []);
      emit("update:positions", []);
      emit("update:positions-uniq", false);
      emit("update:uniq", false);
      emit("reset");
    }
    const isChecked = (arr, v) => Array.isArray(arr) && arr.includes(v);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(WikiFilterPanelFrame, mergeProps({
        open: __props.open,
        title: "Weapons scope",
        count: selectedCount.value,
        onClose: ($event) => _ctx.$emit("close"),
        onReset: handleReset
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-7 pb-8" data-v-c557cfe4${_scopeId}><section class="filter-card" data-v-c557cfe4${_scopeId}><div class="flex items-center justify-between gap-4" data-v-c557cfe4${_scopeId}><h4 class="sec-title" data-v-c557cfe4${_scopeId}>Jobs</h4><label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs" data-v-c557cfe4${_scopeId}><input type="checkbox" class="accent-[#63B4C8]"${ssrIncludeBooleanAttr(__props.uniq) ? " checked" : ""} data-v-c557cfe4${_scopeId}><span class="opacity-80" data-v-c557cfe4${_scopeId}>Unique only</span></label></div><div class="tiles-grid" data-v-c557cfe4${_scopeId}><!--[-->`);
            ssrRenderList(JOB_OPTIONS, (opt) => {
              _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.jobs, opt.value) }, "tile"])}" data-v-c557cfe4${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.jobs.includes(opt.value)) ? " checked" : ""} data-v-c557cfe4${_scopeId}><span class="tile-label" data-v-c557cfe4${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
            });
            _push2(`<!--]--></div><p class="mt-3 text-xs leading-relaxed text-white/70" data-v-c557cfe4${_scopeId}>`);
            if (__props.uniq) {
              _push2(`<!--[--> Shows only weapons available to <b data-v-c557cfe4${_scopeId}>exactly one</b> class or the <b data-v-c557cfe4${_scopeId}>combination</b> of the selected classes. <!--]-->`);
            } else {
              _push2(`<!--[--> A weapon matches if it&#39;s available to <i data-v-c557cfe4${_scopeId}>any</i> of the selected classes. <!--]-->`);
            }
            _push2(`</p></section>`);
            if (skillLabelOptions.value.length) {
              _push2(`<section class="filter-card" data-v-c557cfe4${_scopeId}><div class="flex items-center justify-between gap-4" data-v-c557cfe4${_scopeId}><h4 class="sec-title" data-v-c557cfe4${_scopeId}>Labels</h4><span class="text-xs text-white/50" data-v-c557cfe4${_scopeId}>${ssrInterpolate(skillLabelOptions.value.length)} tags</span></div><div class="tiles-grid" data-v-c557cfe4${_scopeId}><!--[-->`);
              ssrRenderList(skillLabelOptions.value, (opt) => {
                _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.labels, opt.value) }, "tile"])}" style="${ssrRenderStyle({ "--tile-accent": `#${opt.color}` })}" data-v-c557cfe4${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.labels.includes(opt.value)) ? " checked" : ""} data-v-c557cfe4${_scopeId}><span class="tile-label" data-v-c557cfe4${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section class="filter-card" data-v-c557cfe4${_scopeId}><div class="flex items-center justify-between gap-4" data-v-c557cfe4${_scopeId}><h4 class="sec-title" data-v-c557cfe4${_scopeId}>Weapon Slots</h4><label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs" data-v-c557cfe4${_scopeId}><input type="checkbox" class="accent-[#63B4C8]"${ssrIncludeBooleanAttr(__props.positionsUniq) ? " checked" : ""} data-v-c557cfe4${_scopeId}><span class="opacity-80" data-v-c557cfe4${_scopeId}>Unique only</span></label></div><div class="tiles-grid" data-v-c557cfe4${_scopeId}><!--[-->`);
            ssrRenderList(WEAPON_OPTIONS, (opt) => {
              _push2(`<label class="${ssrRenderClass([{ "is-active": isChecked(__props.positions, opt.value) }, "tile"])}" data-v-c557cfe4${_scopeId}><input type="checkbox" class="sr-only"${ssrIncludeBooleanAttr(__props.positions.includes(opt.value)) ? " checked" : ""} data-v-c557cfe4${_scopeId}><span class="tile-label" data-v-c557cfe4${_scopeId}>${ssrInterpolate(opt.label)}</span></label>`);
            });
            _push2(`<!--]--></div><p class="mt-3 text-xs leading-relaxed text-white/70" data-v-c557cfe4${_scopeId}>`);
            if (__props.positionsUniq) {
              _push2(`<!--[--> Shows only weapons whose slot mask matches <b data-v-c557cfe4${_scopeId}>exactly</b> the selected flags. <!--]-->`);
            } else {
              _push2(`<!--[--> A weapon matches if its slot mask contains <i data-v-c557cfe4${_scopeId}>any</i> of the selected flags. <!--]-->`);
            }
            _push2(`</p></section></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-7 pb-8" }, [
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
                      createTextVNode(" Shows only weapons available to "),
                      createVNode("b", null, "exactly one"),
                      createTextVNode(" class or the "),
                      createVNode("b", null, "combination"),
                      createTextVNode(" of the selected classes. ")
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" A weapon matches if it's available to "),
                      createVNode("i", null, "any"),
                      createTextVNode(" of the selected classes. ")
                    ], 64))
                  ])
                ]),
                skillLabelOptions.value.length ? (openBlock(), createBlock("section", {
                  key: 0,
                  class: "filter-card"
                }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("h4", { class: "sec-title" }, "Labels"),
                    createVNode("span", { class: "text-xs text-white/50" }, toDisplayString(skillLabelOptions.value.length) + " tags", 1)
                  ]),
                  createVNode("div", { class: "tiles-grid" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(skillLabelOptions.value, (opt) => {
                      return openBlock(), createBlock("label", {
                        key: `label-${opt.value}`,
                        class: ["tile", { "is-active": isChecked(__props.labels, opt.value) }],
                        style: { "--tile-accent": `#${opt.color}` }
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
                ])) : createCommentVNode("", true),
                createVNode("section", { class: "filter-card" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("h4", { class: "sec-title" }, "Weapon Slots"),
                    createVNode("label", { class: "inline-flex items-center gap-2 cursor-pointer select-none text-xs" }, [
                      createVNode("input", {
                        type: "checkbox",
                        class: "accent-[#63B4C8]",
                        checked: __props.positionsUniq,
                        onChange: ($event) => _ctx.$emit("update:positions-uniq", $event.target.checked)
                      }, null, 40, ["checked", "onChange"]),
                      createVNode("span", { class: "opacity-80" }, "Unique only")
                    ])
                  ]),
                  createVNode("div", { class: "tiles-grid" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(WEAPON_OPTIONS, (opt) => {
                      return createVNode("label", {
                        key: "pos-" + opt.value,
                        class: ["tile", { "is-active": isChecked(__props.positions, opt.value) }]
                      }, [
                        createVNode("input", {
                          type: "checkbox",
                          class: "sr-only",
                          checked: __props.positions.includes(opt.value),
                          onChange: ($event) => toggleVal("positions", opt.value)
                        }, null, 40, ["checked", "onChange"]),
                        createVNode("span", { class: "tile-label" }, toDisplayString(opt.label), 1)
                      ], 2);
                    }), 64))
                  ]),
                  createVNode("p", { class: "mt-3 text-xs leading-relaxed text-white/70" }, [
                    __props.positionsUniq ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" Shows only weapons whose slot mask matches "),
                      createVNode("b", null, "exactly"),
                      createTextVNode(" the selected flags. ")
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" A weapon matches if its slot mask contains "),
                      createVNode("i", null, "any"),
                      createTextVNode(" of the selected flags. ")
                    ], 64))
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/WikiWeaponFilterPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const WikiWeaponFilterPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c557cfe4"]]);
const DEFAULT_SORT = { by: "id", dir: "asc" };
const useWikiSkillStore = defineStore("wikiSkill", {
  state: () => ({
    items: [],
    count: 0,
    loading: false,
    error: "",
    loadedLocale: "en",
    /** Фильтры для навыков */
    filters: {
      search: "",
      // englishName (case-insensitive)
      levels: (
        /** @type {number[]} */
        []
      ),
      // Skill_LV in []
      damageTypes: (
        /** @type {number[]} */
        []
      ),
      // Damage_Type in []
      weaponTypes: (
        /** @type {number[]} */
        []
      ),
      // WeaponTypeLimit in []
      tips: (
        /** @type {number[]} */
        []
      ),
      // Tips_Label содержит любой из выбранных
      hasBuffId: (
        /** @type {number|null} */
        null
      ),
      // искать по Buff_Display
      cooldownMax: (
        /** @type {number|null} */
        null
      ),
      // <= value
      costMax: (
        /** @type {number|null} */
        null
      )
      // <= value
    },
    sort: { ...DEFAULT_SORT },
    // id | name | CombatPower | Cooldown | Skill_LV
    page: 1,
    pageSize: 30,
    rawText: ""
  }),
  getters: {
    /** Удобные локализаторы */
    makeLocalizers: () => (locale) => ({
      nameOf: (s) => s?.i18n?.name?.[locale] ?? s?.englishName ?? "",
      descOf: (s) => s?.i18n?.desc?.[locale] ?? ""
    }),
    /** Фасеты (уровни, типы урона, типы оружия) */
    facets(state) {
      const lv = /* @__PURE__ */ new Set();
      const dmg = /* @__PURE__ */ new Set();
      const wtypes = /* @__PURE__ */ new Set();
      for (const s of state.items) {
        if (s.Skill_LV != null) lv.add(s.Skill_LV);
        if (s.Damage_Type != null) dmg.add(s.Damage_Type);
        if (s.WeaponTypeLimit != null) wtypes.add(s.WeaponTypeLimit);
      }
      return {
        levels: Array.from(lv).sort((a, b) => a - b),
        damageTypes: Array.from(dmg).sort((a, b) => a - b),
        weaponTypes: Array.from(wtypes).sort((a, b) => a - b)
      };
    },
    /** Фильтрация */
    filtered(state) {
      const f = state.filters;
      const s = (f.search || "").trim().toLowerCase();
      const needLv = new Set(f.levels || []);
      const needDmg = new Set(f.damageTypes || []);
      const needWT = new Set(f.weaponTypes || []);
      const needTips = new Set(f.tips || []);
      const buffId = f.hasBuffId;
      const cdMax = Number.isFinite(f.cooldownMax) ? Number(f.cooldownMax) : null;
      const costMax = Number.isFinite(f.costMax) ? Number(f.costMax) : null;
      const { nameOf, descOf } = this.makeLocalizers(state.loadedLocale);
      return state.items.filter((it) => {
        if (needLv.size && !needLv.has(it.Skill_LV)) return false;
        if (needDmg.size && !needDmg.has(it.Damage_Type)) return false;
        if (needWT.size && !needWT.has(it.WeaponTypeLimit)) return false;
        if (needTips.size) {
          const arr = Array.isArray(it.Tips_Label) ? it.Tips_Label : [];
          const hasAny = arr.some((id) => needTips.has(id));
          if (!hasAny) return false;
        }
        if (buffId != null) {
          const arr = Array.isArray(it.Buff_Display) ? it.Buff_Display : [];
          if (!arr.some((b) => b?.BuffId === Number(buffId))) return false;
        }
        if (cdMax != null && Number(it.Cooldown ?? 0) > cdMax) return false;
        if (costMax != null && Number(it.SkillCost ?? 0) > costMax) return false;
        if (s) {
          const name = (nameOf(it) || "").toLowerCase();
          const desc = (descOf(it) || "").toLowerCase();
          const eng = (it.englishName || "").toLowerCase();
          if (!(name.includes(s) || desc.includes(s) || eng.includes(s))) return false;
        }
        return true;
      });
    },
    /** Сортировка */
    sorted() {
      const arr = [...this.filtered];
      const { by, dir } = this.sort;
      const mul = dir === "desc" ? -1 : 1;
      const { nameOf } = this.makeLocalizers(this.loadedLocale);
      arr.sort((a, b) => {
        let va, vb;
        switch (by) {
          case "CombatPower":
            va = a.CombatPower;
            vb = b.CombatPower;
            break;
          case "Cooldown":
            va = a.Cooldown;
            vb = b.Cooldown;
            break;
          case "Skill_LV":
            va = a.Skill_LV;
            vb = b.Skill_LV;
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
    /** Постраничка */
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
    /** Загрузка */
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
        const { data } = await fetchWikiSkills(locale);
        this.items = Array.isArray(data?.skills) ? data.skills : [];
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
    /** Частичное применение фильтров */
    applyFilters(payload = {}) {
      if ("search" in payload) this.filters.search = payload.search ?? "";
      if ("levels" in payload) this.filters.levels = Array.isArray(payload.levels) ? payload.levels : [];
      if ("damageTypes" in payload) this.filters.damageTypes = Array.isArray(payload.damageTypes) ? payload.damageTypes : [];
      if ("weaponTypes" in payload) this.filters.weaponTypes = Array.isArray(payload.weaponTypes) ? payload.weaponTypes : [];
      if ("tips" in payload) this.filters.tips = Array.isArray(payload.tips) ? payload.tips : [];
      if ("hasBuffId" in payload) {
        const v = payload.hasBuffId;
        this.filters.hasBuffId = v === null || v === void 0 || v === "" ? null : Number(v);
      }
      if ("cooldownMax" in payload) {
        const v = Number(payload.cooldownMax);
        this.filters.cooldownMax = Number.isFinite(v) ? v : null;
      }
      if ("costMax" in payload) {
        const v = Number(payload.costMax);
        this.filters.costMax = Number.isFinite(v) ? v : null;
      }
      this.page = 1;
    },
    /** Хелперы — совместимое API */
    nextPage() {
      if (this.hasNextPage) this.page += 1;
    },
    setPage(p) {
      this.page = Math.max(1, Number(p || 1));
    },
    setPageSize(ps) {
      this.pageSize = Math.min(200, Math.max(5, Number(ps || 30)));
      this.page = 1;
    },
    setSort(by, dir) {
      this.sort.by = by || this.sort.by;
      this.sort.dir = dir || this.sort.dir;
      this.page = 1;
    },
    setSearch(v) {
      this.filters.search = v ?? "";
      this.page = 1;
    },
    setLevels(arr) {
      this.filters.levels = Array.isArray(arr) ? arr : [];
      this.page = 1;
    },
    setDamageTypes(a) {
      this.filters.damageTypes = Array.isArray(a) ? a : [];
      this.page = 1;
    },
    setWeaponTypes(a) {
      this.filters.weaponTypes = Array.isArray(a) ? a : [];
      this.page = 1;
    },
    setTips(a) {
      this.filters.tips = Array.isArray(a) ? a : [];
      this.page = 1;
    },
    setBuffId(id) {
      this.filters.hasBuffId = id == null || id === "" ? null : Number(id);
      this.page = 1;
    },
    setCooldownMax(v) {
      this.filters.cooldownMax = Number.isFinite(+v) ? +v : null;
      this.page = 1;
    },
    setCostMax(v) {
      this.filters.costMax = Number.isFinite(+v) ? +v : null;
      this.page = 1;
    },
    resetFilters() {
      this.filters = {
        search: "",
        levels: [],
        damageTypes: [],
        weaponTypes: [],
        tips: [],
        hasBuffId: null,
        cooldownMax: null,
        costMax: null
      };
      this.page = 1;
    }
  }
});
const _sfc_main$1 = {
  __name: "WikiWeaponCard",
  __ssrInlineRender: true,
  props: {
    weapon: { type: Object, required: true },
    locale: { type: String, default: "en" }
  },
  setup(__props) {
    const props = __props;
    const skillStore = useWikiSkillStore();
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
      skillStore.load(next);
      buffStore.load(next);
      formatter.setLocale?.(next);
    });
    const weaponTitle = computed(
      () => props.weapon?.i18n?.name?.[loc.value] || props.weapon?.englishName || `Weapon #${props.weapon?.id}`
    );
    const weaponDescHtml = computed(() => {
      const raw = props.weapon?.i18n?.desc?.[loc.value] || "";
      return formatter.format(raw, props.weapon?.Upgrade_Value || []);
    });
    const weaponIconSrc = computed(() => `/wiki/Weapons/${props.weapon?.Icon}.png`);
    const skillById = computed(() => {
      const map = /* @__PURE__ */ Object.create(null);
      for (const skill of skillStore.items || []) map[skill.id] = skill;
      return map;
    });
    const skills = computed(() => {
      const ids = Array.isArray(props.weapon?.skills) ? props.weapon.skills : [];
      return ids.map((sid) => {
        const s = skillById.value[sid];
        if (!s) return null;
        const upVals = Array.isArray(s.Upgrade_Value) ? s.Upgrade_Value : [];
        const nameRaw = s?.i18n?.name?.[loc.value] || s?.englishName || `Skill ${s.id}`;
        const descRaw = s?.i18n?.desc?.[loc.value] || "";
        return {
          id: s.id,
          icon: `/wiki/Skills/${s?.Icon || "Icon_Skill_10001"}.png`,
          nameHtml: formatter.format(nameRaw, upVals),
          descHtml: formatter.format(descRaw, upVals)
        };
      }).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "weapon-card" }, _attrs))} data-v-79ed0336><div class="hero" data-v-79ed0336><div class="hero-art" data-v-79ed0336><img${ssrRenderAttr("src", _imports_1)} alt="" class="hero-bg" aria-hidden="true" draggable="false" data-v-79ed0336><img${ssrRenderAttr("src", weaponIconSrc.value)}${ssrRenderAttr("alt", weaponTitle.value)} class="hero-weapon" loading="lazy" draggable="false" data-v-79ed0336></div><div class="hero-copy" data-v-79ed0336><p class="eyebrow" data-v-79ed0336>Weapon module</p><h2 data-v-79ed0336>${ssrInterpolate(weaponTitle.value)}</h2></div></div>`);
      if (weaponDescHtml.value) {
        _push(`<section class="section-block" data-v-79ed0336><h3 class="section-title" data-v-79ed0336>Overview</h3><div class="richtext text-base leading-relaxed" data-v-79ed0336>${weaponDescHtml.value ?? ""}</div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (skills.value.length) {
        _push(`<section class="section-block" data-v-79ed0336><h3 class="section-title" data-v-79ed0336>Skills</h3><!--[-->`);
        ssrRenderList(skills.value, (skill) => {
          _push(`<div class="skill-card" data-v-79ed0336><img${ssrRenderAttr("src", skill.icon)} alt="" loading="lazy" data-v-79ed0336><div class="skill-copy" data-v-79ed0336><div class="richtext skill-name" data-v-79ed0336>${skill.nameHtml ?? ""}</div><div class="richtext skill-desc" data-v-79ed0336>${skill.descHtml ?? ""}</div></div></div>`);
        });
        _push(`<!--]--></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/wiki/WeaponCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const WeaponCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-79ed0336"]]);
const _sfc_main = {
  __name: "weapons",
  __ssrInlineRender: true,
  setup(__props) {
    const weaponStore = useWikiWeaponStore();
    const skillStore = useWikiSkillStore();
    const labelStore = useWikiLabelStore();
    useHead({ title: "Wiki — Weapons" });
    async function loadAll(targetLocale = locale.value) {
      const lang = targetLocale ?? locale.value;
      await Promise.all([
        weaponStore.load(lang),
        skillStore.load(lang),
        labelStore.load(lang)
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
      initialLocale: "en",
      loadResources: loadAll,
      onSearchChange: () => {
        weaponStore.page = 1;
      }
    });
    const JOBS = buildJobCardList("All Weapons");
    const selectedJob = ref(0);
    const filters = ref({ rares: [], jobs: [], labels: [], uniq: false });
    function buildFilterState(source = {}) {
      return {
        rares: [],
        jobs: Array.isArray(source.jobs) ? [...source.jobs] : [],
        labels: Array.isArray(source.labels) ? [...source.labels] : [],
        positions: Array.isArray(source.positions) ? [...source.positions] : [],
        positionsUniq: !!source.positionsUniq,
        uniq: !!source.uniq
      };
    }
    filters.value = buildFilterState();
    let syncingFilters = false;
    function syncFiltersFromStore() {
      syncingFilters = true;
      filters.value = buildFilterState(weaponStore.filters || {});
      syncingFilters = false;
      const jobList = Array.isArray(filters.value.jobs) ? filters.value.jobs : [];
      selectedJob.value = jobList.length === 1 ? jobList[0] : 0;
    }
    syncFiltersFromStore();
    const labelMap = computed(() => {
      const map = /* @__PURE__ */ Object.create(null);
      const ids = filters.value.labels || [];
      const loc = locale.value;
      for (const id of ids) {
        const l = labelStore.byId?.[id];
        if (!l) continue;
        map[id] = {
          id,
          text: l.i18n?.[loc] || l.Name?.text || String(id),
          colorHex: l.LabelImageColor || "5E5E5E"
        };
      }
      return map;
    });
    watch(() => filters.value.jobs, (jobs) => {
      const arr = Array.isArray(jobs) ? jobs : [];
      selectedJob.value = arr.length === 1 ? arr[0] : 0;
    });
    function handleResetFromPanel() {
      search.value = "";
      weaponStore.resetFilters();
      syncFiltersFromStore();
    }
    const skillMap = computed(() => {
      const map = /* @__PURE__ */ Object.create(null);
      for (const skill of skillStore.items || []) {
        map[skill.id] = skill;
      }
      return map;
    });
    const searchTerm = computed(() => String(search.value || "").trim().toLowerCase());
    const normalizeText = (val) => String(val || "").toLowerCase();
    function matchesWeaponSearch(weapon) {
      if (!searchTerm.value) return true;
      const term = searchTerm.value;
      const locKey = String(locale.value || "en");
      const english = normalizeText(weapon?.englishName);
      const name = normalizeText(weapon?.i18n?.name?.[locKey]);
      const desc = normalizeText(weapon?.i18n?.desc?.[locKey]);
      if (english.includes(term) || name.includes(term) || desc.includes(term)) return true;
      const skills = Array.isArray(weapon?.skills) ? weapon.skills : [];
      for (const sid of skills) {
        const skill = skillMap.value?.[sid];
        if (!skill) continue;
        const skillName = normalizeText(skill?.i18n?.name?.[locKey] || skill?.englishName);
        const skillDesc = normalizeText(skill?.i18n?.desc?.[locKey]);
        if (skillName.includes(term) || skillDesc.includes(term)) return true;
      }
      return false;
    }
    const filteredWeapons = computed(() => {
      const base = weaponStore.sorted;
      if (!Array.isArray(base)) return [];
      if (!searchTerm.value) return base;
      return base.filter(matchesWeaponSearch);
    });
    const items = computed(() => filteredWeapons.value.slice(0, weaponStore.page * weaponStore.pageSize));
    const totalMatched = computed(() => filteredWeapons.value.length);
    const hasNextPage = computed(() => weaponStore.page * weaponStore.pageSize < filteredWeapons.value.length);
    const isLoading = computed(() => weaponStore.loading);
    function handleLoadMore() {
      if (!hasNextPage.value) return;
      weaponStore.nextPage();
    }
    function weaponIconSrc(w) {
      const icon = w?.Icon || "weapon_unknown";
      return `/wiki/Weapons/${icon}.png`;
    }
    const selectedWeapon = ref(null);
    function closeModal() {
      setModalOpen(false);
      selectedWeapon.value = null;
    }
    watch(filters, (val) => {
      if (syncingFilters) return;
      weaponStore.applyFilters({
        jobs: Array.isArray(val.jobs) ? [...val.jobs] : [],
        labels: Array.isArray(val.labels) ? [...val.labels] : [],
        positions: Array.isArray(val.positions) ? [...val.positions] : [],
        positionsUniq: !!val.positionsUniq,
        uniq: !!val.uniq
      });
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-4" }, _attrs))} data-v-3b1df5e3><header class="space-y-3" data-v-3b1df5e3><div class="flex items-center justify-between" data-v-3b1df5e3><h1 class="text-2xl font-semibold" data-v-3b1df5e3>Wiki - Weapons</h1>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        modelValue: unref(locale),
        "onUpdate:modelValue": ($event) => isRef(locale) ? locale.value = $event : null
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([unref(isMobile) ? "grid-cols-3" : "grid-cols-6", "grid gap-3"])}" data-v-3b1df5e3><!--[-->`);
      ssrRenderList(unref(JOBS), (m) => {
        _push(`<button class="${ssrRenderClass([[unref(isMobile) ? "h-24" : "h-28", selectedJob.value === m.id ? "is-active" : ""], "job-card group"])}"${ssrRenderAttr("title", m.label)} data-v-3b1df5e3><img${ssrRenderAttr("src", m.img)} class="absolute inset-0 h-full w-full object-cover opacity-90" alt="" data-v-3b1df5e3><div class="absolute inset-0" style="${ssrRenderStyle({ "background-image": "url('/wiki/Mechs/Img_BigScreenBG.png')", "background-size": "cover", "opacity": ".25" })}" data-v-3b1df5e3></div><div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent transition-opacity group-hover:opacity-60" data-v-3b1df5e3></div><span class="relative z-10 text-xs font-semibold uppercase tracking-[0.3em] text-white/70" data-v-3b1df5e3>${ssrInterpolate(m.label)}</span></button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center gap-3" data-v-3b1df5e3><div class="order-1 sm:order-1" data-v-3b1df5e3><button class="filter-toggle" data-v-3b1df5e3><img${ssrRenderAttr("src", _imports_0)} class="w-5 sm:w-6" alt="filter" data-v-3b1df5e3> Filters </button></div><div class="order-2 sm:order-3 ml-auto text-sm opacity-80 flex items-center gap-2" data-v-3b1df5e3><span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" data-v-3b1df5e3></span><span data-v-3b1df5e3>Items: <span class="font-medium" data-v-3b1df5e3>${ssrInterpolate(totalMatched.value)}</span></span></div><div class="order-4 sm:order-2 basis-full sm:basis-auto w-full sm:w-auto sm:flex-1 flex items-center gap-3" data-v-3b1df5e3><div class="relative flex-1 min-w-[240px]" data-v-3b1df5e3><input${ssrRenderAttr("value", unref(search))} type="text" inputmode="search" placeholder="Search by name or description..." class="search-input" data-v-3b1df5e3><svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor" data-v-3b1df5e3><path d="M10 4a6 6 0 104.472 10.028l4.25 4.25 1.414-1.414-4.25-4.25A6 6 0 0010 4zm-4 6a4 4 0 118 0 4 4 0 01-8 0z" data-v-3b1df5e3></path></svg>`);
      if (unref(search)) {
        _push(`<button class="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/15" title="Clear" data-v-3b1df5e3><svg class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="currentColor" data-v-3b1df5e3><path d="M6.225 4.811L4.811 6.225 9.586 11l-4.775 4.775 1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z" data-v-3b1df5e3></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="ghost-btn shrink-0" data-v-3b1df5e3> Reload </button></div></div></header>`);
      _push(ssrRenderComponent(ActiveFiltersBar, {
        locale: unref(locale),
        rares: filters.value.rares,
        jobs: filters.value.jobs,
        labels: filters.value.labels,
        positions: filters.value.positions,
        "positions-uniq": filters.value.positionsUniq,
        uniq: filters.value.uniq,
        "label-map": labelMap.value,
        "onRemove:rarity": (val) => filters.value.rares = filters.value.rares.filter((v) => v !== val),
        "onRemove:job": (val) => filters.value.jobs = filters.value.jobs.filter((v) => v !== val),
        "onRemove:label": (val) => filters.value.labels = filters.value.labels.filter((v) => v !== val),
        "onRemove:position": (val) => filters.value.positions = filters.value.positions.filter((v) => v !== val),
        "onUnset:positionsUniq": ($event) => filters.value.positionsUniq = false,
        "onUnset:uniq": ($event) => filters.value.uniq = false
      }, null, _parent));
      if (unref(weaponStore).loading) {
        _push(`<div class="text-sm opacity-80" data-v-3b1df5e3>Loading...</div>`);
      } else if (unref(weaponStore).error) {
        _push(`<div class="text-sm text-red-400" data-v-3b1df5e3>Error: ${ssrInterpolate(unref(weaponStore).error)}</div>`);
      } else {
        _push(`<div data-v-3b1df5e3><div class="hidden sm:grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]" data-v-3b1df5e3><!--[-->`);
        ssrRenderList(items.value, (w) => {
          _push(`<button class="wiki-card group"${ssrRenderAttr("title", w.i18n?.name?.[unref(locale)] || w.englishName || `ID ${w.id}`)} data-v-3b1df5e3><div class="absolute inset-0" data-v-3b1df5e3><img${ssrRenderAttr("src", weaponIconSrc(w))} class="absolute inset-0 w-full h-full object-contain z-10" alt="" draggable="false" loading="lazy" data-v-3b1df5e3><img${ssrRenderAttr("src", _imports_1)} alt="" class="absolute inset-0 w-full h-full object-cover opacity-75" draggable="false" data-v-3b1df5e3></div><div class="absolute bottom-0 left-0 right-0 px-2 py-1 text-[11px] bg-black/40 backdrop-blur-sm" data-v-3b1df5e3><div class="flex items-center justify-center text-center" data-v-3b1df5e3><span class="opacity-90 text-sm font-medium truncate max-w-[90%]" data-v-3b1df5e3>${ssrInterpolate(w.i18n?.name?.[unref(locale)] || w.englishName || `ID ${w.id}`)}</span></div></div></button>`);
        });
        _push(`<!--]--></div><div class="flex flex-col gap-3 sm:hidden" data-v-3b1df5e3><!--[-->`);
        ssrRenderList(items.value, (w) => {
          _push(`<button class="wiki-card-mobile" data-v-3b1df5e3><div class="mobile-art" data-v-3b1df5e3><img${ssrRenderAttr("src", _imports_1)} alt="" class="mobile-bg" aria-hidden="true" draggable="false" data-v-3b1df5e3><img${ssrRenderAttr("src", weaponIconSrc(w))} alt="" class="mobile-thumb" loading="lazy" draggable="false" data-v-3b1df5e3></div><div class="mobile-copy" data-v-3b1df5e3><p class="mobile-title" data-v-3b1df5e3>${ssrInterpolate(w.i18n?.name?.[unref(locale)] || w.englishName || `ID ${w.id}`)}</p></div></button>`);
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
        "aria-label": "Weapon details",
        onClose: closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (selectedWeapon.value) {
              _push2(ssrRenderComponent(WeaponCard, {
                weapon: selectedWeapon.value,
                locale: unref(locale)
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              selectedWeapon.value ? (openBlock(), createBlock(WeaponCard, {
                key: 0,
                weapon: selectedWeapon.value,
                locale: unref(locale)
              }, null, 8, ["weapon", "locale"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(WikiWeaponFilterPanel, {
        open: unref(showFilterPanel),
        locale: unref(locale),
        jobs: filters.value.jobs,
        "onUpdate:jobs": ($event) => filters.value.jobs = $event,
        labels: filters.value.labels,
        "onUpdate:labels": ($event) => filters.value.labels = $event,
        positions: filters.value.positions,
        "onUpdate:positions": ($event) => filters.value.positions = $event,
        "positions-uniq": filters.value.positionsUniq,
        "onUpdate:positionsUniq": ($event) => filters.value.positionsUniq = $event,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wiki/weapons.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const weapons = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3b1df5e3"]]);

export { weapons as default };
//# sourceMappingURL=weapons-CuhPVJvs.mjs.map
