<template>
    <div :class="['bg-white rounded-lg', containerClass]">
      <ul :class="['py-1', listClass]">
        <slot />
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    containerClass: {
      type: String,
      default: 'border border-gray-200 shadow-sm'
    },
    listClass: {
      type: String,
      default: ''
    }
  })
  </script>