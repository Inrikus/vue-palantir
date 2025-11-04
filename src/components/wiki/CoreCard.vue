<script setup>
import { computed, onMounted, watch } from 'vue'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { createRichTextFormatter } from '@/utils/richtext'

const props = defineProps({
  core: { type: Object, required: true },
  locale: { type: String, default: 'en' }
})
const emit = defineEmits(['close', 'level-change'])

const labelStore = useWikiLabelStore()
const buffStore  = useWikiBuffStore()

/* ---------- helpers ---------- */
function findBuff(id, lv) {
  const byId = buffStore.byId?.[id]
  if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId
  const list = Array.isArray(buffStore.items) ? buffStore.items : []
  return list.find(b => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null
}

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

/* ---------- responsive ---------- */
const isMobile = computed(() =>
  (typeof window !== 'undefined'
    ? window.matchMedia('(max-width: 640px)').matches
    : false)
)

/* ---------- computed ---------- */
const nameText = computed(() =>
  props.core?.i18n?.name?.[props.locale] || props.core?.englishName || ''
)

const descHtml = computed(() => {
  const raw = props.core?.i18n?.desc?.[props.locale] || ''
  return formatter.format(raw, props.core?.Upgrade_Value || [])
})

const coreIconSrc = computed(() => `/wiki/Cores/${props.core?.Icon}.png`)

// классы: показываем все 5, неразрешённые — затемняем
const ALL_JOBS = [1, 2, 4, 8, 16]
const jobItems = computed(() => {
  const mask = Number(props.core?.JobLimit || 0)
  const size = isMobile.value ? 32 : 64
  return ALL_JOBS.map(j => ({
    id: j,
    src: `/wiki/Job/MechClass_${j}_${size}.png`,
    size,
    allowed: (mask & j) !== 0
  }))
})

// баффы
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

// теги
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

// прокидываем изменение уровня наружу (ползунок в мобильной шапке)
function onLevelInput(e) {
  const v = Math.min(10, Math.max(1, Number(e?.target?.value || props.core?.CoreLv || 1)))
  emit('level-change', v)
}
</script>

<template>
  <!-- Мобильная версия: полноэкранная шторка с собственной шапкой -->
  <div v-if="isMobile" class="fixed inset-0 z-[60] bg-[#1C1B20] ring-1 ring-white/10 flex flex-col">
    <!-- Шапка: ползунок уровня + Close -->
    <div class="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-[#1C1B20] border-b border-white/10">
      <div class="flex items-center gap-3">
        <span class="text-sm opacity-80">Lv.</span>
        <input
          type="range" min="1" max="10" step="1"
          :value="core?.CoreLv || 1"
          @input="onLevelInput"
          class="w-40"
        />
        <span class="text-sm font-medium w-6 text-center">{{ core?.CoreLv || 1 }}</span>
      </div>
      <button
        @click="$emit('close')"
        class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20"
      >
        Close
      </button>
    </div>

    <!-- Прокручиваемая зона контента -->
    <div class="flex-1 overflow-y-auto">
      <article class="w-full p-4 space-y-6">
        <!-- Крупная иконка на всю ширину -->
        <div class="relative w-full aspect-square rounded-xl bg-black/20 ring-1 ring-white/10 overflow-hidden">
          <img
            :src="coreIconSrc"
            :alt="nameText"
            class="absolute inset-0 w-full h-full object-contain z-10"
            loading="lazy"
            draggable="false"
          />
          <img
            src="/wiki/Cards/Img_CoreBGFX.png"
            alt=""
            class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow"
            aria-hidden="true"
            draggable="false"
          />
        </div>

        <!-- Имя -->
        <h2 class="text-center text-xl font-semibold leading-tight">
          {{ nameText }}
        </h2>

        <!-- 5 иконок классов, неактивные затемняем -->
        <div class="flex items-center justify-center gap-2">
          <img
            v-for="j in jobItems"
            :key="j.id"
            :src="j.src"
            alt=""
            :width="j.size"
            :height="j.size"
            class="object-contain rounded-md bg-black/20 ring-1 ring-white/10 transition-opacity"
            :class="j.allowed ? 'opacity-100' : 'opacity-10 grayscale'"
            loading="lazy"
          />
        </div>

        <!-- Теги -->
        <div v-if="labels.length" class="flex flex-wrap justify-center gap-2">
          <span
            v-for="lab in labels"
            :key="lab.id"
            class="text-xs px-2 py-1 rounded-full"
            :style="{ border: `1px solid #${lab.color}`, backgroundColor: `#${lab.color}22` }"
          >
            {{ lab.text }}
          </span>
        </div>

        <!-- Описание -->
        <section v-if="descHtml" class="prose prose-invert max-w-none">
          <div class="richtext text-base leading-relaxed text-center" v-html="descHtml"></div>
        </section>

        <!-- Баффы -->
        <section v-if="buffs.length" class="space-y-3">
          <h3 class="text-base font-semibold opacity-90 text-center">Buffs</h3>
          <div
            v-for="(b, i) in buffs"
            :key="i"
            class="flex items-start gap-3 p-3 rounded-lg bg-black/20 ring-1 ring-white/10"
          >
            <img
              :src="b.icon"
              alt=""
              width="56" height="56"
              class="w-12 h-12 object-contain rounded bg-black/30 ring-1 ring-white/10 shrink-0"
              loading="lazy"
            />
            <div class="flex-1">
              <div class="richtext font-medium mb-1 text-sm" v-html="b.nameHtml"></div>
              <div class="richtext text-sm opacity-90 leading-relaxed" v-html="b.descHtml"></div>
            </div>
          </div>
        </section>
      </article>
    </div>
  </div>

  <!-- Десктопная версия: как раньше -->
  <article v-else class="w-full rounded-2xl bg-[#1C1B20] ring-1 ring-white/10 p-4 md:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-row items-start gap-4">
      <div class="relative w-64 h-64 rounded-xl bg-black/20 ring-1 ring-white/10 mx-0 shrink-0">
        <img
          :src="coreIconSrc"
          :alt="nameText"
          class="absolute inset-0 w-full h-full object-contain z-10"
          loading="lazy"
          draggable="false"
        />
        <img
          src="/wiki/Cards/Img_CoreBGFX.png"
          alt=""
          class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none core-glow"
          aria-hidden="true"
          draggable="false"
        />
      </div>

      <div class="flex-1 flex flex-col gap-3 text-left">
        <h2 class="text-2xl font-semibold leading-tight">{{ nameText }}</h2>

        <div class="flex justify-start items-center gap-3">
          <img
            v-for="j in jobItems"
            :key="j.id"
            :src="j.src"
            alt=""
            :width="j.size"
            :height="j.size"
            class="object-contain rounded-md bg-black/20 ring-1 ring-white/10 transition-opacity"
            :class="j.allowed ? 'opacity-100' : 'opacity-25 grayscale'"
            loading="lazy"
          />
        </div>

        <div v-if="labels.length" class="flex flex-wrap justify-start gap-2 mt-1">
          <span
            v-for="lab in labels"
            :key="lab.id"
            class="text-sm px-2 py-1 rounded-full"
            :style="{ border: `1px solid #${lab.color}`, backgroundColor: `#${lab.color}22` }"
          >
            {{ lab.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <section v-if="descHtml" class="prose prose-invert max-w-none">
      <div class="richtext text-lg leading-relaxed text-left" v-html="descHtml"></div>
    </section>

    <!-- Buffs -->
    <section v-if="buffs.length" class="space-y-4">
      <h3 class="text-lg font-semibold opacity-90 text-left">Buffs</h3>
      <div class="space-y-3">
        <div
          v-for="(b, i) in buffs"
          :key="i"
          class="flex items-start gap-3 p-3 rounded-lg bg-black/20 ring-1 ring-white/10"
        >
          <img
            :src="b.icon"
            alt=""
            width="64" height="64"
            class="w-14 h-14 object-contain rounded bg-black/30 ring-1 ring-white/10 shrink-0"
            loading="lazy"
          />
          <div class="flex-1">
            <div class="richtext font-medium mb-1 text-base" v-html="b.nameHtml"></div>
            <div class="richtext text-base opacity-90 leading-relaxed" v-html="b.descHtml"></div>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* убираем внешние маргины у p в prose */
.prose :where(p):not(:where([class~="not-prose"] *)) { margin: 0; }

/* мини-иконки баффов в тексте — baseline */
.richtext :deep(.inline-buff-wrap) {
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
  line-height: 1;
}
.richtext :deep(img.inline-buff-icon) {
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  object-fit: contain;
  vertical-align: baseline;
  border-radius: 0.15em;
  background: #0003;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
  transform: translateY(0.05em);
}

/* свечение поверх иконки ядра */
.core-glow {
  opacity: 0.3;
  mix-blend-mode: screen;
  filter: drop-shadow(0 3px 10px rgba(255,255,255,.18));
}
@media (prefers-color-scheme: light) {
  .core-glow { opacity: .75; }
}
</style>
