<script setup>
import { ref, watch } from 'vue'
import ActivityItem from './ActivityItem.vue'
import { fetchActivities } from '@/utils/api' // должен вернуть { _id, actions: [...] }

const props = defineProps({
  endpoint: { type: String, required: true },
})

const items = ref([])
const isLoading = ref(false)
const errorText = ref('')

async function load() {
  if (!props.endpoint) { items.value = []; return }
  try {
    isLoading.value = true
    errorText.value = ''
    items.value = []
    const { data } = await fetchActivities(props.endpoint) // GET /api/activity/{endpoint}
    items.value = Array.isArray(data?.actions) ? data.actions : []
  } catch {
    errorText.value = 'Failed to load activity.'
    items.value = []
  } finally {
    isLoading.value = false
  }
}

// первая загрузка и при смене коллекции
watch(() => props.endpoint, load, { immediate: true })
</script>
<template>
  <section class="activity-panel">
    <div class="head">
      <div>
        <p class="eyebrow">Marketplace stream</p>
        <div class="head-line">
          <h3>Recent Sales</h3>
          <span class="muted">{{ items.length }} records</span>
        </div>
      </div>
      <button class="refresh-btn" :disabled="isLoading" @click="load">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12a9 9 0 10-2.64 6.36" />
          <path d="M21 12h-6" />
        </svg>
        <span>{{ isLoading ? 'Refreshing…' : 'Refresh' }}</span>
      </button>
    </div>

    <template v-if="isLoading && !items.length">
      <div v-for="i in 6" :key="i" class="skeleton-row"></div>
    </template>

    <div v-else-if="!isLoading && !items.length" class="empty">
      No recent sales yet
    </div>

    <div v-else class="list">
      <ActivityItem
        v-for="(it, i) in items"
        :key="it.txHash || it.tokenId || i"
        :item="it"
        :collection-key="endpoint"
      />
    </div>

    <div v-if="errorText" class="error">{{ errorText }}</div>
  </section>
</template>

<style scoped>
.activity-panel {
  border-radius: 1.5rem;
  border: 1px solid rgba(99,180,200,.25);
  background:
    radial-gradient(circle at 10% 0%, rgba(99,180,200,.12), transparent 55%),
    rgba(6,8,16,.85);
  box-shadow: 0 25px 60px rgba(3,6,19,.45);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(157, 209, 222, .7);
}
.head-line {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}
.head h3 { font-size: 1.6rem; font-weight: 700; }
.muted { color: rgba(157,209,222,.8); font-size: 0.85rem; }
.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(99,180,200,.5);
  background: rgba(99,180,200,.12);
  color: #e7f7ff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  transition: border-color .2s, background .2s, opacity .2s;
}
.refresh-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
}
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.refresh-btn:not(:disabled):hover {
  border-color: rgba(99,180,200,.9);
  background: rgba(99,180,200,.18);
}
.skeleton-row {
  height: 72px;
  border-radius: 1.25rem;
  border: 1px solid rgba(255,255,255,.06);
  background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 37%, rgba(255,255,255,.04) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
.empty, .error {
  text-align: center;
  padding: 1.5rem;
  color: rgba(157,209,222,.85);
  border: 1px dashed rgba(157,209,222,.3);
  border-radius: 1rem;
}
.error { color: #ffb3b3; border-color: rgba(255,179,179,.4); }
.list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
</style>
