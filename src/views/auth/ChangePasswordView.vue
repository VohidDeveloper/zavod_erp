<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Parolni o'zgartirish</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Old Password -->
        <div>
          <label for="old_password" class="block text-sm font-medium text-gray-700 mb-2">
            Eski parol *
          </label>
          <input
            id="old_password"
            v-model="form.old_password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.old_password }"
          />
          <p v-if="errors.old_password" class="mt-1 text-sm text-red-600">
            {{ errors.old_password }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label for="new_password" class="block text-sm font-medium text-gray-700 mb-2">
            Yangi parol *
          </label>
          <input
            id="new_password"
            v-model="form.new_password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.new_password }"
          />
          <p v-if="errors.new_password" class="mt-1 text-sm text-red-600">
            {{ errors.new_password }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Kamida 8 ta belgi, katta va kichik harflar, raqam va maxsus belgi
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirm_password" class="block text-sm font-medium text-gray-700 mb-2">
            Parolni tasdiqlang *
          </label>
          <input
            id="confirm_password"
            v-model="form.confirm_password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.confirm_password }"
          />
          <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">
            {{ errors.confirm_password }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {{ loading ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import { useRouter } from 'vue-router'
import { changePasswordSchema } from '@/utils/validators'

const router = useRouter()
const { changePassword } = useAuth()
const notifications = useNotifications()

const form = reactive({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

const errors = reactive({})
const loading = ref(false)

const handleSubmit = async () => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Validate
  try {
    await changePasswordSchema.validate(form, { abortEarly: false })
  } catch (error) {
    error.inner.forEach(err => {
      errors[err.path] = err.message
    })
    return
  }

  loading.value = true

  try {
    await changePassword({
      old_password: form.old_password,
      new_password: form.new_password,
    })

    notifications.success('Parol muvaffaqiyatli o\'zgartirildi!')
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors)
    } else {
      notifications.error(error.response?.data?.detail || 'Xatolik yuz berdi')
    }
  } finally {
    loading.value = false
  }
}
</script>