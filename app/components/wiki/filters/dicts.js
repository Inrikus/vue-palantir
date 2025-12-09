// Dictionary helpers for wiki filter chips and panels.
// Shared between WikiCoreFilterPanel.vue, WikiWeaponFilterPanel.vue, and ActiveFiltersBar.vue.

export const RARITY_NAME = { 1:'Common', 2:'Elite', 4:'Epic', 8:'Legend', 16:'Mythical' }
export const JOB_NAME    = { 1:'Striker', 2:'Keystone', 4:'Buster', 8:'Bullseye', 16:'Apostle' }
export const POSITION_NAME = {
  64:   'Body (T)',
  128:  'Bag L',
  256:  'Bag R',
  512:  'Arm L',
  1024: 'Arm R',
  2048: 'Shoulder L',
  4096: 'Shoulder R',
}

export const CHIP_COLORS = {
  rarity:   '#7aa7ff',
  job:      '#63B4C8',
  position: '#f97316',
  uniq:     '#eab308', // amber tone
  label:    '#5E5E5E', // fallback when label doesn't provide its own color
}

const JOB_CARD_BASE = [
  { id: 1,  img: '/wiki/Mechs/Img_Pic_1.png',  label: 'Striker'  },
  { id: 2,  img: '/wiki/Mechs/Img_Pic_2.png',  label: 'Keystone' },
  { id: 4,  img: '/wiki/Mechs/Img_Pic_4.png',  label: 'Buster'   },
  { id: 8,  img: '/wiki/Mechs/Img_Pic_8.png',  label: 'Bullseye' },
  { id: 16, img: '/wiki/Mechs/Img_Pic_16.png', label: 'Apostle'  },
]

/**
 * Returns the job selector cards shared across wiki pages.
 * @param {string} allLabel - Label for the “all items” card (id=0).
 */
export function buildJobCardList(allLabel = 'All') {
  const head = { id: 0, img: '/wiki/Mechs/Img_Pic_0.png', label: allLabel }
  return [head, ...JOB_CARD_BASE.map(item => ({ ...item }))]
}
