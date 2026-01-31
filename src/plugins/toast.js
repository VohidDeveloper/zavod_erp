import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__slideInRight',
  maxToasts: 5,
  newestOnTop: true,
}

export default {
  install: app => {
    app.use(Toast, options)
  },
}

// import { createApp, h, reactive } from 'vue'
// import ToastContainer from '@/components/common/ToastContainer.vue'

// class ToastService {
//   constructor() {
//     this.toasts = reactive([])
//     this.container = null
//     this.idCounter = 0
//   }
  
//   init() {
//     // Create container element
//     const div = document.createElement('div')
//     div.id = 'toast-container'
//     document.body.appendChild(div)
    
//     // Create Vue app for toasts
//     const app = createApp({
//       setup() {
//         return {
//           toasts: this.toasts
//         }
//       },
//       render() {
//         return h(ToastContainer, {
//           toasts: this.toasts,
//           onRemove: (id) => this.remove(id)
//         })
//       }
//     })
    
//     this.container = app.mount(div)
//   }
  
//   show(options) {
//     const id = ++this.idCounter
//     const duration = options.duration !== undefined ? options.duration : 3000
    
//     const toast = {
//       id,
//       message: options.message || '',
//       type: options.type || 'info',
//       title: options.title || null,
//       duration
//     }
    
//     this.toasts.push(toast)
    
//     // Auto remove after duration
//     if (duration > 0) {
//       setTimeout(() => this.remove(id), duration)
//     }
    
//     return id
//   }
  
//   success(message, options = {}) {
//     return this.show({
//       message,
//       type: 'success',
//       title: options.title || 'Muvaffaqiyatli',
//       duration: options.duration
//     })
//   }
  
//   error(message, options = {}) {
//     return this.show({
//       message,
//       type: 'error',
//       title: options.title || 'Xatolik',
//       duration: options.duration || 5000
//     })
//   }
  
//   warning(message, options = {}) {
//     return this.show({
//       message,
//       type: 'warning',
//       title: options.title || 'Ogohlantirish',
//       duration: options.duration
//     })
//   }
  
//   info(message, options = {}) {
//     return this.show({
//       message,
//       type: 'info',
//       title: options.title || 'Ma\'lumot',
//       duration: options.duration
//     })
//   }
  
//   remove(id) {
//     const index = this.toasts.findIndex(t => t.id === id)
//     if (index > -1) {
//       this.toasts.splice(index, 1)
//     }
//   }
  
//   clear() {
//     this.toasts.splice(0, this.toasts.length)
//   }
  
//   // Promise helpers
//   promise(promise, options = {}) {
//     const loadingId = this.show({
//       message: options.loading || 'Yuklanmoqda...',
//       type: 'info',
//       duration: 0
//     })
    
//     return promise
//       .then((result) => {
//         this.remove(loadingId)
//         if (options.success) {
//           this.success(options.success)
//         }
//         return result
//       })
//       .catch((error) => {
//         this.remove(loadingId)
//         if (options.error) {
//           this.error(options.error)
//         } else {
//           this.error(error.message || 'Xatolik yuz berdi')
//         }
//         throw error
//       })
//   }
// }

// const toastService = new ToastService()

// export default {
//   install(app) {
//     toastService.init()
//     app.config.globalProperties.$toast = toastService
//     app.provide('toast', toastService)
//   }
// }

// export { toastService }