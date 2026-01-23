<template>
    <div :class="groupClasses">
      <slot />
    </div>
  </template>
  
  <script setup>
  import { computed, provide } from 'vue'
  
  const props = defineProps({
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    variant: {
      type: String,
      default: 'primary'
    },
    vertical: {
      type: Boolean,
      default: false
    }
  })
  
  // Provide size and variant to child buttons
  provide('buttonGroupSize', props.size)
  provide('buttonGroupVariant', props.variant)
  
  const groupClasses = computed(() => {
    const classes = ['inline-flex']
    
    if (props.vertical) {
      classes.push('flex-col')
    } else {
      classes.push('flex-row')
    }
    
    return classes.join(' ')
  })
  </script>
  
  <style scoped>
  /* First button */
  :deep(button:first-child) {
    @apply rounded-r-none;
  }
  
  /* Middle buttons */
  :deep(button:not(:first-child):not(:last-child)) {
    @apply rounded-none border-l-0;
  }
  
  /* Last button */
  :deep(button:last-child) {
    @apply rounded-l-none border-l-0;
  }
  
  /* Vertical mode */
  .flex-col :deep(button:first-child) {
    @apply rounded-b-none rounded-r-lg;
  }
  
  .flex-col :deep(button:not(:first-child):not(:last-child)) {
    @apply rounded-none border-t-0 border-l;
  }
  
  .flex-col :deep(button:last-child) {
    @apply rounded-t-none rounded-r-lg border-t-0 border-l;
  }
  </style>