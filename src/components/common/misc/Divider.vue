<template>
    <div
      :class="[
        'flex items-center',
        orientationClass,
        spacingClass
      ]"
    >
      <div
        v-if="label && labelPosition === 'left'"
        :class="labelClass"
      >
        {{ label }}
      </div>
  
      <div
        :class="[
          lineClass,
          orientation === 'vertical' ? 'h-full w-px' : 'flex-1 h-px'
        ]"
      />
  
      <div
        v-if="label && labelPosition === 'center'"
        :class="labelClass"
      >
        {{ label }}
      </div>
  
      <div
        v-if="label && (labelPosition === 'center' || labelPosition === 'right')"
        :class="[
          lineClass,
          orientation === 'vertical' ? 'h-full w-px' : 'flex-1 h-px'
        ]"
      />
  
      <div
        v-if="label && labelPosition === 'right'"
        :class="labelClass"
      >
        {{ label }}
      </div>
  
      <slot />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    label: {
      type: String,
      default: null
    },
    labelPosition: {
      type: String,
      default: 'center',
      validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    spacing: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: 'gray'
    },
    thickness: {
      type: String,
      default: 'thin',
      validator: (value) => ['thin', 'thick'].includes(value)
    },
    dashed: {
      type: Boolean,
      default: false
    }
  })
  
  const orientationClass = computed(() => {
    return props.orientation === 'vertical' 
      ? 'flex-col' 
      : 'flex-row'
  })
  
  const spacingClass = computed(() => {
    const spacings = {
      none: 'my-0',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6'
    }
    return props.orientation === 'horizontal' 
      ? spacings[props.spacing]
      : spacings[props.spacing].replace('my', 'mx')
  })
  
  const lineClass = computed(() => {
    const colors = {
      gray: 'bg-gray-200',
      blue: 'bg-blue-200',
      red: 'bg-red-200',
      green: 'bg-green-200',
      yellow: 'bg-yellow-200',
      purple: 'bg-purple-200'
    }
  
    const classes = [colors[props.color] || colors.gray]
    
    if (props.dashed) {
      classes.push('border-dashed', 'bg-transparent')
      classes.push(props.orientation === 'vertical' ? 'border-l' : 'border-t')
      classes.push(`border-${props.color}-300`)
    }
  
    if (props.thickness === 'thick') {
      classes.push(props.orientation === 'vertical' ? 'w-0.5' : 'h-0.5')
    }
  
    return classes.join(' ')
  })
  
  const labelClass = computed(() => {
    const position = props.orientation === 'horizontal'
      ? 'px-3'
      : 'py-3'
    
    return `text-sm text-gray-500 ${position}`
  })
  </script>