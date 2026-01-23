import { ref, computed } from 'vue'

export function useModal(initialState = false) {
  const isOpen = ref(initialState)
  const modalData = ref(null)
  const loading = ref(false)

  const open = (data = null) => {
    modalData.value = data
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    setTimeout(() => {
      modalData.value = null
      loading.value = false
    }, 300) // Wait for close animation
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const setLoading = (value) => {
    loading.value = value
  }

  const setData = (data) => {
    modalData.value = data
  }

  return {
    isOpen,
    modalData,
    loading,
    open,
    close,
    toggle,
    setLoading,
    setData
  }
}

// For managing multiple modals
export function useModals() {
  const modals = ref({})

  const register = (name, initialState = false) => {
    if (!modals.value[name]) {
      modals.value[name] = useModal(initialState)
    }
    return modals.value[name]
  }

  const open = (name, data = null) => {
    if (modals.value[name]) {
      modals.value[name].open(data)
    }
  }

  const close = (name) => {
    if (modals.value[name]) {
      modals.value[name].close()
    }
  }

  const closeAll = () => {
    Object.values(modals.value).forEach(modal => {
      modal.close()
    })
  }

  const isOpen = (name) => {
    return modals.value[name]?.isOpen.value || false
  }

  return {
    modals,
    register,
    open,
    close,
    closeAll,
    isOpen
  }
}