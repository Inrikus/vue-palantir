// BadgeBiMech.vue
<script setup>
const props = defineProps({ card: Object })

const findTrait = (type) =>
    props.card.traits?.find(t => t.trait_type === type)?.value || ''

const grade = findTrait('GRADE')
const className = findTrait('Class')
const weaponCount = findTrait('Weapons')
</script>

<template>
    <div class="grade-block">
        <img :src="`/cards/mechs/bg_${grade}.png`" alt="grade background" class="grade-bg" />

        <!-- Иконка класса -->
        <div class="grade-icon">
            <img :src="`/cards/mechs/Icon_${className}.png`" alt="class" class="grade-icon-img" />
        </div>

        <!-- Количество оружий -->
        <div class="weapon-count-overlay">
            {{ weaponCount }}
        </div>
    </div>
</template>

<style scoped>
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
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.grade-icon {
    position: absolute;
    top: 50%;
    left: 5.2%;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.grade-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.weapon-count-overlay {
    position: absolute;
    top: 0;
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