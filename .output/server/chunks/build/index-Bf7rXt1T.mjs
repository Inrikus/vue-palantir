import { _ as __nuxt_component_0 } from './nuxt-link-tHiwtXY9.mjs';
import { withAsyncContext, computed, mergeProps, withCtx, createVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAsyncData, B as BannerPanel } from './BannerPanel-DZcqVeJ4.mjs';
import { f as fetchBanners } from './api-DjRwVJCC.mjs';
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
import 'perfect-debounce';
import './dictsList-DakXjKh3.mjs';
import 'axios';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Fusionist — Palantir" });
    const { data: bannerCollections, error } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-banners", async () => {
      const { data } = await fetchBanners();
      return data?.collections || {};
    }, { server: true })), __temp = await __temp, __restore(), __temp);
    const listedCount = computed(() => {
      const entries = bannerCollections.value || {};
      return Object.values(entries).reduce((sum, entry) => sum + (entry?.count_on_sale || 0), 0);
    });
    const tiles = computed(() => [
      {
        title: "Wiki",
        description: "Dive into the encyclopaedia for Cores, Weapons and the upcoming Buffs.",
        hint: "Knowledge base",
        action: "Explore wiki",
        to: "/wiki"
      },
      {
        title: "Collections",
        description: "Live floor prices, filters and analytics across six Fusionist drops.",
        hint: "Marketplace",
        action: listedCount.value ? `${listedCount.value} items listed` : "Browse items",
        to: "/collections"
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "home" }, _attrs))} data-v-a6cc662b><div class="promo-grid" data-v-a6cc662b><!--[-->`);
      ssrRenderList(tiles.value, (tile) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: tile.to,
          to: tile.to,
          class: "promo-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<p class="eyebrow" data-v-a6cc662b${_scopeId}>${ssrInterpolate(tile.hint)}</p><h2 data-v-a6cc662b${_scopeId}>${ssrInterpolate(tile.title)}</h2><p class="description" data-v-a6cc662b${_scopeId}>${ssrInterpolate(tile.description)}</p><span class="action" data-v-a6cc662b${_scopeId}>${ssrInterpolate(tile.action)} →</span>`);
            } else {
              return [
                createVNode("p", { class: "eyebrow" }, toDisplayString(tile.hint), 1),
                createVNode("h2", null, toDisplayString(tile.title), 1),
                createVNode("p", { class: "description" }, toDisplayString(tile.description), 1),
                createVNode("span", { class: "action" }, toDisplayString(tile.action) + " →", 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (unref(error)) {
        _push(`<p class="error-text" data-v-a6cc662b>Failed to load stats. Live data will appear on client.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(BannerPanel, {
        "initial-banners": unref(bannerCollections) || {}
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a6cc662b"]]);

export { index as default };
//# sourceMappingURL=index-Bf7rXt1T.mjs.map
