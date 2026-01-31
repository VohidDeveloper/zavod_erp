<template>
    <div ref="triggerRef" class="inline-block">
      <div @click="togglePopover" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <slot name="trigger" />
      </div>
  
      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="isOpen"
            ref="popoverRef"
            :class="[
              'absolute z-50 rounded-lg shadow-lg border',
              themeClass,
              sizeClass
            ]"
            :style="popoverStyle"
          >
            <!-- Arrow -->
            <div
              v-if="arrow"
              :class="[
                'absolute w-3 h-3 rotate-45 border',
                themeClass,
                arrowPositionClass
              ]"
            />
  
            <!-- Content -->
            <div class="relative">
              <!-- Header -->
              <div
                v-if="title || $slots.header"
                :class="[
                  'px-4 py-3 border-b',
                  themeClass === 'bg-white text-gray-900 border-gray-200'
                    ? 'border-gray-200'
                    : 'border-gray-700'
                ]"
              >
                <slot name="header">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold">{{ title }}</h3>
                    <button
                      v-if="closable"
                      @click="close"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </div>
                </slot>
              </div>
  
              <!-- Body -->
              <div :class="['px-4 py-3', contentClass]">
                <slot />
              </div>
  
              <!-- Footer -->
              <div
                v-if="$slots.footer"
                :class="[
                  'px-4 py-3 border-t',
                  themeClass === 'bg-white text-gray-900 border-gray-200'
                    ? 'border-gray-200'
                    : 'border-gray-700'
                ]"
              >
                <slot name="footer" />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    placement: {
      type: String,
      default: 'bottom',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    trigger: {
      type: String,
      default: 'click',
      validator: (value) => ['click', 'hover', 'manual'].includes(value)
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    arrow: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: false
    },
    offset: {
      type: Number,
      default: 8
    },
    contentClass: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'open', 'close'])
  
  const triggerRef = ref(null)
  const popoverRef = ref(null)
  const isOpen = ref(props.modelValue)
  const popoverStyle = ref({})
  
  const themeClass = computed(() => {
    return props.theme === 'dark'
      ? 'bg-gray-900 text-white border-gray-700'
      : 'bg-white text-gray-900 border-gray-200'
  })
  
  const sizeClass = computed(() => {
    const sizes = {
      sm: 'max-w-xs',
      md: 'max-w-sm',
      lg: 'max-w-md'
    }
    return sizes[props.size]
  })
  
  const arrowPositionClass = computed(() => {
    const positions = {
      top: '-bottom-1.5 left-1/2 -translate-x-1/2',
      bottom: '-top-1.5 left-1/2 -translate-x-1/2',
      left: '-right-1.5 top-1/2 -translate-y-1/2',
      right: '-left-1.5 top-1/2 -translate-y-1/2'
    }
    return positions[props.placement]
  })
  
  const calculatePosition = () => {
    if (!triggerRef.value || !popoverRef.value) return
  
    const triggerRect = triggerRef.value.getBoundingClientRect()
    const popoverRect = popoverRef.value.getBoundingClientRect()
    
    let top = 0
    let left = 0
  
    switch (props.placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - props.offset
        left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
        break
      case 'bottom':
        top = triggerRect.bottom + props.offset
        left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2)
        break
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
        left = triggerRect.left - popoverRect.width - props.offset
        break
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2)
        left = triggerRect.right + props.offset
        break
    }
  
    // Keep within viewport
    const padding = 8
    top = Math.max(padding, Math.min(top, window.innerHeight - popoverRect.height - padding))
    left = Math.max(padding, Math.min(left, window.innerWidth - popoverRect.width - padding))
  
    popoverStyle.value = {
      top: `${top}px`,
      left: `${left}px`
    }
  }
  
  const open = () => {
    if (isOpen.value) return
    isOpen.value = true
    emit('update:modelValue', true)
    emit('open')
    
    setTimeout(() => {
      calculatePosition()
    }, 0)
  }
  
  const close = () => {
    if (!isOpen.value) return
    isOpen.value = false
    emit('update:modelValue', false)
    emit('close')
  }
  
  const togglePopover = () => {
    if (props.trigger !== 'click') return
    isOpen.value ? close() : open()
  }
  
  let hoverTimeout = null
  
  const handleMouseEnter = () => {
    if (props.trigger !== 'hover') return
    clearTimeout(hoverTimeout)
    open()
  }
  
  const handleMouseLeave = () => {
    if (props.trigger !== 'hover') return
    hoverTimeout = setTimeout(() => {
      close()
    }, 100)
  }
  
  const handleClickOutside = (event) => {
    if (!triggerRef.value || !popoverRef.value) return
    
    if (
      !triggerRef.value.contains(event.target) &&
      !popoverRef.value.contains(event.target)
    ) {
      close()
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
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('resize', calculatePosition)
    window.removeEventListener('scroll', calculatePosition, true)
    clearTimeout(hoverTimeout)
  })
  </script>