<script setup>
import { computed } from 'vue'
import HeaderSection from '~/components/HeaderSection.vue'
import FooterSection from '~/components/FooterSection.vue'

const route = useRoute()
const glassShell = computed(() => route.meta?.glassShell)
</script>

<template>
  <div class="layout-default">
    <HeaderSection />
    
    <main :class="[
      'w-full grow lg:px-12 sm:pt-10 pb-10 pt-5 px-3',
      glassShell ? 'page-shell' : 'page-wide'
    ]">
      <slot />
    </main>
    
    <FooterSection />
  </div>

</template>
