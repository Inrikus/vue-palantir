<script setup>
import { collections } from '@/utils/dictsList.js'

defineProps({
  bannerName: String,
  bannerData: Object
})
</script>

<template>
  <div class="relative transition-transform hover:-translate-y-2">
    <router-link
      :to='collections[bannerName].banner.link_to'
      class="bg-[#1F1F1F] w-full shadow-xl hover:shadow-2xl rounded-2xl p-6 flex flex-col xl:flex-row items-center gap-6 transition-all duration-300"
    >
      <!-- Текстовая часть -->
      <div class="flex-1 flex flex-col gap-4 text-center xl:text-left items-center xl:items-start">
        <h3 class="text-[#63b4c8] text-3xl sm:text-4xl xl:text-6xl font-bold leading-tight">
          {{ collections[bannerName].banner.name }}
        </h3>

        <div class="flex flex-col sm:flex-row sm:justify-between gap-6 w-full text-[#ffffffcc] text-sm sm:text-base">
          <div class="flex flex-col items-center xl:items-start">
            <span class="opacity-70">Floor Price</span>
            <span class="mt-1 text-white font-medium text-lg">{{ bannerData.min_price }} USD</span>
          </div>
          <div class="flex flex-col items-center xl:items-end">
            <span class="opacity-70">Listed NFTs</span>
            <span class="mt-1 text-white font-medium text-lg">{{ bannerData.count_on_sale }}</span>
          </div>
        </div>
      </div>

      <!-- Картинка -->
      <div class="flex-shrink-0 max-w-[280px]">
        <img
          :src="collections[bannerName].banner.image"
          class="rounded-xl object-cover h-[200px] w-full"
          alt="Banner Image"
        />
      </div>
    </router-link>
  </div>
</template>
