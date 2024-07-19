<script setup>
import { platformIcon, pageNames, currency } from '@/utils/dictsList.js'
import { useRoute } from 'vue-router';

const props = defineProps({
    activity: Object
})

const nftsPath = {
    'bm': 'bi-mech',
    'qp': 'quartan_primes',
    'ap': 'alpha_prestige',
}

var options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const route = useRoute()

const date = new Date(props.activity.timestamp * 1000);
</script>

<template>
    <td class="flex justify-center"><img :src="platformIcon[activity.platform]" alt="" class="w-6 h-6"></td>
    <td><img :src="'/currency/' + currency[activity.currency]" class="w-4 h-4 float-left">{{ activity.price_usd }}</td>
    <td><img :src='"/nft/" + nftsPath[route.name] + "/" + pageNames[route.name].name + "-" + activity.tokenId + ".jpg"' class='w-10 float-left mr-2'>{{ pageNames[route.name].name }} #{{ activity.tokenId }}</td>
    <td class="hover:opacity-50 transition-all hidden md:table-cell"><a :href="'https://element.market/account/' + activity.from_address">{{ activity.from_address.slice(0, 6) + '...' + activity.from_address.slice(-3) }}</a></td>
    <td class="hover:opacity-50 transition-all hidden md:table-cell"><a :href="'https://element.market/account/' + activity.to">{{ activity.to.slice(0, 6) + '...' + activity.to.slice(-3) }}</a></td>
    <td class="hover:opacity-50 transition-all hidden md:table-cell"><a :href="(activity.chain === 'BSC' ? 'https://bscscan.com/tx/' : 'https://etherscan.io/tx/') + activity.txHash">{{ activity.txHash.slice(0, 6) + '...' + activity.txHash.slice(-3) }}</a></td>
    <td class="text-right">{{ date.toLocaleString('US-us', options) }}</td>
</template>