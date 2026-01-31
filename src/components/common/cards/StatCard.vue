<template>
    <div
      :class="[
        'bg-white rounded-lg border border-gray-200 p-6',
        clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : '',
        cardClass
      ]"
      @click="handleClick"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <!-- Title -->
          <p class="text-sm font-medium text-gray-600">
            {{ title }}
          </p>
  
          <!-- Value -->
          <p :class="['text-3xl font-bold mt-2', getValueColor()]">
            {{ value }}
          </p>
  
          <!-- Change Indicator -->
          <div
            v-if="change !== null && change !== undefined"
            class="flex items-center mt-2 text-sm"
          >
            <component
              :is="change >= 0 ? ArrowUpIcon : ArrowDownIcon"
              :class="[
                'w-4 h-4 mr-1',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            />
            <span :class="change >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ Math.abs(change) }}%
            </span>
            <span v-if="changeLabel" class="text-gray-600 ml-1">
              {{ changeLabel }}
            </span>
          </div>
  
          <!-- Footer Slot -->
          <div v-if="$slots.footer" class="mt-3">
            <slot name="footer" />
          </div>
        </div>
  
        <!-- Icon -->
        <div
          v-if="icon"
          :class="[
            'flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full',
            getIconBgColor()
          ]"
        >
          <component
            :is="icon"
            :class="['w-6 h-6', getIconColor()]"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: Object,
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
        'orange',
        'gray'
      ].includes(value)
    },
    change: {
      type: Number,
      default: null
    },
    changeLabel: {
      type: String,
      default: null
    },
    clickable: {
      type: Boolean,
      default: false
    },
    cardClass: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['click'])
  
  const getValueColor = () => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      gray: 'text-gray-900'
    }
    return colors[props.color] || colors.blue
  }
  
  const getIconBgColor = () => {
    const colors = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      red: 'bg-red-100',
      yellow: 'bg-yellow-100',
      purple: 'bg-purple-100',
      orange: 'bg-orange-100',
      gray: 'bg-gray-100'
    }
    return colors[props.color] || colors.blue
  }
  
  const getIconColor = () => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600'
    }
    return colors[props.color] || colors.blue
  }
  
  const handleClick = () => {
    if (props.clickable) {
      emit('click')
    }
  }
  </script>