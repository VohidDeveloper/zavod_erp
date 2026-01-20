import { ref, computed } from 'vue'

export function usePagination(fetchFunction, initialPage = 1, initialPageSize = 20) {
  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
  const hasNext = computed(() => currentPage.value < totalPages.value)
  const hasPrev = computed(() => currentPage.value > 1)

  async function fetchData(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await fetchFunction({
        page: currentPage.value,
        page_size: pageSize.value,
        ...params,
      })

      items.value = response.items
      total.value = response.total

      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  function nextPage() {
    if (hasNext.value) {
      currentPage.value++
      fetchData()
    }
  }

  function prevPage() {
    if (hasPrev.value) {
      currentPage.value--
      fetchData()
    }
  }

  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      fetchData()
    }
  }

  function changePageSize(size) {
    pageSize.value = size
    currentPage.value = 1
    fetchData()
  }

  function reset() {
    currentPage.value = initialPage
    pageSize.value = initialPageSize
    total.value = 0
    items.value = []
    error.value = null
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    items,
    loading,
    error,
    hasNext,
    hasPrev,
    fetchData,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    reset,
  }
}