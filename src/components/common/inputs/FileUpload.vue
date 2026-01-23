<template>
    <div class="w-full">
      <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div
        :class="[
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
        @click="handleClick"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          class="hidden"
          @change="handleFileChange"
        />
        
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p class="mt-2 text-sm text-gray-600">
          <span class="font-medium text-blue-600">Fayl tanlash</span> yoki shu yerga tashlang
        </p>
        
        <p v-if="accept" class="mt-1 text-xs text-gray-500">
          {{ acceptText }}
        </p>
        
        <p v-if="maxSize" class="text-xs text-gray-500">
          Maksimal: {{ formatBytes(maxSize) }}
        </p>
      </div>
      
      <!-- Selected files -->
      <div v-if="selectedFiles.length" class="mt-3 space-y-2">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
            </div>
          </div>
          
          <button
            type="button"
            @click="removeFile(index)"
            class="ml-3 text-red-500 hover:text-red-700"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
  import { ref, computed } from 'vue'
  import { formatBytes } from '@/utils/helpers'
  
  const props = defineProps({
    modelValue: {
      type: [File, Array],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: null
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
  
  const emit = defineEmits(['update:modelValue', 'error'])
  
  const fileInput = ref(null)
  const isDragging = ref(false)
  
  const selectedFiles = computed(() => {
    if (!props.modelValue) return []
    return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
  })
  
  const acceptText = computed(() => {
    if (!props.accept) return ''
    return props.accept.replace(/,/g, ', ')
  })
  
  const handleClick = () => {
    if (!props.disabled) {
      fileInput.value?.click()
    }
  }
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    validateAndEmitFiles(files)
  }
  
  const handleDragOver = () => {
    if (!props.disabled) {
      isDragging.value = true
    }
  }
  
  const handleDragLeave = () => {
    isDragging.value = false
  }
  
  const handleDrop = (event) => {
    isDragging.value = false
    if (props.disabled) return
    
    const files = Array.from(event.dataTransfer.files || [])
    validateAndEmitFiles(files)
  }
  
  const validateAndEmitFiles = (files) => {
    // Check file size
    if (props.maxSize) {
      const oversizedFile = files.find(file => file.size > props.maxSize)
      if (oversizedFile) {
        emit('error', `Fayl hajmi ${formatBytes(props.maxSize)} dan oshmasligi kerak`)
        return
      }
    }
    
    // Emit files
    if (props.multiple) {
      emit('update:modelValue', files)
    } else {
      emit('update:modelValue', files[0] || null)
    }
  }
  
  const removeFile = (index) => {
    if (props.multiple) {
      const files = [...selectedFiles.value]
      files.splice(index, 1)
      emit('update:modelValue', files)
    } else {
      emit('update:modelValue', null)
    }
  }
  </script>