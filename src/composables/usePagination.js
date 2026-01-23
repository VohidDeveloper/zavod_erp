import { ref, computed, watch } from 'vue'

export function usePagination(options = {}) {
  const {
    initialPage = 1,
    initialPerPage = 10,
    totalItems = ref(0),
    onPageChange = null
  } = options

  const currentPage = ref(initialPage)
  const perPage = ref(initialPerPage)

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / perPage.value)
  })

  const startItem = computed(() => {
    return (currentPage.value - 1) * perPage.value + 1
  })

  const endItem = computed(() => {
    const end = currentPage.value * perPage.value
    return end > totalItems.value ? totalItems.value : end
  })

  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  const isFirstPage = computed(() => {
    return currentPage.value === 1
  })

  const isLastPage = computed(() => {
    return currentPage.value === totalPages.value
  })

  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  const setPerPage = (value) => {
    perPage.value = value
    currentPage.value = 1
  }

  const reset = () => {
    currentPage.value = initialPage
    perPage.value = initialPerPage
  }

  const getPageRange = (maxVisible = 5) => {
    const pages = []
    const half = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage.value - half)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  // Watch for page changes
  watch(currentPage, (newPage) => {
    if (onPageChange) {
      onPageChange(newPage)
    }
  })

  return {
    // State
    currentPage,
    perPage,
    totalPages,
    startItem,
    endItem,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    
    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPerPage,
    reset,
    getPageRange
  }
}