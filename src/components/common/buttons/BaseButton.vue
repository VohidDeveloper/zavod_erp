<template>
    <button
      :type="type"
      :disabled="disabled || loading"
      :class="buttonClasses"
      @click="handleClick"
    >
      <!-- Loading Spinner -->
      <span v-if="loading" class="btn-spinner">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4" 
            fill="none"
          />
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </span>
  
      <!-- Icon (Left) -->
      <component 
        v-if="iconLeft && !loading" 
        :is="iconLeft" 
        :class="['w-5 h-5', { 'mr-2': $slots.default }]"
      />
  
      <!-- Slot Content -->
      <span v-if="$slots.default && !iconOnly">
        <slot />
      </span>
  
      <!-- Icon (Right) -->
      <component 
        v-if="iconRight && !loading" 
        :is="iconRight" 
        :class="['w-5 h-5', { 'ml-2': $slots.default }]"
      />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => [
        'primary', 
        'secondary', 
        'success', 
        'danger', 
        'warning', 
        'ghost', 
        'outline'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: Object,
      default: null
    },
    iconRight: {
      type: Object,
      default: null
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['click'])
  
  const buttonClasses = computed(() => {
    return [
      'btn',
      `btn-${props.variant}`,
      `btn-${props.size}`,
      {
        'w-full': props.block,
        'opacity-50 cursor-not-allowed': props.disabled || props.loading,
        'btn-icon-only': props.iconOnly
      }
    ]
  })
  
  const handleClick = (event) => {
    if (!props.loading && !props.disabled) {
      emit('click', event)
    }
  }
  </script>
  
  <style scoped>
  .btn-icon-only {
    @apply p-2;
  }
  
  .btn-spinner {
    @apply inline-flex items-center mr-2;
  }
  </style>