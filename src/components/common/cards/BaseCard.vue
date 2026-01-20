<template>
    <div :class="cardClasses">
      <!-- Header -->
      <div v-if="$slots.header || title" class="card-header">
        <slot name="header">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
        </slot>
        <div v-if="$slots.actions" class="card-actions">
          <slot name="actions" />
        </div>
      </div>
  
      <!-- Body -->
      <div :class="bodyClasses">
        <slot />
      </div>
  
      <!-- Footer -->
      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'none'].includes(value)
    },
    padding: {
      type: String,
      default: '6',
      validator: (value) => ['0', '2', '4', '6', '8'].includes(value)
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  })
  
  const cardClasses = computed(() => {
    return [
      'card',
      {
        'card-hover': props.hoverable,
        'border border-gray-200 dark:border-gray-700': props.bordered,
        [`shadow-${props.shadow}`]: props.shadow !== 'none',
        'dark:bg-gray-800': true
      }
    ]
  })
  
  const bodyClasses = computed(() => {
    return [
      {
        'card-body': !props.noPadding,
        [`p-${props.padding}`]: !props.noPadding
      }
    ]
  })
  </script>
  
  <style scoped>
  .card-header {
    @apply px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50;
    @apply flex items-center justify-between;
  }
  
  .card-actions {
    @apply flex items-center gap-2;
  }
  
  .card-footer {
    @apply px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50;
  }
  </style>