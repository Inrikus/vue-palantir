<script setup>
import { computed, onMounted, watch } from 'vue'
import { useWikiLabelStore } from '@/stores/wikiLabelStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { createRichTextFormatter } from '@/utils/richtext'

const props = defineProps({
  core: { type: Object, required: true },
  locale: { type: String, default: 'en' },
})

const labelStore = useWikiLabelStore()
const buffStore  = useWikiBuffStore()

function findBuff(id, lv) {
  const byId = buffStore.byId?.[id]
  if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId
  const list = Array.isArray(buffStore.items) ? buffStore.items : []
  return list.find(b => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null
}

const loc = computed(() => String(props.locale || 'en'))
const formatter = createRichTextFormatter({ locale: loc.value, findBuff })

onMounted(() => {
  labelStore.load(loc.value)
  buffStore.load(loc.value)
})

watch(loc, (next) => {
  labelStore.load(next)
  buffStore.load(next)
  formatter.setLocale?.(next)
})

const nameText = computed(() =>
  props.core?.i18n?.name?.[loc.value] || props.core?.englishName || `Core #${props.core?.id}`
)

const descHtml = computed(() => {
  const raw = props.core?.i18n?.desc?.[loc.value] || ''
  return formatter.format(raw, props.core?.Upgrade_Value || [])
})

const coreIconSrc = computed(() => `/wiki/Cores/${props.core?.Icon}.png`)

const ALL_JOBS = [1, 2, 4, 8, 16]
const jobItems = computed(() => {
  const mask = Number(props.core?.JobLimit || 0)
  return ALL_JOBS.map((bit) => ({
    id: bit,
    allowed: (mask & bit) !== 0,
    src: `/wiki/Job/MechClass_${bit}_64.png`,
  }))
})

const buffs = computed(() => {
  const list = Array.isArray(props.core?.Buff_Display) ? props.core.Buff_Display : []
  return list.map((pair) => {
    const found = findBuff(pair?.BuffId, pair?.BuffLv)
    const upVals = Array.isArray(found?.Upgrade_Value) && found.Upgrade_Value.length
      ? found.Upgrade_Value
      : (props.core?.Upgrade_Value || [])

    const nameRaw = found?.i18n?.name?.[loc.value] || found?.englishName || `Buff ${pair?.BuffId}`
    const descRaw = found?.i18n?.desc?.[loc.value] || ''

    return {
      icon: `/wiki/Buffs/${found?.Icon || 'Icon_Buff_Unknown'}.png`,
      nameHtml: formatter.format(nameRaw, upVals),
      descHtml: formatter.format(descRaw, upVals),
    }
  })
})

const labels = computed(() => {
  const ids = Array.isArray(props.core?.Tips_Label) ? props.core.Tips_Label : []
  return ids
    .map((id) => labelStore.byId?.[id])
    .filter(Boolean)
    .map((l) => ({
      id: l.ID,
      text: l.i18n?.[loc.value] || l.Name?.text || String(l.ID),
      color: l.LabelImageColor || '5E5E5E',
    }))
})
</script>

<template>
  <article class="core-card">
    <div class="hero">
      <div class="hero-art">
        <img
          src="/wiki/Mechs/Img_BigScreenBG.png"
          alt=""
          class="hero-bg"
          aria-hidden="true"
          draggable="false"
        />
        <img
          :src="coreIconSrc"
          :alt="nameText"
          class="hero-core"
          loading="lazy"
          draggable="false"
        />
        <img
          src="/wiki/Cards/Img_CoreBGFX.png"
          alt=""
          class="hero-fx"
          aria-hidden="true"
          draggable="false"
        />
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Fusion core</p>
        <h2>{{ nameText }}</h2>
      </div>
    </div>

    <div class="job-strip">
      <div
        v-for="job in jobItems"
        :key="job.id"
        class="job-pill"
        :class="{ 'is-off': !job.allowed }"
      >
        <img :src="job.src" alt="" loading="lazy" />
      </div>
    </div>

    <div v-if="labels.length" class="label-strip">
      <span
        v-for="lab in labels"
        :key="lab.id"
        class="label-chip"
        :style="{ borderColor: `#${lab.color}`, backgroundColor: `#${lab.color}22` }"
      >
        {{ lab.text }}
      </span>
    </div>

    <section v-if="descHtml" class="section-block">
      <h3 class="section-title">Overview</h3>
      <div class="richtext text-base leading-relaxed" v-html="descHtml" />
    </section>

    <section v-if="buffs.length" class="section-block">
      <h3 class="section-title">Buffs</h3>
      <div class="buff-card" v-for="(buff, i) in buffs" :key="i">
        <img :src="buff.icon" alt="" loading="lazy" />
        <div class="buff-copy">
          <div class="richtext buff-name" v-html="buff.nameHtml" />
          <div class="richtext buff-desc" v-html="buff.descHtml" />
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.core-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 1.75rem;
  border: none;
  background: transparent;
  padding: clamp(1.25rem, 4vw, 2rem);
  isolation: isolate;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (min-width: 768px) {
  .hero {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
}

.hero-art {
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 1;
  border-radius: 1.5rem;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.25);
  overflow: hidden;
  margin: 0 auto;
}
.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
}
.hero-core,
.hero-fx {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.hero-core { z-index: 2; }
.hero-fx {
  z-index: 3;
  mix-blend-mode: screen;
  opacity: 0.2;
}
.hero-copy {
  flex: 1;
  text-align: center;
}
@media (min-width: 768px) {
  .hero-copy { text-align: left; }
}
.eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(157,209,222,.7);
}
.hero-copy h2 {
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  font-weight: 700;
}

.job-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.job-pill {
  width: 58px;
  height: 58px;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(0,0,0,.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  transition: opacity .2s ease;
}
.job-pill img { width: 100%; height: 100%; object-fit: contain; }
.job-pill.is-off { opacity: 0.15; filter: grayscale(1); }

.label-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}
.label-chip {
  font-size: 0.75rem;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  border: 1px solid transparent;
  color: #f5f7ff;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.section-title {
  font-size: 0.9rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(157,209,222,.7);
  text-align: left;
}

.buff-card {
  display: flex;
  width: 100%;
  gap: 0.85rem;
  padding: 0.9rem;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.12);
  background:
    radial-gradient(circle at top left, rgba(103,172,212,.08), transparent 60%),
    rgba(6, 9, 20, 0.92);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.02), 0 12px 25px rgba(2,4,12,.45);
}
.buff-card img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}
.buff-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.buff-name { font-weight: 600; }
.buff-desc { opacity: 0.9; font-size: 0.95rem; line-height: 1.4; }

/* inline icons inside formatted text */
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
  border-radius: 0.2em;
  background: #0003;
  box-shadow: 0 0 0 1px rgba(255,255,255,.1);
  transform: translateY(0.04em);
}

@media (max-width: 640px) {
  .core-card {
    border: none;
    border-radius: 0;
  }
}
</style>
