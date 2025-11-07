<template>
  <footer class="relative border-t border-white/10 bg-[#05060c]/90 text-white backdrop-blur-2xl">
    <div class="pointer-events-none absolute inset-0 opacity-50 gradient-noise" aria-hidden="true" />
    <div class="relative mx-auto grid max-w-screen-2xl gap-10 px-6 py-12 md:grid-cols-[1.1fr_auto_0.9fr]">
      <!-- Левая колонка -->
      <div class="space-y-4">
        <p class="text-[11px] uppercase tracking-[0.4em] text-white/60">Palantir</p>
        <h2 class="text-3xl font-semibold leading-tight">Fusionist companion built for pilots, collectors & guilds.</h2>
        <p class="text-sm text-white/70">
          Stay ahead of drops, NFT performance and in-game balance. The wiki now covers Cores and Weapons with transparent stats.
        </p>
        <router-link
          to="/wiki"
          class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/70 to-blue-500/70 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:shadow-sky-900/60"
        >
          Visit Wiki Hub
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <!-- Центр -->
      <div class="flex flex-col items-center justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur">
        <img src="/fusionist-logo.svg" alt="Fusionist Logo" class="h-16 w-auto" />
        <div class="space-y-1 text-sm text-white/70">
          <p>Inspired by Fusionist.io</p>
          <p class="text-base font-semibold text-white">Community edition</p>
        </div>
        <a
          href="https://fusionist.io"
          target="_blank"
          rel="noopener"
          class="text-xs uppercase tracking-[0.4em] text-white/60 hover:text-white"
        >
          fusionist.io
        </a>
      </div>

      <!-- Правая колонка -->
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-1">
        <div>
          <p class="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-3">Explore</p>
          <ul class="space-y-2 text-sm text-white/70">
            <li><router-link to="/collections" class="footer-link">Collections</router-link></li>
            <li><router-link to="/wiki/cores" class="footer-link">Cores Atlas</router-link></li>
            <li><router-link to="/wiki/weapons" class="footer-link">Weapons / Skills</router-link></li>
            <li><router-link to="/wiki/buffs" class="footer-link">Buffs (Soon)</router-link></li>
            <li><router-link to="/contacts" class="footer-link">Contacts</router-link></li>
          </ul>
        </div>

        <div>
          <p class="text-[11px] uppercase tracking-[0.4em] text-white/60 mb-3">Social</p>
          <div class="flex flex-wrap gap-3">
            <a
              href="https://discord.gg/fusionistio"
              target="_blank"
              rel="noopener"
              aria-label="Fusionist Discord"
              class="social-pill"
            >
              <img src="/social-icons/discord.svg" alt="Discord" class="h-5 w-5" />
              Discord
            </a>
            <a
              href="https://x.com/fusionistio"
              target="_blank"
              rel="noopener"
              aria-label="Fusionist on X"
              class="social-pill"
            >
              <img src="/social-icons/x.svg" alt="X (Twitter)" class="h-5 w-5" />
              X / Twitter
            </a>
            <a
              href="https://ace.fusionist.io/?ic=508701"
              target="_blank"
              rel="noopener"
              aria-label="Fusionist Website"
              class="social-pill"
            >
              <img src="/social-icons/website.svg" alt="Website" class="h-5 w-5" />
              ACE Portal
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="relative border-t border-white/10 px-6 py-5 text-center text-xs uppercase tracking-[0.4em] text-white/60">
      © {{ new Date().getFullYear() }} Palantir • Crafted for the Fusionist community
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply transition hover:text-white;
}

.social-pill {
  @apply inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white;
}

.gradient-noise {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(99,180,200,0.2), transparent 35%),
    radial-gradient(circle at 90% 30%, rgba(80,125,255,0.2), transparent 40%),
    linear-gradient(120deg, rgba(255,255,255,0.05), transparent);
}
</style>
