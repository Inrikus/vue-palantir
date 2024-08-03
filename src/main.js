import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VueGtag from 'vue-gtag'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)

// Настройка vue-gtag
app.use(VueGtag, {
    config: { id: 'G-5NRKG76JQG' } // Замените GA_MEASUREMENT_ID на ваш идентификатор Google Analytics
},router)

app.mount('#app')