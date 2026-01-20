<template>
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modelValue"
          class="modal-overlay"
          @click.self="handleBackdropClick"
        >
          <div :class="modalClasses" class="modal-content">
            <!-- Header -->
            <div v-if="!hideHeader" class="modal-header">
              <slot name="header">
                <h3 class="modal-title">{{ title }}</h3>
              </slot>
              <button
                v-if="!hideClose"
                type="button"
                @click="close"
                class="modal-close"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
  
            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    hideHeader: {
      type: Boolean,
      default: false
    },
    hideClose: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'close', 'open'])
  
  const modalClasses = computed(() => {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full h-full rounded-none'
    }
    
    return [
      'modal-dialog',
      sizeClasses[props.size]
    ]
  })
  
  const bodyClasses = computed(() => {
    return [
      'modal-body',
      {
        'p-0': props.noPadding,
        'p-6': !props.noPadding
      }
    ]
  })
  
  function close() {
    emit('update:modelValue', false)
    emit('close')
  }
  
  function handleBackdropClick() {
    if (props.closeOnBackdrop) {
      close()
    }
  }
  
  function handleEscape(e) {
    if (e.key === 'Escape' && props.closeOnEscape && props.modelValue) {
      close()
    }
  }
  
  watch(() => props.modelValue, (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
      emit('open')
      
      if (props.closeOnEscape) {
        document.addEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = ''
      
      if (props.closeOnEscape) {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  })
  </script>
  
  <style scoped>
  .modal-overlay {
    @apply fixed inset-0 z-50 flex items-center justify-center;
    @apply bg-black/50 dark:bg-black/70 backdrop-blur-sm;
    @apply p-4;
  }
  
  .modal-dialog {
    @apply bg-white dark:bg-gray-800 rounded-2xl shadow-2xl;
    @apply w-full max-h-[90vh] overflow-hidden flex flex-col;
    @apply transform transition-all;
  }
  
  .modal-header {
    @apply px-6 py-4 border-b border-gray-200 dark:border-gray-700;
    @apply flex items-center justify-between;
    @apply bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50;
  }
  
  .modal-title {
    @apply text-xl font-semibold text-gray-900 dark:text-white;
  }
  
  .modal-close {
    @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
    @apply rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700;
  }
  
  .modal-body {
    @apply overflow-y-auto flex-1;
  }
  
  .modal-footer {
    @apply px-6 py-4 border-t border-gray-200 dark:border-gray-700;
    @apply bg-gray-50 dark:bg-gray-800/50;
    @apply flex items-center justify-end gap-3;
  }
  
  /* Transitions */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-active .modal-dialog,
  .modal-leave-active .modal-dialog {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  .modal-enter-from .modal-dialog {
    transform: translateY(-50px) scale(0.95);
    opacity: 0;
  }
  
  .modal-leave-to .modal-dialog {
    transform: translateY(50px) scale(0.95);
    opacity: 0;
  }
  </style>