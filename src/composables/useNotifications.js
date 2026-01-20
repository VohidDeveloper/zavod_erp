import { useToast } from 'vue-toastification'

export function useNotifications() {
  const toast = useToast()

  function success(message, options = {}) {
    toast.success(message, {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      icon: true,
      ...options,
    })
  }

  function error(message, options = {}) {
    toast.error(message, {
      position: 'top-right',
      timeout: 5000,
      ...options,
    })
  }

  function warning(message, options = {}) {
    toast.warning(message, {
      position: 'top-right',
      timeout: 4000,
      ...options,
    })
  }

  function info(message, options = {}) {
    toast.info(message, {
      position: 'top-right',
      timeout: 3000,
      ...options,
    })
  }

  return {
    success,
    error,
    warning,
    info,
  }
}