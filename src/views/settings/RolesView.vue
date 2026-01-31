<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Rollar va Huquqlar</h1>
          <p class="text-gray-600 mt-1">Foydalanuvchi rollari va huquqlarini boshqarish</p>
        </div>
        <button
          v-if="can('CREATE_ROLE')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi rol
        </button>
      </div>
  
      <!-- Roles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="role in roles"
          :key="role.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div class="h-2" :class="getRoleColorClass(role.name)"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :class="getRoleBgClass(role.name)"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-lg">{{ role.name }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ role.users_count }} foydalanuvchi</p>
                </div>
              </div>
            </div>
  
            <p class="text-sm text-gray-600 mb-4">{{ role.description }}</p>
  
            <div class="mb-4">
              <p class="text-xs font-medium text-gray-700 mb-2">Huquqlar ({{ role.permissions?.length || 0 }}):</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="permission in role.permissions?.slice(0, 3)"
                  :key="permission.id"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                >
                  {{ formatPermission(permission.name) }}
                </span>
                <span
                  v-if="role.permissions?.length > 3"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                >
                  +{{ role.permissions.length - 3 }} ko'proq
                </span>
              </div>
            </div>
  
            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                @click="viewPermissions(role)"
                class="text-sm text-primary-600 hover:text-primary-900"
              >
                Huquqlarni ko'rish
              </button>
              <button
                v-if="can('UPDATE_ROLE') && !role.is_system"
                @click="editRole(role)"
                class="text-sm text-warning-600 hover:text-warning-900"
              >
                Tahrirlash
              </button>
              <button
                v-if="can('DELETE_ROLE') && !role.is_system"
                @click="deleteRole(role)"
                class="text-sm text-danger-600 hover:text-danger-900"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useSettingsStore } from '@/stores/settings'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  
  const settingsStore = useSettingsStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const roles = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const selectedRole = ref(null)
  
  onMounted(() => {
    fetchRoles()
  })
  
  async function fetchRoles() {
    loading.value = true
    try {
      await settingsStore.fetchRoles()
      roles.value = settingsStore.roles
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function openCreateModal() {
    selectedRole.value = null
    showModal.value = true
  }
  
  function editRole(role) {
    selectedRole.value = role
    showModal.value = true
  }
  
  function viewPermissions(role) {
    console.log('View permissions:', role)
  }
  
  async function deleteRole(role) {
    if (!confirm(`${role.name} rolini o'chirishga ishonchingiz komilmi?`)) return
  
    try {
      await settingsStore.deleteRole(role.id)
      notifications.success('Rol o\'chirildi')
      await fetchRoles()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function formatPermission(name) {
    return name.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  function getRoleColorClass(name) {
    const colors = {
      'Admin': 'bg-danger-500',
      'Manager': 'bg-primary-500',
      'Supervisor': 'bg-warning-500',
      'Worker': 'bg-success-500',
    }
    return colors[name] || 'bg-gray-500'
  }
  
  function getRoleBgClass(name) {
    const colors = {
      'Admin': 'bg-danger-500',
      'Manager': 'bg-primary-500',
      'Supervisor': 'bg-warning-500',
      'Worker': 'bg-success-500',
    }
    return colors[name] || 'bg-gray-500'
  }
  </script>