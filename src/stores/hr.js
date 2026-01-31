import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHRStore = defineStore('hr', () => {
  // State
  const employees = ref([])
  const departments = ref([])
  const attendance = ref([])
  const leaves = ref([])
  const stats = ref({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    newHires: 0,
    totalDepartments: 0,
    averageSalary: 0,
    totalSalaryExpense: 0,
    attendanceRate: 0
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  // Mock data
  const mockEmployees = [
    {
      id: 1,
      employee_id: 'EMP-001',
      first_name: 'Alisher',
      last_name: 'Karimov',
      middle_name: 'Akmalovich',
      birth_date: '1995-05-15',
      gender: 'male',
      passport: 'AA1234567',
      phone: '+998 90 123-45-67',
      email: 'alisher.karimov@example.com',
      address: 'Toshkent, Yakkasaroy tumani',
      department_id: 1,
      department: { id: 1, name: 'Ishlab chiqarish' },
      position: 'Ishlab chiqarish operatori',
      hire_date: '2023-01-15',
      employment_type: 'full_time',
      status: 'active',
      salary: 5000000,
      payment_type: 'monthly',
      notes: 'A\'lo xodim',
      created_at: '2023-01-15T10:00:00',
      created_by: { name: 'Admin' }
    },
    {
      id: 2,
      employee_id: 'EMP-002',
      first_name: 'Madina',
      last_name: 'Rahimova',
      middle_name: 'Shavkatovna',
      birth_date: '1992-08-20',
      gender: 'female',
      passport: 'AB2345678',
      phone: '+998 91 234-56-78',
      email: 'madina.rahimova@example.com',
      address: 'Toshkent, Chilonzor tumani',
      department_id: 3,
      department: { id: 3, name: 'Sotish' },
      position: 'Sotish menejeri',
      hire_date: '2022-06-01',
      employment_type: 'full_time',
      status: 'active',
      salary: 6500000,
      payment_type: 'monthly',
      notes: '',
      created_at: '2022-06-01T09:00:00',
      created_by: { name: 'Admin' }
    },
    {
      id: 3,
      employee_id: 'EMP-003',
      first_name: 'Javohir',
      last_name: 'Toshmatov',
      middle_name: 'Rustamovich',
      birth_date: '1998-03-10',
      gender: 'male',
      passport: 'AC3456789',
      phone: '+998 93 345-67-89',
      email: 'javohir@example.com',
      address: 'Toshkent, Mirzo Ulug\'bek tumani',
      department_id: 2,
      department: { id: 2, name: 'Ombor' },
      position: 'Ombor mudiri',
      hire_date: '2023-09-15',
      employment_type: 'full_time',
      status: 'active',
      salary: 5500000,
      payment_type: 'monthly',
      notes: '',
      created_at: '2023-09-15T11:00:00',
      created_by: { name: 'HR Manager' }
    },
    {
      id: 4,
      employee_id: 'EMP-004',
      first_name: 'Dilnoza',
      last_name: 'Azimova',
      middle_name: 'Bakhtiyorovna',
      birth_date: '1990-12-05',
      gender: 'female',
      passport: 'AD4567890',
      phone: '+998 94 456-78-90',
      email: 'dilnoza@example.com',
      address: 'Toshkent, Yunusobod tumani',
      department_id: 4,
      department: { id: 4, name: 'Moliya' },
      position: 'Bosh hisobchi',
      hire_date: '2021-03-01',
      employment_type: 'full_time',
      status: 'on_leave',
      salary: 8000000,
      payment_type: 'monthly',
      notes: 'Mehnat ta\'tilida',
      created_at: '2021-03-01T08:30:00',
      created_by: { name: 'Admin' }
    }
  ]
  
  const mockStats = {
    totalEmployees: 45,
    activeEmployees: 42,
    onLeave: 3,
    newHires: 8,
    totalDepartments: 6,
    averageSalary: 6200000,
    totalSalaryExpense: 279000000,
    attendanceRate: 96.5,
    employeesByDepartment: [
      { department: 'Ishlab chiqarish', count: 18 },
      { department: 'Ombor', count: 8 },
      { department: 'Sotish', count: 6 },
      { department: 'Moliya', count: 5 },
      { department: 'Boshqaruv', count: 4 },
      { department: 'Texnik xizmat', count: 4 }
    ],
    employeesByStatus: [
      { status: 'active', count: 42 },
      { status: 'on_leave', count: 3 },
      { status: 'terminated', count: 0 }
    ]
  }
  
  const mockDepartments = [
    { id: 1, name: 'Ishlab chiqarish', employee_count: 18, head: 'Alisher Karimov' },
    { id: 2, name: 'Ombor', employee_count: 8, head: 'Javohir Toshmatov' },
    { id: 3, name: 'Sotish', employee_count: 6, head: 'Madina Rahimova' },
    { id: 4, name: 'Moliya', employee_count: 5, head: 'Dilnoza Azimova' },
    { id: 5, name: 'Boshqaruv', employee_count: 4, head: 'Bekzod Usmonov' },
    { id: 6, name: 'Texnik xizmat', employee_count: 4, head: 'Sardor Meliev' }
  ]
  
  // Actions
  
  /**
   * Fetch HR statistics
   */
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/hr/stats')
      await new Promise(resolve => setTimeout(resolve, 300))
      stats.value = mockStats
      return stats.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch employees
   */
  async function fetchEmployees(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/hr/employees', { params })
      await new Promise(resolve => setTimeout(resolve, 300))
      employees.value = mockEmployees
      return employees.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create employee
   */
  async function createEmployee(data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/hr/employees', data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newEmployee = {
        id: employees.value.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        created_by: { name: 'Current User' }
      }
      
      employees.value.unshift(newEmployee)
      
      // Update stats
      stats.value.totalEmployees++
      if (data.status === 'active') {
        stats.value.activeEmployees++
      }
      
      return newEmployee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update employee
   */
  async function updateEmployee(id, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/hr/employees/${id}`, data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = employees.value.findIndex(e => e.id === id)
      if (index > -1) {
        const oldStatus = employees.value[index].status
        
        employees.value[index] = {
          ...employees.value[index],
          ...data,
          updated_at: new Date().toISOString(),
          updated_by: { name: 'Current User' }
        }
        
        // Update stats if status changed
        if (oldStatus !== data.status) {
          if (oldStatus === 'active') stats.value.activeEmployees--
          if (data.status === 'active') stats.value.activeEmployees++
          if (data.status === 'on_leave') stats.value.onLeave++
          if (oldStatus === 'on_leave') stats.value.onLeave--
        }
      }
      
      return employees.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete employee
   */
  async function deleteEmployee(id) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/hr/employees/${id}`)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = employees.value.findIndex(e => e.id === id)
      if (index > -1) {
        const employee = employees.value[index]
        
        // Update stats
        stats.value.totalEmployees--
        if (employee.status === 'active') {
          stats.value.activeEmployees--
        } else if (employee.status === 'on_leave') {
          stats.value.onLeave--
        }
        
        employees.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch departments
   */
  async function fetchDepartments() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      departments.value = mockDepartments
      return departments.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch attendance
   */
  async function fetchAttendance(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      attendance.value = []
      return attendance.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch leaves
   */
  async function fetchLeaves(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      leaves.value = []
      return leaves.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get employee by ID
   */
  function getEmployeeById(id) {
    return employees.value.find(e => e.id === id)
  }
  
  /**
   * Get department by ID
   */
  function getDepartmentById(id) {
    return departments.value.find(d => d.id === id)
  }
  
  /**
   * Get employees by department
   */
  function getEmployeesByDepartment(departmentId) {
    return employees.value.filter(e => e.department_id === departmentId)
  }
  
  /**
   * Get active employees
   */
  function getActiveEmployees() {
    return employees.value.filter(e => e.status === 'active')
  }
  
  /**
   * Search employees
   */
  function searchEmployees(query) {
    if (!query) return employees.value
    
    const lowerQuery = query.toLowerCase()
    return employees.value.filter(employee => {
      return employee.first_name?.toLowerCase().includes(lowerQuery) ||
             employee.last_name?.toLowerCase().includes(lowerQuery) ||
             employee.employee_id?.toLowerCase().includes(lowerQuery) ||
             employee.position?.toLowerCase().includes(lowerQuery) ||
             employee.phone?.includes(query) ||
             employee.email?.toLowerCase().includes(lowerQuery)
    })
  }
  
  /**
   * Filter employees by status
   */
  function filterByStatus(status) {
    return employees.value.filter(e => e.status === status)
  }
  
  /**
   * Filter employees by department
   */
  function filterByDepartment(departmentId) {
    return employees.value.filter(e => e.department_id === departmentId)
  }
  
  /**
   * Reset store
   */
  function reset() {
    employees.value = []
    departments.value = []
    attendance.value = []
    leaves.value = []
    stats.value = {
      totalEmployees: 0,
      activeEmployees: 0,
      onLeave: 0,
      newHires: 0,
      totalDepartments: 0,
      averageSalary: 0,
      totalSalaryExpense: 0,
      attendanceRate: 0
    }
    loading.value = false
    error.value = null
  }
  
  return {
    // State
    employees,
    departments,
    attendance,
    leaves,
    stats,
    loading,
    error,
    
    // Actions
    fetchStats,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchDepartments,
    fetchAttendance,
    fetchLeaves,
    
    // Getters
    getEmployeeById,
    getDepartmentById,
    getEmployeesByDepartment,
    getActiveEmployees,
    searchEmployees,
    filterByStatus,
    filterByDepartment,
    
    // Reset
    reset
  }
})