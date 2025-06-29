<script setup>
import { platformIcon, currency } from '@/utils/dictsList.js'

const props = defineProps({
    card: Object
})

// Коллекции, для которых отображается блок
const supportedCollections = ['Bi-Mech', 'Quartan Primes']

// Универсальный поиск по trait_type
const getTraitValue = (type) =>
    props.card.traits?.find(t => t.trait_type === type)?.value || ''

// Вынесенные значения
const showBadge =
    supportedCollections.includes(props.card.collection_name) &&
    props.card.status === 'Normal'
const grade = getTraitValue('GRADE')
const className = getTraitValue('Class')
const weaponCount = getTraitValue('Weapons')

// Пример расширения: если нужно показывать LEVEL или RARITY
// const level = getTraitValue('Level')

</script>

<template>
    <a class="flex w-full flex-col shadow-xl justify-around rounded-2xl overflow-hidden cursor-pointer text-[#63b4c8] bg-[#1F1F1F] pb-3 hover:translate-y-[-5px] transition-all hover:shadow-2xl"
        :href="card.link.value">
        <div class='relative'>
            <img :src="card.nft_image" alt=""
                class="w-full h-[130px] md:min-h-[300px] rounded-t-2xl object-cover img-cust" />
            <img :src="platformIcon[card.link.source]" alt="" class="w-6 h-6 absolute top-1 left-1" />

            <!-- Grade/Class/Weapon badge -->
            <div v-if="showBadge" class="grade-block">
                <!-- Фон с текстом WEAPON COUNT встроен в изображение -->
                <img :src="`/cards/bg_${grade}.png`" alt="grade background" class="grade-bg" />

                <!-- Иконка класса -->
                <div class="grade-icon">
                    <img :src="`/cards/Icon_${className}.png`" alt="class" class="grade-icon-img" />
                </div>

                <!-- Количество оружий -->
                <div class="weapon-count-overlay">
                    {{ weaponCount }}
                </div>
                <!-- При необходимости отобразим дополнительные поля -->
                <!--<div class="badge-extra">Lvl: {{ level }}</div> -->

            </div>
        </div>

        <div class="ml-2 self-start mt-2">
            <p class="text-lg font-bold tracking-[1px]">{{ card.nft_name }}</p>
            <p class="text-sm font-bold tracking-[1px] mt-2">
                <span class="inline-flex flex-col">
                    <span class="flex items-center text-lg">
                        <img :src="'/currency/' + (Object.keys(currency).includes(card.price_native.currency) ? currency[card.price_native.currency] : 'unknown.svg')"
                            class="w-4 h-4 float-left mr-2" />
                        {{ card.price_native.value }}
                    </span>
                    <span class="text-sm opacity-75">
                        {{ card.price ? card.price + ' USD' : "Not Listed" }}
                    </span>
                </span>
            </p>
        </div>
    </a>
</template>

<style scoped>
.img-cust {
    image-rendering: smooth;
}

/* ---- Weapon badge styles ---- */
.grade-block {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150px;
    height: 32px;
    margin: 4px;
    overflow: hidden;
    border-radius: 4px;
}

.grade-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.grade-icon {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
}

.grade-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Цифра внутри белой рамки (спозиционирована точно под рамку на изображении) */
.weapon-count-overlay {
    position: absolute;
        top: 0px;
        right: 5px;
        font-size: 12px;
        font-weight: bold;
        color: black;
        line-height: 1;
    }

/* Доп. метки при необходимости */
/* .badge-extra { */
    /* position: absolute; */
    /* bottom: 100%; */
    /* right: 0; */
    /* font-size: 10px; */
    /* background: rgba(0, 0, 0, 0.6); */
    /* color: white; */
    /* padding: 2px 4px; */
    /* border-radius: 2px; */
    /* margin-bottom: 2px; */
/* } */

</style>
