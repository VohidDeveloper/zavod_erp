<template>
  <Modal
    v-model="isOpen"
    :title="title"
    size="sm"
    @close="handleCancel"
  >
    <!-- Message -->
    <div class="text-sm text-gray-600">
      <slot>
        {{ message }}
      </slot>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="handleCancel"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="loading"
          :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50',
            type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          ]"
        >
          {{ loading ? 'Yuklanmoqda...' : confirmText }}
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
    default: 'Tasdiqlash'
  },
  message: {
    type: String,
    default: 'Rostdan ham davom etmoqchimisiz?'
  },
  confirmText: {
    type: String,
    default: 'Tasdiqlash'
  },
  cancelText: {
    type: String,
    default: 'Bekor qilish'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'danger'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  isOpen.value = false
}
</script>