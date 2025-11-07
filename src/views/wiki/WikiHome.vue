<script setup>
import { RouterLink } from 'vue-router'

const sections = [
  {
    to: '/wiki/cores',
    title: 'Cores',
    desc: 'Full stats, rarities, passives and label filters.',
    status: 'Live',
    accent: 'from-emerald-400/40 to-teal-500/40',
  },
  {
    to: '/wiki/weapons',
    title: 'Weapons / Skills',
    desc: 'Jobs, weapon slots, label faceting and advanced modal.',
    status: 'Live',
    accent: 'from-sky-400/40 to-indigo-500/40',
  },
  {
    to: '/wiki/buffs',
    title: 'Buffs',
    desc: 'A section in development',
    status: 'Soon',
    accent: 'from-amber-400/40 to-pink-500/40',
    comingSoon: true,
  },
]
</script>

<template>
  <section class="mx-auto max-w-6xl space-y-8">
    <div class="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur">
      <p class="text-xs uppercase tracking-[0.4em] text-white/60">Fusionist wiki</p>
      <h1 class="mt-3 text-4xl font-semibold">One hub for Cores, Weapons and upcoming Buffs.</h1>
      <p class="mt-4 text-sm text-white/70">
        We synchronize the data with the live API and use Palantir's filters to enhance it.
      </p>
      <RouterLink
        to="/wiki/weapons"
        class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400/70 to-blue-600/70 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/40"
      >
        Open Weapons / Skills
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      </RouterLink>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      <component
        v-for="entry in sections"
        :key="entry.title"
        :is="entry.comingSoon ? 'div' : RouterLink"
        :to="entry.comingSoon ? undefined : entry.to"
        class="wiki-tile"
        :class="[
          `bg-gradient-to-br ${entry.accent}`,
          entry.comingSoon ? 'opacity-70 cursor-not-allowed' : 'hover:border-white/60'
        ]"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-white">{{ entry.title }}</h2>
          <span class="status-pill" :class="entry.status === 'Soon' ? 'bg-amber-400/80 text-black' : 'bg-emerald-400/80 text-black'">
            {{ entry.status }}
          </span>
        </div>
        <p class="mt-3 text-sm text-white/80">
          {{ entry.desc }}
        </p>
        <div v-if="!entry.comingSoon" class="mt-auto flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
          View details
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </div>
        <div v-else class="mt-auto text-xs uppercase tracking-[0.3em] text-white/80">
          Work in progress
        </div>
      </component>
    </div>
  </section>
</template>

<style scoped>
.wiki-tile {
  @apply flex min-h-[220px] flex-col rounded-3xl border border-white/20 p-5 shadow-lg shadow-black/30 transition duration-300;
}
.status-pill {
  @apply rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest;
}
</style>
