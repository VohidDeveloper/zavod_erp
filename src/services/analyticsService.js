import { apiClient } from './api'

const analyticsService = {
  // ==================== DASHBOARD ====================
  
  getDashboardStats(params = {}) {
    return apiClient.get('/analytics/dashboard', params)
  },

  getModuleStats(module, params = {}) {
    return apiClient.get(`/analytics/dashboard/${module}`, params)
  },

  // ==================== PRODUCTION ANALYTICS ====================
  
  getProductionAnalytics(params = {}) {
    return apiClient.get('/analytics/production', params)
  },

  getDailyOutput(params = {}) {
    return apiClient.get('/analytics/production/daily-output', params)
  },

  getWeeklyOutput(params = {}) {
    return apiClient.get('/analytics/production/weekly-output', params)
  },

  getMonthlyOutput(params = {}) {
    return apiClient.get('/analytics/production/monthly-output', params)
  },

  getEfficiencyMetrics(params = {}) {
    return apiClient.get('/analytics/production/efficiency', params)
  },

  getDefectRateAnalysis(params = {}) {
    return apiClient.get('/analytics/production/defect-rate', params)
  },

  getLinePerformance(params = {}) {
    return apiClient.get('/analytics/production/line-performance', params)
  },

  getDowntimeAnalysis(params = {}) {
    return apiClient.get('/analytics/production/downtime', params)
  },

  getQualityMetrics(params = {}) {
    return apiClient.get('/analytics/production/quality', params)
  },

  getProductionTrends(params = {}) {
    return apiClient.get('/analytics/production/trends', params)
  },

  // ==================== SALES ANALYTICS ====================
  
  getSalesAnalytics(params = {}) {
    return apiClient.get('/analytics/sales', params)
  },

  getDailySales(params = {}) {
    return apiClient.get('/analytics/sales/daily', params)
  },

  getWeeklySales(params = {}) {
    return apiClient.get('/analytics/sales/weekly', params)
  },

  getMonthlySales(params = {}) {
    return apiClient.get('/analytics/sales/monthly', params)
  },

  getSalesByProduct(params = {}) {
    return apiClient.get('/analytics/sales/by-product', params)
  },

  getSalesByCustomer(params = {}) {
    return apiClient.get('/analytics/sales/by-customer', params)
  },

  getSalesByRegion(params = {}) {
    return apiClient.get('/analytics/sales/by-region', params)
  },

  getTopProducts(params = {}) {
    return apiClient.get('/analytics/sales/top-products', params)
  },

  getTopCustomers(params = {}) {
    return apiClient.get('/analytics/sales/top-customers', params)
  },

  getSalesTrends(params = {}) {
    return apiClient.get('/analytics/sales/trends', params)
  },

  getConversionRate(params = {}) {
    return apiClient.get('/analytics/sales/conversion-rate', params)
  },

  getAverageOrderValue(params = {}) {
    return apiClient.get('/analytics/sales/average-order-value', params)
  },

  // ==================== FINANCE ANALYTICS ====================
  
  getFinanceAnalytics(params = {}) {
    return apiClient.get('/analytics/finance', params)
  },

  getRevenue(params = {}) {
    return apiClient.get('/analytics/finance/revenue', params)
  },

  getExpenses(params = {}) {
    return apiClient.get('/analytics/finance/expenses', params)
  },

  getProfit(params = {}) {
    return apiClient.get('/analytics/finance/profit', params)
  },

  getCashFlow(params = {}) {
    return apiClient.get('/analytics/finance/cash-flow', params)
  },

  getRevenueByCategory(params = {}) {
    return apiClient.get('/analytics/finance/revenue-by-category', params)
  },

  getExpensesByCategory(params = {}) {
    return apiClient.get('/analytics/finance/expenses-by-category', params)
  },

  getProfitMargin(params = {}) {
    return apiClient.get('/analytics/finance/profit-margin', params)
  },

  getFinancialStatements(params = {}) {
    return apiClient.get('/analytics/finance/statements', params)
  },

  getBalanceSheet(params = {}) {
    return apiClient.get('/analytics/finance/balance-sheet', params)
  },

  getIncomeStatement(params = {}) {
    return apiClient.get('/analytics/finance/income-statement', params)
  },

  getCashFlowStatement(params = {}) {
    return apiClient.get('/analytics/finance/cash-flow-statement', params)
  },

  getFinancialRatios(params = {}) {
    return apiClient.get('/analytics/finance/ratios', params)
  },

  // ==================== WAREHOUSE ANALYTICS ====================
  
  getWarehouseAnalytics(params = {}) {
    return apiClient.get('/analytics/warehouse', params)
  },

  getStockLevels(params = {}) {
    return apiClient.get('/analytics/warehouse/stock-levels', params)
  },

  getStockMovement(params = {}) {
    return apiClient.get('/analytics/warehouse/stock-movement', params)
  },

  getTurnoverRate(params = {}) {
    return apiClient.get('/analytics/warehouse/turnover-rate', params)
  },

  getFastMovingItems(params = {}) {
    return apiClient.get('/analytics/warehouse/fast-moving', params)
  },

  getSlowMovingItems(params = {}) {
    return apiClient.get('/analytics/warehouse/slow-moving', params)
  },

  getExpiringStock(params = {}) {
    return apiClient.get('/analytics/warehouse/expiring', params)
  },

  getStockValue(params = {}) {
    return apiClient.get('/analytics/warehouse/stock-value', params)
  },

  getWarehouseUtilization(params = {}) {
    return apiClient.get('/analytics/warehouse/utilization', params)
  },

  getInventoryAge(params = {}) {
    return apiClient.get('/analytics/warehouse/inventory-age', params)
  },

  // ==================== HR ANALYTICS ====================
  
  getHRAnalytics(params = {}) {
    return apiClient.get('/analytics/hr', params)
  },

  getAttendanceAnalytics(params = {}) {
    return apiClient.get('/analytics/hr/attendance', params)
  },

  getProductivityAnalytics(params = {}) {
    return apiClient.get('/analytics/hr/productivity', params)
  },

  getTurnoverAnalysis(params = {}) {
    return apiClient.get('/analytics/hr/turnover', params)
  },

  getSalaryDistribution(params = {}) {
    return apiClient.get('/analytics/hr/salary-distribution', params)
  },

  getDepartmentStats(params = {}) {
    return apiClient.get('/analytics/hr/department-stats', params)
  },

  getLeaveAnalysis(params = {}) {
    return apiClient.get('/analytics/hr/leave-analysis', params)
  },

  getOvertimeAnalysis(params = {}) {
    return apiClient.get('/analytics/hr/overtime', params)
  },

  // ==================== COMPARISONS ====================
  
  comparePeriods(params) {
    return apiClient.post('/analytics/compare/periods', params)
  },

  compareCategories(params) {
    return apiClient.post('/analytics/compare/categories', params)
  },

  compareProducts(params) {
    return apiClient.post('/analytics/compare/products', params)
  },

  compareCustomers(params) {
    return apiClient.post('/analytics/compare/customers', params)
  },

  // ==================== FORECASTS ====================
  
  getSalesForecast(params = {}) {
    return apiClient.get('/analytics/forecast/sales', params)
  },

  getProductionForecast(params = {}) {
    return apiClient.get('/analytics/forecast/production', params)
  },

  getDemandForecast(params = {}) {
    return apiClient.get('/analytics/forecast/demand', params)
  },

  getRevenueForecast(params = {}) {
    return apiClient.get('/analytics/forecast/revenue', params)
  },

  // ==================== CUSTOM REPORTS ====================
  
  getCustomReports(params = {}) {
    return apiClient.get('/analytics/reports/custom', params)
  },

  getCustomReport(id) {
    return apiClient.get(`/analytics/reports/custom/${id}`)
  },

  saveCustomReport(data) {
    return apiClient.post('/analytics/reports/custom', data)
  },

  updateCustomReport(id, data) {
    return apiClient.put(`/analytics/reports/custom/${id}`, data)
  },

  deleteCustomReport(id) {
    return apiClient.delete(`/analytics/reports/custom/${id}`)
  },

  generateReport(type, params = {}) {
    return apiClient.post(`/analytics/reports/generate/${type}`, params)
  },

  runCustomReport(id, params = {}) {
    return apiClient.post(`/analytics/reports/custom/${id}/run`, params)
  },

  // ==================== KPIs ====================
  
  getKPIs(params = {}) {
    return apiClient.get('/analytics/kpis', params)
  },

  getKPIsByModule(module, params = {}) {
    return apiClient.get(`/analytics/kpis/${module}`, params)
  },

  // ==================== TRENDS ====================
  
  getTrends(metric, params = {}) {
    return apiClient.get(`/analytics/trends/${metric}`, params)
  },

  // ==================== INSIGHTS ====================
  
  getInsights(params = {}) {
    return apiClient.get('/analytics/insights', params)
  },

  getAnomalies(params = {}) {
    return apiClient.get('/analytics/anomalies', params)
  },

  // ==================== EXPORTS ====================
  
  exportData(type, format, params = {}) {
    const filename = `${type}-${new Date().toISOString().split('T')[0]}.${format}`
    return apiClient.download(`/analytics/export/${type}`, filename, { ...params, format })
  },

  exportReport(reportId, format = 'xlsx') {
    const filename = `report-${reportId}.${format}`
    return apiClient.download(`/analytics/reports/${reportId}/export`, filename, { format })
  },

  exportDashboard(params = {}, format = 'pdf') {
    const filename = `dashboard-${new Date().toISOString().split('T')[0]}.${format}`
    return apiClient.download('/analytics/dashboard/export', filename, { ...params, format })
  },

  // ==================== REAL-TIME ====================
  
  getRealTimeMetrics(module) {
    return apiClient.get(`/analytics/realtime/${module}`)
  },

  // ==================== ALERTS ====================
  
  getAnalyticsAlerts(params = {}) {
    return apiClient.get('/analytics/alerts', params)
  },

  createAlert(data) {
    return apiClient.post('/analytics/alerts', data)
  },

  updateAlert(id, data) {
    return apiClient.put(`/analytics/alerts/${id}`, data)
  },

  deleteAlert(id) {
    return apiClient.delete(`/analytics/alerts/${id}`)
  }
}

export default analyticsService