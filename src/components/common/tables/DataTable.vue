<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
        <slot name="header">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </slot>
      </div>
      
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="getHeaderClass(column)"
                @click="handleSort(column)"
              >
                <div class="flex items-center gap-2">
                  <span>{{ column.label }}</span>
                  <svg
                    v-if="column.sortable"
                    class="w-4 h-4"
                    :class="getSortIconClass(column)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(row, index) in paginatedData"
              :key="index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              >
                <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                  {{ row[column.key] }}
                </slot>
              </td>
              
              <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <slot name="actions" :row="row" />
              </td>
            </tr>
            
            <tr v-if="!data || data.length === 0">
              <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-12 text-center text-gray-500">
                <slot name="empty">
                  Ma'lumot topilmadi
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && data.length > 0" class="px-6 py-4 border-t border-gray-200">
        <Pagination
          :current-page="currentPage"
          :total="data.length"
          :per-page="perPage"
          @update:current-page="currentPage = $event"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import Pagination from './Pagination.vue'
  
  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true
      // [{ key: 'name', label: 'Nomi', sortable: true, align: 'left' }]
    },
    data: {
      type: Array,
      required: true
    },
    actions: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Boolean,
      default: true
    },
    perPage: {
      type: Number,
      default: 10
    }
  })
  
  const currentPage = ref(1)
  const sortKey = ref('')
  const sortOrder = ref('asc')
  
  const sortedData = computed(() => {
    if (!sortKey.value) return props.data
    
    return [...props.data].sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  })
  
  const paginatedData = computed(() => {
    if (!props.pagination) return sortedData.value
    
    const start = (currentPage.value - 1) * props.perPage
    const end = start + props.perPage
    return sortedData.value.slice(start, end)
  })
  
  const getHeaderClass = (column) => {
    const base = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'
    const align = column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
    const cursor = column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
    return `${base} ${align} ${cursor}`
  }
  
  const getSortIconClass = (column) => {
    if (sortKey.value !== column.key) return 'text-gray-400'
    return sortOrder.value === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'
  }
  
  const handleSort = (column) => {
    if (!column.sortable) return
    
    if (sortKey.value === column.key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = column.key
      sortOrder.value = 'asc'
    }
  }
  </script>