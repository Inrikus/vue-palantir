import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', () => {
    const traits = ref([]);
    const sort = ref('price');
    const orderType = ref(1);
    const status = ref([]);
    const sources = ref([]);
    const tradeType = ref(1);

    const getAllFilters = computed(() => {
        return [ traits.value, sort.value, orderType.value, status.value, sources.value, tradeType.value ]
    })

    function changeTraits(item, filterKey) {
        console.log(item, filterKey)
        if (item.target.checked) {
            traits.value.push({
                trait_type: filterKey,
                value: item.target.value
            })

            return
        }

        let index = traits.value.findIndex((el) => el.value === item.target.value)

        traits.value.splice(index, 1)
    }

    function changeTradeType(item) {
        tradeType.value = item.target.checked ? 1 : 0
    }

    function changeStatus(item) {
        if (item.target.checked) {
            status.value.push(item.target.value)
            return
        }

        let index = status.value.findIndex((el) => el === item.target.value)

        status.value.splice(index, 1)
    }

    function changeSources(item) {
        if (item.target.checked) {
            sources.value.push(item.target.value)
            return
        }

        let index = sources.value.findIndex((el) => el === item.target.value)

        sources.value.splice(index, 1)
    }

    function changeSort(item) {
        sort.value = item.orderBy
        orderType.value = item.orderType
    }

    function clearFilter() {
        traits.value = []
        sort.value = 'rarity'
        orderType.value = -1
        status.value = []
        sources.value = []
        tradeType.value = 1
    }

    return { traits, sort, orderType, status, sources, changeTraits, clearFilter, changeTradeType, changeStatus, changeSources, changeSort, getAllFilters }
})