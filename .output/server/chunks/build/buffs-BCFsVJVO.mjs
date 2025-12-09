import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { u as useHead } from './server.mjs';
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
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "buffs",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Wiki — Buffs" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl space-y-6" }, _attrs))}><div class="rounded-3xl border border-dashed border-amber-300/60 bg-white/5 p-8 text-white shadow-xl shadow-amber-900/20 backdrop-blur"><p class="text-xs uppercase tracking-[0.4em] text-amber-200/80">Coming soon</p><h1 class="mt-3 text-3xl font-semibold">Wiki — Buffs</h1><p class="mt-4 text-sm text-white/70"> We are collecting battle logs and power-up tables for mechs. This section will soon show stackable buffs, activation conditions, and connections to cores. </p><div class="mt-6 grid gap-4 sm:grid-cols-2"><div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.4em] text-white/60">Planned</p><p class="text-sm font-semibold text-white">Buff catalog + filters</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.4em] text-white/60">Planned</p><p class="text-sm font-semibold text-white">Synergy heatmaps</p></div></div></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wiki/buffs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=buffs-BCFsVJVO.mjs.map
