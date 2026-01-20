<template>
    <div class="input-wrapper">
      <!-- Label -->
      <label 
        v-if="label" 
        :for="inputId" 
        class="input-label"
        :class="{ 'text-danger-600': error }"
      >
        {{ label }}
        <span v-if="required" class="text-danger-500 ml-1">*</span>
      </label>
  
      <!-- Input Container -->
      <div class="relative">
        <!-- Prefix Icon -->
        <div v-if="prefixIcon" class="input-icon-left">
          <component :is="prefixIcon" class="w-5 h-5 text-gray-400" />
        </div>
  
        <!-- Input -->
        <input
          :id="inputId"
          :type="type"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :class="inputClasses"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
        />
  
        <!-- Suffix Icon or Clear Button -->
        <div v-if="suffixIcon || (clearable && modelValue)" class="input-icon-right">
          <button
            v-if="clearable && modelValue"
            type="button"
            @click="handleClear"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <component 
            v-else-if="suffixIcon" 
            :is="suffixIcon" 
            class="w-5 h-5 text-gray-400" 
          />
        </div>
  
        <!-- Password Toggle -->
        <button
          v-if="type === 'password' && showPasswordToggle"
          type="button"
          @click="togglePasswordVisibility"
          class="input-icon-right text-gray-400 hover:text-gray-600"
        >
          <svg v-if="passwordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>
  
      <!-- Helper Text -->
      <p v-if="helperText && !error" class="input-helper">
        {{ helperText }}
      </p>
  
      <!-- Error Message -->
      <p v-if="error" class="input-error">
        {{ error }}
      </p>
  
      <!-- Character Counter -->
      <p v-if="maxLength && showCounter" class="input-counter">
        {{ modelValue?.length || 0 }} / {{ maxLength }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    },
    helperText: {
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
    prefixIcon: {
      type: Object,
      default: null
    },
    suffixIcon: {
      type: Object,
      default: null
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPasswordToggle: {
      type: Boolean,
      default: true
    },
    maxLength: {
      type: Number,
      default: null
    },
    showCounter: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear'])
  
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
  const passwordVisible = ref(false)
  
  const inputClasses = computed(() => {
    return [
      'input',
      {
        'input-error': props.error,
        'pl-10': props.prefixIcon,
        'pr-10': props.suffixIcon || props.clearable || (props.type === 'password' && props.showPasswordToggle),
        'opacity-50 cursor-not-allowed': props.disabled,
        'bg-gray-50': props.readonly
      }
    ]
  })
  
  const handleInput = (event) => {
    let value = event.target.value
    
    if (props.maxLength && value.length > props.maxLength) {
      value = value.substring(0, props.maxLength)
    }
    
    emit('update:modelValue', value)
  }
  
  const handleBlur = (event) => {
    emit('blur', event)
  }
  
  const handleFocus = (event) => {
    emit('focus', event)
  }
  
  const handleClear = () => {
    emit('update:modelValue', '')
    emit('clear')
  }
  
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value
    const input = document.getElementById(inputId)
    input.type = passwordVisible.value ? 'text' : 'password'
  }
  </script>
  
  <style scoped>
  .input-wrapper {
    @apply w-full;
  }
  
  .input-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
  }
  
  .input-icon-left {
    @apply absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none;
  }
  
  .input-icon-right {
    @apply absolute right-3 top-1/2 -translate-y-1/2;
  }
  
  .input-helper {
    @apply mt-1 text-sm text-gray-500 dark:text-gray-400;
  }
  
  .input-error {
    @apply mt-1 text-sm text-danger-600 dark:text-danger-400;
  }
  
  .input-counter {
    @apply mt-1 text-sm text-gray-500 dark:text-gray-400 text-right;
  }
  </style>