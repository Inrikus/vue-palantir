<script setup>
import BannerItem from './BannerItem.vue'
import { fetchBanners } from '@/utils/api'; // Импортируем метод
import { onMounted, ref } from 'vue'

const bannerData = ref({})

const getBanners = async () => {
  const { data } = await fetchBanners();
  bannerData.value = data.collections;
};

onMounted(() => {
  getBanners()
})
</script>

<template>
    <div class='pb-20 grid grid-banner gap-4'>
        <BannerItem v-for="banner in Object.keys(bannerData)" :key='banner' :banner-name='banner' :banner-data='bannerData[banner]' />
    </div>
</template>