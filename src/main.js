import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Styles
import './assets/styles/main.css'
import './assets/styles/animation.css'

// Plugins
import axiosPlugin from './plugins/axios'
import toastPlugin from './plugins/toast'

// Directives
import directives from './directives'

const app = createApp(App)

// State Management
app.use(createPinia())

// Router
app.use(router)

// Plugins
app.use(axiosPlugin)
app.use(toastPlugin)

// Register Global Directives
Object.keys(directives).forEach(key => {
  app.directive(key, directives[key])
})

// Global Error Handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
  
  // TODO: Send to error tracking service (Sentry, etc.)
}

// Mount App
app.mount('#app')