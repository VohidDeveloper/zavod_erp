<template>
  <Modal
    v-model="isOpen"
    :title="title"
    :size="size"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <slot />
    </form>

    <template #footer>
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="loading || disabled"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Yuklanmoqda...' : submitText }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  submitText: {
    type: String,
    default: 'Saqlash'
  },
  size: {
    type: String,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleSubmit = () => {
  emit('submit')
}

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}
</script>