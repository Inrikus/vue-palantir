<script setup>
import { platformIcon, currency } from '@/utils/dictsList.js'
import BadgeMech from '@/components/Badges/BadgeMech.vue'
import BadgePlanet from '@/components/Badges/BadgePlanet.vue'

const props = defineProps({
    card: Object
})

const isMechBadge = ['bi_mech', 'quartan_primes'].includes(props.card.collection_name) && props.card.status === 'Normal'
const isPlanetBadge = props.card.collection_name === 'fusionist_planet'

</script>

<template>
    <a class="card-wrapper" :href="card.link.value">
        <div class="relative">
            <img :src="card.nft_image" alt="" class="card-image" />
            <img :src="platformIcon[card.link.source]" alt="" class="platform-icon" />

            <BadgeMech v-if="isMechBadge" :card="card" />
            <BadgePlanet v-else-if="isPlanetBadge" :card="card" />
        </div>

        <div class="card-info">
            <p class="card-title" :title="card.nft_name">{{ card.nft_name }}</p>
            <div class="card-price">
                <img :src="'/currency/' + (Object.keys(currency).includes(card.price_native.currency) ? currency[card.price_native.currency] : 'unknown.svg')"
                    class="price-icon" />
                <span class="price-value">{{ card.price_native.value }}</span>
            </div>
            <p class="usd-price">{{ card.price ? card.price + ' USD' : 'Not Listed' }}</p>
        </div>
    </a>
</template>

<style scoped>
.card-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
    background-color: #1F1F1F;
    border-radius: 1rem;
    overflow: hidden;
    padding-bottom: 8px;
    color: #63b4c8;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
}

.card-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
}

.card-image {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    /* image-rendering: smooth; */
}

.platform-icon {
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
}

.card-info {
    margin-left: 8px;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.card-title {
    font-size: 1rem;
    font-weight: 700;
    color: #63b4c8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-price {
    display: flex;
    align-items: center;
    /* <-- идеальное вертикальное выравнивание */
    gap: 6px;
    margin-top: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #63b4c8;
    line-height: 1;
}

.price-icon {
    width: 1em;
    height: 1em;
    object-fit: contain;
}

.price-value {
    display: inline-block;
}

.usd-price {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 600px) {
    .card-image {
        height: 160px;
        /* десктоп/планшет */
    }
}

</style>