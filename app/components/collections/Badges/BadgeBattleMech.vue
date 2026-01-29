<script setup>
import { computed, onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import { useWikiBuffStore } from '@/stores/wikiBuffStore'
import VideoModal from '@/components/common/VideoModal.vue'
import { buildVideoUrl } from '@/utils/video'
import { createRichTextFormatter } from '@/utils/richtext'

const props = defineProps({ card: Object })

const skillStore = useWikiSkillStore()
const buffStore = useWikiBuffStore()

function findBuff(id, lv) {
  const byId = buffStore.byId?.[id]
  if (byId && (byId.Buff_LV == null || Number(byId.Buff_LV) === Number(lv))) return byId
  const list = Array.isArray(buffStore.items) ? buffStore.items : []
  return list.find(b => b.id === id && Number(b.Buff_LV) === Number(lv)) || byId || null
}

const formatter = createRichTextFormatter({ locale: 'en', findBuff })

const findTrait = (type) => props.card.traits?.find(t => t.trait_type === type)?.value || ''
const skillTraits = computed(() => (props.card.traits || []).filter(t => t.trait_type === 'Skill').map(t => String(t.value || '')).filter(Boolean))

const className = computed(() => {
  const cls = findTrait('Class')
  if (!cls) return ''
  return cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase()
})

const FALLBACK_SKILL_ICON = '/wiki/Skills/Icon_Skill_10001.png'

function normalizeSkillName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
}

const skillLookup = computed(() => {
  const map = Object.create(null)
  for (const s of skillStore.items || []) {
    const keys = [
      s?.englishName,
      s?.i18n?.name?.en,
    ].filter(Boolean)
    for (const k of keys) map[normalizeSkillName(k)] = s
  }
  return map
})

const skills = computed(() => {
  const list = skillTraits.value
  return list.map((name) => {
    const key = normalizeSkillName(name)
    const s = skillLookup.value[key]
    const upVals = Array.isArray(s?.Upgrade_Value) ? s.Upgrade_Value : []
    const descRaw = s?.i18n?.desc?.en || ''
    return {
      name,
      icon: s?.Icon ? `/wiki/Skills/${s.Icon}.png` : FALLBACK_SKILL_ICON,
      descHtml: descRaw ? formatter.format(descRaw, upVals) : '',
    }
  })
})

function sanitizeFileName(value) {
  return String(value || '')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildVideoSrc(jobLabel, skillName) {
  if (!jobLabel || !skillName) return ''
  const filename = `${sanitizeFileName(jobLabel)} - ${sanitizeFileName(skillName)}.mp4`
  return buildVideoUrl(filename)
}

const activeVideoSrc = ref('')
const activeVideoTitle = ref('')
const videoError = ref('')
const openTooltipName = ref('')
const isTouch = ref(false)
const infoOpen = ref(false)
const infoTitle = ref('')
const infoDescHtml = ref('')
const tooltipOpen = ref(false)
const tooltipHtml = ref('')
const tooltipStyle = ref({ left: '0px', top: '0px' })

function updateIsTouch() {
  if (typeof window === 'undefined') return
  isTouch.value = window.matchMedia('(hover: none)').matches
}

onMounted(() => {
  updateIsTouch()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateIsTouch, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateIsTouch)
  }
})

function openSkillVideo(skillName) {
  const src = buildVideoSrc(className.value, skillName)
  if (!src) return
  activeVideoSrc.value = src
  activeVideoTitle.value = skillName
  videoError.value = ''
}

function toggleTooltip(name) {
  if (!isTouch.value) return
  openTooltipName.value = openTooltipName.value === name ? '' : name
}

async function showDesktopTooltip(skill, evt) {
  if (isTouch.value || !skill?.descHtml) return
  tooltipHtml.value = skill.descHtml
  tooltipOpen.value = true
  await nextTick()
  const rect = evt?.currentTarget?.getBoundingClientRect()
  const tip = document.getElementById('battle-mech-tooltip')
  if (!rect || !tip) return
  const vw = document.documentElement.clientWidth
  const margin = 12
  let left = rect.left + rect.width / 2 - tip.offsetWidth / 2
  left = Math.max(margin, Math.min(left, vw - tip.offsetWidth - margin))
  const top = rect.top - tip.offsetHeight - 10
  tooltipStyle.value = {
    left: `${Math.round(left)}px`,
    top: `${Math.round(Math.max(margin, top))}px`,
  }
}

function hideDesktopTooltip() {
  tooltipOpen.value = false
  tooltipHtml.value = ''
}

function openSkillInfo(skill) {
  if (!isTouch.value) return
  infoTitle.value = skill?.name || ''
  infoDescHtml.value = skill?.descHtml || ''
  infoOpen.value = true
}

function closeSkillInfo() {
  infoOpen.value = false
  infoTitle.value = ''
  infoDescHtml.value = ''
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
  <div class="battle-mech-badge" v-if="skills.length">
    <div class="skills">
      <div
        v-for="skill in skills"
        :key="skill.name"
        class="skill-pill-wrap"
        :class="{ 'is-open': openTooltipName === skill.name }"
      >
        <button
          type="button"
          class="skill-pill"
          @click.stop.prevent="isTouch ? openSkillInfo(skill) : openSkillVideo(skill.name)"
          @mouseenter="showDesktopTooltip(skill, $event)"
          @mouseleave="hideDesktopTooltip"
          aria-haspopup="true"
          :aria-expanded="openTooltipName === skill.name ? 'true' : 'false'"
        >
          <img :src="skill.icon" alt="" class="skill-icon" />
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div
      v-if="tooltipOpen"
      id="battle-mech-tooltip"
      class="skill-tooltip"
      :style="tooltipStyle"
    >
      <span class="tooltip-text" v-html="tooltipHtml" />
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="infoOpen" class="skill-info-backdrop" @click.self="closeSkillInfo">
      <button class="skill-info-close" type="button" aria-label="Close" @click="closeSkillInfo">×</button>
      <div class="skill-info-panel">
        <div class="skill-info-header">
          <span class="skill-info-title">{{ infoTitle }}</span>
        </div>
        <div class="skill-info-body" v-html="infoDescHtml" />
        <button
          type="button"
          class="skill-info-play"
          @click="openSkillVideo(infoTitle)"
        >
          Play video
        </button>
      </div>
    </div>
  </Teleport>

  <VideoModal
    :open="!!activeVideoSrc"
    :src="activeVideoSrc"
    :title="activeVideoTitle"
    :error="videoError"
    @close="closeSkillVideo"
    @error="handleVideoError"
  />
</template>

<style scoped>
.battle-mech-badge {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.2rem 0.4rem 0;
}
.skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
}
.skill-pill-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}
.skill-pill {
  width: 44px;
  height: 44px;
  border-radius: 0.7rem;
  background: transparent;
  display: grid;
  place-items: center;
  border: none;
  transition: transform .12s ease, box-shadow .12s ease;
  position: relative;
}
.skill-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: transform .12s ease, filter .12s ease;
}
.skill-tooltip {
  position: fixed;
  display: block;
  width: max-content;
  min-width: 155px;
  max-width: min(340px, calc(100vw - 24px));
  padding: 0.4rem 0.55rem;
  border-radius: 0.5rem;
  background: rgba(8,10,16,0.96);
  color: #f5f7ff;
  font-size: 0.72rem;
  line-height: 1.25;
  text-align: center;
  box-sizing: border-box;
  white-space: normal;
  overflow-wrap: break-word;
  box-shadow: 0 10px 22px rgba(0,0,0,.45);
  opacity: 1;
  pointer-events: none;
  transition: opacity .08s ease;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tooltip-text {
  display: block;
}
.skill-pill:hover {
  transform: translateY(-2px);
}
.skill-pill:hover .skill-icon {
  transform: scale(1.04);
  filter: drop-shadow(0 6px 12px rgba(0,0,0,.4));
}


.skill-info-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6,10,18,.82);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
}
.skill-info-panel {
  width: min(520px, 92vw);
  background: rgba(8,10,16,0.96);
  border-radius: 0.9rem;
  padding: 0.9rem;
  color: #f5f7ff;
  box-shadow: 0 20px 50px rgba(0,0,0,.45);
}
.skill-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
}
.skill-info-title {
  font-size: 0.95rem;
  font-weight: 600;
}
.skill-info-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: none;
  background: transparent;
  color: #f5f7ff;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  font-size: 1.4rem;
  line-height: 1;
  display: grid;
  place-items: center;
}
.skill-info-body {
  font-size: 0.8rem;
  line-height: 1.35;
  text-align: center;
}
.skill-info-play {
  margin-top: 0.75rem;
  width: 100%;
  border: none;
  border-radius: 0.7rem;
  background: rgba(255,255,255,.12);
  color: #f5f7ff;
  padding: 0.55rem 0.8rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

</style>
