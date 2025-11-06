<script setup>
import { computed } from 'vue'

const props = defineProps({
  weapon: { type: Object, required: true },
  locale: { type: String, default: 'en' }
})

const title = computed(() =>
  props.weapon?.i18n?.name?.[props.locale] ||
  props.weapon?.englishName || `ID ${props.weapon?.id}`
)

function weaponIconSrc(w) {
  const icon = w?.Icon || 'weapon_unknown'
  return `/wiki/Weapons/${icon}.png`
}
</script>

<template>
  <article class="w-full rounded-2xl bg-[#1C1B20] ring-1 ring-white/10 p-4 md:p-6 space-y-6">
    <div class="flex flex-col items-center gap-4">
      <div class="relative w-64 h-64 md:w-72 md:h-72 rounded-xl bg-black/20 ring-1 ring-white/10">
        <img :src="weaponIconSrc(weapon)" :alt="title" class="absolute inset-0 w-full h-full object-contain z-10" />
        <img src="/wiki/Mechs/Img_BigScreenBG.png" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25" />
      </div>

      <h2 class="text-xl md:text-2xl font-semibold text-center">{{ title }}</h2>

      <div class="prose prose-invert max-w-none text-center opacity-90">
        <p v-if="weapon?.i18n?.desc?.[locale]">{{ weapon.i18n.desc[locale] }}</p>
        <p v-else class="opacity-70 text-sm">No description.</p>
      </div>
    </div>
  </article>
</template>
