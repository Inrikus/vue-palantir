import { autoAnimate } from '@formkit/auto-animate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('auto-animate', {
    mounted(el, binding) {
      if (typeof window === 'undefined') return
      autoAnimate(el, binding.value)
    },
    getSSRProps() {
      // Avoid SSR directive errors
      return {}
    }
  })
})
