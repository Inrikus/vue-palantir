import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app/**/*.{vue,js,ts}',
    './error.{vue,js,ts}',
    './content/**/*.{md,mdc}',
    './nuxt.config.{js,ts}',
    './app.config.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
