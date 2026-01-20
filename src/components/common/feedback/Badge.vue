<template>
    <span :class="badgeClasses">
      <component 
        v-if="icon" 
        :is="icon" 
        class="w-3 h-3 mr-1" 
      />
      <slot />
      <button
        v-if="removable"
        type="button"
        @click.stop="handleRemove"
        class="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => [
        'primary', 'secondary', 'success', 'warning', 'danger', 'info'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    dot: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Object,
      default: null
    },
    removable: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['remove'])
  
  const badgeClasses = computed(() => {
    const variants = {
      primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
      warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
      danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
      info: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
    }
  
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    }
  
    return [
      'badge inline-flex items-center font-medium',
      variants[props.variant],
      sizes[props.size],
      {
        'rounded-full': props.rounded,
        'rounded': !props.rounded
      }
    ]
  })
  
  const handleRemove = () => {
    emit('remove')
  }
  </script>