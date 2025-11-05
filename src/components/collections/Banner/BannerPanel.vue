<script setup>
import { onMounted, ref } from 'vue'
import BannerItem from './BannerItem.vue'
import { fetchBanners } from '@/utils/api'

const bannerData = ref({})

const getBanners = async () => {
  const { data } = await fetchBanners()
  bannerData.value = data.collections
}

onMounted(() => {
  getBanners()
})
</script>

<template>
  <div class="pb-20 grid-banner">
    <BannerItem
      v-for="banner in Object.keys(bannerData)"
      :key="banner"
      :banner-name="banner"
      :banner-data="bannerData[banner]"
    />
  </div>
</template>
