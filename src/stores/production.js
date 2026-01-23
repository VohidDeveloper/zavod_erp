import { defineStore } from 'pinia'

export const useProductionStore = defineStore('production', {
  state: () => ({
    shifts: [],
    orders: [],
    outputs: [],
    defects: [],
    lines: [],
    loading: false,
    error: null
  }),

  getters: {
    // Active shifts
    activeShifts: (state) => {
      return state.shifts.filter(s => s.status === 'active')
    },
    
    // Completed shifts today
    todayShifts: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.shifts.filter(s => s.date === today)
    },
    
    // Total production today
    todayProduction: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.outputs
        .filter(o => o.date === today)
        .reduce((sum, o) => sum + o.quantity, 0)
    },
    
    // Defect rate
    defectRate: (state) => {
      const totalProduced = state.outputs.reduce((sum, o) => sum + o.quantity, 0)
      const totalDefects = state.defects.reduce((sum, d) => sum + d.quantity, 0)
      return totalProduced > 0 ? (totalDefects / totalProduced) * 100 : 0
    },
    
    // Active production lines
    activeLines: (state) => {
      return state.lines.filter(l => l.status === 'active')
    },
    
    // Pending orders
    pendingOrders: (state) => {
      return state.orders.filter(o => o.status === 'pending')
    }
  },

  actions: {
    // Shifts
    async fetchShifts(params = {}) {
      this.loading = true
      this.error = null

      try {
        this.shifts = [
          {
            id: 1,
            shiftNo: 'SH-001',
            date: '2024-01-23',
            line: 'Line 1',
            operator: 'Operator 1',
            startTime: '08:00',
            endTime: '16:00',
            status: 'completed'
          }
        ]
        return this.shifts
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createShift(data) {
      this.loading = true
      try {
        const shift = { 
          id: Date.now(), 
          shiftNo: `SH-${Date.now()}`,
          status: 'active',
          ...data 
        }
        this.shifts.unshift(shift)
        return shift
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateShift(id, data) {
      this.loading = true
      try {
        const index = this.shifts.findIndex(s => s.id === id)
        if (index !== -1) {
          this.shifts[index] = { ...this.shifts[index], ...data }
        }
        return this.shifts[index]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeShift(id) {
      return this.updateShift(id, { status: 'completed' })
    },

    // Production Orders
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        this.orders = [
          {
            id: 1,
            orderNo: 'PRO-001',
            product: 'Product A',
            quantity: 1000,
            deadline: '2024-01-25',
            status: 'in_progress'
          }
        ]
        return this.orders
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrder(data) {
      this.loading = true
      try {
        const order = {
          id: Date.now(),
          orderNo: `PRO-${Date.now()}`,
          status: 'pending',
          ...data
        }
        this.orders.unshift(order)
        return order
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Outputs
    async fetchOutputs(params = {}) {
      this.loading = true
      try {
        this.outputs = [
          {
            id: 1,
            date: '2024-01-23',
            shiftId: 1,
            product: 'Product A',
            quantity: 500,
            unit: 'dona'
          }
        ]
        return this.outputs
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOutput(data) {
      this.loading = true
      try {
        const output = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data }
        this.outputs.unshift(output)
        return output
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Defects
    async fetchDefects(params = {}) {
      this.loading = true
      try {
        this.defects = [
          {
            id: 1,
            date: '2024-01-23',
            shiftId: 1,
            defectType: 'Scratch',
            quantity: 10,
            reason: 'Machine issue'
          }
        ]
        return this.defects
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDefect(data) {
      this.loading = true
      try {
        const defect = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data }
        this.defects.unshift(defect)
        return defect
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Production Lines
    async fetchLines(params = {}) {
      this.loading = true
      try {
        this.lines = [
          { id: 1, name: 'Line 1', capacity: 1000, status: 'active' },
          { id: 2, name: 'Line 2', capacity: 800, status: 'active' }
        ]
        return this.lines
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})