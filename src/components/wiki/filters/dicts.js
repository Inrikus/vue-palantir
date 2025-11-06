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
