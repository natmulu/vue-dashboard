import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import { createStore } from 'vuex'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)


const store = createStore({
    state () {
      return {
        apiServer: 'http://127.0.0.1:8000/api/',
      }
    },
    mutations: {
      
    }
})

app.use(store)

app.mount('#app')
