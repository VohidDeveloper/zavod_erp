import { ref, computed, watch } from 'vue'
import { usePagination } from './usePagination'
import { useFilters } from './useFilters'

export function useTable(options = {}) {
  const {
    fetchData = null,
    initialSortBy = '',
    initialSortOrder = 'asc',
    perPage = 10,
    filters = {},
    autoFetch = true
  } = options

  const data = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalItems = ref(0)
  const selectedRows = ref([])
  const sortBy = ref(initialSortBy)
  const sortOrder = ref(initialSortOrder)

  // Use pagination
  const pagination = usePagination({
    initialPerPage: perPage,
    totalItems,
    onPageChange: () => {
      if (autoFetch) fetchTableData()
    }
  })

  // Use filters
  const tableFilters = useFilters(filters, {
    onFilterChange: () => {
      pagination.currentPage.value = 1
      if (autoFetch) fetchTableData()
    }
  })

  // Check if all rows are selected
  const allSelected = computed(() => {
    return data.value.length > 0 && selectedRows.value.length === data.value.length
  })

  // Check if some rows are selected
  const someSelected = computed(() => {
    return selectedRows.value.length > 0 && !allSelected.value
  })

  // Fetch table data
  const fetchTableData = async () => {
    if (!fetchData) return

    loading.value = true
    error.value = null

    try {
      const params = {
        page: pagination.currentPage.value,
        per_page: pagination.perPage.value,
        sort_by: sortBy.value,
        sort_order: sortOrder.value,
        ...tableFilters.getFiltersObject()
      }

      const response = await fetchData(params)
      
      data.value = response.data || response.items || []
      totalItems.value = response.total || response.data?.length || 0
    } catch (err) {
      error.value = err.message || 'Ma\'lumotlarni yuklashda xatolik'
      console.error('Table fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // Sort table
  const sort = (column) => {
    if (sortBy.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = column
      sortOrder.value = 'asc'
    }
    
    if (autoFetch) {
      fetchTableData()
    }
  }

  // Select/deselect row
  const toggleRow = (row, idKey = 'id') => {
    const index = selectedRows.value.findIndex(r => r[idKey] === row[idKey])
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    } else {
      selectedRows.value.push(row)
    }
  }

  // Select all rows
  const selectAll = () => {
    selectedRows.value = [...data.value]
  }

  // Deselect all rows
  const deselectAll = () => {
    selectedRows.value = []
  }

  // Toggle all rows
  const toggleAll = () => {
    if (allSelected.value) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  // Check if row is selected
  const isRowSelected = (row, idKey = 'id') => {
    return selectedRows.value.some(r => r[idKey] === row[idKey])
  }

  // Refresh table
  const refresh = () => {
    fetchTableData()
  }

  // Reset table
  const reset = () => {
    pagination.reset()
    tableFilters.resetFilters()
    sortBy.value = initialSortBy
    sortOrder.value = initialSortOrder
    selectedRows.value = []
    fetchTableData()
  }

  // Watch for sort changes
  watch([sortBy, sortOrder], () => {
    if (autoFetch) fetchTableData()
  })

  // Initial fetch
  if (autoFetch && fetchData) {
    fetchTableData()
  }

  return {
    // State
    data,
    loading,
    error,
    totalItems,
    selectedRows,
    sortBy,
    sortOrder,
    allSelected,
    someSelected,
    
    // Pagination
    ...pagination,
    
    // Filters
    filters: tableFilters.filters,
    hasActiveFilters: tableFilters.hasActiveFilters,
    activeFilterCount: tableFilters.activeFilterCount,
    setFilter: tableFilters.setFilter,
    clearFilter: tableFilters.clearFilter,
    clearAllFilters: tableFilters.clearAllFilters,
    
    // Methods
    fetchTableData,
    sort,
    toggleRow,
    selectAll,
    deselectAll,
    toggleAll,
    isRowSelected,
    refresh,
    reset
  }
}