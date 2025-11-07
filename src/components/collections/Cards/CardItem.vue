<script setup>
import { computed } from 'vue'
import { platformIcon, currency } from '@/utils/dictsList.js'
import BadgeMech from '@/components/collections/Badges/BadgeMech.vue'
import BadgePlanet from '@/components/collections/Badges/BadgePlanet.vue'

const props = defineProps({
  card: { type: Object, required: true }
})

const isMechBadge = computed(() =>
  ['bi_mech', 'quartan_primes'].includes(props.card.collection_name) && props.card.status === 'Normal'
)
const isPlanetBadge = computed(() => props.card.collection_name === 'fusionist_planet')

const platformIconSrc = computed(() => {
  const key = props.card?.link?.source
  return platformIcon[key] || platformIcon.Element || '/social-icons/website.svg'
})

const imageSrc = computed(() => {
  const src = props.card?.nft_image || ''
  if (!src) return '/placeholder.png'
  if (/^https?:\/\//i.test(src)) return src
  return src.startsWith('/') ? src : `/${src}`
})

const currencyKey = computed(() => {
  const val = (props.card.price_native?.currency || 'Unknown').toUpperCase()
  return currency[val] ? val : 'Unknown'
})

const currencyIcon = computed(() => `/currency/${currency[currencyKey.value]}`)
const nativePrice = computed(() => props.card.price_native?.value ?? '—')
const usdPrice = computed(() => props.card.price ? `${props.card.price} USD` : 'Not listed')
</script>

<template>
  <a
    class="collection-card"
    :href="card.link?.value || '#'"
    target="_blank"
    rel="noopener"
  >
    <div class="media">
      <img
        :src="imageSrc"
        alt=""
        class="card-bg"
        loading="lazy"
        decoding="async"
      />
      <div class="card-overlay"></div>
      <img :src="platformIconSrc" alt="marketplace" class="market-chip" />

      <div v-if="isPlanetBadge" class="badge-layer badge-layer--planet">
        <BadgePlanet :card="card" />
      </div>
      <div v-else-if="isMechBadge" class="badge-layer badge-layer--mech">
        <BadgeMech :card="card" />
      </div>
    </div>

    <div class="card-info">
      <p class="card-name" :title="card.nft_name">{{ card.nft_name || 'Unknown NFT' }}</p>
      <div class="price-row">
        <div class="primary">
          <img :src="currencyIcon" alt="currency" class="currency-icon" />
          <span class="value">{{ nativePrice }}</span>
          <span class="code">{{ card.price_native?.currency || '--' }}</span>
        </div>
        <div class="secondary">
          {{ usdPrice }}
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>

.collection-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  border: 1px solid rgba(99,180,200,.08);
  background: #0b0d13;
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.collection-card:hover {
  transform: translateY(-6px);
  border-color: rgba(99,180,200,.4);
  box-shadow: 0 20px 45px rgba(7,14,26,.4);
}

.media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.card-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #05060c;
  z-index: 0;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, rgba(5,6,12,0) 40%, rgba(5,6,12,.95) 100%);
  z-index: 1;
  pointer-events: none;
}

.market-chip {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.6rem;
  background: rgba(5,6,12,.4);
  padding: 0.35rem;
  z-index: 2;
}

.card-info {
  padding: 0.85rem 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-name {
  font-weight: 600;
  font-size: 1rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 1rem;
  font-weight: 600;
}

.currency-icon {
  width: 1.1rem;
  height: 1.1rem;
  object-fit: contain;
}

.code {
  font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.secondary {
  font-size: 0.85rem;
  color: rgba(255,255,255,.75);
}

.badge-layer {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 4;
  pointer-events: none;
}
.badge-layer--planet {
  bottom: 0;
}
.badge-layer--planet :deep(.planet-badge) {
  width: 100%;
  border-radius: 0;
  border-top: 1px solid rgba(255,255,255,.15);
  background: rgba(5,6,12,.85);
}
.badge-layer--mech {
  bottom: 0.5rem;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-end;
}
.badge-layer--mech :deep(.mech-badge) {
  max-width: 320px;
  width: 100%;
}
</style>
