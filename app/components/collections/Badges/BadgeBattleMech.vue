<script setup>
import { computed, ref } from 'vue'
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

function openSkillVideo(skillName) {
  const src = buildVideoSrc(className.value, skillName)
  if (!src) return
  activeVideoSrc.value = src
  activeVideoTitle.value = skillName
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
  <div class="battle-mech-badge" v-if="skills.length">
    <div class="skills">
      <button
        v-for="skill in skills"
        :key="skill.name"
        type="button"
        class="skill-pill"
        @click.stop.prevent="openSkillVideo(skill.name)"
      >
        <img :src="skill.icon" alt="" class="skill-icon" />
        <span v-if="skill.descHtml" class="skill-tooltip" v-html="skill.descHtml" />
      </button>
    </div>
  </div>

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
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(4px);
  min-width: 320px;
  max-width: 520px;
  padding: 0.4rem 0.55rem;
  border-radius: 0.5rem;
  background: rgba(8,10,16,0.96);
  color: #f5f7ff;
  font-size: 0.72rem;
  line-height: 1.25;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 10px 22px rgba(0,0,0,.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity .08s ease, transform .08s ease;
  z-index: 20;
}
.skill-tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(8,10,16,0.96);
}
.skill-pill:hover .skill-tooltip,
.skill-pill:focus-visible .skill-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.skill-pill:hover {
  transform: translateY(-2px);
}
.skill-pill:hover .skill-icon {
  transform: scale(1.04);
  filter: drop-shadow(0 6px 12px rgba(0,0,0,.4));
}

</style>
