<template>
    <div :class="containerClasses">
      <svg
        :class="spinnerClasses"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span v-if="label" :class="labelClasses">{{ label }}</span>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => [
        'primary', 'white', 'success', 'danger', 'warning'
      ].includes(value)
    },
    label: {
      type: String,
      default: ''
    },
    centered: {
      type: Boolean,
      default: false
    }
  })
  
  const containerClasses = computed(() => {
    return [
      'spinner-container',
      {
        'flex items-center justify-center': props.centered,
        'inline-flex items-center': !props.centered
      }
    ]
  })
  
  const spinnerClasses = computed(() => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    }
  
    const colors = {
      primary: 'text-primary-600',
      white: 'text-white',
      success: 'text-success-600',
      danger: 'text-danger-600',
      warning: 'text-warning-600',
    }
  
    return [
      'animate-spin',
      sizes[props.size],
      colors[props.color]
    ]
  })
  
  const labelClasses = computed(() => {
    return [
      'ml-3 text-sm font-medium',
      props.color === 'white' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
    ]
  })
  </script>