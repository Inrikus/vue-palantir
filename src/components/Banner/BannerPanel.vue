<script setup>
import BannerItem from './BannerItem.vue'

import axios from 'axios'
import { onMounted, ref } from 'vue'

const bannerData = ref([])

const getBanners = async () => {
  console.log(import.meta.env.VITE_API_URL)
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/nfts/home`)
  
  bannerData.value = data.collections
  console.log(bannerData.value)
}

onMounted(() => {
  getBanners()
})
</script>

<template>
    <div class='mt-20 pb-20 grid grid-banner gap-4'>
        <BannerItem v-for="banner in Object.keys(bannerData)" :key='banner' :banner-name='banner' :banner-data='bannerData[banner]' />
    </div>
</template>