<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p class="text-gray-600 mt-1">Foydalanuvchilar boshqaruvi</p>
        </div>
        <button
          v-if="can('CREATE_USER')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi foydalanuvchi
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami foydalanuvchilar</p>
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
              <p class="text-sm text-gray-600">Faol</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Faol emas</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ stats.inactive }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Administratorlar</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.admins }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.role_id" class="input" @change="fetchUsers">
            <option value="">Barcha rollar</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <select v-model="filters.status" class="input" @change="fetchUsers">
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>
          <select v-model="filters.sort" class="input" @change="fetchUsers">
            <option value="first_name">Ism (A-Z)</option>
            <option value="-first_name">Ism (Z-A)</option>
            <option value="-created_at">Eng yangi</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tozalash
          </button>
        </div>
      </div>
  
      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oxirgi kirish</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>
  
            <tr v-else-if="!users.length">
              <td colspan="6" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p class="text-gray-500">Foydalanuvchilar topilmadi</p>
              </td>
            </tr>
  
            <tr
              v-else
              v-for="user in users"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ getInitials(user) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user.first_name }} {{ user.last_name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                  {{ user.role?.name }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ user.last_login ? formatDateTime(user.last_login) : 'Hech qachon' }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="user.is_active ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'"
                >
                  {{ user.is_active ? 'Faol' : 'Faol emas' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="can('UPDATE_USER')"
                    @click="editUser(user)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('UPDATE_USER')"
                    @click="toggleUserStatus(user)"
                    :class="user.is_active ? 'text-danger-600 hover:text-danger-900' : 'text-success-600 hover:text-success-900'"
                    :title="user.is_active ? 'Bloklash' : 'Faollashtirish'"
                  >
                    <svg v-if="user.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('DELETE_USER') && user.id !== currentUser?.id"
                    @click="deleteUser(user)"
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
      <UserModal
        v-if="showModal"
        :user="selectedUser"
        :roles="roles"
        @close="closeModal"
        @saved="handleSaved"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useSettingsStore } from '@/stores/settings'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { usePagination } from '@/composables/usePagination'
  import { formatDateTime } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import UserModal from '@/components/settings/modals/UserModal.vue'
  
  const authStore = useAuthStore()
  const settingsStore = useSettingsStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const currentUser = computed(() => authStore.user)
  
  const filters = reactive({
    search: '',
    role_id: '',
    status: '',
    sort: 'first_name',
  })
  
  const stats = ref({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
  })
  
  const users = ref([])
  const roles = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const selectedUser = ref(null)
  
  const pagination = usePagination(
    (params) => settingsStore.fetchUsers({ ...filters, ...params }),
    1,
    20
  )
  
  const { currentPage, total, hasNext, hasPrev, from, to } = pagination
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.role_id || filters.status
  })
  
  const debouncedFetch = createDebounce(fetchUsers, 500)
  
  onMounted(async () => {
    await Promise.all([
      fetchUsers(),
      fetchRoles(),
      fetchStats(),
    ])
  })
  
  async function fetchUsers() {
    loading.value = true
    try {
      await pagination.fetch(filters)
      users.value = settingsStore.users
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchRoles() {
    try {
      await settingsStore.fetchRoles()
      roles.value = settingsStore.roles
    } catch (error) {
      console.error('Roles error:', error)
    }
  }
  
  async function fetchStats() {
    try {
      const data = await settingsStore.fetchUsersStats()
      stats.value = {
        total: data.total || 0,
        active: data.active || 0,
        inactive: data.inactive || 0,
        admins: data.admins || 0,
      }
    } catch (error) {
      console.error('Stats error:', error)
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchUsers()
  }
  
  function openCreateModal() {
    selectedUser.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedUser.value = null
  }
  
  function editUser(user) {
    selectedUser.value = user
    showModal.value = true
  }
  
  async function toggleUserStatus(user) {
    const action = user.is_active ? 'bloklash' : 'faollashtirish'
    if (!confirm(`Foydalanuvchini ${action}ga ishonchingiz komilmi?`)) return
  
    try {
      await settingsStore.toggleUserStatus(user.id)
      notifications.success(`Foydalanuvchi ${action}tirildi`)
      await fetchUsers()
      await fetchStats()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  async function deleteUser(user) {
    if (!confirm(`${user.first_name} ${user.last_name}ni o'chirishga ishonchingiz komilmi?`)) return
  
    try {
      await settingsStore.deleteUser(user.id)
      notifications.success('Foydalanuvchi o\'chirildi')
      await fetchUsers()
      await fetchStats()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function handleSaved() {
    closeModal()
    fetchUsers()
    fetchStats()
  }
  
  function getInitials(user) {
    const first = user.first_name?.charAt(0) || ''
    const last = user.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }
  
  function nextPage() {
    pagination.next()
    users.value = settingsStore.users
  }
  
  function prevPage() {
    pagination.prev()
    users.value = settingsStore.users
  }
  </script>