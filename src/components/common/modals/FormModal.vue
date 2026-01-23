<template>
    <BaseModal
      :show="show"
      :title="title"
      :size="size"
      @close="handleClose"
    >
      <form @submit.prevent="handleSubmit">
        <slot :loading="loading" />
        
        <template #footer>
          <div class="flex justify-end gap-3">
            <BaseButton
              type="button"
              variant="outline"
              @click="handleClose"
              :disabled="loading"
            >
              {{ cancelText }}
            </BaseButton>
            
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              {{ submitText }}
            </BaseButton>
          </div>
        </template>
      </form>
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
      required: true
    },
    size: {
      type: String,
      default: 'md'
    },
    submitText: {
      type: String,
      default: 'Saqlash'
    },
    cancelText: {
      type: String,
      default: 'Bekor qilish'
    }
  })
  
  const emit = defineEmits(['submit', 'close'])
  
  const loading = ref(false)
  
  const handleSubmit = async () => {
    loading.value = true
    try {
      await emit('submit')
    } finally {
      loading.value = false
    }
  }
  
  const handleClose = () => {
    if (!loading.value) {
      emit('close')
    }
  }
  </script>