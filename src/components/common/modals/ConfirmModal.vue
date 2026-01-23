<template>
    <BaseModal
      :show="show"
      :title="title"
      :size="size"
      @close="handleCancel"
    >
      <div class="text-sm text-gray-600">
        <slot>{{ message }}</slot>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton
            variant="outline"
            @click="handleCancel"
            :disabled="loading"
          >
            {{ cancelText }}
          </BaseButton>
          
          <BaseButton
            :variant="type === 'danger' ? 'danger' : 'primary'"
            @click="handleConfirm"
            :loading="loading"
          >
            {{ confirmText }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import BaseModal from './BaseModal.vue'
  import BaseButton from './BaseButton.vue'
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Tasdiqlash'
    },
    message: {
      type: String,
      default: 'Ushbu amalni bajarishni xohlaysizmi?'
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'sm'
    },
    confirmText: {
      type: String,
      default: 'Tasdiqlash'
    },
    cancelText: {
      type: String,
      default: 'Bekor qilish'
    }
  })
  
  const emit = defineEmits(['confirm', 'cancel', 'close'])
  
  const loading = ref(false)
  
  const handleConfirm = async () => {
    loading.value = true
    try {
      await emit('confirm')
    } finally {
      loading.value = false
    }
  }
  
  const handleCancel = () => {
    emit('cancel')
    emit('close')
  }
  </script>