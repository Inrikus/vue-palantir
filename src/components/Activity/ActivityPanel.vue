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
  <section class="panel">
    <div class="head">
      <div class="left">
        <h3 class="title">Recent Sales</h3>
        <span class="muted">{{ items.length }} record(s)</span>
      </div>
      <button class="btn" :disabled="isLoading" @click="load">
        <span v-if="isLoading">Loading…</span>
        <span v-else>Refresh</span>
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
      :collection-key="endpoint"  />
    </div>

    <div v-if="errorText" class="error">{{ errorText }}</div>
  </section>
</template>

<style scoped>
.panel { border:1px solid rgba(99,180,200,.25); border-radius:12px; overflow:hidden; background:#161616; }
.head { display:flex; align-items:center; justify-content:space-between; padding:10px 14px;
        border-bottom:1px solid rgba(255,255,255,.08);
        background:linear-gradient(180deg, rgba(35,34,40,.85), rgba(26,26,26,.85)); }
.title { color:#9dd1de; font-weight:800; letter-spacing:.04em; }
.muted { color:#9cc7d3; opacity:.8; font-size:12px; }
.btn { min-width:120px; padding:8px 14px; border-radius:10px; border:2px solid #63B4C8; color:#E7F7FF; font-weight:700;
       background:transparent; transition:background .15s, border-color .15s, opacity .15s; }
.btn:disabled { opacity:.5; cursor:not-allowed; }
.btn:not(:disabled):hover { background:rgba(99,180,200,.12); border-color:rgba(99,180,200,.8); }
.skeleton-row { height:56px; background:linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.07) 37%, rgba(255,255,255,.04) 63%);
                background-size:400% 100%; animation:shimmer 1.2s infinite; border-bottom:1px solid rgba(255,255,255,.06); }
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
.empty, .error { text-align:center; padding:28px 14px; color:#9cc7d3; }
.error { color:#ffb3b3; }
.list { display:grid; }
</style>
