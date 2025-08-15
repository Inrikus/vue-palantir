<script setup>
import { computed } from 'vue'
import { platformIcon, currency as currencyDict, getCollectionLink } from '@/utils/dictsList.js'

const props = defineProps({
  item: { type: Object, required: true },
  collectionKey: { type: String, required: true },
})

/* ====== ссылки ====== */
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

/* ====== отображение ====== */
const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '—')
const humanPrice = (v) => (v || v === 0)
  ? (v >= 1000 ? Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 })
               : Number(v).toFixed(2))
  : '—'
const humanUsd = (u) => (u || u === 0)
  ? `($${Number(u).toLocaleString(undefined, { maximumFractionDigits: 2 })})`
  : ''

// Абсолютное: YYYY-MM-DD HH:mm (24ч)
const absTime = (tsSec) => {
  const d = new Date((typeof tsSec === 'number' ? tsSec * 1000 : Date.now()))
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${dd} ${hh}:${mm}`
}
// Относительное: до 24h — «Nh ago», дальше «Nd ago»
const relTime = (tsSec) => {
  const now = Date.now()
  const t = typeof tsSec === 'number' ? tsSec * 1000 : now
  const diffMs = Math.max(0, now - t)
  const hours = Math.floor(diffMs / 3600000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
const timeLabelAbs = computed(() => absTime(props.item.timestamp))
const timeLabelRel = computed(() => relTime(props.item.timestamp))

/* ====== словари → иконки ====== */
const platformSrc = (platform) => `/${platformIcon[platform] || platformIcon.Element}`
const currencySrc  = (code) => {
  const key = (code || '').toUpperCase()
  const file = currencyDict[key] || currencyDict.Unknown
  return `/currency/${file}`
}

/* ====== ссылка на коллекцию (по платформе) ====== */
const collectionUrl = computed(() => {
  const dict = getCollectionLink[props.collectionKey] || {}
  return dict[props.item.platform] || dict.default || '#'
})
</script>

<template>
<!-- Desktop row -->
<div class="row hidden sm:grid">
  <!-- Market → ссылка на коллекцию -->
  <div class="cell market">
    <img :src="platformSrc(item.platform)" alt="" class="icon-25" />
    <a class="chip" :href="collectionUrl" target="_blank" rel="noopener">
      {{ item.platform || 'Market' }}
    </a>
  </div>

  <!-- Asset -->
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

  <!-- Price -->
  <div class="cell price">
    <div class="price-primary-wrapper">
      <img :src="currencySrc(item.currency)" alt="" class="icon-18" />
      <div class="price-primary">
        <span class="price-v num">{{ humanPrice(item.price_native) }}</span>
        <span class="code">{{ item.currency || '—' }}</span>
      </div>
    </div>
    <div class="price-secondary" v-if="item.price_usd !== undefined">
      <span class="usd num">{{ humanUsd(item.price_usd) }}</span>
    </div>
  </div>

  <!-- From → To -->
  <div class="cell actors">
    <a class="mono link" :href="getMarketLink(item.chain, item.from_address)" target="_blank" rel="noopener">
      {{ shortAddr(item.from_address) }}
    </a>
    <span class="sep">→</span>
    <a class="mono link" :href="getMarketLink(item.chain, item.to)" target="_blank" rel="noopener">
      {{ shortAddr(item.to) }}
    </a>
  </div>

  <!-- Time / Tx -->
  <div class="cell time">
    <div class="time-text">
      <span class="abs">{{ timeLabelAbs }}</span>
      <span class="dot">·</span>
      <span class="rel">{{ timeLabelRel }}</span>
    </div>
    <a
      v-if="item.txHash"
      class="tx-btn"
      :href="getExplorerLink(item.chain, item.txHash)"
      target="_blank"
      rel="noopener"
    >
      Tx <span class="tx-icon">↗️</span>
    </a>
    <span v-else class="tx-btn placeholder">Tx</span>
  </div>

</div>

  <!-- Mobile card -->
  <div class="row-mobile sm:hidden">
    <div class="top">
      <!-- item (mobile) -->
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
      
      <!-- PRICE (mobile) -->
      <div class="right">
        <div class="price-primary-wrapper">
          <img :src="currencySrc(item.currency)" alt="" class="icon-18" />
          <div class="price-primary">
            <span class="price-v num">{{ humanPrice(item.price_native) }}</span>
            <span class="code">{{ item.currency || '—' }}</span>
          </div>
        </div>
        <div class="price-secondary" v-if="item.price_usd !== undefined">
          <span class="usd num">{{ humanUsd(item.price_usd) }}</span>
        </div>
      </div>
   
    </div>

    <div class="meta">
      <div class="market">
        <img :src="platformSrc(item.platform)" alt="" class="icon-25" />
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
        <span class="muted">{{ timeLabelAbs }}</span>
        <span class="sep">·</span>
        <span class="muted">{{ timeLabelRel }}</span>
        <a v-if="item.txHash"
          class="tx-btn"
          :href="getExplorerLink(item.chain, item.txHash)"
          target="_blank"
          rel="noopener"
        >Tx <span class="tx-icon">↗️</span>
        </a>
      <span v-else class="tx-btn placeholder">Tx</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ====== GRID (desktop) ====== */
.row {
  grid-template-columns: 0.15fr 0.7fr 0.6fr 0.4fr 1fr;
  align-items: center;
  padding: 15px 35px;
  border-bottom: 1px solid rgba(255,255,255,.06);
  transition: background .15s ease;
}
.row:hover { background: rgba(255,255,255,.04); }
.cell { display: flex; align-items: center; gap: 10px; min-width: 0; }

/* asset */
.asset .thumb { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
.asset-info { min-width: 0; }
.name { font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.link { text-decoration: none; }
.link:hover { text-decoration: underline; color: #cfe8ef; }

/* ====== PRICE (общие) ====== */
.cell.price {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px; /* между основной ценой и USD */
  padding: 0 6px;
  white-space: nowrap;
}

.price-primary-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.price-primary {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
}

.price-secondary {
  font-variant-numeric: tabular-nums; /* цифры с одинаковой шириной */
  font-weight: 400;
  color: rgba(255,255,255,.7);
}

.price-v { text-align: left; font-weight: 700; line-height: 1.3; }
.code   { text-align: left; line-height: 1.3; opacity: .95; font-size: 16px; }
.usd    { text-align: right; line-height: 1.3; opacity: .85; font-size: 14px; }

/* market */
.cell.market { justify-content: flex-start; }
.chip {
  padding: 2px 8px; border: 1px solid rgba(99,180,200,.5);
  border-radius: 9999px; font-size: 12px; color: #9dd1de; white-space: nowrap;
}

/* actors */
.cell.actors { justify-content: flex-start; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 16px; color: #cfe8ef; }
.sep  { opacity: .6; }

/* time */
.cell.time {
  justify-content: flex-end;
  gap: 8px; /* минимальный зазор между временем и кнопкой */
}
.time-text { display: inline-flex; gap: 6px; align-items: baseline; min-width: 0; font-size: 16px;}
.time .abs { color: #9cc7d3; opacity: .9; }
.time .rel { color: #9cc7d3; opacity: .8; }
.tx-btn {
  display:inline-flex; justify-content:center; align-items:center; gap: 4px; /* иконка чуть от текста */ padding: 0 6px;
  height:24px; border:1px solid rgba(99,180,200,.5);
  color:#9dd1de; border-radius:9999px; font-size:12px; text-decoration:none;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
}
.tx-btn:hover { background: rgba(99,180,200,.12); color:#cfe8ef; border-color:rgba(99,180,200,.8); }
.tx-btn.placeholder { visibility:hidden; }
.tx-icon {
  font-size: 12px;
  line-height: 1;
}

/* ====== MOBILE ====== */
.row-mobile { padding: 12px; border-bottom: 1px solid rgba(255,255,255,.06); }
.row-mobile .top { display:flex; justify-content:space-between; gap:10px; }
.row-mobile .left { display:flex; gap:10px; min-width:0; align-items:center; }
.row-mobile .thumb { width:44px; height:44px; border-radius:8px; object-fit:cover; }
.row-mobile .right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
}
.meta { margin-top:8px; display:grid; gap:6px; }
.market { display:flex; align-items:center; gap:8px; }
.actors { display:flex; align-items:center; gap:6px; color:#cfe8ef; }
.row-mobile .time { display:flex; align-items:center; gap:8px; }
.muted { color:#9cc7d3; opacity:.8; }

/* Узкие экраны: оставляем 2 колонки (цена + валюта), уменьшаем зазоры, скрываем USD */
@media (max-width: 420px){
  /* .row-mobile .right .usd{ display: none; } */
}
/* Универсальные размеры иконок */
.icon-18 { width: 18px; height: 18px; flex: 0 0 18px; object-fit: contain; }
.icon-25 { width: 25px; height: 25px; flex: 0 0 25px; object-fit: contain; }

</style>
