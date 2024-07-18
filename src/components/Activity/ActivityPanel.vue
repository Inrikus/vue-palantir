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
    <table class="table-auto w-4/5 mx-auto border-spacing-4 border-separate">
        <thead>
            <tr class="text-[#63B4C8] text-xl font-semibold">
                <td class="text-center">Market</td>
                <td>Price</td>
                <td>NFT</td>
                <td>From</td>
                <td>To</td>
                <td>txHash</td>
                <td class="text-right">Date</td>
            </tr>
        </thead>

        <tbody class="text-[#63B4C8] text-xl font-semibold">
            <tr v-for="(activity, index) in activityData" :key="index">
                <ActivityItem :activity="activity" />
            </tr>
        </tbody>
    </table>
</template>