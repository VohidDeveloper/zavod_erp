import { ref } from 'vue'

export function useModal() {
  const isOpen = ref(false)
  const data = ref(null)

  function open(modalData = null) {
    data.value = modalData
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    // Clear data after animation
    setTimeout(() => {
      data.value = null
    }, 300)
  }

  function toggle() {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  }
}