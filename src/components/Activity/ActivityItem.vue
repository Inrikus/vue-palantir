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
    'pf': 'pioneer_of_fusionist',
}

var options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};

const route = useRoute()

const date = new Date(props.activity.timestamp * 1000);
</script>

<template>
    <span>
        <div class="w-full h-full flex place-content-center items-center">
            <img :src="platformIcon[activity.platform]" alt="" class="w-7 h-7">
        </div>
    </span>
    <span class="flex place-content-center items-center">
        <img :src='"/nft/" + nftsPath[route.name] + "/" + (route.name !== "pf" ? pageNames[route.name].name + "-" + activity.tokenId + ".jpg" : activity.tokenId > 10000 ? "Steam-Key-NFT.png" : "Beta-Testing-NFT.png")'
            class='w-10 float-left mr-2'>
        {{ pageNames[route.name].name }} #{{ activity.tokenId }}
    </span>
    <span class="place-content-center">
        <div class="w-full flex flex-col items-center">
            <p class="flex items-center">
                <img :src="'/currency/' + (activity.currency in currency ? currency[activity.currency] : 'unknown.svg')"
                    class="w-4 h-4 mr-2">
                {{ activity.price_native }}
            </p>
            <p>{{ activity.price_usd }}$</p>
        </div>
    </span>
    <span class="hover:opacity-50 transition-all hidden md:inline text-center">
        <a :href="'https://element.market/account/' + activity.from_address">
            {{ activity.from_address.slice(0, 6) + '...' + activity.from_address.slice(-3) }}
        </a>
    </span>
    <span class="hover:opacity-50 transition-all hidden md:inline text-center">
        <a :href="'https://element.market/account/' + activity.to">
            {{ activity.to.slice(0, 6) + '...' + activity.to.slice(-3) }}
        </a>
    </span>
    <span class="hover:opacity-50 transition-all text-center">
        <a
            :href="(activity.chain === 'BSC' ? 'https://bscscan.com/tx/' : 'https://etherscan.io/tx/') + activity.txHash">
            {{ date.toLocaleString('en-US', options).replace(',', '') }}
        </a>
    </span>
</template>

<style></style>
