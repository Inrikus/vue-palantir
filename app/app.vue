<script setup>
import { onMounted, watch } from 'vue'
import { useWikiLocaleStore } from '@/stores/wikiLocaleStore'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'
import { useWikiCoreStore } from '@/stores/wikiCoreStore'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'

const wikiLocaleStore = useWikiLocaleStore()
const wikiSkillStore = useWikiSkillStore()
const wikiBuffStore = useWikiBuffStore()
const wikiWeaponStore = useWikiWeaponStore()
const wikiCoreStore = useWikiCoreStore()
const wikiLabelStore = useWikiLabelStore()

function loadAll(locale) {
  const lang = locale || wikiLocaleStore.locale || 'en'
  wikiSkillStore.load(lang)
  wikiBuffStore.load(lang)
  wikiWeaponStore.load(lang)
  wikiCoreStore.load(lang)
  wikiLabelStore.load(lang)
}

onMounted(() => {
  loadAll(wikiLocaleStore.locale)
})

watch(
  () => wikiLocaleStore.locale,
  (next) => {
    const nextLocale = String(next || 'en')
    loadAll(nextLocale)
  }
)
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
