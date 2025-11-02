<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-6xl">
    <h1 class="text-3xl font-semibold mb-6">Fusionist — Wiki</h1>

    <div class="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
      <RouterLink
        to="/wiki/cores"
        class="rounded-2xl p-5 bg-neutral-900/40 ring-1 ring-white/10 hover:ring-white/20 transition"
      >
        <h2 class="text-xl font-medium mb-2">Cores</h2>
        <p class="opacity-80 text-sm">Библиотека «ядер». Временная версия: просто выводим JSON ответа.</p>
      </RouterLink>

      <RouterLink
        to="/wiki/weapons"
        class="rounded-2xl p-5 bg-neutral-900/40 ring-1 ring-white/10 hover:ring-white/20 transition"
      >
        <h2 class="text-xl font-medium mb-2">Weapons / Skills</h2>
        <p class="opacity-80 text-sm">Каждый скилл привязан к оружию. Заглушка на будущее.</p>
      </RouterLink>

      <RouterLink
        to="/wiki/buffs"
        class="rounded-2xl p-5 bg-neutral-900/40 ring-1 ring-white/10 hover:ring-white/20 transition"
      >
        <h2 class="text-xl font-medium mb-2">Buffs</h2>
        <p class="opacity-80 text-sm">Связаны и с ядрами, и со скиллами. Заглушка на будущее.</p>
      </RouterLink>
    </div>
  </section>
</template>
