<script setup>
import { platformIcon, pageNames } from '@/utils/dictsList.js'
import { useRoute } from 'vue-router';

const props = defineProps({
    activity: Object
})

const route = useRoute()

const date = new Date(props.activity.timestamp * 1000);
</script>

<template>
    <td class="flex justify-center"><img :src="platformIcon[activity.platform]" alt="" class="w-6 h-6"></td>
    <td>{{ activity.price_usd }} usdt</td>
    <td>{{ pageNames[route.name].name }} #{{ activity.tokenId }}</td>
    <td class="hover:opacity-50 transition-all"><a :href="'https://element.market/account/' + activity.from_address">{{ activity.from_address.slice(0, 6) + '...' + activity.from_address.slice(-3) }}</a></td>
    <td class="hover:opacity-50 transition-all"><a :href="'https://element.market/account/' + activity.to">{{ activity.to.slice(0, 6) + '...' + activity.to.slice(-3) }}</a></td>
    <td class="hover:opacity-50 transition-all"><a :href="(activity.chain === 'BSC' ? 'https://bscscan.com/tx/' : 'https://etherscan.io/tx/') + activity.txHash">{{ activity.txHash.slice(0, 6) + '...' + activity.txHash.slice(-3) }}</a></td>
    <td class="text-right">{{ date.toLocaleString() }}</td>
</template>