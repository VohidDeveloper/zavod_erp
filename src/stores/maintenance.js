import { defineStore } from 'pinia'
import maintenanceService from '@/services/maintenanceService'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    // Equipment/Machines
    equipment: [],
    currentEquipment: null,
    equipmentStats: {
      total: 0,
      operational: 0,
      underMaintenance: 0,
      broken: 0
    },
    
    // Maintenance requests
    requests: [],
    pendingRequests: [],
    completedRequests: [],
    
    // Maintenance schedule
    schedules: [],
    upcomingSchedules: [],
    overdueSchedules: [],
    
    // Maintenance history
    history: [],
    
    // Spare parts
    spareParts: [],
    lowStockParts: [],
    
    // Maintenance stats
    stats: {
      totalRequests: 0,
      pendingRequests: 0,
      completedThisMonth: 0,
      averageRepairTime: 0,
      totalCost: 0
    },
    
    // Loading states
    loading: false,
    equipmentLoading: false,
    requestsLoading: false,
    schedulesLoading: false,
    
    error: null
  }),

  getters: {
    // Equipment getters
    operationalEquipment: (state) => state.equipment.filter(e => e.status === 'operational'),
    maintenanceEquipment: (state) => state.equipment.filter(e => e.status === 'under_maintenance'),
    brokenEquipment: (state) => state.equipment.filter(e => e.status === 'broken'),
    equipmentUtilization: (state) => {
      if (state.equipment.length === 0) return 0
      const operational = state.equipment.filter(e => e.status === 'operational').length
      return ((operational / state.equipment.length) * 100).toFixed(2)
    },
    
    // Request getters
    urgentRequests: (state) => state.requests.filter(r => r.priority === 'urgent' && r.status === 'pending'),
    highPriorityRequests: (state) => state.requests.filter(r => r.priority === 'high' && r.status === 'pending'),
    requestsByStatus: (state) => (status) => state.requests.filter(r => r.status === status),
    
    // Schedule getters
    todaySchedules: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.schedules.filter(s => s.scheduled_date === today)
    },
    thisWeekSchedules: (state) => {
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return state.schedules.filter(s => {
        const date = new Date(s.scheduled_date)
        return date >= now && date <= weekFromNow
      })
    },
    
    // Parts getters
    criticalStockParts: (state) => state.spareParts.filter(p => p.quantity <= p.min_quantity)
  },

  actions: {
    // ==================== EQUIPMENT ====================
    
    async fetchEquipment(params = {}) {
      this.equipmentLoading = true
      this.error = null
      try {
        const response = await maintenanceService.getEquipment(params)
        this.equipment = response.data
        this.updateEquipmentStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.equipmentLoading = false
      }
    },

    async fetchEquipmentById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.getEquipmentById(id)
        this.currentEquipment = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEquipment(data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.createEquipment(data)
        this.equipment.unshift(response.data)
        this.updateEquipmentStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEquipment(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.updateEquipment(id, data)
        const index = this.equipment.findIndex(e => e.id === id)
        if (index !== -1) this.equipment[index] = response.data
        this.updateEquipmentStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEquipment(id) {
      this.loading = true
      this.error = null
      try {
        await maintenanceService.deleteEquipment(id)
        this.equipment = this.equipment.filter(e => e.id !== id)
        this.updateEquipmentStats()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== MAINTENANCE REQUESTS ====================
    
    async fetchRequests(params = {}) {
      this.requestsLoading = true
      this.error = null
      try {
        const response = await maintenanceService.getRequests(params)
        this.requests = response.data
        this.pendingRequests = response.data.filter(r => r.status === 'pending')
        this.completedRequests = response.data.filter(r => r.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.requestsLoading = false
      }
    },

    async createRequest(data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.createRequest(data)
        this.requests.unshift(response.data)
        if (response.data.status === 'pending') {
          this.pendingRequests.unshift(response.data)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRequest(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.updateRequest(id, data)
        const index = this.requests.findIndex(r => r.id === id)
        if (index !== -1) this.requests[index] = response.data
        this.pendingRequests = this.requests.filter(r => r.status === 'pending')
        this.completedRequests = this.requests.filter(r => r.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async assignRequest(id, technicianId) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.assignRequest(id, { technician_id: technicianId })
        const index = this.requests.findIndex(r => r.id === id)
        if (index !== -1) this.requests[index] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeRequest(id, data = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.completeRequest(id, data)
        const index = this.requests.findIndex(r => r.id === id)
        if (index !== -1) this.requests[index] = response.data
        this.pendingRequests = this.requests.filter(r => r.status === 'pending')
        this.completedRequests = this.requests.filter(r => r.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== MAINTENANCE SCHEDULE ====================
    
    async fetchSchedules(params = {}) {
      this.schedulesLoading = true
      this.error = null
      try {
        const response = await maintenanceService.getSchedules(params)
        this.schedules = response.data
        this.updateScheduleLists()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.schedulesLoading = false
      }
    },

    async createSchedule(data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.createSchedule(data)
        this.schedules.unshift(response.data)
        this.updateScheduleLists()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.updateSchedule(id, data)
        const index = this.schedules.findIndex(s => s.id === id)
        if (index !== -1) this.schedules[index] = response.data
        this.updateScheduleLists()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSchedule(id) {
      this.loading = true
      this.error = null
      try {
        await maintenanceService.deleteSchedule(id)
        this.schedules = this.schedules.filter(s => s.id !== id)
        this.updateScheduleLists()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== SPARE PARTS ====================
    
    async fetchSpareParts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.getSpareParts(params)
        this.spareParts = response.data
        this.lowStockParts = response.data.filter(p => p.quantity <= p.min_quantity)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSparePartStock(id, quantity) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.updateSparePartStock(id, { quantity })
        const index = this.spareParts.findIndex(p => p.id === id)
        if (index !== -1) this.spareParts[index] = response.data
        this.lowStockParts = this.spareParts.filter(p => p.quantity <= p.min_quantity)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== MAINTENANCE HISTORY ====================
    
    async fetchHistory(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.getHistory(params)
        this.history = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== STATS ====================
    
    async fetchStats(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await maintenanceService.getStats(params)
        this.stats = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    updateEquipmentStats() {
      this.equipmentStats = {
        total: this.equipment.length,
        operational: this.equipment.filter(e => e.status === 'operational').length,
        underMaintenance: this.equipment.filter(e => e.status === 'under_maintenance').length,
        broken: this.equipment.filter(e => e.status === 'broken').length
      }
    },

    updateScheduleLists() {
      const now = new Date()
      this.upcomingSchedules = this.schedules.filter(s => {
        return new Date(s.scheduled_date) >= now && s.status === 'scheduled'
      })
      this.overdueSchedules = this.schedules.filter(s => {
        return new Date(s.scheduled_date) < now && s.status === 'scheduled'
      })
    },

    reset() {
      this.equipment = []
      this.requests = []
      this.schedules = []
      this.spareParts = []
      this.history = []
      this.error = null
    }
  }
})