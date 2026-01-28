import { useRuntimeConfig } from '#imports'

export function buildVideoUrl(filename) {
  if (!filename) return ''
  const config = useRuntimeConfig()
  const base = config?.public?.videoBase || ''
  const encoded = encodeURIComponent(filename)
  if (!base) return `/videos/${encoded}`
  return `${base.replace(/\/$/, '')}/${encoded}`
}
