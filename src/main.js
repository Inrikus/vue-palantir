import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VueGtag from 'vue-gtag-next'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)

app.use(VueGtag, {
  property: {
    id: 'G-5NRKG76JQG'  // <-- Замени на свой ID
  }
}, router);

app.mount('#app')