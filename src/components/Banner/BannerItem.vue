<script setup >
import { bannerLinks } from '@/utils/dictsList.js'

defineProps({
    bannerName: String,
    bannerData: Object
})
</script>

<template>
<div class='relative hover:translate-y-[-5px] transition-all'>
    <router-link :to='bannerLinks[bannerName].link_to' class='bg-[#1F1F1F] w-full shadow-2xl hover:shadow-[0 50px 75px -12px rgb(0 0 0 / 0.25);] min-h-full rounded-xl py-20 justify-between px-16 flex flex-col-reverse xl:flex-row items-center'>
        <div class="flex flex-col gap-6 items-center xl:items-start w-full justify-center">
            <div class='flex flex-col gap-2 text-xl lg:text-2xl font-semibold text-[#63b4c8] items-center xl:items-start'>
                <h3 class='text-4xl lg:text-6xl xl:text-7xl font-semibold'>{{ bannerLinks[bannerName].name }}</h3>
                <div class='flex justify-center gap-10 xl:justify-between'>
                    <div>
                        <p class='opacity-60'>Floor price</p>
                        <p class="sm:text-lg text-sm mt-2">{{bannerData.min_price}} USD</p>
                    </div>
                    <div class="text-right">
                        <p class='opacity-60'>Listed NFTs</p>
                        <p class="sm:text-lg text-sm mt-2">{{bannerData.count_on_sale}}</p>
                    </div>
                </div>
            </div>

            
        </div>

        <div class="px-auto max-w-[320px]">
            <img :src='bannerLinks[bannerName].image' class="rounded-2xl h-[240px] w-[320px] object-cover">
        </div>
    </router-link>
</div>
</template>