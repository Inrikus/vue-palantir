import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "contacts",
  __ssrInlineRender: true,
  setup(__props) {
    const contacts2 = [
      {
        name: "Inrikus",
        title: "Palantir Creator",
        avatar: "/logo_cropped.png",
        links: [
          { label: "Telegram", icon: "/social-icons/telegram.svg", url: "https://t.me/Inrikus" },
          { label: "X (Twitter)", icon: "/social-icons/x.svg", url: "https://x.com/MikeSco67162628" },
          { label: "Discord: inrikus", icon: "/social-icons/discord.svg" }
        ]
      },
      {
        name: "No_Suli4",
        title: "UI/UX advisor",
        avatar: "/logo_cropped.png",
        links: [
          { label: "Telegram", icon: "/social-icons/telegram.svg", url: "https://t.me/No_Suli4" }
        ]
      }
    ];
    useHead({ title: "Contacts — Fusionist Palantir" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "contacts" }, _attrs))} data-v-84b4b571><div class="hero" data-v-84b4b571><h1 data-v-84b4b571>Say hello</h1><p data-v-84b4b571>Reach out if you want to collaborate, share alpha or just talk Fusionist.</p></div><!--[-->`);
      ssrRenderList(contacts2, (contact) => {
        _push(`<article class="card glass-panel" data-v-84b4b571><div class="profile" data-v-84b4b571><img${ssrRenderAttr("src", contact.avatar)}${ssrRenderAttr("alt", contact.name)} data-v-84b4b571><div data-v-84b4b571><h2 data-v-84b4b571>${ssrInterpolate(contact.name)}</h2><p data-v-84b4b571>${ssrInterpolate(contact.title)}</p></div></div><ul class="links" data-v-84b4b571><!--[-->`);
        ssrRenderList(contact.links, (link) => {
          _push(`<li data-v-84b4b571><img${ssrRenderAttr("src", link.icon)} alt="" data-v-84b4b571>`);
          if (link.url) {
            _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener" data-v-84b4b571>${ssrInterpolate(link.label)}</a>`);
          } else {
            _push(`<span data-v-84b4b571>${ssrInterpolate(link.label)}</span>`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></article>`);
      });
      _push(`<!--]--></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contacts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const contacts = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-84b4b571"]]);

export { contacts as default };
//# sourceMappingURL=contacts-CtPVaJhS.mjs.map
