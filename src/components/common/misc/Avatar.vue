<template>
    <div
      :class="[
        'relative inline-flex items-center justify-center flex-shrink-0 font-medium',
        sizeClass,
        shapeClass,
        src ? '' : colorClass
      ]"
    >
      <!-- Image Avatar -->
      <img
        v-if="src"
        :src="src"
        :alt="alt"
        :class="['w-full h-full object-cover', shapeClass]"
        @error="handleImageError"
      />
  
      <!-- Initials Avatar -->
      <span
        v-else-if="initials"
        :class="['select-none', textSizeClass]"
      >
        {{ initials }}
      </span>
  
      <!-- Icon Avatar -->
      <component
        v-else-if="icon"
        :is="icon"
        :class="iconSizeClass"
      />
  
      <!-- Default Icon -->
      <UserIcon
        v-else
        :class="iconSizeClass"
      />
  
      <!-- Status Indicator -->
      <span
        v-if="status"
        :class="[
          'absolute rounded-full ring-2 ring-white',
          statusSizeClass,
          statusPositionClass,
          statusColorClass
        ]"
      />
  
      <!-- Badge/Count -->
      <span
        v-if="badge || count"
        :class="[
          'absolute flex items-center justify-center font-bold text-white bg-red-500 rounded-full ring-2 ring-white',
          badgeSizeClass,
          badgePositionClass
        ]"
      >
        {{ badge || (count > 99 ? '99+' : count) }}
      </span>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  import { UserIcon } from '@heroicons/vue/24/solid'
  
  const props = defineProps({
    src: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: 'Avatar'
    },
    name: {
      type: String,
      default: null
    },
    icon: {
      type: Object,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
    },
    shape: {
      type: String,
      default: 'circle',
      validator: (value) => ['circle', 'rounded', 'square'].includes(value)
    },
    color: {
      type: String,
      default: 'blue'
    },
    status: {
      type: String,
      default: null,
      validator: (value) => !value || ['online', 'offline', 'away', 'busy'].includes(value)
    },
    badge: {
      type: String,
      default: null
    },
    count: {
      type: Number,
      default: null
    }
  })
  
  const imageError = ref(false)
  
  const initials = computed(() => {
    if (!props.name) return null
    const parts = props.name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  })
  
  const sizeClass = computed(() => {
    const sizes = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
      '2xl': 'w-16 h-16'
    }
    return sizes[props.size]
  })
  
  const textSizeClass = computed(() => {
    const sizes = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
      '2xl': 'text-xl'
    }
    return sizes[props.size]
  })
  
  const iconSizeClass = computed(() => {
    const sizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
      '2xl': 'w-8 h-8'
    }
    return sizes[props.size]
  })
  
  const shapeClass = computed(() => {
    const shapes = {
      circle: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none'
    }
    return shapes[props.shape]
  })
  
  const colorClass = computed(() => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      gray: 'bg-gray-200 text-gray-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600'
    }
    return colors[props.color] || colors.blue
  })
  
  const statusSizeClass = computed(() => {
    const sizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
      '2xl': 'w-4 h-4'
    }
    return sizes[props.size]
  })
  
  const statusPositionClass = computed(() => {
    return props.shape === 'circle' ? 'bottom-0 right-0' : 'bottom-0.5 right-0.5'
  })
  
  const statusColorClass = computed(() => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    }
    return colors[props.status]
  })
  
  const badgeSizeClass = computed(() => {
    const sizes = {
      xs: 'w-3 h-3 text-[8px]',
      sm: 'w-4 h-4 text-[9px]',
      md: 'w-5 h-5 text-[10px]',
      lg: 'w-5 h-5 text-xs',
      xl: 'w-6 h-6 text-xs',
      '2xl': 'w-7 h-7 text-sm'
    }
    return sizes[props.size]
  })
  
  const badgePositionClass = computed(() => {
    return props.shape === 'circle' ? '-top-1 -right-1' : 'top-0 right-0'
  })
  
  const handleImageError = () => {
    imageError.value = true
  }
  </script>