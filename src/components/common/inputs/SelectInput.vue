<template>
    <div class="w-full">
      <!-- Label -->
      <label
        v-if="label"
        :for="selectId"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <!-- Select wrapper -->
      <div class="relative">
        <select
          :id="selectId"
          :value="modelValue"
          :disabled="disabled"
          :required="required"
          :class="selectClasses"
          @change="handleChange"
        >
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <option
            v-for="option in options"
            :key="getOptionValue(option)"
            :value="getOptionValue(option)"
          >
            {{ getOptionLabel(option) }}
          </option>
        </select>
        
        <!-- Dropdown icon -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
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
      type: [String, Number, Boolean],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Tanlang...'
    },
    options: {
      type: Array,
      required: true
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
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
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'change'])
  
  const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)
  
  const selectClasses = computed(() => {
    const classes = [
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'pr-10 pl-3 py-2 text-sm appearance-none'
    ]
    
    // Error state
    if (props.error) {
      classes.push('border-red-300 focus:border-red-500 focus:ring-red-500')
    } else {
      classes.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500')
    }
    
    return classes.join(' ')
  })
  
  const getOptionValue = (option) => {
    return typeof option === 'object' ? option[props.valueKey] : option
  }
  
  const getOptionLabel = (option) => {
    return typeof option === 'object' ? option[props.labelKey] : option
  }
  
  const handleChange = (event) => {
    const value = event.target.value
    emit('update:modelValue', value)
    emit('change', value)
  }
  </script>