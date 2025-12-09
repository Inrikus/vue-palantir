import { ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderTeleport, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as _imports_0 } from './filter-1-CAGC5e4k.mjs';
import { c as collections, p as platformIcon, a as currency, g as getCollectionLink } from './dictsList-DakXjKh3.mjs';
import { _ as _export_sfc, g as useRoute, u as useHead } from './server.mjs';
import { defineStore } from 'pinia';
import { g as fetchCardsList, h as fetchActivities } from './api-DjRwVJCC.mjs';
import { t as toggleScrollLock, _ as _imports_1 } from './scrollLock-C9L39gzN.mjs';
import { useRoute as useRoute$1 } from 'vue-router';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'better-sqlite3';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'axios';

const _sfc_main$a = {
  __name: "CollectionsBadgesBadgeMech",
  __ssrInlineRender: true,
  props: { card: Object },
  setup(__props) {
    const props = __props;
    const findTrait = (type) => props.card.traits?.find((t) => t.trait_type === type)?.value || "";
    const gradeRaw = computed(() => findTrait("GRADE"));
    const gradeKey = computed(() => {
      const g = gradeRaw.value;
      if (!g) return "Common";
      const normalized = g.toLowerCase();
      const map = {
        common: "Common",
        elite: "Elite",
        epic: "Epic",
        legend: "Legend",
        legendary: "Legend",
        mythical: "Mythical"
      };
      return map[normalized] || g;
    });
    const className = computed(() => {
      const cls = findTrait("Class");
      if (!cls) return "";
      return cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase();
    });
    const classIcon = computed(() => {
      const cls = className.value;
      return cls ? `/cards/mechs/Icon_${cls}.png` : "";
    });
    const weaponCount = computed(() => findTrait("Weapons") || "0");
    const gradeClass = computed(() => `grade-${(gradeKey.value || "Common").toLowerCase()}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["mech-badge", gradeClass.value],
        "aria-hidden": "true"
      }, _attrs))} data-v-bfb21ea7><div class="glow" data-v-bfb21ea7></div>`);
      if (classIcon.value) {
        _push(`<div class="class-icon" data-v-bfb21ea7><img${ssrRenderAttr("src", classIcon.value)}${ssrRenderAttr("alt", className.value || "Class icon")} data-v-bfb21ea7></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="meta" data-v-bfb21ea7><span class="grade-label" data-v-bfb21ea7>${ssrInterpolate(gradeKey.value)}</span><span class="weapon-label" data-v-bfb21ea7>Weapons ${ssrInterpolate(weaponCount.value)}</span></div></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Badges/BadgeMech.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const BadgeMech = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-bfb21ea7"]]);
const _sfc_main$9 = {
  __name: "CollectionsBadgesBadgePlanet",
  __ssrInlineRender: true,
  props: {
    card: Object
  },
  setup(__props) {
    const props = __props;
    const resourceTraits = ["Coal", "Titanium", "Sulfur", "Petroleum", "Helium", "Hydrogen"];
    const getTraitValue = (type) => {
      return props.card.traits?.find((t) => t.trait_type === type)?.value || "0";
    };
    const visibleResources = computed(() => {
      return resourceTraits.filter((resource) => +getTraitValue(resource) > 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "planet-badge" }, _attrs))} data-v-63114567><!--[-->`);
      ssrRenderList(visibleResources.value, (resource) => {
        _push(`<div class="resource-slot" data-v-63114567><img${ssrRenderAttr("src", `/cards/planets/Icon_${resource}.png`)}${ssrRenderAttr("alt", resource)} class="resource-icon" data-v-63114567><span class="resource-count" data-v-63114567>${ssrInterpolate(getTraitValue(resource))}</span></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Badges/BadgePlanet.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const BadgePlanet = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-63114567"]]);
const _sfc_main$8 = {
  __name: "CollectionsCardsCardItem",
  __ssrInlineRender: true,
  props: {
    card: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const isMechBadge = computed(
      () => ["bi_mech", "quartan_primes"].includes(props.card.collection_name) && props.card.status === "Normal"
    );
    const isPlanetBadge = computed(() => props.card.collection_name === "fusionist_planet");
    const platformIconSrc = computed(() => {
      const key = props.card?.link?.source;
      return platformIcon[key] || platformIcon.Element || "/social-icons/website.svg";
    });
    const imageSrc = computed(() => {
      const src = props.card?.nft_image || "";
      if (!src) return "/placeholder.png";
      if (/^https?:\/\//i.test(src)) return src;
      return src.startsWith("/") ? src : `/${src}`;
    });
    const currencyKey = computed(() => {
      const val = (props.card.price_native?.currency || "Unknown").toUpperCase();
      return currency[val] ? val : "Unknown";
    });
    const currencyIcon = computed(() => `/currency/${currency[currencyKey.value]}`);
    const nativePrice = computed(() => props.card.price_native?.value ?? "—");
    const usdPrice = computed(() => props.card.price ? `${props.card.price} USD` : "Not listed");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "collection-card",
        href: __props.card.link?.value || "#",
        target: "_blank",
        rel: "noopener"
      }, _attrs))} data-v-7440e101><div class="media" data-v-7440e101><img${ssrRenderAttr("src", imageSrc.value)} alt="" class="card-bg" loading="lazy" decoding="async" data-v-7440e101><div class="card-overlay" data-v-7440e101></div><img${ssrRenderAttr("src", platformIconSrc.value)} alt="marketplace" class="market-chip" data-v-7440e101>`);
      if (isPlanetBadge.value) {
        _push(`<div class="badge-layer badge-layer--planet" data-v-7440e101>`);
        _push(ssrRenderComponent(BadgePlanet, { card: __props.card }, null, _parent));
        _push(`</div>`);
      } else if (isMechBadge.value) {
        _push(`<div class="badge-layer badge-layer--mech" data-v-7440e101>`);
        _push(ssrRenderComponent(BadgeMech, { card: __props.card }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="card-info" data-v-7440e101><p class="card-name"${ssrRenderAttr("title", __props.card.nft_name)} data-v-7440e101>${ssrInterpolate(__props.card.nft_name || "Unknown NFT")}</p><div class="price-row" data-v-7440e101><div class="primary" data-v-7440e101><img${ssrRenderAttr("src", currencyIcon.value)} alt="currency" class="currency-icon" data-v-7440e101><span class="value" data-v-7440e101>${ssrInterpolate(nativePrice.value)}</span><span class="code" data-v-7440e101>${ssrInterpolate(__props.card.price_native?.currency || "--")}</span></div><div class="secondary" data-v-7440e101>${ssrInterpolate(usdPrice.value)}</div></div></div></a>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Cards/CardItem.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const CardItem = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-7440e101"]]);
const _sfc_main$7 = {
  __name: "CollectionsCardsInfinitePager",
  __ssrInlineRender: true,
  props: {
    isLoading: { type: Boolean, default: false },
    hasNextPage: { type: Boolean, default: true }
  },
  emits: ["load-more"],
  setup(__props, { emit: __emit }) {
    const sentinel = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "sentinel",
        ref: sentinel,
        style: { "height": "1px" }
      }, _attrs))}></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Cards/InfinitePager.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const initial$1 = () => ({
  cards: [],
  maxCards: 0,
  hasNextPage: false,
  isLoading: false
});
const useCardStore = defineStore("card", {
  state: initial$1,
  actions: {
    // Полная замена списка
    setCards(list = []) {
      this.cards = Array.isArray(list) ? list : [];
    },
    // Дозагрузка (для пагинации/инфинит-скролла)
    appendCards(list = []) {
      if (Array.isArray(list) && list.length) this.cards.push(...list);
    },
    // Метаданные страницы: total, hasNextPage и т.п.
    setMeta({ maxCards = 0, hasNextPage = true } = {}) {
      this.maxCards = Number(maxCards) || 0;
      this.hasNextPage = !!hasNextPage;
    },
    setLoading(v) {
      this.isLoading = !!v;
    }
  }
});
const initial = () => ({
  status: [],
  sources: [],
  order: "priceAsc",
  tradeType: 1,
  priceRangeMax: 0,
  page: 1,
  rows: 30,
  traits: [],
  // [{ trait_type, value }]
  needsUpdate: false
});
const useFilterStore = defineStore("filter", {
  state: initial,
  getters: {
    getAllFilters: (s) => [s.sources, s.status, s.tradeType, s.order, s.priceRangeMax, s.page, s.rows, s.traits]
  },
  actions: {
    setNeedsUpdate(v) {
      this.needsUpdate = v;
    },
    changeStatus(e) {
      const v = e?.target?.value, checked = !!e?.target?.checked;
      if (checked) {
        if (!this.status.includes(v)) this.status.push(v);
        return;
      }
      const i = this.status.findIndex((x) => x === v);
      if (i !== -1) this.status.splice(i, 1);
    },
    changeSources(e) {
      const v = e?.target?.value, checked = !!e?.target?.checked;
      if (checked) {
        if (!this.sources.includes(v)) this.sources.push(v);
        return;
      }
      const i = this.sources.findIndex((x) => x === v);
      if (i !== -1) this.sources.splice(i, 1);
    },
    changeTraits(e, key, value) {
      if (e?.target?.checked) {
        this.traits.push({ trait_type: key, value });
        return;
      }
      const i = this.traits.findIndex((t) => t.trait_type === key && t.value === value);
      if (i !== -1) this.traits.splice(i, 1);
    },
    changeTradeType(e) {
      this.tradeType = e?.target?.checked ? 1 : 0;
    },
    setOrder(newOrder) {
      if (this.order === newOrder) return;
      this.order = newOrder;
      this.page = 1;
    },
    changePage(v) {
      this.page = v;
    },
    changeRows(v) {
      this.rows = v;
    },
    changeMaxPrice(v) {
      this.priceRangeMax = Number(v) || 0;
    },
    clearFilter() {
      this.$patch(initial());
    }
  }
});
const _sfc_main$6 = {
  __name: "CollectionsCardsList",
  __ssrInlineRender: true,
  props: {
    endpoint: { type: String, required: true }
    // например: 'fusionist_planet'
  },
  setup(__props) {
    const props = __props;
    const cardStore = useCardStore();
    const filterStore = useFilterStore();
    const payload = computed(() => ({
      sources: filterStore.sources,
      status: filterStore.status,
      traits: filterStore.traits,
      order: filterStore.order,
      tradeType: filterStore.tradeType,
      priceRangeMax: filterStore.priceRangeMax,
      page: filterStore.page,
      rows: filterStore.rows
    }));
    const reqId = ref(0);
    async function load(firstPage = true) {
      const id = ++reqId.value;
      try {
        cardStore.setLoading(true);
        if (firstPage) {
          if (filterStore.page !== 1) filterStore.changePage(1);
          cardStore.setCards([]);
          cardStore.setMeta({ maxCards: 0, hasNextPage: false });
        }
        const { data } = await fetchCardsList(props.endpoint, payload.value);
        if (id !== reqId.value) return;
        firstPage ? cardStore.setCards(data?.nfts || []) : cardStore.appendCards(data?.nfts || []);
        cardStore.setMeta({ maxCards: data?.total_items ?? 0, hasNextPage: !!data?.has_next_page });
      } finally {
        if (id === reqId.value) {
          cardStore.setLoading(false);
          filterStore.setNeedsUpdate(false);
        }
      }
    }
    async function loadMore() {
      if (cardStore.isLoading || !cardStore.hasNextPage) return;
      filterStore.changePage(filterStore.page + 1);
      await load(false);
    }
    watch(
      () => [filterStore.order, filterStore.needsUpdate],
      ([order, needsUpdate], [prevOrder, prevNeedsUpdate]) => {
        if (order !== prevOrder) {
          filterStore.changePage(1);
          load(true);
          return;
        }
        if (needsUpdate && !prevNeedsUpdate) {
          filterStore.changePage(1);
          load(true);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-grid" }, _attrs))} data-v-c77504f4>`);
      if (!unref(cardStore).isLoading && !unref(cardStore).cards.length) {
        _push(`<div class="col-span-full text-center text-[#63B4C8]/80" data-v-c77504f4> No items found </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(cardStore).cards, (card) => {
        _push(ssrRenderComponent(CardItem, {
          key: card._id || card.id || card.token_id || card.nft_name,
          card
        }, null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_sfc_main$7, {
        "is-loading": unref(cardStore).isLoading,
        "has-next-page": unref(cardStore).hasNextPage,
        onLoadMore: loadMore
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Cards/CardsList.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const CardsList = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-c77504f4"]]);
const _sfc_main$5 = {
  __name: "CollectionsUIArrowIcon",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const arrowClasses = computed(() => [
      "w-2.5 h-2.5 ms-3 transition-all",
      { "rotate-180": props.isOpen }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        class: arrowClasses.value,
        "aria-hidden": "true",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 10 6"
      }, _attrs))}><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/UI/ArrowIcon.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "CollectionsFiltersPanel",
  __ssrInlineRender: true,
  props: {
    isFilterPanelOpen: { type: Boolean, required: true }
  },
  emits: ["toggle"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const route = useRoute$1();
    const filterStore = useFilterStore();
    const openSections = ref({ Status: true });
    computed(() => false);
    const isTraitChecked = (filter, option) => filterStore.traits.some((t) => t.trait_type === filter && t.value === option);
    const isStatusChecked = (status) => filterStore.status?.includes(status) || false;
    const isSourceChecked = (source) => filterStore.sources?.includes(source) || false;
    const isTradeTypeChecked = () => filterStore.tradeType === 1;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<template><div class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm" role="presentation" style="${ssrRenderStyle(props.isFilterPanelOpen ? null : { display: "none" })}" data-v-81a5d31f></div></template><template><aside id="filter-inner-panel" class="fixed top-0 left-0 z-[9999] flex h-full w-full flex-col overflow-hidden text-white shadow-2xl sm:w-[440px] sm:rounded-none glass-surface glass-surface--radial" role="dialog" aria-modal="true" aria-labelledby="filters-title" style="${ssrRenderStyle(props.isFilterPanelOpen ? null : { display: "none" })}" data-v-81a5d31f><div class="flex items-center justify-between border-b border-white/10 px-6 py-5" data-v-81a5d31f><div data-v-81a5d31f><p class="text-xs uppercase tracking-[0.4em] text-white/60" data-v-81a5d31f>Filters</p><h2 id="filters-title" class="text-2xl font-semibold" data-v-81a5d31f>Collection control</h2></div><button class="grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Close filters" data-v-81a5d31f><img${ssrRenderAttr("src", _imports_1)} alt="Close" class="w-4 h-4" data-v-81a5d31f></button></div><div class="flex-1 overflow-y-auto px-6 py-6 space-y-6" data-v-81a5d31f><section class="section-container" data-v-81a5d31f><div class="section-header" data-v-81a5d31f><div data-v-81a5d31f><h4 class="text-base font-semibold uppercase tracking-[0.3em] text-white/70" data-v-81a5d31f>Status</h4><p class="text-xs text-white/50" data-v-81a5d31f>Listing availability</p></div>`);
        _push2(ssrRenderComponent(_sfc_main$5, {
          "is-open": openSections.value.Status
        }, null, _parent));
        _push2(`</div><div class="${ssrRenderClass(["section-content", { open: openSections.value.Status }])}" data-v-81a5d31f><label class="checkbox-label" data-v-81a5d31f><input type="checkbox" class="custom-checkbox" id="only-buy-now" name="tradeType"${ssrIncludeBooleanAttr(isTradeTypeChecked()) ? " checked" : ""} data-v-81a5d31f><span class="text-sm font-semibold uppercase tracking-[0.2em]" data-v-81a5d31f>Only Buy Now</span></label><label class="checkbox-label" data-v-81a5d31f><input type="checkbox" class="custom-checkbox" value="Normal" name="status"${ssrIncludeBooleanAttr(isStatusChecked("Normal")) ? " checked" : ""} data-v-81a5d31f><span class="text-sm font-semibold uppercase tracking-[0.2em]" data-v-81a5d31f>Normal</span></label>`);
        if (["quartan_primes", "primeace"].includes(unref(route).name)) {
          _push2(`<label class="checkbox-label" data-v-81a5d31f><input type="checkbox" class="custom-checkbox" value="Uncreated" name="status"${ssrIncludeBooleanAttr(isStatusChecked("Uncreated")) ? " checked" : ""} data-v-81a5d31f><span class="text-sm font-semibold uppercase tracking-[0.2em]" data-v-81a5d31f>Uncreated</span></label>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`</div></section><!--[-->`);
        ssrRenderList(Object.keys(unref(collections)[unref(route).name]?.filters || {}), (filter, i) => {
          _push2(`<section class="section-container" data-v-81a5d31f><div class="section-header" data-v-81a5d31f><div data-v-81a5d31f><h4 class="text-base font-semibold uppercase tracking-[0.3em] text-white/70" data-v-81a5d31f>${ssrInterpolate(filter)}</h4><p class="text-xs text-white/50" data-v-81a5d31f>Traits &amp; rolls</p></div>`);
          _push2(ssrRenderComponent(_sfc_main$5, {
            "is-open": openSections.value[filter]
          }, null, _parent));
          _push2(`</div><div class="${ssrRenderClass(["section-content", { open: openSections.value[filter] }])}" data-v-81a5d31f><!--[-->`);
          ssrRenderList(unref(collections)[unref(route).name].filters[filter] || [], (option, idx) => {
            _push2(`<label class="checkbox-label" data-v-81a5d31f><input type="checkbox" class="custom-checkbox"${ssrRenderAttr("value", `${filter}:${option}`)} name="trait"${ssrIncludeBooleanAttr(isTraitChecked(filter, option)) ? " checked" : ""} data-v-81a5d31f><span class="text-sm font-semibold uppercase tracking-[0.2em]" data-v-81a5d31f>${ssrInterpolate(option)}</span></label>`);
          });
          _push2(`<!--]--></div></section>`);
        });
        _push2(`<!--]--><section class="section-container" data-v-81a5d31f><div class="section-header" data-v-81a5d31f><div data-v-81a5d31f><h4 class="text-base font-semibold uppercase tracking-[0.3em] text-white/70" data-v-81a5d31f>Sources</h4><p class="text-xs text-white/50" data-v-81a5d31f>Marketplaces</p></div>`);
        _push2(ssrRenderComponent(_sfc_main$5, {
          "is-open": openSections.value.Sources
        }, null, _parent));
        _push2(`</div><div class="${ssrRenderClass(["section-content", { open: openSections.value.Sources }])}" data-v-81a5d31f><!--[-->`);
        ssrRenderList(unref(collections)[unref(route).name]?.sources || [], (option, i) => {
          _push2(`<label class="checkbox-label" data-v-81a5d31f><input type="checkbox" class="custom-checkbox"${ssrRenderAttr("value", option)} name="source"${ssrIncludeBooleanAttr(isSourceChecked(option)) ? " checked" : ""} data-v-81a5d31f><img${ssrRenderAttr("src", unref(platformIcon)[option])} class="w-5 h-5 ms-2 mr-2" data-v-81a5d31f><span class="text-sm font-semibold uppercase tracking-[0.2em]" data-v-81a5d31f>${ssrInterpolate(option)}</span></label>`);
        });
        _push2(`<!--]--></div></section></div><div class="flex items-center justify-between gap-3 border-t border-white/10 px-6 py-5" data-v-81a5d31f><button class="action-button ghost" data-v-81a5d31f>Reset</button><button class="action-button solid" data-v-81a5d31f>Apply</button></div></aside></template>`);
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Filters/FiltersPanel.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const FiltersPanel = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-81a5d31f"]]);
const _sfc_main$3 = {
  __name: "CollectionsActivityItem",
  __ssrInlineRender: true,
  props: {
    item: { type: Object, required: true },
    collectionKey: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const getExplorerLink = (chain, txHash) => {
      switch (chain) {
        case "BSC":
          return `https://bscscan.com/tx/${txHash}`;
        case "Ethereum":
          return `https://etherscan.io/tx/${txHash}`;
        case "Endurance":
          return `https://explorer-endurance.fusionist.io/tx/${txHash}`;
        default:
          return "#";
      }
    };
    const getMarketLink = (chain, address) => {
      switch (chain) {
        case "BSC":
          return `https://element.market/account/${address}`;
        case "Ethereum":
          return `https://opensea.io/${address}`;
        case "Endurance":
          return `https://explorer-endurance.fusionist.io/address/${address}?tab=tokens_nfts`;
        default:
          return "#";
      }
    };
    const getNFTLink = (chain, collectionAddress, tokenId) => {
      switch (chain) {
        case "BSC":
          return `https://element.market/assets/bsc/${collectionAddress}/${tokenId}`;
        case "Ethereum":
          return `https://blur.io/eth/asset/${collectionAddress}/${tokenId}`;
        case "Endurance":
          return `https://www.tesseract.world/nfts/detail/648-${collectionAddress}-${tokenId}`;
        default:
          return "#";
      }
    };
    const shortAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—";
    const humanPrice = (v) => v || v === 0 ? v >= 1e3 ? Number(v).toLocaleString(void 0, { maximumFractionDigits: 2 }) : Number(v).toFixed(2) : "—";
    const humanUsd = (u) => u || u === 0 ? `($${Number(u).toLocaleString(void 0, { maximumFractionDigits: 2 })})` : "";
    const absTime = (tsSec) => {
      const d = new Date(typeof tsSec === "number" ? tsSec * 1e3 : Date.now());
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${y}-${m}-${dd} ${hh}:${mm}`;
    };
    const relTime = (tsSec) => {
      const now = Date.now();
      const t = typeof tsSec === "number" ? tsSec * 1e3 : now;
      const diffMs = Math.max(0, now - t);
      const hours = Math.floor(diffMs / 36e5);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };
    const timeLabelAbs = computed(() => absTime(props.item.timestamp));
    const timeLabelRel = computed(() => relTime(props.item.timestamp));
    const resolveAssetPath = (src) => {
      if (!src) return "";
      if (/^https?:\/\//i.test(src)) return src;
      const normalized = src.startsWith("/") ? src : `/${src.replace(/^\/+/, "")}`;
      return normalized;
    };
    const platformIconSrc = computed(() => {
      const raw = platformIcon[props.item.platform] || platformIcon.Element;
      return resolveAssetPath(raw);
    });
    const currencyIconSrc = computed(() => {
      const key = (props.item.currency || "").toUpperCase();
      const file = currency[key] || currency.Unknown;
      return resolveAssetPath(`currency/${file}`);
    });
    const nftThumbSrc = computed(() => resolveAssetPath(props.item.nft_image));
    const collectionUrl = computed(() => {
      const dict = getCollectionLink[props.collectionKey] || {};
      return dict[props.item.platform] || dict.default || "#";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="row row-card hidden sm:grid" data-v-dc4d8ffc><div class="cell market" data-v-dc4d8ffc><img${ssrRenderAttr("src", platformIconSrc.value)} alt="" class="icon-25" data-v-dc4d8ffc><a class="chip"${ssrRenderAttr("href", collectionUrl.value)} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(__props.item.platform || "Market")}</a></div><div class="cell asset" data-v-dc4d8ffc>`);
      if (nftThumbSrc.value) {
        _push(`<img${ssrRenderAttr("src", nftThumbSrc.value)} alt="" class="thumb" data-v-dc4d8ffc>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="asset-info" data-v-dc4d8ffc><a class="name link"${ssrRenderAttr("href", getNFTLink(__props.item.chain, __props.item.collectionAddress, __props.item.tokenId))} target="_blank" rel="noopener"${ssrRenderAttr("title", __props.item.nft_name || "#" + __props.item.tokenId)} data-v-dc4d8ffc>${ssrInterpolate(__props.item.nft_name || "#" + __props.item.tokenId)}</a></div></div><div class="cell price" data-v-dc4d8ffc><div class="price-primary-wrapper" data-v-dc4d8ffc><img${ssrRenderAttr("src", currencyIconSrc.value)} alt="" class="icon-18" data-v-dc4d8ffc><div class="price-primary" data-v-dc4d8ffc><span class="price-v num" data-v-dc4d8ffc>${ssrInterpolate(humanPrice(__props.item.price_native))}</span><span class="code" data-v-dc4d8ffc>${ssrInterpolate(__props.item.currency || "—")}</span></div></div>`);
      if (__props.item.price_usd !== void 0) {
        _push(`<div class="price-secondary" data-v-dc4d8ffc><span class="usd num" data-v-dc4d8ffc>${ssrInterpolate(humanUsd(__props.item.price_usd))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="cell actors" data-v-dc4d8ffc><a class="mono link"${ssrRenderAttr("href", getMarketLink(__props.item.chain, __props.item.from_address))} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(shortAddr(__props.item.from_address))}</a><span class="sep" data-v-dc4d8ffc>→</span><a class="mono link"${ssrRenderAttr("href", getMarketLink(__props.item.chain, __props.item.to))} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(shortAddr(__props.item.to))}</a></div><div class="cell time" data-v-dc4d8ffc><div class="time-text" data-v-dc4d8ffc><span class="abs" data-v-dc4d8ffc>${ssrInterpolate(timeLabelAbs.value)}</span><span class="dot" data-v-dc4d8ffc>·</span><span class="rel" data-v-dc4d8ffc>${ssrInterpolate(timeLabelRel.value)}</span></div>`);
      if (__props.item.txHash) {
        _push(`<a class="tx-btn"${ssrRenderAttr("href", getExplorerLink(__props.item.chain, __props.item.txHash))} target="_blank" rel="noopener" data-v-dc4d8ffc> Tx <span class="tx-icon" data-v-dc4d8ffc>↗️</span></a>`);
      } else {
        _push(`<span class="tx-btn placeholder" data-v-dc4d8ffc>Tx</span>`);
      }
      _push(`</div></div><div class="row-mobile row-card sm:hidden" data-v-dc4d8ffc><div class="top" data-v-dc4d8ffc><div class="left" data-v-dc4d8ffc>`);
      if (nftThumbSrc.value) {
        _push(`<img${ssrRenderAttr("src", nftThumbSrc.value)} alt="" class="thumb" data-v-dc4d8ffc>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="asset-info" data-v-dc4d8ffc><a class="name link"${ssrRenderAttr("href", getNFTLink(__props.item.chain, __props.item.collectionAddress, __props.item.tokenId))} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(__props.item.nft_name || "#" + __props.item.tokenId)}</a></div></div><div class="right" data-v-dc4d8ffc><div class="price-primary-wrapper" data-v-dc4d8ffc><img${ssrRenderAttr("src", currencyIconSrc.value)} alt="" class="icon-18" data-v-dc4d8ffc><div class="price-primary" data-v-dc4d8ffc><span class="price-v num" data-v-dc4d8ffc>${ssrInterpolate(humanPrice(__props.item.price_native))}</span><span class="code" data-v-dc4d8ffc>${ssrInterpolate(__props.item.currency || "—")}</span></div></div>`);
      if (__props.item.price_usd !== void 0) {
        _push(`<div class="price-secondary" data-v-dc4d8ffc><span class="usd num" data-v-dc4d8ffc>${ssrInterpolate(humanUsd(__props.item.price_usd))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="meta" data-v-dc4d8ffc><div class="market" data-v-dc4d8ffc><img${ssrRenderAttr("src", platformIconSrc.value)} alt="" class="icon-25" data-v-dc4d8ffc><a class="chip"${ssrRenderAttr("href", collectionUrl.value)} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(__props.item.platform || "Market")}</a></div><div class="actors" data-v-dc4d8ffc><a class="mono link"${ssrRenderAttr("href", getMarketLink(__props.item.chain, __props.item.from_address))} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(shortAddr(__props.item.from_address))}</a><span class="sep" data-v-dc4d8ffc>→</span><a class="mono link"${ssrRenderAttr("href", getMarketLink(__props.item.chain, __props.item.to))} target="_blank" rel="noopener" data-v-dc4d8ffc>${ssrInterpolate(shortAddr(__props.item.to))}</a></div><div class="time" data-v-dc4d8ffc><span class="muted" data-v-dc4d8ffc>${ssrInterpolate(timeLabelAbs.value)}</span><span class="sep" data-v-dc4d8ffc>·</span><span class="muted" data-v-dc4d8ffc>${ssrInterpolate(timeLabelRel.value)}</span>`);
      if (__props.item.txHash) {
        _push(`<a class="tx-btn"${ssrRenderAttr("href", getExplorerLink(__props.item.chain, __props.item.txHash))} target="_blank" rel="noopener" data-v-dc4d8ffc> Tx <span class="tx-icon" data-v-dc4d8ffc>↗️</span></a>`);
      } else {
        _push(`<span class="tx-btn placeholder" data-v-dc4d8ffc>Tx</span>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Activity/ActivityItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ActivityItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-dc4d8ffc"]]);
const _sfc_main$2 = {
  __name: "CollectionsActivityPanel",
  __ssrInlineRender: true,
  props: {
    endpoint: { type: String, required: true }
  },
  setup(__props) {
    const props = __props;
    const items = ref([]);
    const isLoading = ref(false);
    const errorText = ref("");
    async function load() {
      if (!props.endpoint) {
        items.value = [];
        return;
      }
      try {
        isLoading.value = true;
        errorText.value = "";
        items.value = [];
        const { data } = await fetchActivities(props.endpoint);
        items.value = Array.isArray(data?.actions) ? data.actions : [];
      } catch {
        errorText.value = "Failed to load activity.";
        items.value = [];
      } finally {
        isLoading.value = false;
      }
    }
    watch(() => props.endpoint, load, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "activity-panel" }, _attrs))} data-v-e0693d80><div class="head" data-v-e0693d80><div data-v-e0693d80><p class="eyebrow" data-v-e0693d80>Marketplace stream</p><div class="head-line" data-v-e0693d80><h3 data-v-e0693d80>Recent Sales</h3><span class="muted" data-v-e0693d80>${ssrInterpolate(items.value.length)} records</span></div></div><button class="refresh-btn"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} data-v-e0693d80><svg viewBox="0 0 24 24" aria-hidden="true" data-v-e0693d80><path d="M21 12a9 9 0 10-2.64 6.36" data-v-e0693d80></path><path d="M21 12h-6" data-v-e0693d80></path></svg><span data-v-e0693d80>${ssrInterpolate(isLoading.value ? "Refreshing…" : "Refresh")}</span></button></div>`);
      if (isLoading.value && !items.value.length) {
        _push(`<!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="skeleton-row" data-v-e0693d80></div>`);
        });
        _push(`<!--]-->`);
      } else if (!isLoading.value && !items.value.length) {
        _push(`<div class="empty" data-v-e0693d80> No recent sales yet </div>`);
      } else {
        _push(`<div class="list" data-v-e0693d80><!--[-->`);
        ssrRenderList(items.value, (it, i) => {
          _push(ssrRenderComponent(ActivityItem, {
            key: it.txHash || it.tokenId || i,
            item: it,
            "collection-key": __props.endpoint
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (errorText.value) {
        _push(`<div class="error" data-v-e0693d80>${ssrInterpolate(errorText.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/Activity/ActivityPanel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ActivityPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e0693d80"]]);
const _sfc_main$1 = {
  __name: "CollectionsUITabsPanel",
  __ssrInlineRender: true,
  props: {
    modelValue: String
  },
  emits: ["update:modelValue"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tabs" }, _attrs))} data-v-6319a049><button class="${ssrRenderClass(["tab", __props.modelValue === "Cards" && "active"])}" data-v-6319a049> NFTs </button><button class="${ssrRenderClass(["tab", __props.modelValue === "Activity" && "active"])}" data-v-6319a049> Activity </button></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/UI/TabsPanel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TabsPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6319a049"]]);
const _sfc_main = {
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const cardStore = useCardStore();
    const filterStore = useFilterStore();
    const showFilterPanel = ref(false);
    const currentPanel = ref("Cards");
    const isMobile = computed(() => false);
    const sortOrder = computed({
      get: () => filterStore.order,
      set: (val) => filterStore.setOrder(val)
    });
    const currentCollection = computed(() => collections[route.params.slug] || null);
    const endPoint = computed(() => currentCollection.value?.queryName || "");
    const selectedFiltersCount = computed(() => {
      const traits = filterStore.traits?.length || 0;
      const statuses = filterStore.status?.length || 0;
      const sources = filterStore.sources?.length || 0;
      const buys = filterStore.tradeType ? 1 : 0;
      const price = filterStore.priceRangeMax ? 1 : 0;
      return traits + statuses + sources + buys + price;
    });
    const handleToggleFilter = () => {
      showFilterPanel.value = !showFilterPanel.value;
      if (isMobile.value) toggleScrollLock(showFilterPanel.value);
    };
    watch(() => route.params.slug, () => {
      currentPanel.value = "Cards";
      showFilterPanel.value = false;
    });
    useHead(() => ({
      title: currentCollection.value ? `${currentCollection.value.page.name} — Collections` : "Collections"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      if (currentCollection.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen space-y-2" }, _attrs))} data-v-6b1b3bb7><header class="collections-header" data-v-6b1b3bb7><div class="head-left" data-v-6b1b3bb7><img${ssrRenderAttr("src", currentCollection.value.page.image)} class="logo" alt="collection logo" data-v-6b1b3bb7><div data-v-6b1b3bb7><p class="eyebrow" data-v-6b1b3bb7>Fusionist collection</p><h2 class="title" data-v-6b1b3bb7>${ssrInterpolate(currentCollection.value.page.name)}</h2></div></div><div class="controls-row" data-v-6b1b3bb7><div class="filters-inline" data-v-6b1b3bb7><button class="filter-toggle" data-v-6b1b3bb7><img${ssrRenderAttr("src", _imports_0)} class="w-5 sm:w-6" alt="filter" data-v-6b1b3bb7> Filters `);
        if (selectedFiltersCount.value) {
          _push(`<span class="count" data-v-6b1b3bb7>(${ssrInterpolate(selectedFiltersCount.value)})</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><div class="tabs-wrap" data-v-6b1b3bb7>`);
        _push(ssrRenderComponent(TabsPanel, {
          modelValue: currentPanel.value,
          "onUpdate:modelValue": ($event) => currentPanel.value = $event
        }, null, _parent));
        _push(`</div><div class="indicator" data-v-6b1b3bb7><span class="dot" data-v-6b1b3bb7></span><span data-v-6b1b3bb7>Items: <span class="font-medium" data-v-6b1b3bb7>${ssrInterpolate(unref(cardStore).maxCards)}</span></span></div><div class="sort-area" data-v-6b1b3bb7><label for="sort-select" class="sr-only" data-v-6b1b3bb7>Sort by</label><div class="select-wrapper" data-v-6b1b3bb7><select id="sort-select" class="sort-select" data-v-6b1b3bb7><option value="priceDesc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "priceDesc") : ssrLooseEqual(sortOrder.value, "priceDesc")) ? " selected" : ""}>Price: High to low</option><option value="priceAsc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "priceAsc") : ssrLooseEqual(sortOrder.value, "priceAsc")) ? " selected" : ""}>Price: Low to high</option><option value="rarityDesc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "rarityDesc") : ssrLooseEqual(sortOrder.value, "rarityDesc")) ? " selected" : ""}>Rarity: High to low</option><option value="rarityAsc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "rarityAsc") : ssrLooseEqual(sortOrder.value, "rarityAsc")) ? " selected" : ""}>Rarity: Low to high</option><option value="tokenIdDesc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "tokenIdDesc") : ssrLooseEqual(sortOrder.value, "tokenIdDesc")) ? " selected" : ""}>Token id: High to low</option><option value="tokenIdAsc" data-v-6b1b3bb7${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "tokenIdAsc") : ssrLooseEqual(sortOrder.value, "tokenIdAsc")) ? " selected" : ""}>Token id: Low to high</option></select><svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-6b1b3bb7><path d="M6 9l6 6 6-6" data-v-6b1b3bb7></path></svg></div></div></div></div></header>`);
        if (currentPanel.value === "Cards") {
          _push(`<div data-v-6b1b3bb7><div class="mt-8 relative h-full" data-v-6b1b3bb7>`);
          _push(ssrRenderComponent(FiltersPanel, {
            "is-filter-panel-open": showFilterPanel.value,
            onToggle: handleToggleFilter
          }, null, _parent));
          _push(ssrRenderComponent(CardsList, {
            endpoint: endPoint.value,
            key: endPoint.value
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<div data-v-6b1b3bb7>`);
          _push(ssrRenderComponent(ActivityPanel, { endpoint: endPoint.value }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-10 text-white/80" }, _attrs))} data-v-6b1b3bb7> Unknown collection. </div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6b1b3bb7"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-B_Z3dkqv.mjs.map
