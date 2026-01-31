<template>
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <!-- Icon -->
      <component
        v-if="icon"
        :is="icon"
        :class="[
          'mb-4',
          iconSize === 'sm' ? 'w-12 h-12' : 
          iconSize === 'lg' ? 'w-20 h-20' : 
          'w-16 h-16',
          iconColor || 'text-gray-400'
        ]"
      />
      <InboxIcon
        v-else
        :class="[
          'mb-4',
          iconSize === 'sm' ? 'w-12 h-12' : 
          iconSize === 'lg' ? 'w-20 h-20' : 
          'w-16 h-16',
          'text-gray-400'
        ]"
      />
  
      <!-- Title -->
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ title || 'Ma\'lumot topilmadi' }}
      </h3>
  
      <!-- Description -->
      <p v-if="description" class="text-sm text-gray-600 text-center max-w-md mb-4">
        {{ description }}
      </p>
  
      <!-- Slot for custom content -->
      <slot />
  
      <!-- Action Button -->
      <button
        v-if="buttonText"
        @click="$emit('action')"
        :class="[
          'mt-4 px-4 py-2 rounded-lg font-medium transition-colors',
          buttonVariant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
          buttonVariant === 'secondary' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' :
          'border border-gray-300 text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ buttonText }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { InboxIcon } from '@heroicons/vue/24/outline'
  
  defineProps({
    icon: {
      type: Object,
      default: null
    },
    iconSize: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    iconColor: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Ma\'lumot topilmadi'
    },
    description: {
      type: String,
      default: null
    },
    buttonText: {
      type: String,
      default: null
    },
    buttonVariant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
    }
  })
  
  defineEmits(['action'])
  </script>