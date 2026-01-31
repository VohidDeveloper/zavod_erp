<template>
    <tr
      :class="[
        'transition-colors',
        hoverable ? 'hover:bg-gray-50' : '',
        clickable ? 'cursor-pointer' : '',
        selected ? 'bg-blue-50' : '',
        rowClass
      ]"
      @click="handleClick"
    >
      <slot />
    </tr>
  </template>
  
  <script setup>
  const props = defineProps({
    hoverable: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    rowClass: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['click'])
  
  const handleClick = (event) => {
    if (props.clickable) {
      emit('click', event)
    }
  }
  </script>