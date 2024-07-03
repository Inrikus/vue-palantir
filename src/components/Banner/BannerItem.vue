<script setup >
import { bannerLinks } from '@/utils/dictsList.js'

defineProps({
    bannerName: String,
    bannerData: Object
})
</script>

<template>
<div class='relative'>
    <div class='bg-[#1F1F1F] w-full shadow-2xl min-h-full rounded-xl py-20 justify-between px-16 flex flex-col-reverse xl:flex-row items-center'>
        <div class="flex flex-col gap-6 items-center xl:items-start w-full justify-center">
            <div class='flex flex-col gap-2 text-xl lg:text-2xl font-semibold text-[#63b4c8] items-center xl:items-start'>
                <h3 class='text-4xl lg:text-6xl xl:text-7xl font-semibold'>{{ bannerLinks[bannerName].name }}</h3>
                <div class='flex justify-center gap-10 xl:justify-between'>
                    <div>
                        <p class='opacity-60'>Flor price</p>
                        <p>{{bannerData.min_price}}</p>
                    </div>
                    <div class="text-right">
                        <p class='opacity-60'>Listed NFTS</p>
                        <p>{{bannerData.count_on_sale}}</p>
                    </div>
                </div>
            </div>

            <router-link :to='bannerLinks[bannerName].link_to' class="border-2 border-[#63b4c8] text-[#63b4c8] rounded-md p-2 flex gap-2 text-4xl font-semibold items-center hover:bg-gray-600 transition-all">Open</router-link>
        </div>

        <div class="px-auto max-w-[320px]">
            <img :src='bannerLinks[bannerName].image' class="rounded-2xl h-[240px] w-[320px] object-cover">
        </div>
    </div>
</div>
</template>