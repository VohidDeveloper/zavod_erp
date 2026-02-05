<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Kategoriyalar</h1>
          <p class="text-gray-600 mt-1">Moliyaviy kategoriyalar boshqaruvi</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi kategoriya
        </button>
      </div>
  
      <!-- Filter Tabs -->
      <div class="flex items-center space-x-4">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            activeFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
        <button @click="fetchCategories" class="mt-2 text-sm text-red-600 hover:text-red-700">
          Qayta urinish
        </button>
      </div>
  
      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer"
          @click="viewCategory(category)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                category.category_type === 'income' ? 'bg-green-100' : 'bg-red-100'
              ]">
                <svg 
                  :class="[
                    'w-6 h-6',
                    category.category_type === 'income' ? 'text-green-600' : 'text-red-600'
                  ]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    :d="category.category_type === 'income' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" 
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ category.name }}</h3>
                <p class="text-sm text-gray-600">
                  {{ category.category_type === 'income' ? 'Kirim' : 'Chiqim' }}
                </p>
              </div>
            </div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="category.category_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ category.category_type === 'income' ? 'Tushum' : 'Xarajat' }}
            </span>
          </div>
  
          <div v-if="category.description" class="mb-4">
            <p class="text-sm text-gray-600">{{ category.description }}</p>
          </div>
  
          <div class="flex space-x-2 pt-4 border-t">
            <button
              @click.stop="editCategory(category)"
              class="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Tahrirlash
            </button>
            <button
              @click.stop="confirmDelete(category)"
              class="px-3 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              O'chirish
            </button>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="filteredCategories.length === 0 && !loading" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Kategoriya topilmadi</h3>
        <p class="text-gray-600 mb-4">Yangi kategoriya qo'shing</p>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi kategoriya
        </button>
      </div>
  
      <!-- Add/Edit Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">
              {{ editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya' }}
            </h3>
  
            <form @submit.prevent="saveCategory" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Turi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <div
                    @click="categoryForm.category_type = 'income'"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      categoryForm.category_type === 'income'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    ]"
                  >
                    <p :class="[
                      'text-sm font-medium',
                      categoryForm.category_type === 'income' ? 'text-green-900' : 'text-gray-700'
                    ]">
                      Kirim
                    </p>
                  </div>
  
                  <div
                    @click="categoryForm.category_type = 'expense'"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      categoryForm.category_type === 'expense'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    ]"
                  >
                    <p :class="[
                      'text-sm font-medium',
                      categoryForm.category_type === 'expense' ? 'text-red-900' : 'text-gray-700'
                    ]">
                      Chiqim
                    </p>
                  </div>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomi <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  placeholder="Kategoriya nomi"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  v-model="categoryForm.description"
                  rows="2"
                  placeholder="Qo'shimcha ma'lumot..."
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
  import { useRouter } from 'vue-router'
  import { useFinanceStore } from '@/stores/finance'
  
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const activeFilter = ref('all')
  const showAddModal = ref(false)
  const editingCategory = ref(null)
  const saving = ref(false)
  
  const filters = [
    { value: 'all', label: 'Barchasi' },
    { value: 'income', label: 'Kirim' },
    { value: 'expense', label: 'Chiqim' }
  ]
  
  const categoryForm = reactive({
    name: '',
    description: '',
    category_type: 'income'
  })
  
  const loading = computed(() => financeStore.loading)
  const error = computed(() => financeStore.error?.detail || financeStore.error?.message || null)
  const categories = computed(() => financeStore.categories)
  
  const filteredCategories = computed(() => {
    if (activeFilter.value === 'all') return categories.value
    return categories.value.filter(cat => cat.category_type === activeFilter.value)
  })
  
  async function fetchCategories() {
    try {
      await financeStore.fetchCategories()
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }
  
  function viewCategory(category) {
    // Could navigate to category details or show modal
    console.log('View category:', category)
  }
  
  function editCategory(category) {
    editingCategory.value = category
    Object.assign(categoryForm, {
      name: category.name,
      description: category.description || '',
      category_type: category.category_type
    })
    showAddModal.value = true
  }
  
  function closeModal() {
    showAddModal.value = false
    editingCategory.value = null
    Object.assign(categoryForm, {
      name: '',
      description: '',
      category_type: 'income'
    })
  }
  
  async function saveCategory() {
    saving.value = true
    try {
      if (editingCategory.value) {
        await financeStore.updateCategory(editingCategory.value.id, categoryForm)
      } else {
        await financeStore.createCategory(categoryForm)
      }
      closeModal()
      await fetchCategories()
    } catch (err) {
      console.error('Failed to save category:', err)
    } finally {
      saving.value = false
    }
  }
  
  async function confirmDelete(category) {
    if (!confirm(`"${category.name}" kategoriyasini o'chirishga ishonchingiz komilmi?`)) return
  
    try {
      await financeStore.deleteCategory(category.id)
      await fetchCategories()
    } catch (err) {
      console.error('Failed to delete category:', err)
    }
  }
  
  onMounted(() => {
    fetchCategories()
  })
  </script>