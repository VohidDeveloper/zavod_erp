<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ish haqi to'lovlari</h1>
        <p class="text-gray-600 mt-1">Xodimlar ish haqi tarixi</p>
      </div>
      <button
        @click="$router.push({ name: 'hr-salary-calculate' })"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Ish haqi to'lash
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Bu oy to'langan</p>
        <p class="text-2xl font-bold text-green-600 mt-2">
          {{ formatCurrency(statistics?.total_salary_paid_this_month || 0) }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Jami xodimlar</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ statistics?.total_employees || 0 }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">O'rtacha ish haqi</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">
          {{ calculateAverageSalary() }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Xodim</label>
          <select
            v-model="filters.employee_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha xodimlar</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.first_name }} {{ emp.last_name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Boshlanish</label>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tugash</label>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Payments Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodim</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Davr</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Asosiy ish haqi</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ushlab qolish</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jami</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="salaryPayments.length === 0">
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
              Ma'lumot topilmadi
            </td>
          </tr>
          <tr
            v-else
            v-for="payment in salaryPayments"
            :key="payment.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <p class="font-medium text-gray-900">
                  {{ payment.employee?.first_name }} {{ payment.employee?.last_name }}
                </p>
                <p class="text-sm text-gray-600">{{ payment.employee?.position }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <p class="text-sm text-gray-900">
                  {{ formatDate(payment.period_start) }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ formatDate(payment.period_end) }}
                </p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
              {{ formatCurrency(payment.base_salary) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
              +{{ formatCurrency(payment.bonus) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
              -{{ formatCurrency(payment.deductions) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <p class="font-bold text-gray-900">{{ formatCurrency(payment.total_amount) }}</p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(payment.payment_date) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHRStore } from '@/stores/hr'
import { formatCurrency, formatDate } from '@/utils/formatters'

const router = useRouter()
const hrStore = useHRStore()

const filters = reactive({
  employee_id: '',
  start_date: '',
  end_date: ''
})

const loading = computed(() => hrStore.loading)
const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
const salaryPayments = computed(() => hrStore.salaryPayments)
const employees = computed(() => hrStore.employees)
const statistics = computed(() => hrStore.statistics)

async function fetchData() {
  try {
    await Promise.all([
      hrStore.fetchEmployees(),
      hrStore.fetchStatistics()
    ])

    // If employee selected, fetch their payments
    if (filters.employee_id) {
      await hrStore.fetchEmployeeSalaryPayments(filters.employee_id, {
        limit: 100
      })
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

function handleFilterChange() {
  fetchData()
}

function calculateAverageSalary() {
  if (!salaryPayments.value || salaryPayments.value.length === 0) {
    return formatCurrency(0)
  }
  
  const total = salaryPayments.value.reduce((sum, p) => sum + Number(p.total_amount), 0)
  const avg = total / salaryPayments.value.length
  return formatCurrency(avg)
}

onMounted(() => {
  fetchData()
})
</script>