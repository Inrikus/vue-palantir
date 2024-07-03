import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCardStore = defineStore('card', () => {
    const cards = ref([]);

    const getCardsList = computed(() => {
        return cards.value
    })

    function addCards(data) {
        console.log(data)
        data.forEach(element => {
          cards.value.push(element)
        });
    }

    function changeCards(data) {
        cards.value = data
    }

    return { cards, addCards, getCardsList, changeCards}
})