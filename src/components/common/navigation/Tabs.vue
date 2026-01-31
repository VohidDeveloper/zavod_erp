<template>
    <div class="w-full">
      <!-- Tabs Navigation -->
      <div
        :class="[
          'border-b border-gray-200',
          variant === 'pills' ? 'border-0' : ''
        ]"
      >
        <nav
          :class="[
            'flex',
            variant === 'pills' ? 'space-x-2' : '-mb-px space-x-8'
          ]"
          aria-label="Tabs"
        >
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="selectTab(index)"
            :disabled="tab.disabled"
            :class="[
              'flex items-center py-2 px-1 text-sm font-medium transition-colors',
              getTabClasses(index, tab)
            ]"
            :aria-current="currentTab === index ? 'page' : undefined"
          >
            <!-- Icon -->
            <component
              v-if="tab.icon"
              :is="tab.icon"
              :class="[
                'w-5 h-5',
                tab.label ? 'mr-2' : '',
                currentTab === index
                  ? variant === 'pills' ? 'text-white' : 'text-blue-600'
                  : 'text-gray-500'
              ]"
            />
            
            <!-- Label -->
            <span v-if="tab.label">{{ tab.label }}</span>
            
            <!-- Badge -->
            <span
              v-if="tab.badge !== undefined"
              :class="[
                'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
                currentTab === index
                  ? variant === 'pills' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>
  
      <!-- Tab Content -->
      <div class="mt-4">
        <slot :name="`tab-${currentTab}`">
          <slot />
        </slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    tabs: {
      type: Array,
      required: true,
      validator: (tabs) => tabs.every(tab => tab.label || tab.icon)
    },
    modelValue: {
      type: Number,
      default: 0
    },
    variant: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'pills'].includes(value)
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'change'])
  
  const currentTab = ref(props.modelValue)
  
  const getTabClasses = (index, tab) => {
    const isActive = currentTab.value === index
    const isDisabled = tab.disabled
  
    if (isDisabled) {
      return 'opacity-50 cursor-not-allowed'
    }
  
    if (props.variant === 'pills') {
      return isActive
        ? 'bg-blue-600 text-white rounded-lg px-4'
        : 'text-gray-700 hover:bg-gray-100 rounded-lg px-4'
    }
  
    // Line variant
    return isActive
      ? 'border-b-2 border-blue-600 text-blue-600'
      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
  }
  
  const selectTab = (index) => {
    if (props.tabs[index].disabled) return
    
    currentTab.value = index
    emit('update:modelValue', index)
    emit('change', index, props.tabs[index])
  }
  
  watch(() => props.modelValue, (newVal) => {
    currentTab.value = newVal
  })
  </script>