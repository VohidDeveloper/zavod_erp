<template>
    <div
      v-show="isActive"
      :class="['tab-panel', panelClass]"
      role="tabpanel"
      :aria-hidden="!isActive"
    >
      <slot />
    </div>
  </template>
  
  <script setup>
  import { computed, inject } from 'vue'
  
  const props = defineProps({
    name: {
      type: [String, Number],
      required: true
    },
    panelClass: {
      type: String,
      default: ''
    }
  })
  
  const activeTab = inject('activeTab', null)
  
  const isActive = computed(() => {
    return activeTab?.value === props.name
  })
  </script>