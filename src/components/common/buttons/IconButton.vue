<template>
    <button
      :type="type"
      :disabled="disabled"
      :class="buttonClasses"
      @click="$emit('click', $event)"
      v-tooltip="tooltip"
    >
      <component :is="icon" :class="iconClasses" />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'button'
    },
    icon: {
      type: Object,
      required: true
    },
    variant: {
      type: String,
      default: 'ghost',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'ghost'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: String,
      default: ''
    },
    rounded: {
      type: Boolean,
      default: true
    }
  })
  
  defineEmits(['click'])
  
  const buttonClasses = computed(() => {
    const classes = [
      'inline-flex items-center justify-center transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ]
    
    // Size classes
    const sizeClasses = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5'
    }
    classes.push(sizeClasses[props.size])
    
    // Variant classes
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
    }
    classes.push(variantClasses[props.variant])
    
    // Rounded
    classes.push(props.rounded ? 'rounded-full' : 'rounded-lg')
    
    return classes.join(' ')
  })
  
  const iconClasses = computed(() => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }
    return sizes[props.size]
  })
  </script>