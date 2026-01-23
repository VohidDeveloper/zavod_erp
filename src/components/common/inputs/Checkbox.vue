<template>
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          :id="checkboxId"
          type="checkbox"
          :checked="modelValue"
          :disabled="disabled"
          :class="checkboxClasses"
          @change="handleChange"
        />
      </div>
      
      <div v-if="label || $slots.default" class="ml-3">
        <label :for="checkboxId" class="text-sm font-medium text-gray-700 cursor-pointer">
          <slot>{{ label }}</slot>
        </label>
        <p v-if="description" class="text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'change'])
  
  const checkboxId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`)
  
  const checkboxClasses = computed(() => {
    return [
      'h-4 w-4 rounded border-gray-300 transition-colors duration-200',
      'text-blue-600 focus:ring-2 focus:ring-blue-500',
      'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
    ].join(' ')
  })
  
  const handleChange = (event) => {
    const checked = event.target.checked
    emit('update:modelValue', checked)
    emit('change', checked)
  }
  </script>