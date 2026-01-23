<template>
    <div class="w-full">
      <label
        v-if="label"
        :for="inputId"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative">
        <input
          :id="inputId"
          type="number"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :placeholder="placeholder"
          :disabled="disabled"
          :required="required"
          :class="inputClasses"
          @input="handleInput"
          @blur="$emit('blur', $event)"
        />
        
        <!-- Step buttons -->
        <div v-if="showButtons" class="absolute inset-y-0 right-0 flex flex-col border-l border-gray-300">
          <button
            type="button"
            @click="increment"
            :disabled="disabled || (max !== null && modelValue >= max)"
            class="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            @click="decrement"
            :disabled="disabled || (min !== null && modelValue <= min)"
            class="px-2 py-1 text-gray-600 hover:bg-gray-100 border-t border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <p v-if="error || helperText" :class="['mt-1 text-sm', error ? 'text-red-600' : 'text-gray-500']">
        {{ error || helperText }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: [Number, String],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'blur'])
  
  const inputId = computed(() => `number-${Math.random().toString(36).substr(2, 9)}`)
  
  const inputClasses = computed(() => {
    const classes = [
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'px-3 py-2 text-sm'
    ]
    
    if (props.showButtons) {
      classes.push('pr-8')
    }
    
    if (props.error) {
      classes.push('border-red-300 focus:border-red-500 focus:ring-red-500')
    } else {
      classes.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500')
    }
    
    return classes.join(' ')
  })
  
  const handleInput = (event) => {
    const value = event.target.value === '' ? null : Number(event.target.value)
    emit('update:modelValue', value)
  }
  
  const increment = () => {
    const currentValue = props.modelValue || 0
    const newValue = currentValue + props.step
    if (props.max === null || newValue <= props.max) {
      emit('update:modelValue', newValue)
    }
  }
  
  const decrement = () => {
    const currentValue = props.modelValue || 0
    const newValue = currentValue - props.step
    if (props.min === null || newValue >= props.min) {
      emit('update:modelValue', newValue)
    }
  }
  </script>