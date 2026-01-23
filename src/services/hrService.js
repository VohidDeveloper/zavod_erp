import { apiClient } from './api'

const hrService = {
  // ==================== EMPLOYEES ====================
  
  getEmployees(params = {}) {
    return apiClient.get('/hr/employees', params)
  },

  getEmployee(id) {
    return apiClient.get(`/hr/employees/${id}`)
  },

  createEmployee(data) {
    return apiClient.post('/hr/employees', data)
  },

  updateEmployee(id, data) {
    return apiClient.put(`/hr/employees/${id}`, data)
  },

  deleteEmployee(id) {
    return apiClient.delete(`/hr/employees/${id}`)
  },

  terminateEmployee(id, data) {
    return apiClient.post(`/hr/employees/${id}/terminate`, data)
  },

  activateEmployee(id) {
    return apiClient.post(`/hr/employees/${id}/activate`)
  },

  // ==================== ATTENDANCE ====================
  
  getAttendance(params = {}) {
    return apiClient.get('/hr/attendance', params)
  },

  getEmployeeAttendance(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/attendance`, params)
  },

  markAttendance(data) {
    return apiClient.post('/hr/attendance', data)
  },

  updateAttendance(id, data) {
    return apiClient.put(`/hr/attendance/${id}`, data)
  },

  deleteAttendance(id) {
    return apiClient.delete(`/hr/attendance/${id}`)
  },

  getTodayAttendance() {
    return apiClient.get('/hr/attendance/today')
  },

  // ==================== SALARIES ====================
  
  getSalaries(params = {}) {
    return apiClient.get('/hr/salaries', params)
  },

  getSalary(id) {
    return apiClient.get(`/hr/salaries/${id}`)
  },

  getEmployeeSalary(employeeId) {
    return apiClient.get(`/hr/employees/${employeeId}/salary`)
  },

  createSalary(data) {
    return apiClient.post('/hr/salaries', data)
  },

  updateSalary(id, data) {
    return apiClient.put(`/hr/salaries/${id}`, data)
  },

  deleteSalary(id) {
    return apiClient.delete(`/hr/salaries/${id}`)
  },

  // Payroll
  processPayroll(data) {
    return apiClient.post('/hr/payroll/process', data)
  },

  getPayrollHistory(params = {}) {
    return apiClient.get('/hr/payroll/history', params)
  },

  getPayrollReport(month, year) {
    return apiClient.get('/hr/payroll/report', { month, year })
  },

  generatePayslip(employeeId, month, year) {
    return apiClient.get(`/hr/employees/${employeeId}/payslip`, { month, year })
  },

  // ==================== LEAVE REQUESTS ====================
  
  getLeaveRequests(params = {}) {
    return apiClient.get('/hr/leave-requests', params)
  },

  getLeaveRequest(id) {
    return apiClient.get(`/hr/leave-requests/${id}`)
  },

  getEmployeeLeaveRequests(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/leave-requests`, params)
  },

  createLeaveRequest(data) {
    return apiClient.post('/hr/leave-requests', data)
  },

  updateLeaveRequest(id, data) {
    return apiClient.put(`/hr/leave-requests/${id}`, data)
  },

  deleteLeaveRequest(id) {
    return apiClient.delete(`/hr/leave-requests/${id}`)
  },

  approveLeaveRequest(id, data = {}) {
    return apiClient.post(`/hr/leave-requests/${id}/approve`, data)
  },

  rejectLeaveRequest(id, data = {}) {
    return apiClient.post(`/hr/leave-requests/${id}/reject`, data)
  },

  cancelLeaveRequest(id) {
    return apiClient.post(`/hr/leave-requests/${id}/cancel`)
  },

  // ==================== DEPARTMENTS ====================
  
  getDepartments(params = {}) {
    return apiClient.get('/hr/departments', params)
  },

  getDepartment(id) {
    return apiClient.get(`/hr/departments/${id}`)
  },

  createDepartment(data) {
    return apiClient.post('/hr/departments', data)
  },

  updateDepartment(id, data) {
    return apiClient.put(`/hr/departments/${id}`, data)
  },

  deleteDepartment(id) {
    return apiClient.delete(`/hr/departments/${id}`)
  },

  // ==================== POSITIONS ====================
  
  getPositions(params = {}) {
    return apiClient.get('/hr/positions', params)
  },

  getPosition(id) {
    return apiClient.get(`/hr/positions/${id}`)
  },

  createPosition(data) {
    return apiClient.post('/hr/positions', data)
  },

  updatePosition(id, data) {
    return apiClient.put(`/hr/positions/${id}`, data)
  },

  deletePosition(id) {
    return apiClient.delete(`/hr/positions/${id}`)
  },

  // ==================== LEAVE TYPES ====================
  
  getLeaveTypes() {
    return apiClient.get('/hr/leave-types')
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/hr/stats', params)
  },

  getAttendanceStats(params = {}) {
    return apiClient.get('/hr/stats/attendance', params)
  },

  getEmployeeStats(employeeId, params = {}) {
    return apiClient.get(`/hr/employees/${employeeId}/stats`, params)
  },

  getDepartmentStats(departmentId, params = {}) {
    return apiClient.get(`/hr/departments/${departmentId}/stats`, params)
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/hr/reports/${type}`, params)
  },

  exportEmployees(params = {}, format = 'xlsx') {
    return apiClient.download('/hr/employees/export', `employees.${format}`, { ...params, format })
  },

  exportAttendance(params = {}, format = 'xlsx') {
    return apiClient.download('/hr/attendance/export', `attendance.${format}`, { ...params, format })
  },

  exportPayroll(month, year, format = 'xlsx') {
    return apiClient.download('/hr/payroll/export', `payroll-${month}-${year}.${format}`, { month, year, format })
  }
}

export default hrService