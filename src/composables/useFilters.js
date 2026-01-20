import { ref, computed } from 'vue'

export function useFilters(defaultFilters = {}) {
  const filters = ref({ ...defaultFilters })
  const search = ref('')

  const activeFiltersCount = computed(() => {
    return Object.values(filters.value).filter(
      v => v !== null && v !== '' && v !== undefined
    ).length
  })

  const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

  function setFilter(key, value) {
    filters.value[key] = value
  }

  function clearFilter(key) {
    filters.value[key] = defaultFilters[key] || null
  }

  function clearAllFilters() {
    filters.value = { ...defaultFilters }
    search.value = ''
  }

  const queryParams = computed(() => {
    const params = { ...filters.value }
    
    if (search.value) {
      params.search = search.value
    }

    // Remove null/empty values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })

    return params
  })

  return {
    filters,
    search,
    activeFiltersCount,
    hasActiveFilters,
    queryParams,
    setFilter,
    clearFilter,
    clearAllFilters,
  }
}