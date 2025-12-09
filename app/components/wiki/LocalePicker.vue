<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

/**
 * Универсальный селектор локали с флажками.
 *
 * Props:
 *  - modelValue: string                     // текущая локаль
 *  - options: Array<{ value, native, flag }>|undefined
 *      Если не переданы — используется внутренний LOCALES (источник правды).
 *  - useTeleport: boolean                   // рендерить меню в <body> (по умолчанию true)
 *  - placementOffset: number                // отступ меню от кнопки (px)
 *
 * Emits:
 *  - update:modelValue (value)
 *  - change (value)
 */

// ВНУТРЕННИЙ СПИСОК ЛОКАЛЕЙ — единый для проекта
const INTERNAL_LOCALES = [
  { value: 'en', native: 'English',            flag: '/flags/Icon_Flag_English.png'     },
  { value: 'ru', native: 'Русский',            flag: '/flags/Icon_Flag_Russia.png'      },
  { value: 'ch', native: '中文',                flag: '/flags/Icon_Flag_Chinese.png'      },
  { value: 'jp', native: '日本語',              flag: '/flags/Icon_Flag_Japanese.png'     },
  { value: 'kr', native: '한국어',              flag: '/flags/Icon_Flag_Korean.png'       },
  { value: 'vn', native: 'Tiếng Việt',         flag: '/flags/Icon_Flag_Vietnamese.png'  },
  { value: 'id', native: 'Bahasa Indonesia',   flag: '/flags/Icon_Flag_Indonesian.png'  },
  { value: 'tr', native: 'Türkçe',             flag: '/flags/Icon_Flag_Turkish.png'     },
]

const props = defineProps({
  modelValue: { type: String, default: 'en' },
  options:    { type: Array,  default: undefined }, // если не задано — берём INTERNAL_LOCALES
  useTeleport:{ type: Boolean, default: true },
  placementOffset: { type: Number, default: 8 },
})
const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const btnRef = ref(null)

// список опций: внешний или внутренний
const allOptions = computed(() => (props.options?.length ? props.options : INTERNAL_LOCALES))

const current = computed(() =>
  allOptions.value.find(o => o.value === props.modelValue) || allOptions.value[0] || { native: props.modelValue, flag: '' }
)

function toggle() { open.value = !open.value }
function pick(val) {
  emit('update:modelValue', val)
  emit('change', val)
  open.value = false
}

function onClickOutside(e) {
  if (!open.value) return
  if (!btnRef.value) return
  // если клик не по кнопке и не по меню — закрываем
  const menu = document.getElementById('locale-menu')
  if (!menu) { open.value = false; return }
  if (!menu.contains(e.target) && !btnRef.value.contains(e.target)) {
    open.value = false
  }
}
function onEsc(e) {
  if (e.key === 'Escape') open.value = false
}

// --- позиция меню (для Teleport)
const menuStyle = ref({ top: '0px', left: '0px', minWidth: '14rem' })
function placeMenu() {
  if (!btnRef.value) return
  const rect = btnRef.value.getBoundingClientRect()
  const vw = document.documentElement.clientWidth
  const desiredLeft = rect.left
  const desiredTop  = rect.bottom + props.placementOffset
  const menuWidth   = 224 // 14rem
  let left = desiredLeft
  if (left + menuWidth > vw - 8) left = Math.max(8, vw - menuWidth - 8)
  menuStyle.value = {
    position: 'fixed',
    top: `${Math.round(desiredTop)}px`,
    left: `${Math.round(left)}px`,
    minWidth: `${menuWidth}px`,
    zIndex: 1000,
  }
}

watch(open, async (v) => {
  if (v) {
    await nextTick()
    placeMenu()
  }
})

onMounted(() => {
  document.addEventListener('click', onClickOutside, { passive: true })
  document.addEventListener('keydown', onEsc)
  window.addEventListener('resize', placeMenu, { passive: true })
  window.addEventListener('scroll', placeMenu, { passive: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEsc)
  window.removeEventListener('resize', placeMenu)
  window.removeEventListener('scroll', placeMenu)
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Кнопка -->
    <button
      ref="btnRef"
      @click="toggle"
      class="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 ring-1 ring-white/10 hover:ring-white/20 bg-neutral-900/50"
      aria-haspopup="listbox"
      :aria-expanded="open ? 'true' : 'false'"
    >
      <img v-if="current.flag" :src="current.flag" :alt="current.native" class="w-5 h-5 rounded-sm object-contain" />
      <span class="text-sm font-medium">{{ current.native }}</span>
      <svg class="w-4 h-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
      </svg>
    </button>

    <!-- Меню -->
    <Teleport v-if="useTeleport" to="body">
      <div
        v-show="open"
        id="locale-menu"
        class="rounded-md bg-[#232228] ring-1 ring-white/10 shadow-lg overflow-hidden"
        :style="menuStyle"
        role="listbox"
      >
        <button
          v-for="opt in allOptions"
          :key="opt.value"
          class="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5"
          @click="pick(opt.value)"
          role="option"
          :aria-selected="opt.value === modelValue"
        >
          <div class="flex items-center gap-2">
            <img v-if="opt.flag" :src="opt.flag" :alt="opt.native" class="w-5 h-5 rounded-sm object-contain" />
            <span class="text-sm">{{ opt.native }}</span>
          </div>
          <span class="text-xs opacity-70 uppercase">{{ opt.value }}</span>
        </button>
      </div>
    </Teleport>

    <!-- Фолбэк: без Teleport (меню внутри потока) -->
    <div
      v-else
      v-show="open"
      id="locale-menu"
      class="absolute z-40 mt-2 w-56 rounded-md bg-[#232228] ring-1 ring-white/10 shadow-lg overflow-hidden"
      role="listbox"
    >
      <button
        v-for="opt in allOptions"
        :key="opt.value"
        class="w-full flex items-center justify-between gap-3 px-3 py-2 text-left hover:bg-white/5"
        @click="pick(opt.value)"
        role="option"
        :aria-selected="opt.value === modelValue"
      >
        <div class="flex items-center gap-2">
          <img v-if="opt.flag" :src="opt.flag" :alt="opt.native" class="w-5 h-5 rounded-sm object-contain" />
          <span class="text-sm">{{ opt.native }}</span>
        </div>
        <span class="text-xs opacity-70 uppercase">{{ opt.value }}</span>
      </button>
    </div>
  </div>
</template>
