<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Xodimlar</h1>
          <p class="text-gray-600 mt-1">Barcha xodimlarni boshqarish</p>
        </div>
        <button
          v-if="can('CREATE_EMPLOYEE')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi xodim
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami xodimlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Faol xodimlar</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.active / stats.total) * 100).toFixed(1) }}% barcha xodimlardan
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Yangi (bu oy)</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.new_this_month }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">O'rtacha ish haqi</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">
                {{ formatCurrency(stats.avg_salary) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.department" class="input" @change="fetchEmployees">
            <option value="">Barcha bo'limlar</option>
            <option value="production">Ishlab chiqarish</option>
            <option value="sales">Savdo</option>
            <option value="warehouse">Ombor</option>
            <option value="finance">Moliya</option>
            <option value="hr">HR</option>
          </select>
          <select v-model="filters.position" class="input" @change="fetchEmployees">
            <option value="">Barcha lavozimlar</option>
            <option value="manager">Menejer</option>
            <option value="worker">Ishchi</option>
            <option value="driver">Haydovchi</option>
            <option value="accountant">Buxgalter</option>
          </select>
          <select v-model="filters.status" class="input" @change="fetchEmployees">
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
            <option value="on_leave">Ta'tilda</option>
          </select>
          <select v-model="filters.sort" class="input" @change="fetchEmployees">
            <option value="first_name">Ism (A-Z)</option>
            <option value="-first_name">Ism (Z-A)</option>
            <option value="-hire_date">Ish boshlagan (yangi)</option>
            <option value="hire_date">Ish boshlagan (eski)</option>
            <option value="-salary">Maosh (yuqori)</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tozalash
          </button>
        </div>
        <div class="flex items-center justify-end gap-2 mt-4">
          <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Excel
          </button>
          <button @click="exportToPDF" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            PDF
          </button>
        </div>
      </div>
  
      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Xodim
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bo'lim
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lavozim
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Aloqa
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Maosh
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ish boshlagan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Holat
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>
  
            <tr v-else-if="!employees.length">
              <td colspan="8" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p class="text-gray-500">Xodimlar topilmadi</p>
              </td>
            </tr>
  
            <tr
              v-else
              v-for="employee in employees"
              :key="employee.id"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="viewEmployee(employee)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ getInitials(employee) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ employee.first_name }} {{ employee.last_name }}
                    </p>
                    <p class="text-xs text-gray-500">ID: {{ employee.employee_id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDepartment(employee.department) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ employee.position }}
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm text-gray-900">{{ formatPhone(employee.phone) }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ employee.email }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                {{ formatCurrency(employee.salary) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ formatDate(employee.hire_date) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(employee.status)"
                >
                  {{ formatStatus(employee.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="viewEmployee(employee)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('UPDATE_EMPLOYEE')"
                    @click.stop="editEmployee(employee)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('DELETE_EMPLOYEE')"
                    @click.stop="deleteEmployee(employee)"
                    class="text-danger-600 hover:text-danger-900"
                    title="O'chirish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Ko'rsatilmoqda <span class="font-medium">{{ from }}</span> dan
              <span class="font-medium">{{ to }}</span> gacha,
              jami <span class="font-medium">{{ total }}</span> ta
            </div>
            <div class="flex gap-2">
              <button
                @click="prevPage"
                :disabled="!hasPrev"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oldingi
              </button>
              <button
                @click="nextPage"
                :disabled="!hasNext"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modals -->
      <EmployeeModal
        v-if="showModal"
        :employee="selectedEmployee"
        @close="closeModal"
        @saved="handleSaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useHRStore } from '@/stores/hr'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { usePagination } from '@/composables/usePagination'
  import {
    formatCurrency,
    formatDate,
    formatPhone,
    formatStatus,
  } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import { exportToExcel as exportExcel, exportToPDF as exportPdf } from '@/utils/exportUtils'
  import EmployeeModal from '@/components/hr/modals/EmployeeModal.vue'
  
  const router = useRouter()
  const hrStore = useHRStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const filters = reactive({
    search: '',
    department: '',
    position: '',
    status: '',
    sort: 'first_name',
  })
  
  const stats = ref({
    total: 0,
    active: 0,
    new_this_month: 0,
    avg_salary: 0,
  })
  
  const employees = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const selectedEmployee = ref(null)
  
  const pagination = usePagination(
    (params) => hrStore.fetchEmployees({ ...filters, ...params }),
    1,
    20
  )
  
  const { currentPage, total, hasNext, hasPrev, from, to } = pagination
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.department || filters.position || filters.status
  })
  
  const debouncedFetch = createDebounce(fetchEmployees, 500)
  
  onMounted(async () => {
    await Promise.all([
      fetchEmployees(),
      fetchStats(),
    ])
  })
  
  async function fetchEmployees() {
    loading.value = true
    try {
      await pagination.fetch(filters)
      employees.value = hrStore.employees
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStats() {
    try {
      const data = await hrStore.fetchStats()
      stats.value = {
        total: data.total_employees || 0,
        active: data.active_employees || 0,
        new_this_month: data.new_this_month || 0,
        avg_salary: data.avg_salary || 0,
      }
    } catch (error) {
      console.error('Stats error:', error)
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchEmployees()
  }
  
  function openCreateModal() {
    selectedEmployee.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedEmployee.value = null
  }
  
  function viewEmployee(employee) {
    router.push(`/hr/employees/${employee.id}`)
  }
  
  function editEmployee(employee) {
    selectedEmployee.value = employee
    showModal.value = true
  }
  
  async function deleteEmployee(employee) {
    if (!confirm(`${employee.first_name} ${employee.last_name}ni o'chirishga ishonchingiz komilmi?`)) return
  
    try {
      await hrStore.deleteEmployee(employee.id)
      notifications.success('Xodim o\'chirildi')
      await fetchEmployees()
      await fetchStats()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function handleSaved() {
    closeModal()
    fetchEmployees()
    fetchStats()
  }
  
  function getInitials(employee) {
    const first = employee.first_name?.charAt(0) || ''
    const last = employee.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'X'
  }
  
  function formatDepartment(dept) {
    const departments = {
      production: 'Ishlab chiqarish',
      sales: 'Savdo',
      warehouse: 'Ombor',
      finance: 'Moliya',
      hr: 'HR',
    }
    return departments[dept] || dept
  }
  
  function getStatusClass(status) {
    const classes = {
      active: 'bg-success-100 text-success-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-warning-100 text-warning-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function nextPage() {
    pagination.next()
    employees.value = hrStore.employees
  }
  
  function prevPage() {
    pagination.prev()
    employees.value = hrStore.employees
  }
  
  function exportToExcel() {
    const data = employees.value.map(e => ({
      'ID': e.employee_id,
      'Ism': e.first_name,
      'Familiya': e.last_name,
      'Bo\'lim': formatDepartment(e.department),
      'Lavozim': e.position,
      'Telefon': e.phone,
      'Email': e.email,
      'Maosh': e.salary,
      'Ish boshlagan': formatDate(e.hire_date),
      'Holat': formatStatus(e.status),
    }))
    exportExcel(data, 'xodimlar.xlsx')
    notifications.success('Excel faylga eksport qilindi')
  }
  
  function exportToPDF() {
    const columns = [
      { header: 'Xodim', key: 'name' },
      { header: 'Bo\'lim', key: 'department' },
      { header: 'Lavozim', key: 'position' },
      { header: 'Maosh', key: 'salary' },
    ]
    const data = employees.value.map(e => ({
      name: `${e.first_name} ${e.last_name}`,
      department: formatDepartment(e.department),
      position: e.position,
      salary: formatCurrency(e.salary),
    }))
    exportPdf(data, columns, 'xodimlar.pdf', 'Xodimlar ro\'yxati')
    notifications.success('PDF faylga eksport qilindi')
  }
  </script>