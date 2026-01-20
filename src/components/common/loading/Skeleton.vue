<template>
    <div :class="skeletonClasses" :style="skeletonStyle" />
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'circular', 'rectangular'].includes(value)
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: undefined
    },
    animation: {
      type: String,
      default: 'pulse',
      validator: (value) => ['pulse', 'wave', 'none'].includes(value)
    }
  })
  
  const skeletonClasses = computed(() => {
    const animations = {
      pulse: 'animate-pulse',
      wave: 'skeleton',
      none: ''
    }
  
    return [
      'bg-gray-200 dark:bg-gray-700',
      animations[props.animation],
      {
        'rounded-full': props.variant === 'circular',
        'rounded': props.variant === 'rectangular',
        'rounded h-4': props.variant === 'text' && !props.height
      }
    ]
  })
  
  const skeletonStyle = computed(() => {
    const width = typeof props.width === 'number' ? `${props.width}px` : props.width
    const height = props.height 
      ? (typeof props.height === 'number' ? `${props.height}px` : props.height)
      : (props.variant === 'circular' ? width : undefined)
  
    return {
      width,
      height
    }
  })
  </script>