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
            <h1 class="text-2xl font-bold text-gray-900">Ish haqi hisoblash</h1>
            <p class="text-gray-600 mt-1">Xodim ish haqini hisoblash va to'lash</p>
          </div>
        </div>
        <button
          @click="processPayment"
          :disabled="!isValid || saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Saqlanmoqda...' : 'To\'lashni tasdiqlash' }}
        </button>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Employee Selection -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Xodim tanlash</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xodim <span class="text-red-600">*</span>
              </label>
              <select
                v-model="form.employee_id"
                @change="onEmployeeChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Tanlang</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.first_name }} {{ emp.last_name }} - {{ emp.position }}
                </option>
              </select>
            </div>
  
            <div v-if="selectedEmployee" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Bo'lim:</p>
                  <p class="font-medium text-gray-900">{{ selectedEmployee.department?.name }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Lavozim:</p>
                  <p class="font-medium text-gray-900">{{ selectedEmployee.position }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Asosiy ish haqi:</p>
                  <p class="font-medium text-gray-900">{{ formatCurrency(selectedEmployee.salary) }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Period Selection -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">To'lov davri</h3>
  
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Boshlanish <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.period_start"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tugash <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.period_end"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
  
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                To'lov sanasi <span class="text-red-600">*</span>
              </label>
              <input
                v-model="form.payment_date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <!-- Salary Calculation -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ish haqi hisoblash</h3>
  
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Asosiy ish haqi <span class="text-red-600">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.base_salary"
                    type="number"
                    min="0"
                    step="1000"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">UZS</span>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bonus / Ustama
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.bonus"
                    type="number"
                    min="0"
                    step="1000"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">UZS</span>
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ushlab qolish / Jarima
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.deductions"
                    type="number"
                    min="0"
                    step="1000"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">UZS</span>
                </div>
              </div>
  
              <div class="pt-4 border-t">
                <div class="flex items-center justify-between">
                  <span class="text-lg font-medium text-gray-700">Jami to'lov:</span>
                  <span class="text-3xl font-bold text-green-600">
                    {{ formatCurrency(totalAmount) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Payment Method & Notes -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">To'lov tafsilotlari</h3>
  
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  To'lov usuli <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.payment_method"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Tanlang</option>
                  <option value="cash">Naqd pul</option>
                  <option value="bank_transfer">Bank o'tkazmasi</option>
                  <option value="card">Karta</option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Izoh
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha ma'lumotlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Summary -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Xulasa</h3>
  
            <div class="space-y-3">
              <div class="flex items-center justify-between pb-3 border-b">
                <span class="text-sm text-gray-600">Asosiy ish haqi</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(form.base_salary) }}</span>
              </div>
              <div class="flex items-center justify-between pb-3 border-b">
                <span class="text-sm text-gray-600">Bonus</span>
                <span class="font-medium text-green-600">+{{ formatCurrency(form.bonus) }}</span>
              </div>
              <div class="flex items-center justify-between pb-3 border-b">
                <span class="text-sm text-gray-600">Ushlab qolish</span>
                <span class="font-medium text-red-600">-{{ formatCurrency(form.deductions) }}</span>
              </div>
              <div class="flex items-center justify-between pt-2">
                <span class="text-lg font-semibold text-gray-900">Jami</span>
                <span class="text-2xl font-bold text-green-600">{{ formatCurrency(totalAmount) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Tips -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Eslatma</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Barcha maydonlarni to'ldiring</p>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>To'lov sanasini tekshiring</p>
              </div>
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Summani qayta hisoblang</p>
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
  
  const saving = ref(false)
  const selectedEmployee = ref(null)
  
  const form = reactive({
    employee_id: '',
    payment_date: new Date().toISOString().split('T')[0],
    period_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    period_end: new Date().toISOString().split('T')[0],
    base_salary: 0,
    bonus: 0,
    deductions: 0,
    payment_method: '',
    notes: ''
  })
  
  const employees = computed(() => hrStore.employees)
  
  const totalAmount = computed(() => {
    return form.base_salary + form.bonus - form.deductions
  })
  
  const isValid = computed(() => {
    return form.employee_id &&
           form.payment_date &&
           form.period_start &&
           form.period_end &&
           form.base_salary > 0 &&
           form.payment_method &&
           totalAmount.value > 0
  })
  
  async function onEmployeeChange() {
    if (form.employee_id) {
      selectedEmployee.value = employees.value.find(e => e.id === form.employee_id)
      if (selectedEmployee.value) {
        form.base_salary = Number(selectedEmployee.value.salary)
      }
    } else {
      selectedEmployee.value = null
      form.base_salary = 0
    }
  }
  
  async function processPayment() {
    if (!isValid.value) return
  
    saving.value = true
    try {
      await hrStore.createSalaryPayment(form)
      router.push({ name: 'hr-salaries' })
    } catch (err) {
      console.error('Failed to process payment:', err)
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    await hrStore.fetchEmployees()
  
    // Pre-fill if employee_id in query
    if (route.query.employee_id) {
      form.employee_id = route.query.employee_id
      onEmployeeChange()
    }
  })
  </script>