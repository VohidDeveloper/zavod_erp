<template>
    <div class="w-full">
      <!-- Label -->
      <label
        v-if="label"
        :for="inputId"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <!-- Input wrapper -->
      <div class="relative">
        <!-- Icon left -->
        <div
          v-if="iconLeft"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <component :is="iconLeft" class="h-5 w-5 text-gray-400" />
        </div>
        
        <!-- Input -->
        <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :autocomplete="autocomplete"
          :class="inputClasses"
          @input="$emit('update:modelValue', $event.target.value)"
          @blur="$emit('blur', $event)"
          @focus="$emit('focus', $event)"
        />
        
        <!-- Icon right / Clear button -->
        <div
          v-if="iconRight || (clearable && modelValue)"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <button
            v-if="clearable && modelValue && !disabled"
            type="button"
            @click="handleClear"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <component
            v-else-if="iconRight"
            :is="iconRight"
            class="h-5 w-5 text-gray-400"
          />
        </div>
      </div>
      
      <!-- Helper text / Error -->
      <p
        v-if="error || helperText"
        :class="[
          'mt-1 text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        ]"
      >
        {{ error || helperText }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
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
    iconLeft: {
      type: Object,
      default: null
    },
    iconRight: {
      type: Object,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear'])
  
  const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
  
  const inputClasses = computed(() => {
    const classes = [
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'text-sm'
    ]
    
    // Padding based on icons
    if (props.iconLeft) {
      classes.push('pl-10 pr-3 py-2')
    } else if (props.iconRight || props.clearable) {
      classes.push('pl-3 pr-10 py-2')
    } else {
      classes.push('px-3 py-2')
    }
    
    // Error state
    if (props.error) {
      classes.push('border-red-300 focus:border-red-500 focus:ring-red-500')
    } else {
      classes.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500')
    }
    
    return classes.join(' ')
  })
  
  const handleClear = () => {
    emit('update:modelValue', '')
    emit('clear')
  }
  </script>