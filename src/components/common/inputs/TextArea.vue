<template>
    <div class="w-full">
      <!-- Label -->
      <label
        v-if="label"
        :for="textareaId"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <!-- Textarea -->
      <textarea
        :id="textareaId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :maxlength="maxLength"
        :class="textareaClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      ></textarea>
      
      <!-- Character count & Helper text / Error -->
      <div class="mt-1 flex justify-between items-start">
        <p
          v-if="error || helperText"
          :class="[
            'text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          ]"
        >
          {{ error || helperText }}
        </p>
        
        <span
          v-if="showCount && maxLength"
          class="text-sm text-gray-500 ml-auto"
        >
          {{ characterCount }} / {{ maxLength }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 4
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
    maxLength: {
      type: Number,
      default: null
    },
    showCount: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'blur', 'focus'])
  
  const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)
  
  const characterCount = computed(() => props.modelValue?.length || 0)
  
  const textareaClasses = computed(() => {
    const classes = [
      'block w-full rounded-lg border transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'px-3 py-2 text-sm resize-none'
    ]
    
    // Error state
    if (props.error) {
      classes.push('border-red-300 focus:border-red-500 focus:ring-red-500')
    } else {
      classes.push('border-gray-300 focus:border-blue-500 focus:ring-blue-500')
    }
    
    return classes.join(' ')
  })
  
  const handleInput = (event) => {
    emit('update:modelValue', event.target.value)
  }
  </script>