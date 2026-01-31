<template>
    <span
      :class="[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        badgeClass,
        sizeClass
      ]"
    >
      <slot>{{ label }}</slot>
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { getStatusBadgeClass, getStatusLabel } from '@/utils/statusUtils'
  
  const props = defineProps({
    status: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    customClass: {
      type: String,
      default: ''
    }
  })
  
  const badgeClass = computed(() => {
    if (props.customClass) {
      return props.customClass
    }
    return getStatusBadgeClass(props.status)
  })
  
  const sizeClass = computed(() => {
    const sizes = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-0.5',
      lg: 'text-sm px-3 py-1'
    }
    return sizes[props.size]
  })
  
  const label = computed(() => {
    if (props.label) {
      return props.label
    }
    return getStatusLabel(props.status)
  })
  </script>