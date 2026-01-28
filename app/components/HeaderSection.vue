<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { toggleScrollLock } from '@/utils/scrollLock'
import { currency as currencyDict } from '@/utils/dictsList.js'
import { fetchCryptocurrencies } from '@/utils/api.js'
import LocalePicker from '@/components/wiki/LocalePicker.vue'
import { useWikiLocaleStore } from '@/stores/wikiLocaleStore'

const isOpen = ref(false)
const panelRef = ref(null)
const wikiLocaleStore = useWikiLocaleStore()
const localeRef = computed({
  get: () => wikiLocaleStore.locale,
  set: (val) => wikiLocaleStore.setLocale(val),
})

const navItems = [
  { to: '/collections/fusionist_planet', label: 'Fusionist Planet' },
  { to: '/collections/bi_mech', label: 'Bi-Mech' },
  { to: '/collections/quartan_primes', label: 'Quartan Primes' },
  { to: '/collections/alpha_prestige', label: 'Alpha Prestige' },
  //{ to: '/collections/pioneer_of_fusionist', label: 'Pioneer of Fusionist' },
  { to: '/collections/primeace', label: 'PrimeACE' },
]
const wikiNavItems = [
  { to: '/wiki', label: 'Wiki Hub', detail: 'Overview & entry point' },
  { to: '/wiki/cores', label: 'Cores', detail: 'Stats, rarities, passives' },
  { to: '/wiki/weapons', label: 'Weapons', detail: 'Jobs, slots, labels' },
  { to: '/wiki/buffs', label: 'Buffs', detail: 'Coming soon', soon: true },
]

const open = () => { isOpen.value = true }
const close = () => { isOpen.value = false }
const toggle = () => { isOpen.value ? close() : open() }

watch(isOpen, (val) => { toggleScrollLock(val) })
onBeforeUnmount(() => toggleScrollLock(false))

/* ====== КУРСЫ КРИПТЫ ====== */
const rawCryptos = ref([])
const isLoadingCryptos = ref(false)
const desiredOrder = ['ACE', 'ETH', 'BNB'] // порядок вывода

const loadCryptos = async () => {
  try {
    isLoadingCryptos.value = true
    const { data } = await fetchCryptocurrencies()
    rawCryptos.value = Array.isArray(data?.data) ? data.data : []
  } catch (e) {
    console.error('cryptos load failed:', e)
    rawCryptos.value = []
  } finally {
    isLoadingCryptos.value = false
  }
}
onMounted(loadCryptos)

const iconFor = (sym) => `/currency/${currencyDict[sym] ?? currencyDict.Unknown}`
const fmt = (v) => {
  if (v >= 1000) return Math.round(v).toString()
  if (v >= 100) return v.toFixed(1)
  if (v >= 1) return v.toFixed(2)
  return v.toFixed(2)
}

const cryptos = computed(() => {
  const bySymbol = Object.fromEntries(rawCryptos.value.map(c => [c.symbol, c]))
  return desiredOrder.map(sym => bySymbol[sym]).filter(Boolean)
})

</script>

<template>
  <!-- Хедер -->
  <header class="relative z-40 border-b border-white/5 bg-[#05060c]/70 header-blur shadow-[0_10px_40px_rgba(5,6,12,0.6)]">
    <div class="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen gradient-noise" aria-hidden="true" />
    <div class="relative mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <!-- Лого -->
      <NuxtLink
        to="/"
        class="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-4 py-2 backdrop-blur"
      >
        <div class="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400/70 to-blue-500/70 text-white shadow-lg shadow-sky-900/50 transition duration-300 group-hover:scale-105">
          <img src="/logo_cropped.png" alt="PALANTIR logo" class="h-8 w-8" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-[0.5em] text-white/70">Fusionist</p>
          <p class="text-2xl font-semibold tracking-[0.3em] text-white drop-shadow logo-grad">Palantir</p>
        </div>
      </NuxtLink>

      <!-- Навигация -->
      <nav class="flex flex-col gap-3 text-sm font-semibold text-white/80 sm:flex-row sm:items-center sm:gap-4">
        <div class="flex items-center gap-2 justify-center">
          <button
            class="nav-chip"
            @click="toggle"
            :aria-expanded="isOpen ? 'true' : 'false'"
            aria-controls="collections-drawer"
          >
            <span class="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
            Collections
          </button>

          <NuxtLink to="/wiki" class="nav-chip relative">
            Wiki Hub
            <span class="badge">NEW</span>
          </NuxtLink>
        </div>

        <NuxtLink
          to="/wiki/weapons"
          class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/80 to-indigo-500/80 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:shadow-sky-900/60"
        >
          Explore Weapons
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/wiki/cores"
          class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400/80 to-teal-500/80 px-5 py-2 text-base font-semibold text-white shadow-lg shadow-emerald-900/40 transition hover:shadow-emerald-900/60"
        >
          Explore Cores
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        <div class="flex items-center justify-center">
          <LocalePicker v-model="localeRef" />
        </div>
      </nav>
    </div>
  </header>

  <!-- Криптобар -->
  <section v-if="cryptos.length" class="relative isolate border-b border-white/5 bg-[#05060c]/60 py-2 backdrop-blur-xl">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-indigo-500/10" aria-hidden="true" />
    <div
      class="relative mx-auto max-w-screen-2xl px-5 text-white/80"
      aria-label="Crypto prices"
    >
      <ul class="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
        <li
          v-for="c in cryptos"
          :key="c.symbol"
          class="glass-chip flex items-center gap-2 rounded-full px-4 py-1.5"
        >
          <img :src="iconFor(c.symbol)" :alt="c.symbol" class="h-4 w-4" />
          <span class="text-[11px] uppercase tracking-[0.25em] text-white/60">{{ c.symbol }}</span>
          <span class="tabular-nums text-white">{{ fmt(c.value) }}</span>
        </li>
      </ul>
    </div>
  </section>



  <!-- Бэкдроп и дровер -->
  <teleport to="body">
    <transition name="fade" appear>
      <div
        v-show="isOpen"
        class="fixed inset-0 z-[9998] bg-black/70 backdrop-blur"
        role="presentation"
        @click.self="close"
      />
    </transition>

    <transition name="slide" appear>
      <aside
        v-show="isOpen"
        id="collections-drawer"
        ref="panelRef"
        class="fixed right-0 top-0 z-[9999] flex h-full w-full flex-col bg-transparent text-white shadow-2xl ring-1 ring-white/10 header-blur sm:w-[460px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collections-title"
        @click.stop
      >
        <div class="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p class="text-xs uppercase tracking-[0.4em] text-white/60">Navigator</p>
            <h2 id="collections-title" class="text-2xl font-semibold text-white">
              Collections & Wiki
            </h2>
          </div>
          <button
            class="grid h-9 w-9 place-items-center rounded-full border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            @click="close"
            aria-label="Close collections"
          >
            <img src="@/assets/cross.svg" alt="Close" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8 panel-body-bg">
          <section>
            <p class="mb-3 text-[11px] uppercase tracking-[0.4em] text-white/50">Collections</p>
            <nav>
              <ul class="space-y-2">
                <li v-for="item in navItems" :key="item.to">
                  <NuxtLink
                    :to="item.to"
                    class="glass-row"
                    @click="close"
                  >
                    <div>
                      <p class="font-semibold text-white">{{ item.label }}</p>
                      <p class="text-xs text-white/60">NFT analytics & drop overview</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </section>

          <section>
            <div class="mb-4 flex items-center justify-between">
              <div>
                <p class="text-[11px] uppercase tracking-[0.3em] text-white/60">Wiki</p>
                <p class="text-lg font-semibold text-white">Game Encyclopedia</p>
              </div>
              <span class="badge">Updated</span>
            </div>
            <ul class="space-y-2">
              <li v-for="wiki in wikiNavItems" :key="wiki.to">
                <NuxtLink
                  :to="wiki.to"
                  class="glass-row text-sm"
                  :class="{ 'opacity-70': wiki.soon }"
                  @click="close"
                >
                  <div>
                    <p class="font-semibold text-white">{{ wiki.label }}</p>
                    <p class="text-xs text-white/60">{{ wiki.detail }}</p>
                  </div>
                  <span v-if="wiki.soon" class="badge">Soon</span>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M8 12h8" />
                    <path d="M12 8l4 4-4 4" />
                  </svg>
                </NuxtLink>
              </li>
            </ul>
          </section>
          <div
            class="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-white/60"
          >
            <span>© {{ new Date().getFullYear() }} Palantir</span>
            <NuxtLink to="/" class="text-[#63b4c8] hover:text-white" @click="close">
              Home
            </NuxtLink>
          </div>
        </div>
      </aside>
    </transition>
  </teleport>
</template>




<style scoped>
/* Backdrop fade */
.fade-enter-active, .fade-leave-active { transition: opacity 180ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Panel slide */
.slide-enter-active, .slide-leave-active { transition: transform 220ms ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.logo-grad {
  background: linear-gradient(182deg, rgba(249,249,249,1) 0%, rgba(169,229,242,1) 35%, rgba(52,152,219,1) 100%);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Ровные цифры для цен */
.tabular-nums { font-variant-numeric: tabular-nums; }

.nav-chip {
  @apply inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white;
}

.header-blur {
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(32px);
}


.badge {
  @apply ml-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white;
}

.glass-chip {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
}

.panel-body-bg {
  background:
    radial-gradient(circle at 15% 0%, rgba(84,141,194,0.16), rgba(7,11,22,0.8)),
    rgba(7,11,22,0.92);
}
.glass-row {
  @apply flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:border-white/30 hover:bg-white/10;
}


.gradient-noise {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(99,180,200,0.25), transparent 35%),
    radial-gradient(circle at 90% 30%, rgba(80,125,255,0.2), transparent 40%),
    linear-gradient(120deg, rgba(255,255,255,0.05), transparent);
}
</style>
