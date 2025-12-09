<script setup>
import BannerPanel from '~/components/collections/Banner/BannerPanel.vue'
import { fetchBanners } from '~/utils/api'

definePageMeta({
  glassShell: true
})

useHead({ title: 'Collections — Fusionist Palantir' })

const { data: bannerCollections } = await useAsyncData('collections-banners', async () => {
  const { data } = await fetchBanners()
  return data?.collections || {}
}, { server: true })
</script>

<template>
  <section>
    <BannerPanel :initial-banners="bannerCollections || {}" />
  </section>
</template>
