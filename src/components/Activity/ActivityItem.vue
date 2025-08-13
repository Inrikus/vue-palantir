<script setup>
import { computed } from 'vue'
import { platformIcon, currency as currencyDict, getCollectionLink } from '@/utils/dictsList.js'

const props = defineProps({
  item: { type: Object, required: true },
  collectionKey: { type: String, required: true },
})

const getExplorerLink = (chain, txHash) => {
  switch (chain) {
    case 'BSC':       return `https://bscscan.com/tx/${txHash}`
    case 'Ethereum':  return `https://etherscan.io/tx/${txHash}`
    case 'Endurance': return `https://explorer-endurance.fusionist.io/tx/${txHash}`
    default:          return '#'
  }
}
const getMarketLink = (chain, address) => {
  switch (chain) {
    case 'BSC':       return `https://element.market/account/${address}`
    case 'Ethereum':  return `https://opensea.io/${address}`
    case 'Endurance': return `https://explorer-endurance.fusionist.io/address/${address}?tab=tokens_nfts`
    default:          return '#'
  }
}
const getNFTLink = (chain, collectionAddress, tokenId) => {
  switch (chain) {
    case 'BSC':       return `https://element.market/assets/bsc/${collectionAddress}/${tokenId}`
    case 'Ethereum':  return `https://blur.io/eth/asset/${collectionAddress}/${tokenId}`
    case 'Endurance': return `https://www.tesseract.world/nfts/detail/648-${collectionAddress}-${tokenId}`
    default:          return '#'
  }
}

const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—')
const humanPrice = (v) => (v || v === 0)
  ? (v >= 1000 ? Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })
               : Number(v).toFixed(2))
  : '—'
const humanUsd = (u) => (u || u === 0)
  ? `($${Number(u).toLocaleString(undefined, { maximumFractionDigits: 2 })})`
  : ''
const timeLabel = (tsSec) => {
  const d = new Date((typeof tsSec === 'number' ? tsSec * 1000 : Date.now()))
  const abs = d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
  const diff = Date.now() - d.getTime()
  const mins = Math.max(0, Math.floor(diff / 60000))
  const rel = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`
  return `${abs} · ${rel}`
}

const platformSrc = (platform) => `/${platformIcon[platform] || platformIcon.Element}`
const currencySrc  = (code) => {
  const key = (code || '').toUpperCase()
  const file = currencyDict[key] || currencyDict.Unknown
  return `/currency/${file}`
}

const collectionUrl = computed(() => {
  const dict = getCollectionLink[props.collectionKey] || {}
  return dict[props.item.platform] || dict.default || '#'
})
</script>

<template>
  <!-- Desktop row -->
  <div class="row hidden sm:grid">
    <div class="cell asset">
      <img v-if="item.nft_image" :src="item.nft_image" alt="" class="thumb" />
      <div class="asset-info">
        <a
          class="name link"
          :href="getNFTLink(item.chain, item.collectionAddress, item.tokenId)"
          target="_blank" rel="noopener"
          :title="item.nft_name || ('#' + item.tokenId)"
        >
          {{ item.nft_name || ('#' + item.tokenId) }}
        </a>
      </div>
    </div>

    <div class="cell price">
      <img :src="currencySrc(item.currency)" alt="" class="icon" />
      <span class="price-v">{{ humanPrice(item.price_native) }}</span>
      <span class="code">{{ item.currency || '—' }}</span>
      <span v-if="item.price_usd !== undefined" class="usd">{{ humanUsd(item.price_usd) }}</span>
    </div>

    <div class="cell market">
      <img :src="platformSrc(item.platform)" alt="" class="icon" />
      <a class="chip" :href="collectionUrl" target="_blank" rel="noopener">
        {{ item.platform || 'Market' }}
      </a>
    </div>

    <div class="cell actors">
      <a class="mono link" :href="getMarketLink(item.chain, item.from_address)" target="_blank" rel="noopener">
        {{ shortAddr(item.from_address) }}
      </a>
      <span class="sep">→</span>
      <a class="mono link" :href="getMarketLink(item.chain, item.to)" target="_blank" rel="noopener">
        {{ shortAddr(item.to) }}
      </a>
    </div>

    <div class="cell time">
      <div class="muted">{{ timeLabel(item.timestamp) }}</div>
      <a v-if="item.txHash" class="tx link" :href="getExplorerLink(item.chain, item.txHash)" target="_blank" rel="noopener">
        View tx
      </a>
    </div>
  </div>

  <!-- Mobile card -->
  <div class="row-mobile sm:hidden">
    <div class="top">
      <div class="left">
        <img v-if="item.nft_image" :src="item.nft_image" alt="" class="thumb" />
        <div class="asset-info">
          <a
            class="name link"
            :href="getNFTLink(item.chain, item.collectionAddress, item.tokenId)"
            target="_blank" rel="noopener"
          >
            {{ (item.nft_name || ('#' + item.tokenId)).slice(0, 19) + '…' }}
          </a>
        </div>
      </div>
      <div class="right">
        <img :src="currencySrc(item.currency)" alt="" class="icon" />
        <span class="price-v">{{ humanPrice(item.price_native) }}</span>
        <span class="code">{{ item.currency || '—' }}</span>
      </div>
    </div>

    <div class="meta">
      <div class="market">
        <img :src="platformSrc(item.platform)" alt="" class="icon" />
        <a class="chip" :href="collectionUrl" target="_blank" rel="noopener">
          {{ item.platform || 'Market' }}
        </a>
      </div>
      <div class="actors">
        <a class="mono link" :href="getMarketLink(item.chain, item.from_address)" target="_blank" rel="noopener">
          {{ shortAddr(item.from_address) }}
        </a>
        <span class="sep">→</span>
        <a class="mono link" :href="getMarketLink(item.chain, item.to)" target="_blank" rel="noopener">
          {{ shortAddr(item.to) }}
        </a>
      </div>
      <div class="time">
        <span class="muted">{{ timeLabel(item.timestamp) }}</span>
        <a v-if="item.txHash" class="tx link" :href="getExplorerLink(item.chain, item.txHash)" target="_blank" rel="noopener">
          View tx
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  grid-template-columns: 1.3fr 0.9fr 0.9fr 1.2fr 1fr;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  transition: background .15s ease;
}
.row:hover { background: rgba(255,255,255,.04); }
.cell { display: flex; align-items: center; gap: 10px; min-width: 0; }

.asset .thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
.asset-info { min-width: 0; }
.name { font-weight: 600; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.link  { text-decoration: none; }
.link:hover { text-decoration: underline; color: #cfe8ef; }

.icon     { width: 18px; height: 18px; object-fit: contain; }
.price-v  { font-weight: 700; }
.code     { opacity: .85; font-size: 12px; }
.usd      { opacity: .7; font-size: 12px; margin-left: 6px; }

.chip {
  padding: 2px 8px;
  border: 1px solid rgba(99,180,200,.5);
  border-radius: 9999px;
  font-size: 12px;
  color: #9dd1de;
  white-space: nowrap;
}

.mono  { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #cfe8ef; }
.muted { color: #9cc7d3; opacity: .8; }
.sep   { opacity: .6; }

.tx { margin-left: 8px; font-size: 12px; opacity: .9; }

/* MOBILE */
.row-mobile {
  padding: 12px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.row-mobile .top { display: flex; justify-content: space-between; gap: 10px; }
.row-mobile .left { display: flex; gap: 10px; min-width: 0; align-items: center; }
.row-mobile .thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; }
.row-mobile .right { display: flex; gap: 6px; align-items: center; }
.meta { margin-top: 8px; display: grid; gap: 6px; }
.market { display: flex; align-items: center; gap: 8px; }
.actors { display: flex; align-items: center; gap: 6px; color: #cfe8ef; }
.time { display: flex; align-items: center; gap: 8px; }
</style>
