<template>
    <Teleport to="body">
      <div
        :class="[
          'fixed z-50 pointer-events-none',
          positionClasses
        ]"
      >
        <TransitionGroup
          name="toast"
          tag="div"
          class="flex flex-col gap-3"
        >
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'pointer-events-auto max-w-sm w-full rounded-lg shadow-lg overflow-hidden',
              'bg-white border-l-4',
              getBorderColor(toast.type)
            ]"
          >
            <div class="p-4">
              <div class="flex items-start">
                <!-- Icon -->
                <div class="flex-shrink-0">
                  <component
                    :is="getIcon(toast.type)"
                    :class="['w-6 h-6', getIconColor(toast.type)]"
                  />
                </div>
  
                <!-- Content -->
                <div class="ml-3 flex-1">
                  <p
                    v-if="toast.title"
                    class="text-sm font-medium text-gray-900"
                  >
                    {{ toast.title }}
                  </p>
                  <p
                    v-if="toast.message"
                    :class="[
                      'text-sm text-gray-600',
                      toast.title ? 'mt-1' : ''
                    ]"
                  >
                    {{ toast.message }}
                  </p>
                </div>
  
                <!-- Close Button -->
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="removeToast(toast.id)"
                    class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    toasts: {
      type: Array,
      default: () => []
    },
    position: {
      type: String,
      default: 'top-right',
      validator: (value) => [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ].includes(value)
    }
  })
  
  const emit = defineEmits(['remove'])
  
  const positionClasses = computed(() => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4'
    }
    return positions[props.position]
  })
  
  const getIcon = (type) => {
    const icons = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      warning: ExclamationTriangleIcon,
      info: InformationCircleIcon
    }
    return icons[type] || InformationCircleIcon
  }
  
  const getIconColor = (type) => {
    const colors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    }
    return colors[type] || 'text-blue-500'
  }
  
  const getBorderColor = (type) => {
    const colors = {
      success: 'border-green-500',
      error: 'border-red-500',
      warning: 'border-yellow-500',
      info: 'border-blue-500'
    }
    return colors[type] || 'border-blue-500'
  }
  
  const removeToast = (id) => {
    emit('remove', id)
  }
  </script>
  
  <style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-enter-from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  
  .toast-leave-to {
    opacity: 0;
    transform: translateX(2rem);
  }
  </style>