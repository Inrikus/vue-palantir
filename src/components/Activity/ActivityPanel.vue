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
    <table class="table-auto w-full mx-auto border-spacing-4 border-separate overflow-x-scroll">
        <thead>
            <tr class="text-[#63B4C8] text-sm sm:text-l xl:text-xl font-semibold">
                <td class="text-center">Market</td>
                <td>Price</td>
                <td>NFT</td>
                <td class="hidden md:table-cell">From</td>
                <td class="hidden md:table-cell">To</td>
                <td class="hidden md:table-cell">txHash</td>
                <td class="text-right">Date</td>
            </tr>
        </thead>

        <tbody class="text-[#63B4C8] text-sm sm:text-l xl:text-xl  font-semibold align-middle">
            <tr v-for="(activity, index) in activityData" :key="index">
                <ActivityItem :activity="activity" />
            </tr>
        </tbody>
    </table>
</template>