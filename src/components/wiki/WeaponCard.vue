<script setup>
import { computed, onMounted, watch } from 'vue'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { createRichTextFormatter } from '@/utils/richtext'

const props = defineProps({
  weapon: { type: Object, required: true },  // объект оружия (id, Icon, i18n, skills[])
  locale: { type: String, default: 'en' }
})

/* ---------- stores ---------- */
const skillStore = useWikiSkillStore()
const buffStore  = useWikiBuffStore()

/* ---------- helpers ---------- */
// найти бафф (id+lv) — как в CoreCard.vue
function findBuff(id, lv) {
  const byId = buffStore.byId?.[id]
  if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId
  const list = Array.isArray(buffStore.items) ? buffStore.items : []
  return list.find(b => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null
}

/* единый форматтер richtext */
const formatter = createRichTextFormatter({ locale: props.locale, findBuff })

onMounted(() => {
  // на случай если компонент используется автономно — гарантируем загрузку
  if (!skillStore.items?.length) skillStore.load(props.locale)
  if (!buffStore.items?.length)  buffStore.load(props.locale)
})
watch(() => props.locale, (loc) => {
  // если где-то наверху меняем локаль — освежим сторы + форматтер
  skillStore.load(loc)
  buffStore.load(loc)
  formatter.setLocale?.(loc)
})

/* ---------- computed ---------- */
const loc = computed(() => String(props.locale || 'en'))

const weaponTitle = computed(() =>
  props.weapon?.i18n?.name?.[loc.value] || props.weapon?.englishName || `ID ${props.weapon?.id}`
)

const weaponDescHtml = computed(() => {
  const raw = props.weapon?.i18n?.desc?.[loc.value] || ''
  // у оружия, как правило, нет Upgrade_Value применимых к самой карточке; просто форматируем текст
  return formatter.format(raw, props.weapon?.Upgrade_Value || [])
})

const weaponIconSrc = computed(() => `/wiki/Weapons/${props.weapon?.Icon}.png`)

/* карта скиллов по id для быстрого доступа */
const skillById = computed(() => {
  const map = Object.create(null)
  for (const s of skillStore.items || []) map[s.id] = s
  return map
})

/* секция Skills — детализированные карточки по ids из weapon.skills */
const skills = computed(() => {
  const ids = Array.isArray(props.weapon?.skills) ? props.weapon.skills : []
  const out = []
  for (const sid of ids) {
    const s = skillById.value[sid]
    if (!s) continue
    const upVals  = Array.isArray(s.Upgrade_Value) ? s.Upgrade_Value : []
    const nameRaw = s?.i18n?.name?.[loc.value] || s?.englishName || `Skill ${s.id}`
    const descRaw = s?.i18n?.desc?.[loc.value] || ''

    out.push({
      id: s.id,
      icon: `/wiki/Skills/${s?.Icon || 'Icon_Skill_10001'}.png`,
      nameHtml: formatter.format(nameRaw, upVals),
      descHtml: formatter.format(descRaw, upVals),
    })
  }
  return out
})
</script>

<template>
  <article class="w-full rounded-2xl bg-[#1C1B20] ring-1 ring-white/10 p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col items-center gap-4">
      <!-- Иконка оружия на фоне большого экрана -->
      <div class="relative w-full max-w-[420px] aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-white/10 bg-black/30">
        <img
          src="/wiki/Mechs/Img_BigScreenBG.png"
          alt=""
          class="absolute inset-0 w-full h-full object-cover opacity-60"
          aria-hidden="true"
          draggable="false"
        />
        <img
          :src="weaponIconSrc"
          :alt="weaponTitle"
          class="absolute inset-0 m-auto w-[56%] h-[56%] object-contain z-10"
          loading="lazy"
          draggable="false"
        />
      </div>

      <!-- Название -->
      <h2 class="text-xl md:text-2xl font-semibold text-center leading-tight">
        {{ weaponTitle }}
      </h2>
    </div>

    <!-- Описание оружия -->
    <section v-if="weaponDescHtml" class="prose prose-invert max-w-none">
      <div class="richtext text-base md:text-lg leading-relaxed text-center" v-html="weaponDescHtml"></div>
    </section>

    <!-- Skills -->
    <section v-if="skills.length" class="space-y-3">
      <h3 class="text-base font-semibold opacity-90 text-center">Skills</h3>

      <div
        v-for="s in skills"
        :key="s.id"
        class="flex items-start gap-3 p-3 rounded-lg bg-black/20 ring-1 ring-white/10"
      >
        <img
          :src="s.icon"
          alt=""
          width="56" height="56"
          class="w-12 h-12 object-contain rounded bg-black/30 ring-1 ring-white/10 shrink-0"
          loading="lazy"
        />
        <div class="flex-1">
          <div class="richtext font-medium mb-1 text-sm" v-html="s.nameHtml"></div>
          <div class="richtext text-sm opacity-90 leading-relaxed" v-html="s.descHtml"></div>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* аккуратный baseline для встроенных inline-иконок из форматтера */
.richtext :deep(.inline-buff-wrap){ display:inline-flex; align-items:baseline; vertical-align:baseline; line-height:1; }
.richtext :deep(img.inline-buff-icon){
  display:inline-block; width:.9em; height:.9em; object-fit:contain; vertical-align:baseline;
  border-radius:.15em; background:#0003; box-shadow:0 0 0 1px rgba(255,255,255,.08); transform:translateY(.05em);
}
</style>
