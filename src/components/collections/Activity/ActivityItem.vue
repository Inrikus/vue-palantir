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

/* ====== assets helpers ====== */
const resolveAssetPath = (src) => {
  if (!src) return ''
  if (/^https?:\/\//i.test(src)) return src
  const normalized = src.startsWith('/') ? src : `/${src.replace(/^\/+/, '')}`
  return normalized
}

const platformIconSrc = computed(() => {
  const raw = platformIcon[props.item.platform] || platformIcon.Element
  return resolveAssetPath(raw)
})

const currencyIconSrc = computed(() => {
  const key = (props.item.currency || '').toUpperCase()
  const file = currencyDict[key] || currencyDict.Unknown
  return resolveAssetPath(`currency/${file}`)
})

const nftThumbSrc = computed(() => resolveAssetPath(props.item.nft_image))

/* ====== ссылка на коллекцию (по платформе) ====== */
const collectionUrl = computed(() => {
  const dict = getCollectionLink[props.collectionKey] || {}
  return dict[props.item.platform] || dict.default || '#'
})
</script>

<template>
<!-- Desktop row -->
<div class="row row-card hidden sm:grid">
  <!-- Market → ссылка на коллекцию -->
  <div class="cell market">
    <img :src="platformIconSrc" alt="" class="icon-25" />
    <a class="chip" :href="collectionUrl" target="_blank" rel="noopener">
      {{ item.platform || 'Market' }}
    </a>
  </div>

  <!-- Asset -->
  <div class="cell asset">
    <img v-if="nftThumbSrc" :src="nftThumbSrc" alt="" class="thumb" />
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
      <img :src="currencyIconSrc" alt="" class="icon-18" />
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
  <div class="row-mobile row-card sm:hidden">
    <div class="top">
      <!-- item (mobile) -->
      <div class="left">
        <img v-if="nftThumbSrc" :src="nftThumbSrc" alt="" class="thumb" />
        <div class="asset-info">
          <a
            class="name link"
            :href="getNFTLink(item.chain, item.collectionAddress, item.tokenId)"
            target="_blank" rel="noopener"
          >
            {{ item.nft_name || ('#' + item.tokenId) }}
          </a>
        </div>
      </div>
      
      <!-- PRICE (mobile) -->
      <div class="right">
        <div class="price-primary-wrapper">
          <img :src="currencyIconSrc" alt="" class="icon-18" />
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
        <img :src="platformIconSrc" alt="" class="icon-25" />
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
        > Tx <span class="tx-icon">↗️</span>
        </a>
      <span v-else class="tx-btn placeholder">Tx</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row-card {
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 1.25rem;
  background:
    radial-gradient(circle at 0% 0%, rgba(99,180,200,.15), transparent 55%),
    rgba(7,11,22,.85);
  box-shadow: 0 20px 45px rgba(3,6,19,.35);
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.row-card:hover {
  border-color: rgba(99,180,200,.4);
  transform: translateY(-2px);
  box-shadow: 0 26px 60px rgba(3,6,19,.45);
}

/* ====== GRID (desktop) ====== */
.row {
  grid-template-columns:
    minmax(120px, 0.18fr)
    minmax(220px, 0.70fr)
    minmax(150px, 0.55fr)
    minmax(180px, 0.45fr)
    minmax(210px, 1fr);
  align-items: center;
  padding: 18px 32px;
  gap: 1rem;
}
.cell { display: flex; align-items: center; gap: 10px; min-width: 0; }

/* asset */
.asset .thumb {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0,0,0,.45);
}
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
  gap: 2px;
  padding: 0 6px;
  white-space: nowrap;
}

.price-primary-wrapper { display: flex; align-items: center; gap: 6px; }
.price-primary { display: flex; align-items: baseline; gap: 4px; font-size: 16px; font-weight: 600; }
.price-secondary { font-variant-numeric: tabular-nums; font-weight: 400; color: rgba(255,255,255,.7); }

.price-v { text-align: left; font-weight: 700; line-height: 1.3; }
.code   { text-align: left; line-height: 1.3; opacity: .95; font-size: 16px; }
.usd    { text-align: right; line-height: 1.3; opacity: .85; font-size: 14px; }

/* market */
.cell.market { justify-content: flex-start; }
.chip {
  padding: 2px 10px;
  border: 1px solid rgba(99,180,200,.45);
  border-radius: 9999px;
  font-size: 12px;
  color: #9dd1de;
  white-space: nowrap;
  background: rgba(99,180,200,.08);
}

/* actors */
.cell.actors { justify-content: flex-start; min-width: 0; }
.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 16px; color: #cfe8ef;
  min-width: 0; max-width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.sep  { opacity: .6; }

/* time */
.cell.time {
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
}
.time-text {
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
  min-width: 0;
  overflow: hidden;            /* позволяет обрезать время */
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  font-size: 16px;
}
.time .abs { color: #9cc7d3; opacity: .9; }
.time .rel { color: #9cc7d3; opacity: .8; }
.tx-btn {
  display:inline-flex; justify-content:center; align-items:center; gap: 4px;
  padding: 0 6px; height:24px;
  border:1px solid rgba(99,180,200,.5);
  color:#9dd1de; border-radius:9999px; font-size:12px; text-decoration:none;
  transition: background .15s ease, color .15s ease, border-color .15s ease;
  flex-shrink: 0;              /* кнопка не сжимается и не залезает на текст */
}
.tx-btn:hover { background: rgba(99,180,200,.12); color:#cfe8ef; border-color:rgba(99,180,200,.8); }
.tx-btn.placeholder { visibility:hidden; }
.tx-icon { font-size: 12px; line-height: 1; }

/* ====== MOBILE ====== */
.row-mobile {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row-mobile .top { display:flex; justify-content:space-between; gap:12px; }
.row-mobile .left { display:flex; gap:10px; min-width:0; align-items:center; }
.row-mobile .thumb { width:48px; height:48px; border-radius:12px; object-fit:cover; box-shadow: 0 8px 18px rgba(0,0,0,.45); }
.row-mobile .right {
  display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 2px;
}
.row-mobile .name { display:block; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px; }
.row-mobile .meta { margin-top:8px; display:grid; gap:6px; }
.row-mobile .market { display:flex; align-items:center; gap:8px; }
.row-mobile .actors { display:flex; align-items:center; gap:6px; color:#cfe8ef; }
.row-mobile .time { display:flex; align-items:center; gap:8px; font-size: 16px;}
.muted { color:#9cc7d3; opacity:.8; }

/* @media (max-width: 420px){ */
  /* при желании можно скрыть USD на очень узких — оставлено на ваше усмотрение */
/* } */

/* Visibility guards in case utility classes aren't applied */
@media (max-width: 639px) {
  .row { display: none; }
}
@media (min-width: 640px) {
  .row { display: grid; }
  .row-mobile { display: none !important; }
}

/* Универсальные размеры иконок */
.icon-18 { width: 18px; height: 18px; flex: 0 0 18px; object-fit: contain; }
.icon-25 { width: 25px; height: 25px; flex: 0 0 25px; object-fit: contain; }

/* ====== ПРОГРЕССИВНОЕ «СЖАТИЕ» НА ДЕСКТОПЕ (и при зуме) ====== */

/* 1) Cначала убираем USD, сетку чуть пересобираем */
@media (max-width: 1400px){
  .price-secondary { display: none; }
  .row {
    grid-template-columns:
      minmax(110px, 0.18fr)
      minmax(200px, 0.75fr)
      minmax(140px, 0.50fr)
      minmax(170px, 0.45fr)
      minmax(190px, 1fr);
  }
}

/* 2) Прячем подпись маркетплейса (оставляем иконку) */
@media (max-width: 1300px){
  .cell.market .chip { display: none; }
  .row {
    grid-template-columns:
      minmax(40px, 0.10fr)     /* только иконка */
      minmax(200px, 0.85fr)
      minmax(140px, 0.55fr)
      minmax(160px, 0.45fr)
      minmax(180px, 1fr);
  }
}

/* 3) Прячем относительное время и точку-разделитель */
@media (max-width: 1200px){
  .time .rel, .time .dot { display: none; }
  .row {
    grid-template-columns:
      minmax(40px, 0.10fr)
      minmax(180px, 0.90fr)
      minmax(130px, 0.55fr)
      minmax(150px, 0.45fr)
      minmax(160px, 1fr);
  }
}

/* 4) Прячем адрес отправителя (оставляем только получателя) */
@media (max-width: 1100px){
  .cell.actors a:first-child, .cell.actors .sep { display: none; }
  .row {
    grid-template-columns:
      minmax(40px, 0.10fr)
      minmax(180px, 1fr)
      minmax(120px, 0.55fr)
      minmax(120px, 0.35fr)   /* actors стало короче */
      minmax(150px, 1fr);
  }
}

/* 5) Если совсем тесно — чуть уменьшаем минимумы времени/актеров */
@media (max-width: 1000px){
  .row {
    grid-template-columns:
      minmax(40px, 0.10fr)
      minmax(170px, 1fr)
      minmax(110px, 0.50fr)
      minmax(110px, 0.30fr)
      minmax(140px, 1fr);
  }
}

</style>
