<script setup>
import BannerItem from './BannerItem.vue'

import axios from 'axios'
import { onMounted, ref } from 'vue'

const bannerData = ref({})

const getBanners = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/nfts/home`)
  
  bannerData.value = data.collections
}

onMounted(() => {
  getBanners()
})
</script>

<template>
    <div class='pb-20 grid grid-banner gap-4'>
        <BannerItem v-for="banner in Object.keys(bannerData)" :key='banner' :banner-name='banner' :banner-data='bannerData[banner]' />
    </div>
</template>