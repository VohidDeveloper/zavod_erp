<template>
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="visible"
        :class="[
          'rounded-lg p-4',
          getAlertClasses()
        ]"
        role="alert"
      >
        <div class="flex">
          <!-- Icon -->
          <div v-if="showIcon" class="flex-shrink-0">
            <component
              :is="getIcon()"
              :class="['w-5 h-5', getIconColor()]"
            />
          </div>
  
          <!-- Content -->
          <div :class="['flex-1', showIcon ? 'ml-3' : '']">
            <!-- Title -->
            <h3
              v-if="title"
              :class="['text-sm font-medium', getTitleColor()]"
            >
              {{ title }}
            </h3>
  
            <!-- Message -->
            <div
              :class="[
                'text-sm',
                title ? 'mt-1' : '',
                getMessageColor()
              ]"
            >
              <slot>
                {{ message }}
              </slot>
            </div>
  
            <!-- Actions -->
            <div v-if="$slots.actions" class="mt-3">
              <slot name="actions" />
            </div>
          </div>
  
          <!-- Close Button -->
          <div v-if="closable" class="ml-auto pl-3">
            <button
              @click="close"
              :class="[
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                getCloseButtonClasses()
              ]"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: null
    },
    closable: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String,
      default: 'soft',
      validator: (value) => ['soft', 'solid', 'outline'].includes(value)
    }
  })
  
  const emit = defineEmits(['close'])
  
  const visible = ref(true)
  
  const getAlertClasses = () => {
    const baseClasses = {
      soft: {
        success: 'bg-green-50 border border-green-200',
        error: 'bg-red-50 border border-red-200',
        warning: 'bg-yellow-50 border border-yellow-200',
        info: 'bg-blue-50 border border-blue-200'
      },
      solid: {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-600 text-white'
      },
      outline: {
        success: 'bg-white border-2 border-green-500',
        error: 'bg-white border-2 border-red-500',
        warning: 'bg-white border-2 border-yellow-500',
        info: 'bg-white border-2 border-blue-500'
      }
    }
    return baseClasses[props.variant][props.type]
  }
  
  const getIcon = () => {
    const icons = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      warning: ExclamationTriangleIcon,
      info: InformationCircleIcon
    }
    return icons[props.type]
  }
  
  const getIconColor = () => {
    if (props.variant === 'solid') return 'text-white'
    
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600'
    }
    return colors[props.type]
  }
  
  const getTitleColor = () => {
    if (props.variant === 'solid') return 'text-white'
    
    const colors = {
      success: 'text-green-800',
      error: 'text-red-800',
      warning: 'text-yellow-800',
      info: 'text-blue-800'
    }
    return colors[props.type]
  }
  
  const getMessageColor = () => {
    if (props.variant === 'solid') return 'text-white'
    
    const colors = {
      success: 'text-green-700',
      error: 'text-red-700',
      warning: 'text-yellow-700',
      info: 'text-blue-700'
    }
    return colors[props.type]
  }
  
  const getCloseButtonClasses = () => {
    if (props.variant === 'solid') {
      return 'text-white hover:bg-white/20 focus:ring-white'
    }
    
    const classes = {
      success: 'text-green-500 hover:bg-green-100 focus:ring-green-600',
      error: 'text-red-500 hover:bg-red-100 focus:ring-red-600',
      warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
      info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
    }
    return classes[props.type]
  }
  
  const close = () => {
    visible.value = false
    emit('close')
  }
  </script>