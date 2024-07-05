import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', () => {
    const cards = ref([]);
    const maxCards = ref(0);

    const getCardsList = computed(() => {
        return cards.value
    })

    const getMaxCards = computed(() => {
        return maxCards.value
    })

    function addCards(data) {
        data.forEach(element => {
          cards.value.push(element)
        });
    }

    function changeCards(data, cardsCount) {
        cards.value = data
        maxCards.value = cardsCount
    }

    return { cards, maxCards, getMaxCards, addCards, getCardsList, changeCards}
})