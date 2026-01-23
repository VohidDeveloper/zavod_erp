import { ref, computed, watch } from 'vue'
import { debounce } from '@/utils/helpers'

export function useFilters(initialFilters = {}, options = {}) {
  const {
    debounceTime = 300,
    onFilterChange = null,
    persist = false,
    storageKey = 'filters'
  } = options

  // Load from localStorage if persist is enabled
  const loadFilters = () => {
    if (persist && storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          return { ...initialFilters, ...JSON.parse(saved) }
        } catch (e) {
          console.error('Failed to parse saved filters:', e)
        }
      }
    }
    return initialFilters
  }

  const filters = ref(loadFilters())
  const isActive = ref(false)

  // Check if any filters are applied
  const hasActiveFilters = computed(() => {
    return Object.keys(filters.value).some(key => {
      const value = filters.value[key]
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== '' && v !== null && v !== undefined)
      }
      return value !== '' && value !== null && value !== undefined
    })
  })

  // Get active filter count
  const activeFilterCount = computed(() => {
    let count = 0
    Object.keys(filters.value).forEach(key => {
      const value = filters.value[key]
      if (Array.isArray(value) && value.length > 0) {
        count++
      } else if (typeof value === 'object' && value !== null) {
        if (Object.values(value).some(v => v !== '' && v !== null && v !== undefined)) {
          count++
        }
      } else if (value !== '' && value !== null && value !== undefined) {
        count++
      }
    })
    return count
  })

  // Set a single filter
  const setFilter = (key, value) => {
    filters.value[key] = value
  }

  // Set multiple filters at once
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  // Clear a single filter
  const clearFilter = (key) => {
    if (Array.isArray(filters.value[key])) {
      filters.value[key] = []
    } else if (typeof filters.value[key] === 'object' && filters.value[key] !== null) {
      filters.value[key] = {}
    } else {
      filters.value[key] = ''
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    filters.value = { ...initialFilters }
  }

  // Reset filters to initial state
  const resetFilters = () => {
    filters.value = { ...initialFilters }
  }

  // Get query string for API calls
  const getQueryString = () => {
    const params = new URLSearchParams()
    
    Object.keys(filters.value).forEach(key => {
      const value = filters.value[key]
      
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(','))
      } else if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach(subKey => {
          const subValue = value[subKey]
          if (subValue !== '' && subValue !== null && subValue !== undefined) {
            params.append(`${key}[${subKey}]`, subValue)
          }
        })
      } else if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value)
      }
    })
    
    return params.toString()
  }

  // Get filters as object (for API calls)
  const getFiltersObject = () => {
    const result = {}
    
    Object.keys(filters.value).forEach(key => {
      const value = filters.value[key]
      
      if (Array.isArray(value) && value.length > 0) {
        result[key] = value
      } else if (typeof value === 'object' && value !== null) {
        const hasValue = Object.values(value).some(v => v !== '' && v !== null && v !== undefined)
        if (hasValue) {
          result[key] = value
        }
      } else if (value !== '' && value !== null && value !== undefined) {
        result[key] = value
      }
    })
    
    return result
  }

  // Save to localStorage
  const saveFilters = () => {
    if (persist && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(filters.value))
    }
  }

  // Debounced filter change handler
  const debouncedFilterChange = debounce(() => {
    if (onFilterChange) {
      onFilterChange(filters.value)
    }
    saveFilters()
  }, debounceTime)

  // Watch for filter changes
  watch(filters, () => {
    isActive.value = hasActiveFilters.value
    debouncedFilterChange()
  }, { deep: true })

  return {
    // State
    filters,
    isActive,
    hasActiveFilters,
    activeFilterCount,
    
    // Methods
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    resetFilters,
    getQueryString,
    getFiltersObject
  }
}