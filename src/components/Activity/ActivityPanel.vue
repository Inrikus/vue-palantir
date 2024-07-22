<script setup>
import axios from 'axios'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router';

import ActivityItem from './ActivityItem.vue';

import { queryName } from '@/utils/dictsList.js'

const activityData = ref([])
const route = useRoute()

const getActivities = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/nfts/activity/${queryName[route.name]}`)
    activityData.value = data.actions
}

let activityInterval = null

onMounted(() => {
    getActivities()
    activityInterval = setInterval(getActivities, 5000)
})

onBeforeUnmount(() => {
    clearInterval(activityInterval)
})
</script>

<template>
    <div class="grid-table w-full mx-auto text-[#63B4C8] text-sm sm:text-l xl:text-xl font-normal sm:font-semibold">
        <div class="grid-table-line items-center border-b-2 border-[#63B4C8] pb-2 border-opacity-50">
            <span class="text-start">Market</span>
            <span class="text-start">NFT</span>
            <span class="text-end">Price</span>
            <span class="hidden md:inline text-center">From</span>
            <span class="hidden md:inline text-center">To</span>
            <span class="text-center">Date</span>
        </div>

        <div v-for="activity in activityData" :key="activity.id"
            class="grid-table-line items-center hover:bg-gray-800 hover:border-2 hover:border-[#63B4C8] p-2 rounded-xl">
            <ActivityItem :activity="activity" />
        </div>

    </div>
</template>

<style>
.grid-table {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.grid-table-line {
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
    gap: 10px;
}

@media (min-width: 768px) {
    .grid-table-line {
        grid-template-columns: 0.5fr 1.5fr 1fr 2fr 2fr 1.5fr;
    }
}

@media (max-width: 767px) {
    .grid-table-line {
        grid-template-columns: 0.5fr 1.5fr 1fr 1fr;
    }
}

.grid-table-line span {
    min-width: 0;
    /* Позволяет элементам уменьшаться до минимального размера */
}
</style>
