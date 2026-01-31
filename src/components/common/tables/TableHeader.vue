<template>
    <th
      :class="[
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        sortable ? 'cursor-pointer select-none' : '',
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        headerClass
      ]"
      @click="handleClick"
    >
      <div class="flex items-center space-x-1">
        <span class="flex-1">
          <slot />
        </span>
        
        <!-- Sort Icons -->
        <span v-if="sortable" class="flex flex-col">
          <ChevronUpIcon
            :class="[
              'w-3 h-3 -mb-1',
              sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'
            ]"
          />
          <ChevronDownIcon
            :class="[
              'w-3 h-3',
              sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'
            ]"
          />
        </span>
      </div>
    </th>
  </template>
  
  <script setup>
  import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
  
  const props = defineProps({
    sortable: {
      type: Boolean,
      default: false
    },
    sortDirection: {
      type: String,
      default: null,
      validator: (value) => !value || ['asc', 'desc'].includes(value)
    },
    align: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    headerClass: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['sort'])
  
  const handleClick = () => {
    if (props.sortable) {
      let newDirection = 'asc'
      if (props.sortDirection === 'asc') {
        newDirection = 'desc'
      } else if (props.sortDirection === 'desc') {
        newDirection = null
      }
      emit('sort', newDirection)
    }
  }
  </script>