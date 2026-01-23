import { defineStore } from 'pinia'
import hrService from '@/services/hrService'

export const useHRStore = defineStore('hr', {
  state: () => ({
    // Employees
    employees: [],
    currentEmployee: null,
    employeeStats: {
      total: 0,
      active: 0,
      onLeave: 0,
      terminated: 0
    },
    
    // Attendance
    attendance: [],
    todayAttendance: [],
    attendanceStats: {
      present: 0,
      absent: 0,
      late: 0,
      onLeave: 0
    },
    
    // Salaries
    salaries: [],
    payrollSummary: {
      totalSalary: 0,
      totalBonuses: 0,
      totalDeductions: 0,
      netPayroll: 0
    },
    
    // Departments & Positions
    departments: [],
    positions: [],
    
    // Leave requests
    leaveRequests: [],
    pendingLeaveRequests: [],
    
    // Loading states
    loading: false,
    employeesLoading: false,
    attendanceLoading: false,
    salariesLoading: false,
    
    error: null
  }),

  getters: {
    // Employee getters
    activeEmployees: (state) => state.employees.filter(e => e.status === 'active'),
    totalEmployees: (state) => state.employees.length,
    employeesByDepartment: (state) => {
      return state.departments.map(dept => ({
        ...dept,
        employees: state.employees.filter(e => e.department_id === dept.id)
      }))
    },
    
    // Attendance getters
    presentToday: (state) => state.todayAttendance.filter(a => a.status === 'present').length,
    absentToday: (state) => state.todayAttendance.filter(a => a.status === 'absent').length,
    lateToday: (state) => state.todayAttendance.filter(a => a.status === 'late').length,
    attendanceRate: (state) => {
      if (state.todayAttendance.length === 0) return 0
      const present = state.todayAttendance.filter(a => a.status === 'present').length
      return ((present / state.todayAttendance.length) * 100).toFixed(2)
    },
    
    // Salary getters
    totalMonthlySalary: (state) => {
      return state.salaries.reduce((sum, s) => sum + (s.base_salary || 0), 0)
    },
    averageSalary: (state) => {
      if (state.salaries.length === 0) return 0
      const total = state.salaries.reduce((sum, s) => sum + (s.base_salary || 0), 0)
      return total / state.salaries.length
    },
    
    // Leave getters
    pendingLeaveCount: (state) => state.leaveRequests.filter(r => r.status === 'pending').length,
    approvedLeaveCount: (state) => state.leaveRequests.filter(r => r.status === 'approved').length
  },

  actions: {
    // Employees
    async fetchEmployees(params = {}) {
      this.employeesLoading = true
      this.error = null
      try {
        const response = await hrService.getEmployees(params)
        this.employees = response.data
        this.updateEmployeeStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.employeesLoading = false
      }
    },

    async createEmployee(data) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.createEmployee(data)
        this.employees.unshift(response.data)
        this.updateEmployeeStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEmployee(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.updateEmployee(id, data)
        const index = this.employees.findIndex(e => e.id === id)
        if (index !== -1) this.employees[index] = response.data
        this.updateEmployeeStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Attendance
    async fetchAttendance(params = {}) {
      this.attendanceLoading = true
      this.error = null
      try {
        const response = await hrService.getAttendance(params)
        this.attendance = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.attendanceLoading = false
      }
    },

    async markAttendance(data) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.markAttendance(data)
        this.todayAttendance.push(response.data)
        this.updateAttendanceStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Salaries
    async fetchSalaries(params = {}) {
      this.salariesLoading = true
      this.error = null
      try {
        const response = await hrService.getSalaries(params)
        this.salaries = response.data
        this.updatePayrollSummary()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.salariesLoading = false
      }
    },

    async processPayroll(month, year) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.processPayroll({ month, year })
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Leave requests
    async fetchLeaveRequests(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.getLeaveRequests(params)
        this.leaveRequests = response.data
        this.pendingLeaveRequests = response.data.filter(r => r.status === 'pending')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveLeaveRequest(id, data = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.approveLeaveRequest(id, data)
        const index = this.leaveRequests.findIndex(r => r.id === id)
        if (index !== -1) this.leaveRequests[index] = response.data
        this.pendingLeaveRequests = this.leaveRequests.filter(r => r.status === 'pending')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Departments & Positions
    async fetchDepartments() {
      this.loading = true
      this.error = null
      try {
        const response = await hrService.getDepartments()
        this.departments = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Stats
    updateEmployeeStats() {
      this.employeeStats = {
        total: this.employees.length,
        active: this.employees.filter(e => e.status === 'active').length,
        onLeave: this.employees.filter(e => e.status === 'on_leave').length,
        terminated: this.employees.filter(e => e.status === 'terminated').length
      }
    },

    updateAttendanceStats() {
      this.attendanceStats = {
        present: this.todayAttendance.filter(a => a.status === 'present').length,
        absent: this.todayAttendance.filter(a => a.status === 'absent').length,
        late: this.todayAttendance.filter(a => a.status === 'late').length,
        onLeave: this.todayAttendance.filter(a => a.status === 'on_leave').length
      }
    },

    updatePayrollSummary() {
      this.payrollSummary = {
        totalSalary: this.salaries.reduce((sum, s) => sum + (s.base_salary || 0), 0),
        totalBonuses: this.salaries.reduce((sum, s) => sum + (s.bonuses || 0), 0),
        totalDeductions: this.salaries.reduce((sum, s) => sum + (s.deductions || 0), 0),
        netPayroll: this.salaries.reduce((sum, s) => sum + (s.net_salary || 0), 0)
      }
    },

    reset() {
      this.employees = []
      this.attendance = []
      this.salaries = []
      this.leaveRequests = []
      this.error = null
    }
  }
})