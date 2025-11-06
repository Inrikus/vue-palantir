<script setup>
const props = defineProps({
  open:   { type: Boolean, default: false },
  locale: { type: String,  default: 'en' },
  jobs:   { type: Array,   default: () => [] },
  uniq:   { type: Boolean, default: false },
})
const emit = defineEmits(['close','reset', 'update:jobs','update:uniq'])

const JOB_OPTIONS = [
  { label: 'Striker',  value: 1  },
  { label: 'Keystone', value: 2  },
  { label: 'Buster',   value: 4  },
  { label: 'Bullseye', value: 8  },
  { label: 'Apostle',  value: 16 },
]

function toggleVal(val) {
  const curr = new Set(props.jobs || [])
  curr.has(val) ? curr.delete(val) : curr.add(val)
  emit('update:jobs', Array.from(curr))
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[1000] bg-black/60" @click="$emit('close')" />
    </transition>
    <transition name="slide-up">
      <aside
        v-if="open"
        class="fixed inset-x-0 bottom-0 top-0 sm:inset-auto sm:inset-y-0 sm:left-0 sm:w-80 sm:max-w-[85vw]
               z-[1001] bg-[#232228] ring-1 ring-white/10 shadow-2xl overflow-y-auto"
        role="dialog" aria-modal="true"
      >
        <div class="p-4 flex items-center justify-between border-b border-white/10">
          <h3 class="text-lg font-semibold text-[#63B4C8]">Filters</h3>
          <div class="flex items-center gap-2">
            <button @click="$emit('reset')" class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20">Reset</button>
            <button @click="$emit('close')" class="rounded px-3 py-1 ring-1 ring-white/10 hover:ring-white/20">Close</button>
          </div>
        </div>

        <div class="p-4 space-y-6">
          <section>
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm uppercase tracking-wide opacity-80">Jobs</h4>
              <label class="inline-flex items-center gap-2 cursor-pointer select-none text-xs">
                <input type="checkbox" class="accent-[#63B4C8]" :checked="uniq" @change="$emit('update:uniq', $event.target.checked)" />
                <span class="opacity-80">Unique only</span>
              </label>
            </div>

            <div class="flex flex-wrap gap-2">
              <label
                v-for="opt in JOB_OPTIONS" :key="'jobs-' + opt.value"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-white/10 hover:ring-white/20 cursor-pointer select-none"
              >
                <input type="checkbox" class="accent-[#63B4C8]" :checked="jobs.includes(opt.value)" @change="toggleVal(opt.value)" />
                <span class="text-sm">{{ opt.label }}</span>
              </label>
            </div>
          </section>

          <!-- тут позже добавим остальные фильтры оружия -->
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}

@media (max-width: 640px){
  .slide-up-enter-active,.slide-up-leave-active{transition:transform .25s ease,opacity .25s ease}
  .slide-up-enter-from,.slide-up-leave-to{transform:translateY(100%);opacity:.8}
}
</style>
