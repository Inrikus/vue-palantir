<script setup>
import { platformIcon, currency } from '@/utils/dictsList.js'
//import { useRoute } from 'vue-router';

const props = defineProps({
    activity: Object
})

var options = {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
};

//const route = useRoute()

const date = new Date(props.activity.timestamp * 1000);

// Метод для получения ссылки на обозреватель
const getExplorerLink = (chain, txHash) => {
    switch (chain) {
        case 'BSC':
            return `https://bscscan.com/tx/${txHash}`;
        case 'Ethereum':
            return `https://etherscan.io/tx/${txHash}`;
        case 'Endurance':
            return `https://explorer-endurance.fusionist.io/tx/${txHash}`;
        default:
            return '#'; // Ссылка по умолчанию, если цепь неизвестна
    }
};
const getMarketLink = (chain, adress) => {
    switch (chain) {
        case 'BSC':
            return `https://element.market/account/${adress}`;
        case 'Ethereum':
            return `https://opensea.io/${adress}`;
        case 'Endurance':
            return `https://explorer-endurance.fusionist.io/address/${adress}?tab=tokens_nfts`;
        default:
            return '#'; // Ссылка по умолчанию, если цепь неизвестна
    }
};
const getNFTLink = (chain, collectionAddress, tokenId) => {
    switch (chain) {
        case 'BSC':
            return `https://element.market/assets/bsc/${collectionAddress}/${tokenId}`;
        case 'Ethereum':
            return `https://blur.io/eth/asset/${collectionAddress}/${tokenId}`;
        case 'Endurance':
            return `https://www.tesseract.world/nfts/detail/648-${collectionAddress}-${tokenId}`;
            
        default:
            return '#'; // Ссылка по умолчанию, если цепь неизвестна
    }
};

</script>

<template>
    <span>
        <div class="w-full h-full flex place-content-center items-center">
            <img :src="platformIcon[activity.platform]" alt="" class="w-7 h-7">
        </div>
    </span>

    <span class="flex items-center pl-4">
      <a
        :href="getNFTLink(activity.chain, activity.collectionAddress, activity.tokenId)"
        class="flex items-center max-w-full"
      >
        <img :src="activity.nft_image" class="w-10 h-10 mr-2 flex-shrink-0" />
        <span class="nft-name truncate-text">{{ activity.nft_name }}</span>
      </a>
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
        <a :href="getMarketLink(activity.chain, activity.from_address)">
            {{ activity.from_address.slice(0, 6) + '...' + activity.from_address.slice(-3) }}
        </a>
    </span>
    
    <span class="hover:opacity-50 transition-all hidden md:inline text-center">
        <a :href="getMarketLink(activity.chain, activity.to)">
            {{ activity.to.slice(0, 6) + '...' + activity.to.slice(-3) }}
        </a>
    </span>
    
    <span class="hover:opacity-50 transition-all text-center">
        <a :href="getExplorerLink(activity.chain, activity.txHash)">
            {{ date.toLocaleString('en-US', options).replace(',', '') }}
        </a>
    </span>
</template>

<style scoped>
.truncate-text {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .truncate-text {
    font-size: 0.875rem; /* адаптивно уменьшим размер текста */
    max-width: 120px; /* ширина имени NFT в мобильной версии */
  }
}

@media (min-width: 768px) {
  .truncate-text {
    max-width: 220px; /* для десктопа можно шире */
  }
}

</style>
