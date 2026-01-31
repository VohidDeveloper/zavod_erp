<template>
    <component
      :is="component"
      :to="to"
      :href="href"
      :target="target"
      @click="handleClick"
      :class="[
        'flex items-center w-full px-4 py-2 text-sm transition-colors',
        disabled 
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-gray-700 hover:bg-gray-100 cursor-pointer',
        variant === 'danger' && !disabled ? 'text-red-600 hover:bg-red-50' : ''
      ]"
    >
      <component
        v-if="icon"
        :is="icon"
        :class="[
          'w-5 h-5 mr-3',
          disabled ? 'text-gray-400' : variant === 'danger' ? 'text-red-600' : 'text-gray-500'
        ]"
      />
      <span class="flex-1">{{ label }}</span>
      <span v-if="shortcut" class="ml-auto text-xs text-gray-500">{{ shortcut }}</span>
      <ChevronRightIcon v-if="hasSubmenu" class="w-4 h-4 ml-2 text-gray-400" />
    </component>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { ChevronRightIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    icon: {
      type: Object,
      default: null
    },
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    target: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'danger'].includes(value)
    },
    shortcut: {
      type: String,
      default: null
    },
    hasSubmenu: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['click'])
  
  const component = computed(() => {
    if (props.to) return 'router-link'
    if (props.href) return 'a'
    return 'button'
  })
  
  const handleClick = (event) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }
    emit('click', event)
  }
  </script>