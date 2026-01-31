import { inject } from 'vue'
import { useCommonStore } from '@/stores/common'

/**
 * Notifications composable
 * Handles toast notifications and system alerts
 */
export function useNotifications() {
  // Try to use injected plugins first (if available)
  const toast = inject('$toast', null)
  const notification = inject('$notification', null)
  
  // Fallback to commonStore
  const commonStore = useCommonStore()

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type: success, error, warning, info
   * @param {number} duration - Duration in milliseconds
   */
  const showToast = (message, type = 'info', duration = 3000) => {
    // Try injected toast first
    if (toast) {
      toast.show(message, type, duration)
      return
    }
    
    // Fallback to commonStore
    commonStore.showToast({
      type,
      message,
      duration
    })
  }

  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in milliseconds
   */
  const success = (message, title = 'Muvaffaqiyatli', duration = 3000) => {
    if (toast) {
      showToast(message, 'success', duration)
    } else {
      commonStore.showSuccess(message, title)
    }
  }

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in milliseconds
   */
  const error = (message, title = 'Xatolik', duration = 5000) => {
    if (toast) {
      showToast(message, 'error', duration)
    } else {
      commonStore.showError(message, title)
    }
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in milliseconds
   */
  const warning = (message, title = 'Ogohlantirish', duration = 4000) => {
    if (toast) {
      showToast(message, 'warning', duration)
    } else {
      commonStore.showWarning(message, title)
    }
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {string} title - Optional title
   * @param {number} duration - Duration in milliseconds
   */
  const info = (message, title = 'Ma\'lumot', duration = 3000) => {
    if (toast) {
      showToast(message, 'info', duration)
    } else {
      commonStore.showInfo(message, title)
    }
  }

  /**
   * Show API error notification
   * Handles error objects from API calls
   * @param {Error|Object} err - Error object
   * @param {string} defaultMessage - Default message if error message not available
   */
  const apiError = (err, defaultMessage = 'Xatolik yuz berdi') => {
    let message = defaultMessage
    
    // Extract error message from various error formats
    if (err.response?.data?.message) {
      message = err.response.data.message
    } else if (err.response?.data?.error) {
      message = err.response.data.error
    } else if (err.response?.data?.detail) {
      message = err.response.data.detail
    } else if (err.message) {
      message = err.message
    }
    
    error(message, 'API Xatolik', 5000)
  }

  /**
   * Show validation errors
   * Handles validation error objects from API
   * @param {Object} errors - Validation errors object
   */
  const validationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
      error('Validatsiya xatosi', 'Xatolik')
      return
    }
    
    // Handle different error formats
    Object.keys(errors).forEach(key => {
      const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]]
      messages.forEach(msg => {
        error(msg, `${key} xatosi`, 4000)
      })
    })
  }

  /**
   * Show confirmation success
   * @param {string} action - Action name (e.g., 'yaratildi', 'o\'chirildi')
   */
  const confirmSuccess = (action = 'bajarildi') => {
    success(`Amal muvaffaqiyatli ${action}`)
  }

  /**
   * Show delete success
   */
  const deleteSuccess = () => {
    success('Muvaffaqiyatli o\'chirildi')
  }

  /**
   * Show save success
   */
  const saveSuccess = () => {
    success('Muvaffaqiyatli saqlandi')
  }

  /**
   * Show update success
   */
  const updateSuccess = () => {
    success('Muvaffaqiyatli yangilandi')
  }

  /**
   * Show create success
   */
  const createSuccess = () => {
    success('Muvaffaqiyatli yaratildi')
  }

  // System notifications (using injected notification plugin)
  
  /**
   * Show system notification
   * @param {Object} options - Notification options
   */
  const notify = (options) => {
    if (!notification) {
      // Fallback to toast
      showToast(options.message || options.title, options.type || 'info')
      return
    }
    notification.show(options)
  }

  /**
   * Show system success notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {boolean} persistent - Whether notification persists
   */
  const notifySuccess = (title, message, persistent = false) => {
    notify({
      type: 'success',
      title,
      message,
      persistent
    })
  }

  /**
   * Show system error notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {boolean} persistent - Whether notification persists
   */
  const notifyError = (title, message, persistent = true) => {
    notify({
      type: 'error',
      title,
      message,
      persistent
    })
  }

  /**
   * Show system warning notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {boolean} persistent - Whether notification persists
   */
  const notifyWarning = (title, message, persistent = false) => {
    notify({
      type: 'warning',
      title,
      message,
      persistent
    })
  }

  /**
   * Show system info notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {boolean} persistent - Whether notification persists
   */
  const notifyInfo = (title, message, persistent = false) => {
    notify({
      type: 'info',
      title,
      message,
      persistent
    })
  }

  /**
   * Clear all notifications
   */
  const clear = () => {
    commonStore.clearToasts()
  }

  return {
    // Toast notifications
    showToast,
    success,
    error,
    warning,
    info,
    
    // API & Validation errors
    apiError,
    validationErrors,
    
    // Quick success messages
    confirmSuccess,
    deleteSuccess,
    saveSuccess,
    updateSuccess,
    createSuccess,
    
    // System notifications
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    
    // Utilities
    clear
  }
}