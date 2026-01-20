<template>
    <span :class="statusClasses">
      <span 
        v-if="dot" 
        :class="dotClasses"
      />
      {{ statusText }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { getStatusText, getStatusBadgeClass } from '@/utils/formatters'
  
  const props = defineProps({
    status: {
      type: String,
      required: true
    },
    dot: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    }
  })
  
  const statusClasses = computed(() => {
    const baseClass = getStatusBadgeClass(props.status)
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    }
  
    return [
      'inline-flex items-center font-medium rounded-full',
      baseClass,
      sizes[props.size]
    ]
  })
  
  const dotClasses = computed(() => {
    const colors = {
      active: 'bg-success-500',
      inactive: 'bg-gray-400',
      pending: 'bg-warning-500',
      approved: 'bg-success-500',
      rejected: 'bg-danger-500',
      completed: 'bg-success-500',
      cancelled: 'bg-danger-500',
      sufficient: 'bg-success-500',
      low: 'bg-warning-500',
      critical: 'bg-danger-500',
    }
  
    return [
      'w-2 h-2 rounded-full mr-1.5',
      colors[props.status] || 'bg-gray-400'
    ]
  })
  
  const statusText = computed(() => getStatusText(props.status))
  </script>