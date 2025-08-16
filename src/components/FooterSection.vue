<template>
  <footer class="bg-black text-white border-t border-gray-800">
    <div
      class="silver-grad shadow header-grad w-full sm:px-20 py-8
             grid grid-cols-1 sm:[grid-template-columns:1fr_auto_1fr] items-center gap-6"
    >
      <!-- Левая часть: логотип + подпись -->
      <div class="justify-self-center sm:justify-self-start min-w-0">
        <a href="https://fusionist.io" target="_blank" rel="noopener" class="flex items-center gap-2">
          <span class="hidden sm:inline text-gray-400 text-lg whitespace-nowrap">Inspired by</span>
          <img src="/fusionist-logo.svg" alt="Fusionist Logo" class="h-10 sm:h-12 w-auto shrink-0" />
        </a>
      </div>

      <!-- Центр: надпись (строго по центру) -->
      <div class="justify-self-center text-center text-lg text-gray-400">
        Created for community by
        <router-link to="/">
          <span class="hover:opacity-50 text-[#63b4c8] font-semibold"> Palantir </span>
        </router-link>
        team
      </div>

      <!-- Правая часть: иконки соцсетей -->
      <div class="justify-self-center sm:justify-self-end flex items-center gap-5">
        <a href="https://discord.gg/fusionistio" target="_blank" rel="noopener" aria-label="Fusionist Discord"
          class="hover:opacity-80">
          <img src="/social-icons/discord.svg" alt="Discord" class="h-7 w-7" />
        </a>
        <a href="https://x.com/fusionistio" target="_blank" rel="noopener" aria-label="Fusionist on X"
          class="hover:opacity-80">
          <img src="/social-icons/x.svg" alt="X (Twitter)" class="h-7 w-7" />
        </a>
        <a href="https://ace.fusionist.io/?ic=508701" target="_blank" rel="noopener"
          aria-label="Fusionist Website" class="hover:opacity-80">
          <img src="/social-icons/website.svg" alt="Website" class="h-7 w-7" />
        </a>
      </div>
    </div>
  </footer>
</template>
