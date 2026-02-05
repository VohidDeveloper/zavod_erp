<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEdit ? 'Xodimni tahrirlash' : 'Yangi xodim' }}
            </h1>
            <p class="text-gray-600 mt-1">Xodim ma'lumotlarini kiriting</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="$router.back()"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Bekor qilish
          </button>
          <button
            @click="saveEmployee"
            :disabled="!isValid || saving"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Shaxsiy ma'lumotlar</h3>
  
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ism <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Familiya <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.last_name"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telefon <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+998 XX XXX-XX-XX"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pasport seriyasi
                </label>
                <input
                  v-model="form.passport_serial"
                  type="text"
                  placeholder="AA1234567"
                  maxlength="9"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  INN
                </label>
                <input
                  v-model="form.inn"
                  type="text"
                  placeholder="123456789"
                  maxlength="9"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Manzil
                </label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  placeholder="To'liq manzil..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
  
          <!-- Employment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ish ma'lumotlari</h3>
  
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bo'lim <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.department_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Tanlang</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Lavozim <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.position"
                  type="text"
                  placeholder="Masalan: Muhandis"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ishga qabul qilingan <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.hire_date"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ish haqi (oylik) <span class="text-red-600">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.salary"
                    type="number"
                    min="0"
                    step="100000"
                    placeholder="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    UZS
                  </span>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Holat <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.employment_status"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="active">Faol</option>
                  <option value="on_leave">Ta'tilda</option>
                  <option value="terminated">Ishdan bo'shatilgan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Summary -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Xulasa</h3>
            <div class="space-y-3">
              <div v-if="form.first_name || form.last_name">
                <p class="text-sm text-gray-600">F.I.Sh</p>
                <p class="font-medium text-gray-900">
                  {{ form.first_name }} {{ form.last_name }}
                </p>
              </div>
              <div v-if="form.position">
                <p class="text-sm text-gray-600">Lavozim</p>
                <p class="font-medium text-gray-900">{{ form.position }}</p>
              </div>
              <div v-if="form.department_id">
                <p class="text-sm text-gray-600">Bo'lim</p>
                <p class="font-medium text-gray-900">{{ getDepartmentName(form.department_id) }}</p>
              </div>
              <div v-if="form.salary">
                <p class="text-sm text-gray-600">Ish haqi</p>
                <p class="text-xl font-bold text-gray-900">{{ formatCurrency(form.salary) }}</p>
              </div>
            </div>
          </div>
  
          <!-- Tips -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>Barcha majburiy maydonlarni to'ldiring</p>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>Telefon raqamini to'g'ri kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p>Ish haqini to'g'ri belgilang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useHRStore } from '@/stores/hr'
  import { formatCurrency } from '@/utils/formatters'
  
  const route = useRoute()
  const router = useRouter()
  const hrStore = useHRStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  
  const form = reactive({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    passport_serial: '',
    inn: '',
    department_id: '',
    position: '',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 0,
    employment_status: 'active',
    user_id: null
  })
  
  const departments = computed(() => hrStore.departments)
  
  const isValid = computed(() => {
    return form.first_name &&
           form.last_name &&
           form.phone &&
           form.department_id &&
           form.position &&
           form.hire_date &&
           form.salary > 0
  })
  
  function getDepartmentName(id) {
    return departments.value.find(d => d.id === id)?.name || ''
  }
  
  async function saveEmployee() {
    if (!isValid.value) return
  
    saving.value = true
    try {
      if (isEdit.value) {
        await hrStore.updateEmployee(route.params.id, form)
      } else {
        await hrStore.createEmployee(form)
      }
      router.push({ name: 'hr-employees' })
    } catch (err) {
      console.error('Failed to save employee:', err)
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    await hrStore.fetchDepartments()
  
    if (isEdit.value) {
      const employee = await hrStore.fetchEmployee(route.params.id)
      Object.assign(form, {
        first_name: employee.first_name,
        last_name: employee.last_name,
        phone: employee.phone,
        email: employee.email || '',
        address: employee.address || '',
        passport_serial: employee.passport_serial || '',
        inn: employee.inn || '',
        department_id: employee.department_id,
        position: employee.position,
        hire_date: employee.hire_date,
        salary: employee.salary,
        employment_status: employee.employment_status,
        user_id: employee.user_id
      })
    }
  })
  </script>