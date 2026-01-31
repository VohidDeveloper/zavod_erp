<template>
    <Teleport to="body">
      <div
        :class="[
          'fixed z-50',
          positionClass
        ]"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'mb-3 max-w-sm w-full rounded-lg shadow-lg overflow-hidden pointer-events-auto',
              getToastClasses(toast.type)
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
                    :class="['text-sm font-medium', getTitleColor(toast.type)]"
                  >
                    {{ toast.title }}
                  </p>
                  <p
                    v-if="toast.message"
                    :class="[
                      'text-sm',
                      toast.title ? 'mt-1' : '',
                      getMessageColor(toast.type)
                    ]"
                  >
                    {{ toast.message }}
                  </p>
                </div>
  
                <!-- Close Button -->
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="removeToast(toast.id)"
                    :class="[
                      'rounded-md inline-flex focus:outline-none focus:ring-2',
                      getCloseButtonColor(toast.type)
                    ]"
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
  
  const positionClass = computed(() => {
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
  
  const getToastClasses = (type) => {
    const classes = {
      success: 'bg-white border-l-4 border-green-500',
      error: 'bg-white border-l-4 border-red-500',
      warning: 'bg-white border-l-4 border-yellow-500',
      info: 'bg-white border-l-4 border-blue-500'
    }
    return classes[type] || classes.info
  }
  
  const getIcon = (type) => {
    const icons = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      warning: ExclamationTriangleIcon,
      info: InformationCircleIcon
    }
    return icons[type] || icons.info
  }
  
  const getIconColor = (type) => {
    const colors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    }
    return colors[type] || colors.info
  }
  
  const getTitleColor = (type) => {
    return 'text-gray-900'
  }
  
  const getMessageColor = (type) => {
    return 'text-gray-600'
  }
  
  const getCloseButtonColor = (type) => {
    const colors = {
      success: 'text-green-500 hover:text-green-600 focus:ring-green-500',
      error: 'text-red-500 hover:text-red-600 focus:ring-red-500',
      warning: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500',
      info: 'text-blue-500 hover:text-blue-600 focus:ring-blue-500'
    }
    return colors[type] || colors.info
  }
  
  const removeToast = (id) => {
    emit('remove', id)
  }
  </script>