<!-- src/components/wiki/WikiWeapons.vue -->
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useWikiWeaponStore } from '@/stores/wikiWeaponStore'
import { useWikiSkillStore }  from '@/stores/wikiSkillStore'
import { JOB_NAME } from '@/components/wiki/filters/dicts'

/* ---------- locale / route ---------- */
const route  = useRoute()
const locale = ref(route.query.locale ?? 'en')

/* ---------- stores ---------- */
const weaponStore = useWikiWeaponStore()
const skillStore  = useWikiSkillStore()

/* ---------- load ---------- */
async function loadAll() {
  await Promise.all([
    weaponStore.load(locale.value),
    skillStore.load(locale.value),
  ])
}
onMounted(loadAll)
watch(locale, loadAll)

/* ---------- job selector ---------- */
const JOBS = [1, 2, 4, 8, 16]

const selectedJob = ref(null) // null = All Weapons
function selectJob(jobOrNull) { selectedJob.value = jobOrNull }

/* ---------- helpers / paths ---------- */
function weaponIconSrc(w) {
  // Иконки оружия
  return `/wiki/Weapons/${w?.Icon}.png`
}
function jobImage(job) {
  // Картинка-баннер класса (1440x600)
  return `/wiki/Mechs/Img_Pic_${job}.png`
}
function bigScreenBg() {
  return `/wiki/Mechs/Img_BigScreenBG.png`
}
function skillIconById(id) {
  const s = skillStore.byId?.[id]
  const icon = s?.Icon || 'Icon_Skill_10001'
  return `/wiki/Skills/${icon}.png`
}
function weaponTitle(w) {
  return w?.i18n?.name?.[locale.value] || w?.englishName || `ID ${w?.id}`
}

/* ---------- filtering ---------- */
const filteredWeapons = computed(() => {
  const list = Array.isArray(weaponStore.items) ? weaponStore.items : []
  const job = selectedJob.value
  if (!job) return list
  return list.filter(w => (Number(w.JobLimit || 0) & Number(job)) !== 0)
})
</script>

<template>
  <section class="mx-auto w-full max-w-[98vw] px-2 sm:px-4 lg:px-6 space-y-6">
    <!-- Заголовок -->
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Wiki — Weapons</h1>
      <!-- простой селектор локали как слот/компонент можно подменить позже -->
      <div class="opacity-70 text-sm">Locale: <b>{{ locale }}</b></div>
    </header>

    <!-- СТАРТОВОЕ МЕНЮ ВЫБОРА КЛАССА -->
    <section class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="rounded-md px-3 py-1.5 ring-1 ring-white/10 hover:ring-white/20"
          :class="selectedJob === null ? 'bg-white/10' : ''"
          @click="selectJob(null)"
          title="Show every weapon"
        >
          All Weapons
        </button>
        <button
          v-for="job in JOBS"
          :key="job"
          class="relative rounded overflow-hidden ring-1 ring-white/10 hover:ring-[#63B4C8] transition"
          @click="selectJob(job)"
          :title="JOB_NAME[job] || job"
        >
          <img
            :src="jobImage(job)"
            class="h-20 w-[340px] object-cover sm:h-24"
            :alt="JOB_NAME[job] || `Job ${job}`"
            draggable="false"
          />
          <div class="absolute inset-0 bg-black/30" />
          <div class="absolute inset-x-0 bottom-0 p-2 text-center font-semibold">
            {{ JOB_NAME[job] || job }}
          </div>
          <div
            v-if="selectedJob === job"
            class="absolute inset-0 ring-2 ring-[#63B4C8] rounded pointer-events-none"
          />
        </button>
      </div>
      <p class="text-sm opacity-70">
        {{ selectedJob ? `Class: ${JOB_NAME[selectedJob] || selectedJob}` : 'Showing all classes' }}
      </p>
    </section>

    <!-- Список Weapon → Skills -->
    <section>
      <div v-if="weaponStore.loading || skillStore.loading" class="text-sm opacity-80">Loading…</div>
      <div v-else-if="weaponStore.error || skillStore.error" class="text-sm text-red-400">
        {{ weaponStore.error || skillStore.error }}
      </div>

      <div v-else class="space-y-6">
        <article
          v-for="w in filteredWeapons"
          :key="w.id"
          class="rounded-2xl ring-1 ring-white/10 bg-[#1C1B20] p-3 md:p-4"
        >
          <!-- Заголовок оружия -->
          <div class="mb-3 flex items-center justify-between gap-3">
            <h3 class="text-lg font-semibold truncate" :title="weaponTitle(w)">
              {{ weaponTitle(w) }}
            </h3>
            <span class="text-xs opacity-70 whitespace-nowrap">ID {{ w.id }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[360px,1fr] gap-4">
            <!-- WEAPON ICON on BigScreenBG -->
            <div
              class="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/30 h-[180px] md:h-[220px]"
              :style="{ backgroundImage: `url(${bigScreenBg()})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
            >
              <img
                :src="weaponIconSrc(w)"
                class="absolute inset-0 m-auto max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,.5)]"
                :alt="weaponTitle(w)"
                loading="lazy"
                draggable="false"
                @error="($event.target.style.opacity='0.25')"
              />
            </div>

            <!-- SKILL ICONS LIST -->
            <div class="flex flex-wrap items-center content-start gap-3">
              <template v-if="Array.isArray(w.skills) && w.skills.length">
                <div
                  v-for="sid in w.skills"
                  :key="sid"
                  class="flex flex-col items-center gap-1"
                  :title="skillStore.byId?.[sid]?.i18n?.name?.[locale] || skillStore.byId?.[sid]?.englishName || `Skill ${sid}`"
                >
                  <div class="relative w-16 h-16 rounded-xl ring-1 ring-white/10 bg-neutral-900/50">
                    <img
                      :src="skillIconById(sid)"
                      class="absolute inset-0 m-auto w-14 h-14 object-contain"
                      alt=""
                      loading="lazy"
                      draggable="false"
                      @error="($event.target.style.opacity='0.15')"
                    />
                  </div>
                  <span class="text-[11px] opacity-80 max-w-28 text-center truncate">
                    {{ skillStore.byId?.[sid]?.i18n?.name?.[locale] || skillStore.byId?.[sid]?.englishName || `Skill ${sid}` }}
                  </span>
                </div>
              </template>
              <p v-else class="text-sm opacity-70">No skills linked.</p>
            </div>
          </div>
        </article>

        <p v-if="!filteredWeapons.length" class="text-sm opacity-70">No weapons for current filter.</p>
      </div>
    </section>
  </section>
</template>

<style scoped>
/* лёгкая подсветка при наведении на строку */
article:hover { box-shadow: 0 8px 40px rgba(0,0,0,.25) inset; }
</style>
