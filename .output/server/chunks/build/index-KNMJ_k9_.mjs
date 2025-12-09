import { mergeProps, createVNode, resolveDynamicComponent, withCtx, createBlock, toDisplayString, openBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const sections = [
      {
        to: "/wiki/cores",
        title: "Cores",
        desc: "Full stats, rarities, passives and label filters.",
        status: "Live",
        accent: "from-emerald-400/40 to-teal-500/40"
      },
      {
        to: "/wiki/weapons",
        title: "Weapons / Skills",
        desc: "Jobs, weapon slots, label faceting and advanced modal.",
        status: "Live",
        accent: "from-sky-400/40 to-indigo-500/40"
      },
      {
        to: "/wiki/buffs",
        title: "Buffs",
        desc: "A section in development",
        status: "Soon",
        accent: "from-amber-400/40 to-pink-500/40",
        comingSoon: true
      }
    ];
    useHead({ title: "Wiki — Fusionist Palantir" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "wiki-home mx-auto max-w-6xl" }, _attrs))} data-v-74b1f8ce><div class="lead-card" data-v-74b1f8ce><p class="text-xs uppercase tracking-[0.4em] text-white/60" data-v-74b1f8ce>Fusionist wiki</p><h1 class="mt-3 text-4xl font-semibold" data-v-74b1f8ce>One hub for Cores, Weapons and upcoming Buffs.</h1><p class="mt-4 text-sm text-white/70" data-v-74b1f8ce> We synchronize the data with the live API and use Palantir&#39;s filters to enhance it. </p></div><div class="grid gap-5 md:grid-cols-3" data-v-74b1f8ce><!--[-->`);
      ssrRenderList(sections, (entry) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(entry.comingSoon ? "div" : "NuxtLink"), {
          key: entry.title,
          to: entry.comingSoon ? void 0 : entry.to,
          class: ["wiki-tile", [
            `bg-gradient-to-br ${entry.accent}`,
            entry.comingSoon ? "opacity-70 cursor-not-allowed" : "hover:border-white/60"
          ]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex items-center justify-between" data-v-74b1f8ce${_scopeId}><h2 class="text-2xl font-semibold text-white" data-v-74b1f8ce${_scopeId}>${ssrInterpolate(entry.title)}</h2><span class="${ssrRenderClass([entry.status === "Soon" ? "bg-amber-400/80 text-black" : "bg-emerald-400/80 text-black", "status-pill"])}" data-v-74b1f8ce${_scopeId}>${ssrInterpolate(entry.status)}</span></div><p class="mt-3 text-sm text-white/80" data-v-74b1f8ce${_scopeId}>${ssrInterpolate(entry.desc)}</p>`);
              if (!entry.comingSoon) {
                _push2(`<div class="mt-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70" data-v-74b1f8ce${_scopeId}> View details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" data-v-74b1f8ce${_scopeId}><path d="M5 12h14" data-v-74b1f8ce${_scopeId}></path><path d="M13 5l7 7-7 7" data-v-74b1f8ce${_scopeId}></path></svg></div>`);
              } else {
                _push2(`<div class="mt-auto text-xs uppercase tracking-[0.3em] text-white/80" data-v-74b1f8ce${_scopeId}> Work in progress </div>`);
              }
            } else {
              return [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("h2", { class: "text-2xl font-semibold text-white" }, toDisplayString(entry.title), 1),
                  createVNode("span", {
                    class: ["status-pill", entry.status === "Soon" ? "bg-amber-400/80 text-black" : "bg-emerald-400/80 text-black"]
                  }, toDisplayString(entry.status), 3)
                ]),
                createVNode("p", { class: "mt-3 text-sm text-white/80" }, toDisplayString(entry.desc), 1),
                !entry.comingSoon ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "mt-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70"
                }, [
                  createTextVNode(" View details "),
                  (openBlock(), createBlock("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1.6"
                  }, [
                    createVNode("path", { d: "M5 12h14" }),
                    createVNode("path", { d: "M13 5l7 7-7 7" })
                  ]))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "mt-auto text-xs uppercase tracking-[0.3em] text-white/80"
                }, " Work in progress "))
              ];
            }
          }),
          _: 2
        }), _parent);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/wiki/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-74b1f8ce"]]);

export { index as default };
//# sourceMappingURL=index-KNMJ_k9_.mjs.map
