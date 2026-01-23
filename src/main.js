import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import Toast from 'vue-toastification'

import App from './App.vue'
import './assets/styles/main.css'
import 'vue-toastification/dist/index.css'
import directives from './directives'
// import notificationPlugin from './plugins/notification'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(directives)
app.use(notificationPlugin)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
})

app.mount('#app')