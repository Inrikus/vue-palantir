// Небольшой общий словарик для подписей фильтров.
// Импортируется и в WikiCoreFilterPanel.vue, и в ActiveFiltersBar.vue.
export const RARITY_NAME = { 1:'Common', 2:'Elite', 4:'Epic', 8:'Legend', 16:'Mythical' }
export const JOB_NAME    = { 1:'Striker', 2:'Keystone', 4:'Buster', 8:'Bullseye', 16:'Apostle' }

// Цвета чипов — можно централизовать тут, чтобы менять стиль в одном месте
export const CHIP_COLORS = {
  rarity: '#7aa7ff',
  job:    '#63B4C8',
  uniq:   '#eab308', // amber
  label:  '#5E5E5E', // fallback, конкретный цвет берём из LabelImageColor
}
