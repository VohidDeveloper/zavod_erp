<template>
    <div ref="dropdownRef" class="relative inline-block">
      <!-- Trigger -->
      <div @click="toggle">
        <slot name="trigger">
          <button
            type="button"
            :class="[
              'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              buttonClass
            ]"
          >
            <slot name="button-content">
              {{ buttonText }}
            </slot>
            <ChevronDownIcon 
              :class="[
                'w-4 h-4 ml-2 transition-transform',
                isOpen ? 'rotate-180' : ''
              ]" 
            />
          </button>
        </slot>
      </div>
  
      <!-- Dropdown Menu -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            ref="menuRef"
            :class="[
              'absolute z-50 rounded-lg shadow-lg border border-gray-200 bg-white',
              widthClass
            ]"
            :style="menuStyle"
          >
            <div :class="['py-1', contentClass]">
              <slot />
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import { ChevronDownIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: 'Options'
    },
    buttonClass: {
      type: String,
      default: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    },
    placement: {
      type: String,
      default: 'bottom-start',
      validator: (value) => [
        'bottom-start',
        'bottom-end',
        'top-start',
        'top-end',
        'left-start',
        'right-start'
      ].includes(value)
    },
    width: {
      type: String,
      default: 'auto',
      validator: (value) => ['auto', 'trigger', 'sm', 'md', 'lg'].includes(value)
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    contentClass: {
      type: String,
      default: ''
    },
    offset: {
      type: Number,
      default: 4
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'open', 'close'])
  
  const dropdownRef = ref(null)
  const menuRef = ref(null)
  const isOpen = ref(props.modelValue)
  const menuStyle = ref({})
  
  const widthClass = computed(() => {
    const widths = {
      auto: 'min-w-[200px]',
      trigger: '',
      sm: 'w-48',
      md: 'w-56',
      lg: 'w-64'
    }
    return widths[props.width]
  })
  
  const calculatePosition = async () => {
    if (!dropdownRef.value || !menuRef.value) return
  
    await nextTick()
  
    const triggerRect = dropdownRef.value.getBoundingClientRect()
    const menuRect = menuRef.value.getBoundingClientRect()
    
    let top = 0
    let left = 0
  
    // Calculate position based on placement
    switch (props.placement) {
      case 'bottom-start':
        top = triggerRect.bottom + props.offset
        left = triggerRect.left
        break
      case 'bottom-end':
        top = triggerRect.bottom + props.offset
        left = triggerRect.right - menuRect.width
        break
      case 'top-start':
        top = triggerRect.top - menuRect.height - props.offset
        left = triggerRect.left
        break
      case 'top-end':
        top = triggerRect.top - menuRect.height - props.offset
        left = triggerRect.right - menuRect.width
        break
      case 'left-start':
        top = triggerRect.top
        left = triggerRect.left - menuRect.width - props.offset
        break
      case 'right-start':
        top = triggerRect.top
        left = triggerRect.right + props.offset
        break
    }
  
    // Keep within viewport
    const padding = 8
    top = Math.max(padding, Math.min(top, window.innerHeight - menuRect.height - padding))
    left = Math.max(padding, Math.min(left, window.innerWidth - menuRect.width - padding))
  
    // Set width if 'trigger' width
    const style = {
      top: `${top}px`,
      left: `${left}px`
    }
  
    if (props.width === 'trigger') {
      style.width = `${triggerRect.width}px`
    }
  
    menuStyle.value = style
  }
  
  const open = async () => {
    if (isOpen.value) return
    isOpen.value = true
    emit('update:modelValue', true)
    emit('open')
    
    await nextTick()
    calculatePosition()
  }
  
  const close = () => {
    if (!isOpen.value) return
    isOpen.value = false
    emit('update:modelValue', false)
    emit('close')
  }
  
  const toggle = () => {
    isOpen.value ? close() : open()
  }
  
  const handleClickOutside = (event) => {
    if (!dropdownRef.value || !menuRef.value) return
    
    if (
      !dropdownRef.value.contains(event.target) &&
      !menuRef.value.contains(event.target)
    ) {
      close()
    }
  }
  
  const handleMenuClick = (event) => {
    if (props.closeOnClick) {
      // Check if clicked element or its parent is a button/link
      const clickedElement = event.target.closest('button, a, [role="menuitem"]')
      if (clickedElement) {
        close()
      }
    }
  }
  
  watch(() => props.modelValue, (newVal) => {
    if (newVal !== isOpen.value) {
      newVal ? open() : close()
    }
  })
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', calculatePosition)
    window.addEventListener('scroll', calculatePosition, true)
    
    if (menuRef.value) {
      menuRef.value.addEventListener('click', handleMenuClick)
    }
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', calculatePosition)
    window.removeEventListener('scroll', calculatePosition, true)
    
    if (menuRef.value) {
      menuRef.value.removeEventListener('click', handleMenuClick)
    }
  })
  </script>