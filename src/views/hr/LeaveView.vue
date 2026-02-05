<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ta'til so'rovlari</h1>
          <p class="text-gray-600 mt-1">Xodimlar ta'til so'rovlari boshqaruvi</p>
        </div>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Ta'til so'rovi
        </button>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-600">Kutilmoqda</p>
          <p class="text-2xl font-bold text-yellow-600 mt-2">
            {{ statistics?.pending_leave_requests || 0 }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-600">Tasdiqlangan</p>
          <p class="text-2xl font-bold text-green-600 mt-2">
            {{ approvedCount }}
          </p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm text-gray-600">Rad etilgan</p>
          <p class="text-2xl font-bold text-red-600 mt-2">
            {{ rejectedCount }}
          </p>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              @change="handleFilterChange"
            >
              <option value="">Barcha holatlar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="approved">Tasdiqlangan</option>
              <option value="rejected">Rad etilgan</option>
            </select>
          </div>
          <div>
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
  
      <!-- Leave Requests Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodim</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ta'til turi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Davomiyligi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sabab</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredRequests.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Ma'lumot topilmadi
              </td>
            </tr>
            <tr
              v-else
              v-for="request in filteredRequests"
              :key="request.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ request.employee?.first_name }} {{ request.employee?.last_name }}
                  </p>
                  <p class="text-sm text-gray-600">{{ request.employee?.position }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getLeaveTypeClass(request.leave_type)"
                >
                  {{ getLeaveTypeText(request.leave_type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm text-gray-900">
                    {{ formatDate(request.start_date) }} - {{ formatDate(request.end_date) }}
                  </p>
                  <p class="text-xs text-gray-600">{{ request.days_count }} kun</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-600">{{ request.reason || '-' }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(request.status)"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex space-x-2">
                  <button
                    v-if="request.status === 'pending'"
                    @click="approveRequest(request, 'approved')"
                    class="text-green-600 hover:text-green-700"
                    title="Tasdiqlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    v-if="request.status === 'pending'"
                    @click="approveRequest(request, 'rejected')"
                    class="text-red-600 hover:text-red-700"
                    title="Rad etish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    @click="viewRequest(request)"
                    class="text-blue-600 hover:text-blue-700"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Add Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Ta'til so'rovi</h3>
  
            <form @submit.prevent="saveLeaveRequest" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Xodim <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="leaveForm.employee_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Tanlang</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.first_name }} {{ emp.last_name }}
                  </option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ta'til turi <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="leaveForm.leave_type"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Tanlang</option>
                  <option value="annual">Yillik ta'til</option>
                  <option value="sick">Kasallik</option>
                  <option value="unpaid">Haq to'lanmaydigan</option>
                  <option value="maternity">Homiladorlik</option>
                </select>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Boshlanish <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="leaveForm.start_date"
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
                    v-model="leaveForm.end_date"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sabab
                </label>
                <textarea
                  v-model="leaveForm.reason"
                  rows="3"
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
                  {{ saving ? 'Saqlanmoqda...' : 'Yuborish' }}
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
  import { formatDate } from '@/utils/formatters'
  
  const hrStore = useHRStore()
  
  const showAddModal = ref(false)
  const saving = ref(false)
  
  const filters = reactive({
    status: '',
    employee_id: ''
  })
  
  const leaveForm = reactive({
    employee_id: '',
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  })
  
  const loading = computed(() => hrStore.loading)
  const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
  const leaveRequests = computed(() => hrStore.leaveRequests)
  const employees = computed(() => hrStore.employees)
  const statistics = computed(() => hrStore.statistics)
  
  const filteredRequests = computed(() => {
    let filtered = leaveRequests.value
  
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status)
    }
  
    if (filters.employee_id) {
      filtered = filtered.filter(r => r.employee_id === filters.employee_id)
    }
  
    return filtered
  })
  
  const approvedCount = computed(() => 
    leaveRequests.value.filter(r => r.status === 'approved').length
  )
  
  const rejectedCount = computed(() => 
    leaveRequests.value.filter(r => r.status === 'rejected').length
  )
  
  async function fetchData() {
    try {
      await Promise.all([
        hrStore.fetchLeaveRequests(filters),
        hrStore.fetchEmployees(),
        hrStore.fetchStatistics()
      ])
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }
  
  function handleFilterChange() {
    fetchData()
  }
  
  function getLeaveTypeClass(type) {
    const classes = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      unpaid: 'bg-gray-100 text-gray-800',
      maternity: 'bg-purple-100 text-purple-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
  }
  
  function getLeaveTypeText(type) {
    const texts = {
      annual: 'Yillik ta\'til',
      sick: 'Kasallik',
      unpaid: 'Haq to\'lanmaydigan',
      maternity: 'Homiladorlik'
    }
    return texts[type] || type
  }
  
  function getStatusClass(status) {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function getStatusText(status) {
    const texts = {
      pending: 'Kutilmoqda',
      approved: 'Tasdiqlangan',
      rejected: 'Rad etilgan'
    }
    return texts[status] || status
  }
  
  async function approveRequest(request, status) {
    const action = status === 'approved' ? 'tasdiqlash' : 'rad etish'
    if (!confirm(`So'rovni ${action}ga ishonchingiz komilmi?`)) return
  
    try {
      await hrStore.approveLeaveRequest(request.id, { status })
      await fetchData()
    } catch (err) {
      console.error('Failed to approve/reject request:', err)
    }
  }
  
  function viewRequest(request) {
    // Navigate to details or show modal
    console.log('View request:', request)
  }
  
  function closeModal() {
    showAddModal.value = false
    Object.assign(leaveForm, {
      employee_id: '',
      leave_type: '',
      start_date: '',
      end_date: '',
      reason: ''
    })
  }
  
  async function saveLeaveRequest() {
    saving.value = true
    try {
      await hrStore.createLeaveRequest(leaveForm)
      closeModal()
      await fetchData()
    } catch (err) {
      console.error('Failed to save leave request:', err)
    } finally {
      saving.value = false
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>