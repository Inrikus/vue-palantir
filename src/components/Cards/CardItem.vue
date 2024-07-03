<script setup>
import { platformIcon } from '@/utils/dictsList.js'

defineProps({
    card: Object
})
</script>

<template>
    <a class="flex w-full flex-col shadow-xl justify-around rounded-2xl overflow-hidden cursor-pointer text-[#63b4c8] bg-[#1F1F1F] pb-3 hover:translate-y-[-5px] transition-all hover:shadow-2xl" :href="card.link.value">
        <div class='relative'>
            <img :src="`${ card.nft_image }`" alt="" class="w-full h-[130px] md:min-h-[300px] rounded-t-2xl object-cover img-cust">
            <img :src="platformIcon[card.link.source]" alt="" class="w-6 h-6 absolute top-1 left-1">
        </div>

        <div class="ml-2 self-start mt-2">
            <p class="text-sm font-bold tracking-[1px]">{{ card.nft_name }}</p>
            <p class="text-sm font-bold tracking-[1px] mt-2">Price: {{ card.price ? card.price : "Not Listed" }}</p>
        </div>
    </a>
</template>

<style>
    .shadow-cust {
        box-shadow: 0 4px 20px rgba(0, 0, 0, .05);
    }

    .img-cust {
        image-rendering: smooth;
    }
</style>
