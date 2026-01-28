import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

export function useWikiListingPage(options = {}) {
  const {
    initialLocale = 'en',
    loadResources,
    onSearchChange,
    mobileQuery = '(max-width: 640px)',
    localeRef,
  } = options

  const locale = localeRef || ref(initialLocale)
  const search = ref('')
  const isMobile = ref(false)
  const showFilterPanel = ref(false)
  const modalOpen = ref(false)

  const updateIsMobile = () => {
    if (typeof window === 'undefined') {
      isMobile.value = false
      return
    }
    isMobile.value = window.matchMedia(mobileQuery).matches
  }

  const toggleFilterPanel = () => {
    showFilterPanel.value = !showFilterPanel.value
  }
  const setFilterPanelOpen = (val) => {
    showFilterPanel.value = !!val
  }

  const setModalOpen = (val) => {
    modalOpen.value = !!val
  }

  const toggleScrollLock = (locked) => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const body = document.body
    html.classList.toggle('hidden-scroll', !!locked)
    body.classList.toggle('hidden-scroll', !!locked)
  }

  const runLoad = (targetLocale) => {
    if (typeof loadResources !== 'function') return null
    return Promise.resolve(loadResources(targetLocale ?? locale.value))
  }

  const invokeLoad = (targetLocale) => {
    const maybe = runLoad(targetLocale)
    if (maybe && typeof maybe.then === 'function') {
      maybe.catch(() => {})
    }
  }

  watch(locale, (next) => {
    invokeLoad(next)
  })

  watch(search, (val) => {
    if (typeof onSearchChange === 'function') {
      onSearchChange(val ?? '')
    }
  })

  watch(modalOpen, (locked) => {
    toggleScrollLock(locked)
  })

  onMounted(() => {
    updateIsMobile()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateIsMobile, { passive: true })
    }
    invokeLoad(locale.value)
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateIsMobile)
    }
    toggleScrollLock(false)
  })

  return {
    locale,
    search,
    isMobile,
    showFilterPanel,
    modalOpen,
    toggleFilterPanel,
    setFilterPanelOpen,
    setModalOpen,
    setSearch: (val) => { search.value = val },
    setLocale: (val) => { locale.value = val },
    updateIsMobile,
  }
}
