<script setup>
const sections = [
  {
    to: '/wiki/cores',
    title: 'Cores',
    desc: 'Full stats, rarities, passives and label filters.',
    status: 'Live',
    accent: 'from-emerald-400/40 to-teal-500/40'
  },
  {
    to: '/wiki/weapons',
    title: 'Weapons / Skills',
    desc: 'Jobs, weapon slots, label faceting and advanced modal.',
    status: 'Live',
    accent: 'from-sky-400/40 to-indigo-500/40'
  },
  {
    to: '/wiki/buffs',
    title: 'Buffs',
    desc: 'A section in development',
    status: 'Soon',
    accent: 'from-amber-400/40 to-pink-500/40',
    comingSoon: true
  }
]

definePageMeta({
  glassShell: true
})

useHead({ title: 'Wiki — Fusionist Palantir' })
</script>

<template>
  <section class="wiki-home mx-auto max-w-6xl">
    <div class="lead-card">
      <p class="text-xs uppercase tracking-[0.4em] text-white/60">Fusionist wiki</p>
      <h1 class="mt-3 text-4xl font-semibold">One hub for Cores, Weapons and upcoming Buffs.</h1>
      <p class="mt-4 text-sm text-white/70">
        We synchronize the data with the live API and use Palantir's filters to enhance it.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <template v-for="entry in sections" :key="entry.title">
        <NuxtLink
          v-if="!entry.comingSoon"
          :to="entry.to"
          class="wiki-tile"
          :class="`bg-gradient-to-br ${entry.accent} hover:border-white/60`"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-white">{{ entry.title }}</h2>
            <span class="status-pill bg-emerald-400/80 text-black">
              {{ entry.status }}
            </span>
          </div>
          <p class="mt-3 text-sm text-white/80">
            {{ entry.desc }}
          </p>
          <div class="mt-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
            View details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </div>
        </NuxtLink>

        <div
          v-else
          class="wiki-tile opacity-70 cursor-not-allowed"
          :class="`bg-gradient-to-br ${entry.accent}`"
          role="presentation"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-white">{{ entry.title }}</h2>
            <span class="status-pill bg-amber-400/80 text-black">
              {{ entry.status }}
            </span>
          </div>
          <p class="mt-3 text-sm text-white/80">
            {{ entry.desc }}
          </p>
          <div class="mt-auto text-xs uppercase tracking-[0.3em] text-white/80">
            Work in progress
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.wiki-home {
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.lead-card {
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border-radius: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255,255,255,.1);
  background:
    radial-gradient(circle at 0% 0%, rgba(99,180,200,.2), transparent 60%),
    rgba(8,11,20,.85);
  box-shadow: 0 25px 55px rgba(3,6,19,.35);
}
.wiki-tile {
  @apply flex min-h-[220px] flex-col rounded-3xl border border-white/20 p-5 shadow-lg shadow-black/30 transition duration-300;
}
.status-pill {
  @apply rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest;
}
</style>
