import { ref } from 'vue'
import { useNotifications } from './useNotifications'

export function useAsync(asyncFunction, options = {}) {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    showSuccessNotification = false,
    showErrorNotification = true,
    successMessage = 'Muvaffaqiyatli!',
    errorMessage = 'Xatolik yuz berdi',
  } = options

  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  const notifications = useNotifications()

  async function execute(...args) {
    loading.value = true
    error.value = null

    try {
      const result = await asyncFunction(...args)
      data.value = result

      if (showSuccessNotification) {
        notifications.success(successMessage)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      error.value = err

      if (showErrorNotification) {
        const message = err.response?.data?.detail || errorMessage
        notifications.error(message)
      }

      if (onError) {
        onError(err)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    loading,
    error,
    data,
    execute,
  }
}