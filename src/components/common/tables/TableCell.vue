<template>
    <td
      :class="[
        'px-6 py-4 whitespace-nowrap',
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
        cellClass
      ]"
    >
      <slot />
    </td>
  </template>
  
  <script setup>
  defineProps({
    align: {
      type: String,
      default: 'left',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    cellClass: {
      type: String,
      default: ''
    }
  })
  </script>