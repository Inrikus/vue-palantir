<script setup>
import { ref, watch } from 'vue'

const isOpen = ref(false)
const panelRef = ref(null)

// Навигация — snake_case пути, красивые подписи
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

// Лочим скролл body только когда открыт дровер
watch(isOpen, (val) => {
  document.body.classList.toggle('hidden-scroll', val)
})
</script>

<template>
  <header
    class="silver-grad shadow flex sm:flex-row flex-col justify-between sm:px-20 sm:py-0 pb-10 items-center header-grad">
    <router-link to="/" class="py-6 flex items-center">
      <img src="/logo_cropped.png" alt="PALANTIR logo" class="w-10 h-10" />
      <h1 class="ml-2 text-3xl font-bold tracking-[8px] logo-grad">PALANTIR</h1>
    </router-link>

    <nav class="text-[#63b4c8] font-semibold text-xl flex gap-4">
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

  <!-- Бэкдроп -->
  <teleport to="body">
    <transition name="fade" appear>
      <div
        v-show="isOpen"
        class="fixed inset-0 z-[9998] bg-black/50"
        role="presentation"
        @click.self="close"
      />
    </transition>

    <!-- Дровер -->
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
          <h2 id="collections-title" class="text-2xl font-semibold">Collections</h2>
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

        <div class="p-6 border-t border-white/10 flex items-center justify-between gap-4 text-sm text-white/70">
          <span>© {{ new Date().getFullYear() }} Palantir</span>
          <a href="https://palantir.ws" target="_blank" rel="noopener" class="hover:opacity-80">palantir.ws</a>
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
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.header-grad { background: linear-gradient(to bottom, rgba(19, 19, 19, 1) 10%, rgba(26, 26, 26, 1) 100%); }
.hidden-scroll { overflow: hidden; }
</style>
