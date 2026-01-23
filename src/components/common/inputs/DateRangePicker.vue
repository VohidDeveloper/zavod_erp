<template>
    <div class="w-full">
      <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div class="grid grid-cols-2 gap-3">
        <!-- Start Date -->
        <div class="relative">
          <input
            type="date"
            :value="startDate"
            :max="endDate || max"
            :disabled="disabled"
            :required="required"
            :class="inputClasses"
            @input="handleStartDateChange"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="mt-1 text-xs text-gray-500">Boshlanish</p>
        </div>
        
        <!-- End Date -->
        <div class="relative">
          <input
            type="date"
            :value="endDate"
            :min="startDate || min"
            :disabled="disabled"
            :required="required"
            :class="inputClasses"
            @input="handleEndDateChange"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="mt-1 text-xs text-gray-500">Tugash</p>
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
      type: Object,
      default: () => ({ start: '', end: '' })
    },
    label: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
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
  
  const emit = defineEmits(['update:modelValue'])
  
  const startDate = computed(() => props.modelValue?.start || '')
  const endDate = computed(() => props.modelValue?.end || '')
  
  const inputClasses = computed(() => {
    const classes = [
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'px-3 py-2 text-sm pr-10'
    ]
    
    if (props.error) {
      classes.push('border-red-300 focus:border-red-500 focus:ring-red-500')
    } else {
      classes.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500')
    }
    
    return classes.join(' ')
  })
  
  const handleStartDateChange = (event) => {
    emit('update:modelValue', {
      start: event.target.value,
      end: endDate.value
    })
  }
  
  const handleEndDateChange = (event) => {
    emit('update:modelValue', {
      start: startDate.value,
      end: event.target.value
    })
  }
  </script>