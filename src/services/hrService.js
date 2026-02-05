import { apiClient } from './api'

const hrService = {
  // ============ DEPARTMENTS ============
  
  /**
   * Get all departments
   * @param {Object} params - { skip, limit }
   */
  getDepartments(params = {}) {
    return apiClient.get('/hr/departments', { params })
  },

  /**
   * Get single department by ID
   * @param {string} departmentId - Department UUID
   */
  getDepartment(departmentId) {
    return apiClient.get(`/hr/departments/${departmentId}`)
  },

  /**
   * Create new department
   * @param {Object} data - { name, description }
   */
  createDepartment(data) {
    return apiClient.post('/hr/departments', data)
  },

  /**
   * Update department
   * @param {string} departmentId - Department UUID
   * @param {Object} data - { name, description }
   */
  updateDepartment(departmentId, data) {
    return apiClient.put(`/hr/departments/${departmentId}`, data)
  },

  /**
   * Delete department
   * @param {string} departmentId - Department UUID
   */
  deleteDepartment(departmentId) {
    return apiClient.delete(`/hr/departments/${departmentId}`)
  },

  // ============ EMPLOYEES ============

  /**
   * Get all employees
   * @param {Object} params - { skip, limit, department_id, employment_status }
   */
  getEmployees(params = {}) {
    return apiClient.get('/hr/employees', { params })
  },

  /**
   * Get single employee by ID
   * @param {string} employeeId - Employee UUID
   */
  getEmployee(employeeId) {
    return apiClient.get(`/hr/employees/${employeeId}`)
  },

  /**
   * Create new employee
   * @param {Object} data - Employee data
   */
  createEmployee(data) {
    return apiClient.post('/hr/employees', data)
  },

  /**
   * Update employee
   * @param {string} employeeId - Employee UUID
   * @param {Object} data - Employee data
   */
  updateEmployee(employeeId, data) {
    return apiClient.put(`/hr/employees/${employeeId}`, data)
  },

  /**
   * Delete employee
   * @param {string} employeeId - Employee UUID
   */
  deleteEmployee(employeeId) {
    return apiClient.delete(`/hr/employees/${employeeId}`)
  },

  // ============ ATTENDANCE ============

  /**
   * Create attendance record
   * @param {Object} data - { employee_id, attendance_date, check_in_time, check_out_time, status, notes }
   */
  createAttendance(data) {
    return apiClient.post('/hr/attendances', data)
  },

  /**
   * Get today's attendance
   * @param {string} attendanceDate - Date in YYYY-MM-DD format
   */
  getTodayAttendance(attendanceDate = null) {
    const params = attendanceDate ? { attendance_date: attendanceDate } : {}
    return apiClient.get('/hr/attendances/today', { params })
  },

  /**
   * Get employee attendance history
   * @param {string} employeeId - Employee UUID
   * @param {Object} params - { start_date, end_date }
   */
  getEmployeeAttendance(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/attendances`, { params })
  },

  /**
   * Update attendance record
   * @param {string} attendanceId - Attendance UUID
   * @param {Object} data - { check_in_time, check_out_time, status, notes }
   */
  updateAttendance(attendanceId, data) {
    return apiClient.put(`/hr/attendances/${attendanceId}`, data)
  },

  /**
   * Delete attendance record
   * @param {string} attendanceId - Attendance UUID
   */
  deleteAttendance(attendanceId) {
    return apiClient.delete(`/hr/attendances/${attendanceId}`)
  },

  // ============ SALARY PAYMENTS ============

  /**
   * Create salary payment
   * @param {Object} data - Salary payment data
   */
  createSalaryPayment(data) {
    return apiClient.post('/hr/salary-payments', data)
  },

  /**
   * Get salary payment by ID
   * @param {string} paymentId - Payment UUID
   */
  getSalaryPayment(paymentId) {
    return apiClient.get(`/hr/salary-payments/${paymentId}`)
  },

  /**
   * Get employee salary payments
   * @param {string} employeeId - Employee UUID
   * @param {Object} params - { skip, limit }
   */
  getEmployeeSalaryPayments(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/salary-payments`, { params })
  },

  // ============ LEAVE REQUESTS ============

  /**
   * Create leave request
   * @param {Object} data - { employee_id, leave_type, start_date, end_date, reason }
   */
  createLeaveRequest(data) {
    return apiClient.post('/hr/leave-requests', data)
  },

  /**
   * Get all leave requests
   * @param {Object} params - { skip, limit, status }
   */
  getLeaveRequests(params = {}) {
    return apiClient.get('/hr/leave-requests', { params })
  },

  /**
   * Get leave request by ID
   * @param {string} requestId - Leave request UUID
   */
  getLeaveRequest(requestId) {
    return apiClient.get(`/hr/leave-requests/${requestId}`)
  },

  /**
   * Get employee leave requests
   * @param {string} employeeId - Employee UUID
   * @param {Object} params - { skip, limit }
   */
  getEmployeeLeaveRequests(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/leave-requests`, { params })
  },

  /**
   * Approve/Reject leave request
   * @param {string} requestId - Leave request UUID
   * @param {Object} data - { status: 'approved' | 'rejected' }
   */
  approveLeaveRequest(requestId, data) {
    return apiClient.put(`/hr/leave-requests/${requestId}/approve`, data)
  },

  // ============ STATISTICS ============

  /**
   * Get HR statistics
   */
  getStatistics() {
    return apiClient.get('/hr/statistics')
  }
}

export default hrService