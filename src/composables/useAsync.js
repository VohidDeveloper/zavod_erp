import { ref, computed, watch, onMounted } from 'vue'
import { useNotifications } from './useNotifications'

export function useAsync(asyncFunction, options = {}) {
  const {
    immediate = false,
    initialData = null,
    onSuccess = null,
    onError = null,
    showErrorNotification = true,
    showSuccessNotification = false
  } = options

  const { error: showError, success: showSuccess } = useNotifications()

  const data = ref(initialData)
  const error = ref(null)
  const loading = ref(false)
  const isReady = ref(false)

  const isSuccess = computed(() => isReady.value && !error.value)
  const isError = computed(() => isReady.value && !!error.value)

  const execute = async (...args) => {
    loading.value = true
    error.value = null
    isReady.value = false

    try {
      const result = await asyncFunction(...args)
      data.value = result
      isReady.value = true

      if (onSuccess) {
        onSuccess(result)
      }

      if (showSuccessNotification) {
        showSuccess('Muvaffaqiyatli bajarildi')
      }

      return result
    } catch (err) {
      error.value = err
      isReady.value = true

      if (onError) {
        onError(err)
      }

      if (showErrorNotification) {
        const message = err.response?.data?.message || err.message || 'Xatolik yuz berdi'
        showError(message)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = initialData
    error.value = null
    loading.value = false
    isReady.value = false
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    error,
    loading,
    isReady,
    isSuccess,
    isError,
    execute,
    reset
  }
}

// For handling multiple async operations
export function useAsyncQueue() {
  const queue = ref([])
  const currentIndex = ref(0)
  const loading = ref(false)
  const results = ref([])
  const errors = ref([])

  const progress = computed(() => {
    if (queue.value.length === 0) return 0
    return (currentIndex.value / queue.value.length) * 100
  })

  const isComplete = computed(() => {
    return currentIndex.value === queue.value.length && !loading.value
  })

  const add = (asyncFn) => {
    queue.value.push(asyncFn)
  }

  const execute = async () => {
    if (queue.value.length === 0) return

    loading.value = true
    currentIndex.value = 0
    results.value = []
    errors.value = []

    for (let i = 0; i < queue.value.length; i++) {
      try {
        const result = await queue.value[i]()
        results.value.push(result)
        errors.value.push(null)
      } catch (error) {
        results.value.push(null)
        errors.value.push(error)
      }
      currentIndex.value = i + 1
    }

    loading.value = false
  }

  const reset = () => {
    queue.value = []
    currentIndex.value = 0
    results.value = []
    errors.value = []
    loading.value = false
  }

  return {
    queue,
    currentIndex,
    loading,
    results,
    errors,
    progress,
    isComplete,
    add,
    execute,
    reset
  }
}