import { inject } from 'vue'

export function useNotifications() {
  const toast = inject('$toast')
  const notification = inject('$notification')

  // Toast notifications
  const showToast = (message, type = 'info', duration = 3000) => {
    if (!toast) {
      console.warn('Toast plugin not found')
      return
    }
    toast.show(message, type, duration)
  }

  const success = (message, duration = 3000) => {
    showToast(message, 'success', duration)
  }

  const error = (message, duration = 5000) => {
    showToast(message, 'error', duration)
  }

  const warning = (message, duration = 4000) => {
    showToast(message, 'warning', duration)
  }

  const info = (message, duration = 3000) => {
    showToast(message, 'info', duration)
  }

  // System notifications
  const notify = (options) => {
    if (!notification) {
      console.warn('Notification plugin not found')
      return
    }
    notification.show(options)
  }

  const notifySuccess = (title, message, persistent = false) => {
    notify({
      type: 'success',
      title,
      message,
      persistent
    })
  }

  const notifyError = (title, message, persistent = true) => {
    notify({
      type: 'error',
      title,
      message,
      persistent
    })
  }

  const notifyWarning = (title, message, persistent = false) => {
    notify({
      type: 'warning',
      title,
      message,
      persistent
    })
  }

  const notifyInfo = (title, message, persistent = false) => {
    notify({
      type: 'info',
      title,
      message,
      persistent
    })
  }

  return {
    // Toast
    showToast,
    success,
    error,
    warning,
    info,
    
    // Notifications
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  }
}