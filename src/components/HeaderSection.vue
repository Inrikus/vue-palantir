<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { toggleScrollLock } from '@/utils/scrollLock'
import { currency as currencyDict } from '@/utils/dictsList.js'
import { fetchCryptocurrencies } from '@/utils/api.js'

const isOpen = ref(false)
const panelRef = ref(null)

const navItems = [
  { to: '/fusionist_planet', label: 'Fusionist Planet' },
  { to: '/bi_mech', label: 'Bi-Mech' },
  { to: '/quartan_primes', label: 'Quartan Primes' },
  { to: '/alpha_prestige', label: 'Alpha Prestige' },
  { to: '/pioneer_of_fusionist', label: 'Pioneer of Fusionist' },
  { to: '/primeace', label: 'PrimeACE' },
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
  <header
    class="silver-grad shadow
           flex flex-col items-center gap-4
           sm:flex-row sm:justify-between sm:items-center
           px-5 sm:px-20 py-6 header-grad"
  >
    <!-- Лого -->
    <router-link to="/" class="flex items-center justify-center sm:justify-start w-full sm:w-auto">
      <img src="/logo_cropped.png" alt="PALANTIR logo" class="w-10 h-10" />
      <h1 class="ml-2 text-3xl font-bold tracking-[8px] logo-grad">PALANTIR</h1>
    </router-link>

    <!-- Навигация -->
    <nav
      class="text-[#63b4c8] font-semibold text-xl flex gap-4 justify-center w-full sm:w-auto sm:justify-end"
    >
      <button
        class="hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
        @click="toggle"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-controls="collections-drawer"
      >
        Collections
      </button>
      <router-link to="/contacts" class="hover:opacity-50">Contacts</router-link>
    </nav>
  </header>

  <!-- Криптобар -->
  <section v-if="cryptos.length" class="w-full bg-[#121212] border-y border-white/10">
    <div
      class="mx-auto max-w-screen-xl px-5 text-[#63b4c8] font-semibold text-[15px] leading-10"
      aria-label="Crypto prices"
    >
      <ul class="flex items-center justify-center flex-wrap">
        <li
          v-for="c in cryptos"
          :key="c.symbol"
          class="flex items-center gap-2 after:content-['|'] after:mx-2 after:opacity-50 last:after:content-none"
        >
          <img :src="iconFor(c.symbol)" :alt="c.symbol" class="w-4 h-4" />
          <span class="uppercase">{{ c.symbol }}</span>
          <span class="opacity-70">:</span>
          <span class="tabular-nums">{{ fmt(c.value) }}</span>
        </li>
      </ul>
    </div>
  </section>


  <!-- Бэкдроп и дровер -->
  <teleport to="body">
    <transition name="fade" appear>
      <div
        v-show="isOpen"
        class="fixed inset-0 z-[9998] bg-black/50"
        role="presentation"
        @click.self="close"
      />
    </transition>

    <transition name="slide" appear>
      <aside
        v-show="isOpen"
        id="collections-drawer"
        ref="panelRef"
        class="fixed right-0 top-0 h-full w-full sm:w-[420px] z-[9999] bg-[#1a1a1a] text-[#63b4c8] shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="collections-title"
        @click.stop
      >
        <div class="flex items-center justify-between p-5 border-b border-white/10">
          <h2 id="collections-title" class="text-2xl font-semibold">
            Collections
          </h2>
          <button
            class="w-9 h-9 grid place-items-center rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400"
            @click="close"
            aria-label="Close collections"
          >
            <img src="@/assets/cross.svg" alt="Close" class="w-4 h-4" />
          </button>
        </div>

        <nav class="p-6 flex-1 overflow-y-auto">
          <ul class="space-y-3">
            <li v-for="item in navItems" :key="item.to">
              <router-link
                :to="item.to"
                class="block rounded-xl px-4 py-3 hover:bg-white/5"
                @click="close"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </nav>

        <div
          class="p-6 border-t border-white/10 flex items-center justify-between gap-4 text-sm text-white/70"
        >
          <span>© {{ new Date().getFullYear() }} Palantir </span>
          <router-link to="/" class="hover:opacity-50" @click="close">
            <span class="text-[#63b4c8] font-semibold">Home</span>
          </router-link>
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
  background-clip: text;              /* стандартное свойство */
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-grad { background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 10%, rgba(26, 26, 26, 1) 100%); }

/* Ровные цифры для цен */
.tabular-nums { font-variant-numeric: tabular-nums; }
</style>
