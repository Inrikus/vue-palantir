<script setup>
import { computed, onMounted, watch } from 'vue'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { createRichTextFormatter } from '@/utils/richtext'

const props = defineProps({
  core: { type: Object, required: true },
  locale: { type: String, default: 'en' }
})

const labelStore = useWikiLabelStore()
const buffStore  = useWikiBuffStore()

// helper: найти бафф (id+lv) в сторе
function findBuff(id, lv) {
  const byId = buffStore.byId?.[id]
  if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId
  const list = Array.isArray(buffStore.items) ? buffStore.items : []
  return list.find(b => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null
}

// общий форматтер richtext (модульный, переиспользуемый)
const formatter = createRichTextFormatter({ locale: props.locale, findBuff })

onMounted(() => {
  labelStore.load(props.locale)
  buffStore.load(props.locale)
})
watch(() => props.locale, (loc) => {
  labelStore.load(loc)
  buffStore.load(loc)
  formatter.setLocale(loc)
})

/* ===================== computed ===================== */

const nameText = computed(() =>
  props.core?.i18n?.name?.[props.locale] || props.core?.englishName || ''
)

const descHtml = computed(() => {
  const raw = props.core?.i18n?.desc?.[props.locale] || ''
  return formatter.format(raw, props.core?.Upgrade_Value || [])
})

// адаптив: на мобиле 32px, на десктопе 64px
const isMobile = computed(() =>
  (typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false)
)

const jobIcons = computed(() => {
  const size = isMobile.value ? 32 : 64
  // пока показываем все 5; позже можно подсветить по bitmask JobLimit
  return [1, 2, 4, 8, 16].map(j => `/wiki/Job/MechClass_${j}_${size}.png`)
})

const coreIconSrc = computed(() => `/wiki/Cores/${props.core?.Icon}.png`)

// Блок баффов: из Buff_Display + wikiBuffStore + тот же форматтер
const buffs = computed(() => {
  const list = Array.isArray(props.core?.Buff_Display) ? props.core.Buff_Display : []
  return list.map(pair => {
    const b = findBuff(pair?.BuffId, pair?.BuffLv)
    const upVals = (Array.isArray(b?.Upgrade_Value) && b.Upgrade_Value.length)
      ? b.Upgrade_Value
      : (props.core?.Upgrade_Value || [])
    const nameRaw = b?.i18n?.name?.[props.locale] || b?.englishName || `Buff ${pair?.BuffId}`
    const descRaw = b?.i18n?.desc?.[props.locale] || ''

    return {
      icon: `/wiki/Buffs/${b?.Icon || 'Icon_Buff_Unknown'}.png`,
      nameHtml: formatter.format(nameRaw, upVals),
      descHtml: formatter.format(descRaw, upVals)
    }
  })
})

const labels = computed(() => {
  const ids = Array.isArray(props.core?.Tips_Label) ? props.core.Tips_Label : []
  return ids
    .map(id => labelStore.byId[id])
    .filter(Boolean)
    .map(l => ({
      id: l.ID,
      text: l.i18n?.[props.locale] || l.Name?.text || String(l.ID),
      color: (l.LabelImageColor || '5E5E5E')
    }))
})
</script>

<template>
  <article class="w-full rounded-2xl bg-[#1C1B20] ring-1 ring-white/10 p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start gap-4">
      <!-- СТАЛО -->
      <div
        class="relative rounded-xl bg-black/20 ring-1 ring-white/10 mx-auto md:mx-0"
        :class="isMobile ? 'w-32 h-32' : 'w-64 h-64'"
      >
        <!-- иконка ядра -->
        <img
          :src="coreIconSrc"
          :alt="nameText"
          class="absolute inset-0 w-full h-full object-contain z-10"
          loading="lazy"
          draggable="false"
        />
        <!-- свечение поверх -->
        <img
          src="/wiki/Cards/Img_CoreBGFX.png"
          alt=""
          class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow"
          aria-hidden="true"
          draggable="false"
        />
      </div>
      
      <div class="flex-1 flex flex-col gap-3 text-center md:text-left">
        <h2 class="text-xl md:text-2xl font-semibold leading-tight">
          {{ nameText }}
        </h2>

        <!-- Job icons -->
        <div class="flex justify-center md:justify-start items-center gap-2 md:gap-3">
          <img
            v-for="(src, idx) in jobIcons"
            :key="idx"
            :src="src"
            alt=""
            :width="isMobile ? 32 : 64"
            :height="isMobile ? 32 : 64"
            class="object-contain rounded-md bg-black/20 ring-1 ring-white/10"
            loading="lazy"
          />
        </div>

        <!-- Labels -->
        <div v-if="labels.length" class="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
          <span
            v-for="lab in labels"
            :key="lab.id"
            class="text-xs md:text-sm px-2 py-1 rounded-full"
            :style="{
              border: `1px solid #${lab.color}`,
              backgroundColor: `#${lab.color}22`
            }"
          >
            {{ lab.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Description (core) -->
    <section v-if="descHtml" class="prose prose-invert max-w-none">
      <div class="richtext text-base md:text-lg leading-relaxed text-center md:text-left" v-html="descHtml"></div>
    </section>

    <!-- Buffs -->
    <section v-if="buffs.length" class="space-y-4">
      <h3 class="text-lg font-semibold opacity-90 text-center md:text-left">Buffs</h3>
      <div class="space-y-3">
        <div
          v-for="(b, i) in buffs"
          :key="i"
          class="flex items-start gap-3 p-3 rounded-lg bg-black/20 ring-1 ring-white/10"
        >
          <!-- большая иконка самого баффа в списке -->
          <img
            :src="b.icon"
            alt=""
            width="64" height="64"
            class="w-12 h-12 md:w-14 md:h-14 object-contain rounded bg-black/30 ring-1 ring-white/10 shrink-0"
            loading="lazy"
          />
          <div class="flex-1">
            <div class="richtext font-medium mb-1 text-base" v-html="b.nameHtml"></div>
            <div class="richtext text-sm md:text-base opacity-90 leading-relaxed" v-html="b.descHtml"></div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Убираем внешние маргины у параграфов в prose-блоке */
.prose :where(p):not(:where([class~="not-prose"] *)) {
  margin: 0;
}

/* Ровное inline-встраивание мини-иконки баффа и её baseline */
.richtext :deep(.inline-buff-wrap) {
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
  line-height: 1;
}

.richtext :deep(img.inline-buff-icon) {
  display: inline-block;
  width: 0.9em;         /* маленькая, в линию с текстом */
  height: 0.9em;
  object-fit: contain;
  vertical-align: baseline;
  border-radius: 0.15em;
  background: #0003;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
  transform: translateY(0.05em); /* тонкая компенсация */
}

.core-glow {
  opacity: 0.3;
  mix-blend-mode: screen;
  filter: drop-shadow(0 3px 10px rgba(255,255,255,.18));
}
@media (prefers-color-scheme: light) {
  .core-glow { opacity: .75; }
}

</style>
