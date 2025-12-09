
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'FooterSection': typeof import("../../app/components/FooterSection.vue").default
  'HeaderSection': typeof import("../../app/components/HeaderSection.vue").default
  'CollectionsActivityItem': typeof import("../../app/components/collections/Activity/ActivityItem.vue").default
  'CollectionsActivityPanel': typeof import("../../app/components/collections/Activity/ActivityPanel.vue").default
  'CollectionsBadgesBadgeMech': typeof import("../../app/components/collections/Badges/BadgeMech.vue").default
  'CollectionsBadgesBadgePlanet': typeof import("../../app/components/collections/Badges/BadgePlanet.vue").default
  'CollectionsBannerItem': typeof import("../../app/components/collections/Banner/BannerItem.vue").default
  'CollectionsBannerPanel': typeof import("../../app/components/collections/Banner/BannerPanel.vue").default
  'CollectionsCardsCardItem': typeof import("../../app/components/collections/Cards/CardItem.vue").default
  'CollectionsCardsList': typeof import("../../app/components/collections/Cards/CardsList.vue").default
  'CollectionsCardsInfinitePager': typeof import("../../app/components/collections/Cards/InfinitePager.vue").default
  'CollectionsFiltersPanel': typeof import("../../app/components/collections/Filters/FiltersPanel.vue").default
  'CollectionsUIArrowIcon': typeof import("../../app/components/collections/UI/ArrowIcon.vue").default
  'CollectionsUITabsPanel': typeof import("../../app/components/collections/UI/TabsPanel.vue").default
  'WikiActiveFiltersBar': typeof import("../../app/components/wiki/ActiveFiltersBar.vue").default
  'WikiCoreCard': typeof import("../../app/components/wiki/CoreCard.vue").default
  'WikiInfinitePager': typeof import("../../app/components/wiki/InfinitePager.vue").default
  'WikiLocalePicker': typeof import("../../app/components/wiki/LocalePicker.vue").default
  'WikiWeaponCard': typeof import("../../app/components/wiki/WeaponCard.vue").default
  'WikiCoreFilterPanel': typeof import("../../app/components/wiki/WikiCoreFilterPanel.vue").default
  'WikiDetailModal': typeof import("../../app/components/wiki/WikiDetailModal.vue").default
  'WikiFilterPanelFrame': typeof import("../../app/components/wiki/WikiFilterPanelFrame.vue").default
  'WikiWeaponFilterPanel': typeof import("../../app/components/wiki/WikiWeaponFilterPanel.vue").default
  'WikiFiltersDicts': typeof import("../../app/components/wiki/filters/dicts").default
  'ProseA': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue").default
  'ProseBlockquote': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue").default
  'ProseCode': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue").default
  'ProseEm': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue").default
  'ProseH1': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue").default
  'ProseH2': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue").default
  'ProseH3': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue").default
  'ProseH4': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue").default
  'ProseH5': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue").default
  'ProseH6': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue").default
  'ProseHr': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue").default
  'ProseImg': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseImg.vue").default
  'ProseLi': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue").default
  'ProseOl': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue").default
  'ProseP': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue").default
  'ProsePre': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue").default
  'ProseScript': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue").default
  'ProseStrong': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue").default
  'ProseTable': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue").default
  'ProseTbody': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue").default
  'ProseTd': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue").default
  'ProseTh': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue").default
  'ProseThead': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue").default
  'ProseTr': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue").default
  'ProseUl': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue").default
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'NuxtLinkLocale': typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale").default
  'SwitchLocalePathLink': typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink").default
  'ContentRenderer': typeof import("../../node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue").default
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body
  'MDC': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue").default
  'MDCCached': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue").default
  'MDCRenderer': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue").default
  'MDCSlot': typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue").default
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyFooterSection': LazyComponent<typeof import("../../app/components/FooterSection.vue").default>
  'LazyHeaderSection': LazyComponent<typeof import("../../app/components/HeaderSection.vue").default>
  'LazyCollectionsActivityItem': LazyComponent<typeof import("../../app/components/collections/Activity/ActivityItem.vue").default>
  'LazyCollectionsActivityPanel': LazyComponent<typeof import("../../app/components/collections/Activity/ActivityPanel.vue").default>
  'LazyCollectionsBadgesBadgeMech': LazyComponent<typeof import("../../app/components/collections/Badges/BadgeMech.vue").default>
  'LazyCollectionsBadgesBadgePlanet': LazyComponent<typeof import("../../app/components/collections/Badges/BadgePlanet.vue").default>
  'LazyCollectionsBannerItem': LazyComponent<typeof import("../../app/components/collections/Banner/BannerItem.vue").default>
  'LazyCollectionsBannerPanel': LazyComponent<typeof import("../../app/components/collections/Banner/BannerPanel.vue").default>
  'LazyCollectionsCardsCardItem': LazyComponent<typeof import("../../app/components/collections/Cards/CardItem.vue").default>
  'LazyCollectionsCardsList': LazyComponent<typeof import("../../app/components/collections/Cards/CardsList.vue").default>
  'LazyCollectionsCardsInfinitePager': LazyComponent<typeof import("../../app/components/collections/Cards/InfinitePager.vue").default>
  'LazyCollectionsFiltersPanel': LazyComponent<typeof import("../../app/components/collections/Filters/FiltersPanel.vue").default>
  'LazyCollectionsUIArrowIcon': LazyComponent<typeof import("../../app/components/collections/UI/ArrowIcon.vue").default>
  'LazyCollectionsUITabsPanel': LazyComponent<typeof import("../../app/components/collections/UI/TabsPanel.vue").default>
  'LazyWikiActiveFiltersBar': LazyComponent<typeof import("../../app/components/wiki/ActiveFiltersBar.vue").default>
  'LazyWikiCoreCard': LazyComponent<typeof import("../../app/components/wiki/CoreCard.vue").default>
  'LazyWikiInfinitePager': LazyComponent<typeof import("../../app/components/wiki/InfinitePager.vue").default>
  'LazyWikiLocalePicker': LazyComponent<typeof import("../../app/components/wiki/LocalePicker.vue").default>
  'LazyWikiWeaponCard': LazyComponent<typeof import("../../app/components/wiki/WeaponCard.vue").default>
  'LazyWikiCoreFilterPanel': LazyComponent<typeof import("../../app/components/wiki/WikiCoreFilterPanel.vue").default>
  'LazyWikiDetailModal': LazyComponent<typeof import("../../app/components/wiki/WikiDetailModal.vue").default>
  'LazyWikiFilterPanelFrame': LazyComponent<typeof import("../../app/components/wiki/WikiFilterPanelFrame.vue").default>
  'LazyWikiWeaponFilterPanel': LazyComponent<typeof import("../../app/components/wiki/WikiWeaponFilterPanel.vue").default>
  'LazyWikiFiltersDicts': LazyComponent<typeof import("../../app/components/wiki/filters/dicts").default>
  'LazyProseA': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue").default>
  'LazyProseBlockquote': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseBlockquote.vue").default>
  'LazyProseCode': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseCode.vue").default>
  'LazyProseEm': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseEm.vue").default>
  'LazyProseH1': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH1.vue").default>
  'LazyProseH2': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH2.vue").default>
  'LazyProseH3': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH3.vue").default>
  'LazyProseH4': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH4.vue").default>
  'LazyProseH5': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH5.vue").default>
  'LazyProseH6': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue").default>
  'LazyProseHr': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseHr.vue").default>
  'LazyProseImg': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseImg.vue").default>
  'LazyProseLi': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseLi.vue").default>
  'LazyProseOl': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseOl.vue").default>
  'LazyProseP': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue").default>
  'LazyProsePre': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProsePre.vue").default>
  'LazyProseScript': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseScript.vue").default>
  'LazyProseStrong': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue").default>
  'LazyProseTable': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTable.vue").default>
  'LazyProseTbody': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTbody.vue").default>
  'LazyProseTd': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTd.vue").default>
  'LazyProseTh': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTh.vue").default>
  'LazyProseThead': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseThead.vue").default>
  'LazyProseTr': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseTr.vue").default>
  'LazyProseUl': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseUl.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyNuxtLinkLocale': LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale").default>
  'LazySwitchLocalePathLink': LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink").default>
  'LazyContentRenderer': LazyComponent<typeof import("../../node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue").default>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page").default>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyMDC': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDC.vue").default>
  'LazyMDCCached': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCCached.vue").default>
  'LazyMDCRenderer': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCRenderer.vue").default>
  'LazyMDCSlot': LazyComponent<typeof import("../../node_modules/@nuxtjs/mdc/dist/runtime/components/MDCSlot.vue").default>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
