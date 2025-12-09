<script setup>
import { onMounted, ref, watch } from 'vue'
import BannerItem from './BannerItem.vue'
import { fetchBanners } from '@/utils/api'

const props = defineProps({
  initialBanners: {
    type: Object,
    default: () => ({})
  }
})

const bannerData = ref(props.initialBanners || {})
const hasInitial = () => !!bannerData.value && Object.keys(bannerData.value).length > 0
const isLoading = ref(!hasInitial())
const errorText = ref('')

const getBanners = async () => {
  if (hasInitial()) return
  try {
    isLoading.value = true
    errorText.value = ''
    const { data } = await fetchBanners()
    bannerData.value = data.collections || {}
  } catch (e) {
    console.error('banner load failed', e)
    errorText.value = 'Failed to load banners'
    bannerData.value = {}
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.initialBanners,
  (val) => {
    if (val && Object.keys(val).length) {
      bannerData.value = val
      isLoading.value = false
      errorText.value = ''
    }
  },
  { deep: true }
)

onMounted(() => {
  if (!hasInitial()) getBanners()
})
</script>

<template>
  <div>
    <div v-if="isLoading" class="skeleton-grid">
      <div v-for="i in 3" :key="i" class="skeleton-card" />
    </div>
    <p v-else-if="errorText" class="error">{{ errorText }}</p>
    <div v-else class="grid-banner">
      <BannerItem
        v-for="banner in Object.keys(bannerData)"
        :key="banner"
        :banner-name="banner"
        :banner-data="bannerData[banner]"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.skeleton-card {
  height: 260px;
  border-radius: 1.5rem;
  background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.04) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.3s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.error { text-align:center; color: rgba(255,255,255,.7); padding: 2rem 0; }
</style>
