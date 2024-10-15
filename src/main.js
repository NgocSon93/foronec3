/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import '@mdi/font/css/materialdesignicons.css';
import { registerPlugins } from '@/plugins'
import axiosPlugin from './plugins/axios';
import vuetify from './plugins/vuetify';

// Components
import App from './App.vue'
// Composables
import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { createPinia } from 'pinia'

// Router and Store
import router from '@/router'


const app = createApp(App)

app.use(Vue3Toastify, {
  autoClose: 3000,
  // You can add more global options here
})

app.use(router)
app.use(vuetify)

app
   .use(axiosPlugin)

registerPlugins(app)

const pinia = createPinia()

app.use(pinia)

app.mount('#app')


