import { computed, mergeProps, ref, watch, withCtx, createVNode, createTextVNode, createBlock, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-tHiwtXY9.mjs';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { t as toggleScrollLock, _ as _imports_1$1 } from './scrollLock-C9L39gzN.mjs';
import { a as currency } from './dictsList-DakXjKh3.mjs';
import { g as useRoute, _ as _export_sfc } from './server.mjs';
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

const _imports_0$1 = publicAssetsURL("/logo_cropped.png");
const _sfc_main$2 = {
  __name: "HeaderSection",
  __ssrInlineRender: true,
  setup(__props) {
    const isOpen = ref(false);
    ref(null);
    const navItems = [
      { to: "/collections/fusionist_planet", label: "Fusionist Planet" },
      { to: "/collections/bi_mech", label: "Bi-Mech" },
      { to: "/collections/quartan_primes", label: "Quartan Primes" },
      { to: "/collections/alpha_prestige", label: "Alpha Prestige" },
      { to: "/collections/pioneer_of_fusionist", label: "Pioneer of Fusionist" },
      { to: "/collections/primeace", label: "PrimeACE" }
    ];
    const wikiNavItems = [
      { to: "/wiki", label: "Wiki Hub", detail: "Overview & entry point" },
      { to: "/wiki/cores", label: "Cores", detail: "Stats, rarities, passives" },
      { to: "/wiki/weapons", label: "Weapons", detail: "Jobs, slots, labels" },
      { to: "/wiki/buffs", label: "Buffs", detail: "Coming soon", soon: true }
    ];
    const close = () => {
      isOpen.value = false;
    };
    watch(isOpen, (val) => {
      toggleScrollLock(val);
    });
    const rawCryptos = ref([]);
    ref(false);
    const desiredOrder = ["ACE", "ETH", "BNB"];
    const iconFor = (sym) => `/currency/${currency[sym] ?? currency.Unknown}`;
    const fmt = (v) => {
      if (v >= 1e3) return Math.round(v).toString();
      if (v >= 100) return v.toFixed(1);
      if (v >= 1) return v.toFixed(2);
      return v.toFixed(2);
    };
    const cryptos = computed(() => {
      const bySymbol = Object.fromEntries(rawCryptos.value.map((c) => [c.symbol, c]));
      return desiredOrder.map((sym) => bySymbol[sym]).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[--><header class="relative z-40 border-b border-white/5 bg-[#05060c]/70 header-blur shadow-[0_10px_40px_rgba(5,6,12,0.6)]" data-v-0fd1d068><div class="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen gradient-noise" aria-hidden="true" data-v-0fd1d068></div><div class="relative mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between" data-v-0fd1d068>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 backdrop-blur"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400/70 to-blue-500/70 text-white shadow-lg shadow-sky-900/50 transition duration-300 group-hover:scale-105" data-v-0fd1d068${_scopeId}><img${ssrRenderAttr("src", _imports_0$1)} alt="PALANTIR logo" class="h-8 w-8" data-v-0fd1d068${_scopeId}></div><div data-v-0fd1d068${_scopeId}><p class="text-[10px] uppercase tracking-[0.5em] text-white/70" data-v-0fd1d068${_scopeId}>Fusionist</p><p class="text-2xl font-semibold tracking-[0.3em] text-white drop-shadow logo-grad" data-v-0fd1d068${_scopeId}>Palantir</p></div>`);
          } else {
            return [
              createVNode("div", { class: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400/70 to-blue-500/70 text-white shadow-lg shadow-sky-900/50 transition duration-300 group-hover:scale-105" }, [
                createVNode("img", {
                  src: _imports_0$1,
                  alt: "PALANTIR logo",
                  class: "h-8 w-8"
                })
              ]),
              createVNode("div", null, [
                createVNode("p", { class: "text-[10px] uppercase tracking-[0.5em] text-white/70" }, "Fusionist"),
                createVNode("p", { class: "text-2xl font-semibold tracking-[0.3em] text-white drop-shadow logo-grad" }, "Palantir")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex flex-col gap-3 text-sm font-semibold text-white/80 sm:flex-row sm:items-center sm:gap-4" data-v-0fd1d068><div class="flex items-center gap-2 justify-center" data-v-0fd1d068><button class="nav-chip"${ssrRenderAttr("aria-expanded", isOpen.value ? "true" : "false")} aria-controls="collections-drawer" data-v-0fd1d068><span class="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" data-v-0fd1d068></span> Collections </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wiki",
        class: "nav-chip relative"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Wiki Hub <span class="badge" data-v-0fd1d068${_scopeId}>NEW</span>`);
          } else {
            return [
              createTextVNode(" Wiki Hub "),
              createVNode("span", { class: "badge" }, "NEW")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wiki/weapons",
        class: "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/80 to-indigo-500/80 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:shadow-sky-900/60"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explore Weapons <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-0fd1d068${_scopeId}><path d="M5 12h14" data-v-0fd1d068${_scopeId}></path><path d="M13 5l7 7-7 7" data-v-0fd1d068${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Explore Weapons "),
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M5 12h14" }),
                createVNode("path", { d: "M13 5l7 7-7 7" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/wiki/cores",
        class: "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400/80 to-teal-500/80 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:shadow-emerald-900/60"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explore Cores <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-0fd1d068${_scopeId}><path d="M5 12h14" data-v-0fd1d068${_scopeId}></path><path d="M13 5l7 7-7 7" data-v-0fd1d068${_scopeId}></path></svg>`);
          } else {
            return [
              createTextVNode(" Explore Cores "),
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("path", { d: "M5 12h14" }),
                createVNode("path", { d: "M13 5l7 7-7 7" })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div></header>`);
      if (cryptos.value.length) {
        _push(`<section class="relative isolate border-b border-white/5 bg-[#05060c]/60 py-2 backdrop-blur-xl" data-v-0fd1d068><div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10" aria-hidden="true" data-v-0fd1d068></div><div class="relative mx-auto max-w-screen-2xl px-5 text-white/80" aria-label="Crypto prices" data-v-0fd1d068><ul class="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm" data-v-0fd1d068><!--[-->`);
        ssrRenderList(cryptos.value, (c) => {
          _push(`<li class="glass-chip flex items-center gap-2 rounded-full px-4 py-1.5" data-v-0fd1d068><img${ssrRenderAttr("src", iconFor(c.symbol))}${ssrRenderAttr("alt", c.symbol)} class="h-4 w-4" data-v-0fd1d068><span class="text-[11px] uppercase tracking-[0.25em] text-white/60" data-v-0fd1d068>${ssrInterpolate(c.symbol)}</span><span class="tabular-nums text-white" data-v-0fd1d068>${ssrInterpolate(fmt(c.value))}</span></li>`);
        });
        _push(`<!--]--></ul></div></section>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<template><div class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur" role="presentation" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-0fd1d068></div></template><template><aside id="collections-drawer" class="fixed right-0 top-0 z-[9999] flex h-full w-full flex-col bg-transparent text-white shadow-2xl ring-1 ring-white/10 header-blur sm:w-[460px]" role="dialog" aria-modal="true" aria-labelledby="collections-title" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}" data-v-0fd1d068><div class="flex items-center justify-between border-b border-white/10 p-5" data-v-0fd1d068><div data-v-0fd1d068><p class="text-xs uppercase tracking-[0.4em] text-white/60" data-v-0fd1d068>Navigator</p><h2 id="collections-title" class="text-2xl font-semibold text-white" data-v-0fd1d068> Collections &amp; Wiki </h2></div><button class="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400" aria-label="Close collections" data-v-0fd1d068><img${ssrRenderAttr("src", _imports_1$1)} alt="Close" class="w-4 h-4" data-v-0fd1d068></button></div><div class="flex-1 overflow-y-auto p-6 space-y-8 panel-body-bg" data-v-0fd1d068><section data-v-0fd1d068><p class="mb-3 text-[11px] uppercase tracking-[0.4em] text-white/50" data-v-0fd1d068>Collections</p><nav data-v-0fd1d068><ul class="space-y-2" data-v-0fd1d068><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push2(`<li data-v-0fd1d068>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: item.to,
            class: "glass-row",
            onClick: close
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<div data-v-0fd1d068${_scopeId}><p class="font-semibold text-white" data-v-0fd1d068${_scopeId}>${ssrInterpolate(item.label)}</p><p class="text-xs text-white/60" data-v-0fd1d068${_scopeId}>NFT analytics &amp; drop overview</p></div><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-0fd1d068${_scopeId}><path d="M9 18l6-6-6-6" data-v-0fd1d068${_scopeId}></path></svg>`);
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("p", { class: "font-semibold text-white" }, toDisplayString(item.label), 1),
                    createVNode("p", { class: "text-xs text-white/60" }, "NFT analytics & drop overview")
                  ]),
                  (openBlock(), createBlock("svg", {
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }, [
                    createVNode("path", { d: "M9 18l6-6-6-6" })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push2(`</li>`);
        });
        _push2(`<!--]--></ul></nav></section><section data-v-0fd1d068><div class="mb-4 flex items-center justify-between" data-v-0fd1d068><div data-v-0fd1d068><p class="text-[11px] uppercase tracking-[0.3em] text-white/60" data-v-0fd1d068>Wiki</p><p class="text-lg font-semibold text-white" data-v-0fd1d068>Game Encyclopedia</p></div><span class="badge" data-v-0fd1d068>Updated</span></div><ul class="space-y-2" data-v-0fd1d068><!--[-->`);
        ssrRenderList(wikiNavItems, (wiki) => {
          _push2(`<li data-v-0fd1d068>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: wiki.to,
            class: ["glass-row text-sm", { "opacity-70": wiki.soon }],
            onClick: close
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<div data-v-0fd1d068${_scopeId}><p class="font-semibold text-white" data-v-0fd1d068${_scopeId}>${ssrInterpolate(wiki.label)}</p><p class="text-xs text-white/60" data-v-0fd1d068${_scopeId}>${ssrInterpolate(wiki.detail)}</p></div>`);
                if (wiki.soon) {
                  _push3(`<span class="badge" data-v-0fd1d068${_scopeId}>Soon</span>`);
                } else {
                  _push3(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-0fd1d068${_scopeId}><path d="M8 12h8" data-v-0fd1d068${_scopeId}></path><path d="M12 8l4 4-4 4" data-v-0fd1d068${_scopeId}></path></svg>`);
                }
              } else {
                return [
                  createVNode("div", null, [
                    createVNode("p", { class: "font-semibold text-white" }, toDisplayString(wiki.label), 1),
                    createVNode("p", { class: "text-xs text-white/60" }, toDisplayString(wiki.detail), 1)
                  ]),
                  wiki.soon ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "badge"
                  }, "Soon")) : (openBlock(), createBlock("svg", {
                    key: 1,
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "1.5"
                  }, [
                    createVNode("path", { d: "M8 12h8" }),
                    createVNode("path", { d: "M12 8l4 4-4 4" })
                  ]))
                ];
              }
            }),
            _: 2
          }, _parent));
          _push2(`</li>`);
        });
        _push2(`<!--]--></ul></section><div class="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-white/60" data-v-0fd1d068><span data-v-0fd1d068>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Palantir</span>`);
        _push2(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "text-[#63b4c8] hover:text-white",
          onClick: close
        }, {
          default: withCtx((_, _push3, _parent2, _scopeId) => {
            if (_push3) {
              _push3(` Home `);
            } else {
              return [
                createTextVNode(" Home ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push2(`</div></div></aside></template>`);
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeaderSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const HeaderSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-0fd1d068"]]);
const _imports_0 = publicAssetsURL("/fusionist-logo.svg");
const _imports_1 = publicAssetsURL("/social-icons/discord.svg");
const _imports_2 = publicAssetsURL("/social-icons/x.svg");
const _imports_3 = publicAssetsURL("/social-icons/website.svg");
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer-shell" }, _attrs))} data-v-88d5e1fc><div class="pointer-events-none absolute inset-0 gradient-noise" aria-hidden="true" data-v-88d5e1fc></div><div class="footer-inner" data-v-88d5e1fc><div class="space-y-4" data-v-88d5e1fc><p class="text-[11px] uppercase tracking-[0.4em] text-white/60" data-v-88d5e1fc>Palantir</p><h2 class="text-3xl font-semibold leading-tight" data-v-88d5e1fc>Fusionist companion built for pilots, collectors &amp; guilds.</h2><p class="text-sm text-white/70" data-v-88d5e1fc> Stay ahead of drops, NFT performance and in-game balance. The wiki now covers Cores and Weapons with transparent stats. </p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/wiki",
    class: "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/70 to-blue-500/70 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:shadow-sky-900/60"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Visit Wiki Hub <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-88d5e1fc${_scopeId}><path d="M5 12h14" data-v-88d5e1fc${_scopeId}></path><path d="M13 5l7 7-7 7" data-v-88d5e1fc${_scopeId}></path></svg>`);
      } else {
        return [
          createTextVNode(" Visit Wiki Hub "),
          (openBlock(), createBlock("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2"
          }, [
            createVNode("path", { d: "M5 12h14" }),
            createVNode("path", { d: "M13 5l7 7-7 7" })
          ]))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="footer-card glass-surface glass-surface--radial footer-center" data-v-88d5e1fc><img${ssrRenderAttr("src", _imports_0)} alt="Fusionist Logo" class="h-16 w-auto" data-v-88d5e1fc><div class="space-y-1 text-sm text-white/70" data-v-88d5e1fc><p data-v-88d5e1fc>Inspired by Fusionist.io</p><p class="text-base font-semibold text-white" data-v-88d5e1fc>Community edition</p></div><a href="https://fusionist.io" target="_blank" rel="noopener" class="text-xs uppercase tracking-[0.4em] text-white/60 hover:text-white" data-v-88d5e1fc> fusionist.io </a></div><div class="grid gap-6 sm:grid-cols-2 md:grid-cols-1" data-v-88d5e1fc><div data-v-88d5e1fc><p class="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-3" data-v-88d5e1fc>Explore</p><ul class="space-y-2 text-sm text-white/70" data-v-88d5e1fc><li data-v-88d5e1fc>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/collections",
    class: "footer-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Collections`);
      } else {
        return [
          createTextVNode("Collections")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-88d5e1fc>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/wiki/cores",
    class: "footer-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cores Atlas`);
      } else {
        return [
          createTextVNode("Cores Atlas")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-88d5e1fc>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/wiki/weapons",
    class: "footer-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Weapons / Skills`);
      } else {
        return [
          createTextVNode("Weapons / Skills")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-88d5e1fc>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/wiki/buffs",
    class: "footer-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Buffs (Soon)`);
      } else {
        return [
          createTextVNode("Buffs (Soon)")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-88d5e1fc>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contacts",
    class: "footer-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Contacts`);
      } else {
        return [
          createTextVNode("Contacts")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div data-v-88d5e1fc><p class="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-3" data-v-88d5e1fc>Social</p><div class="flex flex-wrap gap-3" data-v-88d5e1fc><a href="https://discord.gg/fusionistio" target="_blank" rel="noopener" aria-label="Fusionist Discord" class="social-pill glass-chip" data-v-88d5e1fc><img${ssrRenderAttr("src", _imports_1)} alt="Discord" class="h-5 w-5" data-v-88d5e1fc> Discord </a><a href="https://x.com/fusionistio" target="_blank" rel="noopener" aria-label="Fusionist on X" class="social-pill glass-chip" data-v-88d5e1fc><img${ssrRenderAttr("src", _imports_2)} alt="X (Twitter)" class="h-5 w-5" data-v-88d5e1fc> X / Twitter </a><a href="https://ace.fusionist.io/?ic=508701" target="_blank" rel="noopener" aria-label="Fusionist Website" class="social-pill glass-chip" data-v-88d5e1fc><img${ssrRenderAttr("src", _imports_3)} alt="Website" class="h-5 w-5" data-v-88d5e1fc> ACE Portal </a></div></div></div></div><div class="footer-bottom" data-v-88d5e1fc> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Palantir • Crafted for the Fusionist community </div></footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FooterSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const FooterSection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-88d5e1fc"]]), { __name: "FooterSection" });
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const glassShell = computed(() => route.meta?.glassShell);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-default" }, _attrs))}>`);
      _push(ssrRenderComponent(HeaderSection, null, null, _parent));
      _push(`<main class="${ssrRenderClass([
        "w-full grow lg:px-12 sm:pt-10 pb-10 pt-5 px-3",
        glassShell.value ? "page-shell" : "page-wide"
      ])}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(FooterSection, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DMZ2nx6y.mjs.map
