<script setup>
import { computed } from 'vue'

const props = defineProps({
    card: Object
})

const resourceTraits = ['Coal', 'Titanium', 'Sulfur', 'Petroleum', 'Helium', 'Hydrogen']

const getTraitValue = (type) => {
    return props.card.traits?.find(t => t.trait_type === type)?.value || '0'
}

const visibleResources = computed(() => {
    return resourceTraits.filter(resource => +getTraitValue(resource) > 0)
})
</script>

<template>
    <div class="planet-badge">
        <div v-for="resource in visibleResources" :key="resource" class="resource-slot">
            <img :src="`/cards/planets/Icon_${resource}.png`" :alt="resource" class="resource-icon" />
            <span class="resource-count">{{ getTraitValue(resource) }}</span>
        </div>
    </div>
</template>

<style scoped>
.planet-badge {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.4);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0 0 8px 8px;
    min-height: 54px; /* Высота баджа */
}

.resource-slot {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
}

.resource-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.resource-count {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
}

@media (max-width: 600px) {
    .resource-slot {
        width: 30%;
    }
}
</style>