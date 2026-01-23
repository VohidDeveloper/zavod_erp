<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-600">{{ title }}</h3>
        <component v-if="icon" :is="icon" class="w-5 h-5 text-gray-400" />
      </div>
      
      <div class="flex items-baseline justify-between">
        <p class="text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
        
        <div v-if="trend" class="flex items-center">
          <svg
            v-if="trend.direction === 'up'"
            class="w-4 h-4"
            :class="trend.positive ? 'text-green-500' : 'text-red-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <svg
            v-else
            class="w-4 h-4"
            :class="trend.positive ? 'text-green-500' : 'text-red-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span
            :class="[
              'ml-1 text-sm font-medium',
              trend.positive ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ trend.value }}
          </span>
        </div>
      </div>
      
      <p v-if="subtitle" class="mt-2 text-sm text-gray-500">{{ subtitle }}</p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { formatNumber, formatCurrency, formatPercent } from '@/utils/numberUtils'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    format: {
      type: String,
      default: 'number',
      validator: (value) => ['number', 'currency', 'percent', 'text'].includes(value)
    },
    icon: {
      type: Object,
      default: null
    },
    subtitle: {
      type: String,
      default: ''
    },
    trend: {
      type: Object,
      default: null
      // { value: '+12%', direction: 'up', positive: true }
    }
  })
  
  const formattedValue = computed(() => {
    switch (props.format) {
      case 'currency':
        return formatCurrency(props.value)
      case 'number':
        return formatNumber(props.value)
      case 'percent':
        return formatPercent(props.value)
      default:
        return props.value
    }
  })
  </script>