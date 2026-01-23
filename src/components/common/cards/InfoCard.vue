<template>
    <div :class="cardClasses">
      <div class="flex items-start">
        <div v-if="icon" :class="['flex-shrink-0', iconColor]">
          <component :is="icon" class="w-6 h-6" />
        </div>
        
        <div :class="['flex-1', icon ? 'ml-3' : '']">
          <h3 v-if="title" class="text-sm font-medium" :class="titleColor">
            {{ title }}
          </h3>
          <div class="mt-1 text-sm" :class="textColor">
            <slot>{{ message }}</slot>
          </div>
          
          <div v-if="$slots.actions" class="mt-3">
            <slot name="actions" />
          </div>
        </div>
        
        <button
          v-if="closeable"
          @click="$emit('close')"
          :class="['ml-3 flex-shrink-0', closeColor]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    icon: {
      type: Object,
      default: null
    },
    closeable: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['close'])
  
  const cardClasses = computed(() => {
    const base = 'rounded-lg p-4 border-l-4'
    
    const types = {
      info: 'bg-blue-50 border-blue-500',
      success: 'bg-green-50 border-green-500',
      warning: 'bg-yellow-50 border-yellow-500',
      error: 'bg-red-50 border-red-500'
    }
    
    return `${base} ${types[props.type]}`
  })
  
  const iconColor = computed(() => {
    const colors = {
      info: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      error: 'text-red-600'
    }
    return colors[props.type]
  })
  
  const titleColor = computed(() => {
    const colors = {
      info: 'text-blue-900',
      success: 'text-green-900',
      warning: 'text-yellow-900',
      error: 'text-red-900'
    }
    return colors[props.type]
  })
  
  const textColor = computed(() => {
    const colors = {
      info: 'text-blue-700',
      success: 'text-green-700',
      warning: 'text-yellow-700',
      error: 'text-red-700'
    }
    return colors[props.type]
  })
  
  const closeColor = computed(() => {
    const colors = {
      info: 'text-blue-500 hover:text-blue-700',
      success: 'text-green-500 hover:text-green-700',
      warning: 'text-yellow-500 hover:text-yellow-700',
      error: 'text-red-500 hover:text-red-700'
    }
    return colors[props.type]
  })
  </script>