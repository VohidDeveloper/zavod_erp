<template>
    <div :class="['flex flex-col items-center justify-center', paddingClass]">
      <!-- Icon -->
      <div
        v-if="showIcon"
        :class="[
          'mb-4 rounded-full flex items-center justify-center',
          size === 'sm' ? 'w-12 h-12' :
          size === 'lg' ? 'w-20 h-20' :
          'w-16 h-16',
          iconBgColor || 'bg-gray-100'
        ]"
      >
        <component
          v-if="icon"
          :is="icon"
          :class="[
            size === 'sm' ? 'w-6 h-6' :
            size === 'lg' ? 'w-10 h-10' :
            'w-8 h-8',
            iconColor || 'text-gray-400'
          ]"
        />
        <InboxIcon
          v-else
          :class="[
            size === 'sm' ? 'w-6 h-6' :
            size === 'lg' ? 'w-10 h-10' :
            'w-8 h-8',
            'text-gray-400'
          ]"
        />
      </div>
  
      <!-- Title -->
      <h3
        v-if="title"
        :class="[
          'font-semibold text-gray-900 mb-2',
          size === 'sm' ? 'text-base' :
          size === 'lg' ? 'text-xl' :
          'text-lg'
        ]"
      >
        {{ title }}
      </h3>
  
      <!-- Description -->
      <p
        v-if="description"
        :class="[
          'text-gray-600 text-center mb-4',
          size === 'sm' ? 'text-xs max-w-xs' :
          size === 'lg' ? 'text-base max-w-lg' :
          'text-sm max-w-md'
        ]"
      >
        {{ description }}
      </p>
  
      <!-- Default Slot -->
      <slot />
  
      <!-- Actions -->
      <div v-if="$slots.actions || primaryAction || secondaryAction" class="flex items-center gap-3 mt-4">
        <slot name="actions">
          <button
            v-if="secondaryAction"
            @click="$emit('secondary-action')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {{ secondaryAction }}
          </button>
          <button
            v-if="primaryAction"
            @click="$emit('primary-action')"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ primaryAction }}
          </button>
        </slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { InboxIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    icon: {
      type: Object,
      default: null
    },
    iconColor: {
      type: String,
      default: null
    },
    iconBgColor: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Ma\'lumot topilmadi'
    },
    description: {
      type: String,
      default: null
    },
    primaryAction: {
      type: String,
      default: null
    },
    secondaryAction: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    padding: {
      type: String,
      default: 'default',
      validator: (value) => ['none', 'sm', 'default', 'lg'].includes(value)
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  })
  
  defineEmits(['primary-action', 'secondary-action'])
  
  const paddingClass = computed(() => {
    const classes = {
      none: 'p-0',
      sm: 'py-6 px-4',
      default: 'py-12 px-4',
      lg: 'py-16 px-6'
    }
    return classes[props.padding]
  })
  </script>