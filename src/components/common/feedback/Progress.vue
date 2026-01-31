<template>
    <div class="w-full">
      <!-- Label -->
      <div
        v-if="label || showPercentage"
        class="flex items-center justify-between mb-2"
      >
        <span v-if="label" class="text-sm font-medium text-gray-700">
          {{ label }}
        </span>
        <span
          v-if="showPercentage"
          :class="[
            'text-sm font-medium',
            getPercentageColor()
          ]"
        >
          {{ Math.round(percentage) }}%
        </span>
      </div>
  
      <!-- Progress Bar -->
      <div
        :class="[
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClass
        ]"
      >
        <div
          :class="[
            'h-full rounded-full transition-all duration-300 ease-out',
            getBarColor(),
            striped ? 'progress-striped' : '',
            animated ? 'progress-animated' : ''
          ]"
          :style="{ width: `${Math.min(percentage, 100)}%` }"
          role="progressbar"
          :aria-valuenow="percentage"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <!-- Inner Label -->
          <span
            v-if="showInnerLabel && percentage > 10"
            class="flex items-center justify-center h-full text-xs font-medium text-white px-2"
          >
            {{ Math.round(percentage) }}%
          </span>
        </div>
      </div>
  
      <!-- Status Text -->
      <p
        v-if="statusText"
        class="mt-2 text-xs text-gray-600"
      >
        {{ statusText }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100
    },
    label: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'blue',
      validator: (value) => [
        'blue',
        'green',
        'red',
        'yellow',
        'purple',
        'gray'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
    },
    showPercentage: {
      type: Boolean,
      default: true
    },
    showInnerLabel: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    statusText: {
      type: String,
      default: null
    }
  })
  
  const percentage = computed(() => {
    return (props.value / props.max) * 100
  })
  
  const sizeClass = computed(() => {
    const sizes = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    }
    return sizes[props.size]
  })
  
  const getBarColor = () => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-600',
      gray: 'bg-gray-600'
    }
    return colors[props.color] || colors.blue
  }
  
  const getPercentageColor = () => {
    if (percentage.value >= 100) return 'text-green-600'
    if (percentage.value >= 75) return 'text-blue-600'
    if (percentage.value >= 50) return 'text-yellow-600'
    return 'text-gray-600'
  }
  </script>
  
  <style scoped>
  .progress-striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }
  
  .progress-animated {
    animation: progress-stripes 1s linear infinite;
  }
  
  @keyframes progress-stripes {
    0% {
      background-position: 1rem 0;
    }
    100% {
      background-position: 0 0;
    }
  }
  </style>