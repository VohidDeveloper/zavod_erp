import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import hrService from '@/services/hrService'

export const useHRStore = defineStore('hr', () => {
  // ============ STATE ============
  
  // Departments
  const departments = ref([])
  const currentDepartment = ref(null)
  
  // Employees
  const employees = ref([])
  const currentEmployee = ref(null)
  
  // Attendance
  const attendances = ref([])
  const todayAttendance = ref([])
  
  // Salary Payments
  const salaryPayments = ref([])
  const currentPayment = ref(null)
  
  // Leave Requests
  const leaveRequests = ref([])
  const currentLeaveRequest = ref(null)
  
  // Statistics
  const statistics = ref(null)
  
  // UI State
  const loading = ref(false)
  const error = ref(null)

  // ============ GETTERS ============
  
  const totalDepartments = computed(() => departments.value.length)
  const totalEmployees = computed(() => employees.value.length)
  const activeEmployees = computed(() => 
    employees.value.filter(e => e.employment_status === 'active').length
  )
  const onLeaveEmployees = computed(() =>
    employees.value.filter(e => e.employment_status === 'on_leave').length
  )
  
  const pendingLeaveRequests = computed(() =>
    leaveRequests.value.filter(r => r.status === 'pending').length
  )
  
  const presentToday = computed(() =>
    todayAttendance.value.filter(a => a.status === 'present').length
  )
  
  const absentToday = computed(() =>
    todayAttendance.value.filter(a => a.status === 'absent').length
  )

  // ============ ACTIONS - DEPARTMENTS ============
  
  async function fetchDepartments(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getDepartments(params)
      departments.value = response.data || response
      return departments.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchDepartment(departmentId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getDepartment(departmentId)
      currentDepartment.value = response.data || response
      return currentDepartment.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createDepartment(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.createDepartment(data)
      const newDepartment = response.data || response
      departments.value.push(newDepartment)
      return newDepartment
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateDepartment(departmentId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.updateDepartment(departmentId, data)
      const updated = response.data || response
      
      const index = departments.value.findIndex(d => d.id === departmentId)
      if (index !== -1) {
        departments.value[index] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteDepartment(departmentId) {
    loading.value = true
    error.value = null
    
    try {
      await hrService.deleteDepartment(departmentId)
      departments.value = departments.value.filter(d => d.id !== departmentId)
      return true
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - EMPLOYEES ============
  
  async function fetchEmployees(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getEmployees(params)
      employees.value = response.data || response
      return employees.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchEmployee(employeeId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getEmployee(employeeId)
      currentEmployee.value = response.data || response
      return currentEmployee.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createEmployee(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.createEmployee(data)
      const newEmployee = response.data || response
      employees.value.unshift(newEmployee)
      return newEmployee
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateEmployee(employeeId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.updateEmployee(employeeId, data)
      const updated = response.data || response
      
      const index = employees.value.findIndex(e => e.id === employeeId)
      if (index !== -1) {
        employees.value[index] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteEmployee(employeeId) {
    loading.value = true
    error.value = null
    
    try {
      await hrService.deleteEmployee(employeeId)
      employees.value = employees.value.filter(e => e.id !== employeeId)
      return true
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - ATTENDANCE ============
  
  async function createAttendance(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.createAttendance(data)
      const newAttendance = response.data || response
      attendances.value.unshift(newAttendance)
      return newAttendance
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTodayAttendance(attendanceDate = null) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getTodayAttendance(attendanceDate)
      todayAttendance.value = response.data || response
      return todayAttendance.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchEmployeeAttendance(employeeId, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getEmployeeAttendance(employeeId, params)
      attendances.value = response.data || response
      return attendances.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateAttendance(attendanceId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.updateAttendance(attendanceId, data)
      const updated = response.data || response
      
      const index = attendances.value.findIndex(a => a.id === attendanceId)
      if (index !== -1) {
        attendances.value[index] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAttendance(attendanceId) {
    loading.value = true
    error.value = null
    
    try {
      await hrService.deleteAttendance(attendanceId)
      attendances.value = attendances.value.filter(a => a.id !== attendanceId)
      return true
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - SALARY PAYMENTS ============
  
  async function createSalaryPayment(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.createSalaryPayment(data)
      const newPayment = response.data || response
      salaryPayments.value.unshift(newPayment)
      return newPayment
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchSalaryPayment(paymentId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getSalaryPayment(paymentId)
      currentPayment.value = response.data || response
      return currentPayment.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchEmployeeSalaryPayments(employeeId, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getEmployeeSalaryPayments(employeeId, params)
      salaryPayments.value = response.data || response
      return salaryPayments.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - LEAVE REQUESTS ============
  
  async function createLeaveRequest(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.createLeaveRequest(data)
      const newRequest = response.data || response
      leaveRequests.value.unshift(newRequest)
      return newRequest
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchLeaveRequests(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getLeaveRequests(params)
      leaveRequests.value = response.data || response
      return leaveRequests.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchLeaveRequest(requestId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getLeaveRequest(requestId)
      currentLeaveRequest.value = response.data || response
      return currentLeaveRequest.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchEmployeeLeaveRequests(employeeId, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getEmployeeLeaveRequests(employeeId, params)
      leaveRequests.value = response.data || response
      return leaveRequests.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function approveLeaveRequest(requestId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.approveLeaveRequest(requestId, data)
      const updated = response.data || response
      
      const index = leaveRequests.value.findIndex(r => r.id === requestId)
      if (index !== -1) {
        leaveRequests.value[index] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - STATISTICS ============
  
  async function fetchStatistics() {
    loading.value = true
    error.value = null
    
    try {
      const response = await hrService.getStatistics()
      statistics.value = response.data || response
      return statistics.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ HELPERS ============
  
  function resetState() {
    departments.value = []
    currentDepartment.value = null
    employees.value = []
    currentEmployee.value = null
    attendances.value = []
    todayAttendance.value = []
    salaryPayments.value = []
    currentPayment.value = null
    leaveRequests.value = []
    currentLeaveRequest.value = null
    statistics.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    departments,
    currentDepartment,
    employees,
    currentEmployee,
    attendances,
    todayAttendance,
    salaryPayments,
    currentPayment,
    leaveRequests,
    currentLeaveRequest,
    statistics,
    loading,
    error,
    
    // Getters
    totalDepartments,
    totalEmployees,
    activeEmployees,
    onLeaveEmployees,
    pendingLeaveRequests,
    presentToday,
    absentToday,
    
    // Actions - Departments
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    
    // Actions - Employees
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    
    // Actions - Attendance
    createAttendance,
    fetchTodayAttendance,
    fetchEmployeeAttendance,
    updateAttendance,
    deleteAttendance,
    
    // Actions - Salary Payments
    createSalaryPayment,
    fetchSalaryPayment,
    fetchEmployeeSalaryPayments,
    
    // Actions - Leave Requests
    createLeaveRequest,
    fetchLeaveRequests,
    fetchLeaveRequest,
    fetchEmployeeLeaveRequests,
    approveLeaveRequest,
    
    // Actions - Statistics
    fetchStatistics,
    
    // Helpers
    resetState
  }
})