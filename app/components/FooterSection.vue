<template>
  <footer class="footer-shell">
    <div class="pointer-events-none absolute inset-0 gradient-noise" aria-hidden="true" />
    <div class="footer-inner">
      <!-- Левая колонка -->
      <div class="space-y-4">
        <p class="text-[11px] uppercase tracking-[0.4em] text-white/60">Palantir</p>
        <h2 class="text-3xl font-semibold leading-tight">Fusionist companion built for pilots, collectors & guilds.</h2>
        <p class="text-sm text-white/70">
          Stay ahead of drops, NFT performance and in-game balance. The wiki now covers Cores and Weapons with transparent stats.
        </p>
        <NuxtLink
          to="/wiki"
          class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/70 to-blue-500/70 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:shadow-sky-900/60"
        >
          Visit Wiki Hub
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Центр -->
      <div class="footer-card glass-surface glass-surface--radial footer-center">
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
            <li><NuxtLink to="/collections" class="footer-link">Collections</NuxtLink></li>
            <li><NuxtLink to="/wiki/cores" class="footer-link">Cores Atlas</NuxtLink></li>
            <li><NuxtLink to="/wiki/weapons" class="footer-link">Weapons / Skills</NuxtLink></li>
            <li><NuxtLink to="/wiki/buffs" class="footer-link">Buffs (Soon)</NuxtLink></li>
            <li><NuxtLink to="/contacts" class="footer-link">Contacts</NuxtLink></li>
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
              class="social-pill glass-chip"
            >
              <img src="/social-icons/discord.svg" alt="Discord" class="h-5 w-5" />
              Discord
            </a>
            <a
              href="https://x.com/fusionistio"
              target="_blank"
              rel="noopener"
              aria-label="Fusionist on X"
              class="social-pill glass-chip"
            >
              <img src="/social-icons/x.svg" alt="X (Twitter)" class="h-5 w-5" />
              X / Twitter
            </a>
            <a
              href="https://ace.fusionist.io/?ic=508701"
              target="_blank"
              rel="noopener"
              aria-label="Fusionist Website"
              class="social-pill glass-chip"
            >
              <img src="/social-icons/website.svg" alt="Website" class="h-5 w-5" />
              ACE Portal
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      © {{ new Date().getFullYear() }} Palantir • Crafted for the Fusionist community
    </div>
  </footer>
</template>

<style scoped>
:global(body) {
  color: #f1f5ff;
}
.footer-shell {
  position: relative;
  border-top: 1px solid rgba(255,255,255,0.1);
  background:
    radial-gradient(circle at 10% 20%, rgba(84,141,194,0.18), transparent 45%),
    linear-gradient(180deg, rgba(5,6,12,0.95), rgba(5,7,14,0.92));
  color: #fff;
  backdrop-filter: blur(18px);
  overflow: hidden;
}
.footer-inner {
  position: relative;
  display: grid;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2.5rem;
  padding: 3.5rem 1.5rem;
  grid-template-columns: 1.1fr auto 0.9fr;
}
@media (max-width: 1024px) {
  .footer-inner { grid-template-columns: 1fr; }
}

.footer-link {
  @apply transition hover:text-white;
}

.social-pill {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.gradient-noise {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(99,180,200,0.2), transparent 35%),
    radial-gradient(circle at 90% 30%, rgba(80,125,255,0.2), transparent 40%),
    linear-gradient(120deg, rgba(255,255,255,0.05), transparent);
  opacity: 0.5;
}
.footer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  border-radius: 24px;
  padding: 2rem;
  text-align: center;
}
.footer-bottom {
  position: relative;
  border-top: 1px solid rgba(255,255,255,0.12);
  padding: 1.25rem;
  text-align: center;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
</style>
