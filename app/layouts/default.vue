<script setup>
import HeaderSection from '~/components/HeaderSection.vue'
import FooterSection from '~/components/FooterSection.vue'
</script>

<template>
  <main id="main" class="layout-default">
    <HeaderSection class="mb-0 sm:mb-3" />
    <div class="layout-body">
      <slot />
    </div>
    <FooterSection class="mt-12" />
  </main>
</template>
