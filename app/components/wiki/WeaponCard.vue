<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import VideoModal from '@/components/common/VideoModal.vue'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import { createRichTextFormatter } from '@/utils/richtext'
import { buildVideoUrl } from '@/utils/video'

const props = defineProps({
  weapon: { type: Object, required: true },
  locale: { type: String, default: 'en' },
})

const skillStore = useWikiSkillStore()
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
  skillStore.load(loc.value)
  buffStore.load(loc.value)
})

watch(loc, (next) => {
  skillStore.load(next)
  buffStore.load(next)
  formatter.setLocale?.(next)
})

const weaponTitle = computed(() =>
  props.weapon?.i18n?.name?.[loc.value] || props.weapon?.englishName || `Weapon #${props.weapon?.id}`
)

const weaponDescHtml = computed(() => {
  const raw = props.weapon?.i18n?.desc?.[loc.value] || ''
  return formatter.format(raw, props.weapon?.Upgrade_Value || [])
})

const JOB_OPTIONS = [
  { label: 'Striker',  value: 1  },
  { label: 'Keystone', value: 2  },
  { label: 'Buster',   value: 4  },
  { label: 'Bullseye', value: 8  },
  { label: 'Apostle',  value: 16 },
]

const weaponJobLabel = computed(() => {
  const mask = Number(props.weapon?.JobLimit || 0)
  if (!mask) return ''
  const match = JOB_OPTIONS.find(opt => (mask & opt.value) !== 0) || JOB_OPTIONS.find(opt => opt.value === mask)
  return match?.label || ''
})

const FALLBACK_ICON = '/wiki/fallback/icon_missing.png'
const weaponIconSrc = computed(() => {
  const icon = props.weapon?.Icon
  return icon ? `/wiki/Weapons/${icon}.png` : FALLBACK_ICON
})

function handleImgError(e) {
  const img = e?.target
  if (!img || img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = '1'
  img.src = FALLBACK_ICON
}

const skillById = computed(() => {
  const map = Object.create(null)
  for (const skill of skillStore.items || []) map[skill.id] = skill
  return map
})

const skills = computed(() => {
  const ids = Array.isArray(props.weapon?.skills) ? props.weapon.skills : []
  return ids.map((sid) => {
    const s = skillById.value[sid]
    if (!s) return null
    const upVals = Array.isArray(s.Upgrade_Value) ? s.Upgrade_Value : []
    const nameRaw = s?.i18n?.name?.[loc.value] || s?.englishName || `Skill ${s.id}`
    const descRaw = s?.i18n?.desc?.[loc.value] || ''
    return {
      id: s.id,
      icon: `/wiki/Skills/${s?.Icon || 'Icon_Skill_10001'}.png`,
      nameHtml: formatter.format(nameRaw, upVals),
      descHtml: formatter.format(descRaw, upVals),
      videoName: s?.englishName || nameRaw,
    }
  }).filter(Boolean)
})

function stripTags(text) {
  return String(text || '').replace(/<[^>]*>/g, '').trim()
}

function buildVideoSrc(jobLabel, skillName) {
  if (!jobLabel || !skillName) return ''
  const safeName = stripTags(skillName)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!safeName) return ''
  const filename = `${jobLabel} - ${safeName}.mp4`
  return buildVideoUrl(filename)
}

const activeVideoSrc = ref('')
const activeVideoTitle = ref('')
const videoError = ref('')

function openSkillVideo(skill) {
  const src = buildVideoSrc(weaponJobLabel.value, skill?.videoName)
  if (!src) return
  activeVideoSrc.value = src
  activeVideoTitle.value = stripTags(skill?.videoName || '')
  videoError.value = ''
}

function closeSkillVideo() {
  activeVideoSrc.value = ''
  activeVideoTitle.value = ''
  videoError.value = ''
}

function handleVideoError() {
  videoError.value = 'Video not found.'
}
</script>

<template>
  <article class="weapon-card">
    <div class="hero">
      <div class="hero-art">
        <img src="/wiki/Mechs/Img_BigScreenBG.png" alt="" class="hero-bg" aria-hidden="true" draggable="false" />
        <img
          :src="weaponIconSrc"
          :alt="weaponTitle"
          class="hero-weapon"
          loading="lazy"
          draggable="false"
          @error="handleImgError"
        />
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Weapon module</p>
        <h2>{{ weaponTitle }}</h2>
      </div>
    </div>

    <section v-if="weaponDescHtml" class="section-block">
      <h3 class="section-title">Overview</h3>
      <div class="richtext text-base leading-relaxed" v-html="weaponDescHtml" />
    </section>

    <section v-if="skills.length" class="section-block">
      <h3 class="section-title">Skills</h3>
      <div class="skill-card" v-for="skill in skills" :key="skill.id" @click="openSkillVideo(skill)">
        <img :src="skill.icon" alt="" loading="lazy" />
        <div class="skill-copy">
          <div class="richtext skill-name" v-html="skill.nameHtml" />
          <div class="richtext skill-desc" v-html="skill.descHtml" />
        </div>
      </div>
    </section>

    <VideoModal
      :open="!!activeVideoSrc"
      :src="activeVideoSrc"
      :title="activeVideoTitle"
      :error="videoError"
      @close="closeSkillVideo"
      @error="handleVideoError"
    />
  </article>
</template>

<style scoped>
.weapon-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 1.75rem;
  border: none;
  background: transparent;
  padding: clamp(1.25rem, 4vw, 2rem);
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
  max-width: 440px;
  aspect-ratio: 16 / 9;
  border-radius: 1.25rem;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.3);
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
.hero-weapon {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 70%;
  height: 70%;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,.65));
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
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700;
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

.skill-card {
  display: flex;
  width: 100%;
  gap: 0.9rem;
  padding: 0.95rem;
  border-radius: 1rem;
  border: 1px solid rgba(255,255,255,.12);
  background:
    radial-gradient(circle at top left, rgba(103,172,212,.08), transparent 60%),
    rgba(6, 9, 20, 0.92);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.02), 0 12px 25px rgba(2,4,12,.45);
  cursor: pointer;
}
.skill-card::before,
.skill-card::after { content: none; }
.skill-card img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}
.skill-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.skill-name { font-weight: 600; }
.skill-desc { opacity: 0.9; font-size: 0.95rem; line-height: 1.4; }


.richtext :deep(.inline-buff-wrap) {
  display: inline-flex;
  align-items: baseline;
  vertical-align: baseline;
  line-height: 1;
}
.richtext :deep(.inline-buff-wrap[data-tooltip]) {
  position: relative;
  cursor: help;
}
.richtext :deep(.inline-buff-wrap[data-tooltip])::after {
  content: attr(data-tooltip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(4px);
  max-width: 260px;
  min-width: 140px;
  padding: 0.35rem 0.5rem;
  border-radius: 0.45rem;
  background: rgba(8,10,16,0.96);
  color: #f5f7ff;
  font-size: 0.7rem;
  line-height: 1.25;
  text-align: center;
  box-shadow: 0 10px 22px rgba(0,0,0,.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity .08s ease, transform .08s ease;
  z-index: 20;
}
.richtext :deep(.inline-buff-wrap[data-tooltip])::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: calc(100% + 2px);
  transform: translateX(-50%) translateY(4px);
  border: 6px solid transparent;
  border-top-color: rgba(8,10,16,0.96);
  opacity: 0;
  transition: opacity .08s ease, transform .08s ease;
  pointer-events: none;
  z-index: 21;
}
.richtext :deep(.inline-buff-wrap[data-tooltip]):hover::after,
.richtext :deep(.inline-buff-wrap[data-tooltip]):focus-visible::after,
.richtext :deep(.inline-buff-wrap[data-tooltip]):hover::before,
.richtext :deep(.inline-buff-wrap[data-tooltip]):focus-visible::before {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
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
  .weapon-card {
    border: none;
    border-radius: 0;
  }
}
</style>
