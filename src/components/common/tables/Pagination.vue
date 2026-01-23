<template>
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        <span class="font-medium">{{ startItem }}</span>
        dan
        <span class="font-medium">{{ endItem }}</span>
        gacha, jami
        <span class="font-medium">{{ total }}</span>
      </div>
      
      <div class="flex gap-1">
        <!-- Previous -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Oldingi
        </button>
        
        <!-- Pages -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <!-- Next -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Keyingi
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    },
    maxVisible: {
      type: Number,
      default: 5
    }
  })
  
  const emit = defineEmits(['update:currentPage'])
  
  const totalPages = computed(() => Math.ceil(props.total / props.perPage))
  
  const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
  
  const endItem = computed(() => {
    const end = props.currentPage * props.perPage
    return end > props.total ? props.total : end
  })
  
  const visiblePages = computed(() => {
    const pages = []
    const half = Math.floor(props.maxVisible / 2)
    
    let start = Math.max(1, props.currentPage - half)
    let end = Math.min(totalPages.value, start + props.maxVisible - 1)
    
    if (end - start < props.maxVisible - 1) {
      start = Math.max(1, end - props.maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  })
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      emit('update:currentPage', page)
    }
  }
  </script>