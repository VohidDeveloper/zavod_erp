<template>
    <div class="w-full">
      <nav aria-label="Progress">
        <ol
          :class="[
            'flex',
            orientation === 'vertical' ? 'flex-col space-y-4' : 'items-center'
          ]"
        >
          <li
            v-for="(step, index) in steps"
            :key="index"
            :class="[
              'relative',
              orientation === 'horizontal' ? 'flex-1' : 'w-full'
            ]"
          >
            <!-- Connector Line -->
            <div
              v-if="index < steps.length - 1"
              :class="[
                'absolute',
                orientation === 'vertical'
                  ? 'left-4 top-12 bottom-0 w-0.5 h-full'
                  : 'left-1/2 top-4 right-0 h-0.5 w-full',
                index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              ]"
              aria-hidden="true"
            />
  
            <!-- Step Content -->
            <div
              :class="[
                'relative flex items-start group',
                clickable && 'cursor-pointer'
              ]"
              @click="handleStepClick(index)"
            >
              <!-- Step Circle/Icon -->
              <div class="flex items-center">
                <div
                  :class="[
                    'relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                    getStepClasses(index)
                  ]"
                >
                  <!-- Completed -->
                  <CheckIcon
                    v-if="index < currentStep"
                    class="w-5 h-5 text-white"
                  />
                  <!-- Current/Upcoming -->
                  <span
                    v-else
                    :class="[
                      'text-sm font-medium',
                      index === currentStep ? 'text-white' : 'text-gray-500'
                    ]"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
              </div>
  
              <!-- Step Details -->
              <div
                :class="[
                  orientation === 'horizontal'
                    ? 'ml-3 text-left'
                    : 'ml-4 min-w-0 flex-1'
                ]"
              >
                <div
                  :class="[
                    'text-sm font-medium transition-colors',
                    index === currentStep
                      ? 'text-blue-600'
                      : index < currentStep
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  ]"
                >
                  {{ step.title }}
                </div>
                <div
                  v-if="step.description"
                  class="text-xs text-gray-500 mt-1"
                >
                  {{ step.description }}
                </div>
              </div>
            </div>
          </li>
        </ol>
      </nav>
  
      <!-- Navigation Buttons -->
      <div
        v-if="showButtons"
        class="flex items-center justify-between mt-8"
      >
        <button
          v-if="currentStep > 0"
          @click="previousStep"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Orqaga
        </button>
        <div v-else></div>
  
        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="loading || !canProceed"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Yuklanmoqda...' : 'Keyingi' }}
        </button>
        <button
          v-else
          @click="finish"
          :disabled="loading || !canProceed"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {{ loading ? 'Yuklanmoqda...' : 'Tugatish' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { CheckIcon } from '@heroicons/vue/24/solid'
  
  const props = defineProps({
    steps: {
      type: Array,
      required: true,
      validator: (steps) => steps.every(step => step.title)
    },
    modelValue: {
      type: Number,
      default: 0
    },
    orientation: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    canProceed: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'change', 'finish'])
  
  const currentStep = computed(() => props.modelValue)
  
  const getStepClasses = (index) => {
    if (index < currentStep.value) {
      return 'bg-blue-600 border-blue-600'
    } else if (index === currentStep.value) {
      return 'bg-blue-600 border-blue-600'
    } else {
      return 'bg-white border-gray-300'
    }
  }
  
  const handleStepClick = (index) => {
    if (!props.clickable) return
    if (index > currentStep.value && !props.canProceed) return
    
    emit('update:modelValue', index)
    emit('change', index)
  }
  
  const nextStep = () => {
    if (currentStep.value < props.steps.length - 1) {
      const newStep = currentStep.value + 1
      emit('update:modelValue', newStep)
      emit('change', newStep)
    }
  }
  
  const previousStep = () => {
    if (currentStep.value > 0) {
      const newStep = currentStep.value - 1
      emit('update:modelValue', newStep)
      emit('change', newStep)
    }
  }
  
  const finish = () => {
    emit('finish')
  }
  </script>