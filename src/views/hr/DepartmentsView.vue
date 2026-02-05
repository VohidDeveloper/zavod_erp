<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bo'limlar</h1>
          <p class="text-gray-600 mt-1">Tashkilot bo'limlari boshqaruvi</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi bo'lim
        </button>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
        <button @click="fetchDepartments" class="mt-2 text-sm text-red-600 hover:text-red-700">
          Qayta urinish
        </button>
      </div>
  
      <!-- Departments Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="department in departments"
          :key="department.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ department.name }}</h3>
                <p class="text-sm text-gray-600">{{ department.employee_count || 0 }} xodim</p>
              </div>
            </div>
          </div>
  
          <div v-if="department.description" class="mb-4">
            <p class="text-sm text-gray-600">{{ department.description }}</p>
          </div>
  
          <div class="flex space-x-2 pt-4 border-t">
            <button
              @click="editDepartment(department)"
              class="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Tahrirlash
            </button>
            <button
              @click="confirmDelete(department)"
              class="px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="departments.length === 0 && !loading" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Bo'lim topilmadi</h3>
        <p class="text-gray-600 mb-4">Yangi bo'lim qo'shing</p>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi bo'lim
        </button>
      </div>
  
      <!-- Add/Edit Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
              {{ editingDepartment ? 'Bo\'limni tahrirlash' : 'Yangi bo\'lim' }}
            </h3>
  
            <form @submit.prevent="saveDepartment" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomi <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="departmentForm.name"
                  type="text"
                  placeholder="Bo'lim nomi"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  v-model="departmentForm.description"
                  rows="3"
                  placeholder="Bo'lim haqida qo'shimcha ma'lumot..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
  
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useHRStore } from '@/stores/hr'
  
  const hrStore = useHRStore()
  
  const showAddModal = ref(false)
  const editingDepartment = ref(null)
  const saving = ref(false)
  
  const departmentForm = reactive({
    name: '',
    description: ''
  })
  
  const loading = computed(() => hrStore.loading)
  const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
  const departments = computed(() => hrStore.departments)
  
  async function fetchDepartments() {
    try {
      await hrStore.fetchDepartments()
    } catch (err) {
      console.error('Failed to fetch departments:', err)
    }
  }
  
  function editDepartment(department) {
    editingDepartment.value = department
    Object.assign(departmentForm, {
      name: department.name,
      description: department.description || ''
    })
    showAddModal.value = true
  }
  
  function closeModal() {
    showAddModal.value = false
    editingDepartment.value = null
    Object.assign(departmentForm, {
      name: '',
      description: ''
    })
  }
  
  async function saveDepartment() {
    saving.value = true
    try {
      if (editingDepartment.value) {
        await hrStore.updateDepartment(editingDepartment.value.id, departmentForm)
      } else {
        await hrStore.createDepartment(departmentForm)
      }
      closeModal()
      await fetchDepartments()
    } catch (err) {
      console.error('Failed to save department:', err)
    } finally {
      saving.value = false
    }
  }
  
  async function confirmDelete(department) {
    if (!confirm(`"${department.name}" bo'limini o'chirishga ishonchingiz komilmi?`)) return
  
    try {
      await hrStore.deleteDepartment(department.id)
      await fetchDepartments()
    } catch (err) {
      console.error('Failed to delete department:', err)
    }
  }
  
  onMounted(() => {
    fetchDepartments()
  })
  </script>