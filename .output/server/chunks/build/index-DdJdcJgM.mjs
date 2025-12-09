import { withAsyncContext, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAsyncData, B as BannerPanel } from './BannerPanel-DZcqVeJ4.mjs';
import { f as fetchBanners } from './api-DjRwVJCC.mjs';
import { u as useHead } from './server.mjs';
import 'perfect-debounce';
import './nuxt-link-tHiwtXY9.mjs';
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
    useHead({ title: "Collections — Fusionist Palantir" });
    const { data: bannerCollections } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("collections-banners", async () => {
      const { data } = await fetchBanners();
      return data?.collections || {};
    }, { server: true })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DdJdcJgM.mjs.map
