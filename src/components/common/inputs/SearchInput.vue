<template>
    <div class="relative">
      <!-- Search icon -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- Input -->
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="handleInput"
      />
      
      <!-- Clear button -->
      <button
        v-if="modelValue && !disabled"
        type="button"
        @click="handleClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { debounce } from '@/utils/helpers'
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Qidirish...'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 300
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'search', 'clear'])
  
  const debouncedSearch = debounce((value) => {
    emit('search', value)
  }, props.debounce)
  
  const handleInput = (event) => {
    const value = event.target.value
    emit('update:modelValue', value)
    debouncedSearch(value)
  }
  
  const handleClear = () => {
    emit('update:modelValue', '')
    emit('clear')
    emit('search', '')
  }
  </script>