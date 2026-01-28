<script setup>
import { computed, ref } from 'vue'
import { useWikiSkillStore } from '@/stores/wikiSkillStore'
import VideoModal from '@/components/common/VideoModal.vue'
import { buildVideoUrl } from '@/utils/video'

const props = defineProps({ card: Object })

const skillStore = useWikiSkillStore()

const findTrait = (type) => props.card.traits?.find(t => t.trait_type === type)?.value || ''
const skillTraits = computed(() => (props.card.traits || []).filter(t => t.trait_type === 'Skill').map(t => String(t.value || '')).filter(Boolean))

const className = computed(() => {
  const cls = findTrait('Class')
  if (!cls) return ''
  return cls.charAt(0).toUpperCase() + cls.slice(1).toLowerCase()
})

const FALLBACK_SKILL_ICON = '/wiki/Skills/Icon_Skill_10001.png'

const skillLookup = computed(() => {
  const map = Object.create(null)
  for (const s of skillStore.items || []) {
    const keys = [
      s?.englishName,
      s?.i18n?.name?.en,
    ].filter(Boolean)
    for (const k of keys) map[String(k).toLowerCase().trim()] = s
  }
  return map
})

const skills = computed(() => {
  const list = skillTraits.value
  return list.map((name) => {
    const key = String(name).toLowerCase().trim()
    const s = skillLookup.value[key]
    return {
      name,
      icon: s?.Icon ? `/wiki/Skills/${s.Icon}.png` : FALLBACK_SKILL_ICON,
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
}
.skill-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: transform .12s ease, filter .12s ease;
}
.skill-pill:hover {
  transform: translateY(-2px);
}
.skill-pill:hover .skill-icon {
  transform: scale(1.04);
  filter: drop-shadow(0 6px 12px rgba(0,0,0,.4));
}

</style>
