import { defineStore } from 'pinia'
import analyticsService from '@/services/analyticsService'

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    // Dashboard stats
    dashboardStats: {
      production: {
        totalOutput: 0,
        efficiency: 0,
        defectRate: 0,
        activeLines: 0
      },
      sales: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        growthRate: 0
      },
      finance: {
        revenue: 0,
        expenses: 0,
        profit: 0,
        profitMargin: 0
      },
      warehouse: {
        totalStock: 0,
        lowStockItems: 0,
        stockValue: 0,
        turnoverRate: 0
      },
      hr: {
        totalEmployees: 0,
        presentToday: 0,
        onLeave: 0,
        attendanceRate: 0
      }
    },
    
    // Production analytics
    productionAnalytics: {
      dailyOutput: [],
      weeklyOutput: [],
      monthlyOutput: [],
      efficiency: [],
      defectRate: [],
      linePerformance: [],
      downtimeAnalysis: [],
      qualityMetrics: [],
      topProducts: [],
      productionTrends: []
    },
    
    // Sales analytics
    salesAnalytics: {
      dailySales: [],
      weeklySales: [],
      monthlySales: [],
      salesByProduct: [],
      salesByCustomer: [],
      salesByRegion: [],
      topProducts: [],
      topCustomers: [],
      salesTrends: [],
      conversionRate: [],
      averageOrderValue: []
    },
    
    // Finance analytics
    financeAnalytics: {
      revenue: [],
      expenses: [],
      profit: [],
      cashFlow: [],
      revenueByCategory: [],
      expensesByCategory: [],
      profitMargin: [],
      balanceSheet: {},
      incomeStatement: {},
      cashFlowStatement: {},
      financialRatios: {}
    },
    
    // Warehouse analytics
    warehouseAnalytics: {
      stockLevels: [],
      stockMovement: [],
      turnoverRate: [],
      fastMoving: [],
      slowMoving: [],
      expiringStock: [],
      stockValue: [],
      warehouseUtilization: [],
      inventoryAge: []
    },
    
    // HR analytics
    hrAnalytics: {
      attendance: [],
      productivity: [],
      turnover: [],
      salaryDistribution: [],
      departmentStats: [],
      leaveAnalysis: [],
      overtimeAnalysis: []
    },
    
    // Custom reports
    customReports: [],
    
    // Comparisons
    comparisons: {
      periodComparison: {},
      categoryComparison: {},
      productComparison: {}
    },
    
    // Forecasts
    forecasts: {
      salesForecast: [],
      productionForecast: [],
      demandForecast: []
    },
    
    // Date range
    dateRange: {
      start: null,
      end: null,
      preset: 'thisMonth' // today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth, custom
    },
    
    // Filters
    filters: {
      department: null,
      category: null,
      product: null,
      customer: null,
      region: null
    },
    
    // Loading states
    loading: false,
    dashboardLoading: false,
    productionLoading: false,
    salesLoading: false,
    financeLoading: false,
    warehouseLoading: false,
    hrLoading: false,
    
    error: null
  }),

  getters: {
    // Production metrics
    totalProduction: (state) => {
      return state.productionAnalytics.dailyOutput.reduce((sum, item) => sum + (item.quantity || 0), 0)
    },
    
    averageEfficiency: (state) => {
      if (state.productionAnalytics.efficiency.length === 0) return 0
      const total = state.productionAnalytics.efficiency.reduce((sum, item) => sum + (item.value || 0), 0)
      return (total / state.productionAnalytics.efficiency.length).toFixed(2)
    },
    
    averageDefectRate: (state) => {
      if (state.productionAnalytics.defectRate.length === 0) return 0
      const total = state.productionAnalytics.defectRate.reduce((sum, item) => sum + (item.rate || 0), 0)
      return (total / state.productionAnalytics.defectRate.length).toFixed(2)
    },
    
    // Sales metrics
    totalRevenue: (state) => {
      return state.salesAnalytics.dailySales.reduce((sum, item) => sum + (item.amount || 0), 0)
    },
    
    totalOrders: (state) => {
      return state.salesAnalytics.dailySales.reduce((sum, item) => sum + (item.orders || 0), 0)
    },
    
    averageDailySales: (state) => {
      if (state.salesAnalytics.dailySales.length === 0) return 0
      const total = state.salesAnalytics.dailySales.reduce((sum, item) => sum + (item.amount || 0), 0)
      return (total / state.salesAnalytics.dailySales.length).toFixed(2)
    },
    
    averageOrderValue: (state) => {
      const revenue = state.salesAnalytics.dailySales.reduce((sum, item) => sum + (item.amount || 0), 0)
      const orders = state.salesAnalytics.dailySales.reduce((sum, item) => sum + (item.orders || 0), 0)
      return orders > 0 ? (revenue / orders).toFixed(2) : 0
    },
    
    // Finance metrics
    totalProfit: (state) => {
      return state.financeAnalytics.profit.reduce((sum, item) => sum + (item.amount || 0), 0)
    },
    
    profitMargin: (state) => {
      const revenue = state.financeAnalytics.revenue.reduce((sum, item) => sum + (item.amount || 0), 0)
      const expenses = state.financeAnalytics.expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
      if (revenue === 0) return 0
      return (((revenue - expenses) / revenue) * 100).toFixed(2)
    },
    
    totalExpenses: (state) => {
      return state.financeAnalytics.expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
    },
    
    // Warehouse metrics
    totalStockValue: (state) => {
      return state.warehouseAnalytics.stockValue.reduce((sum, item) => sum + (item.value || 0), 0)
    },
    
    averageTurnoverRate: (state) => {
      if (state.warehouseAnalytics.turnoverRate.length === 0) return 0
      const total = state.warehouseAnalytics.turnoverRate.reduce((sum, item) => sum + (item.rate || 0), 0)
      return (total / state.warehouseAnalytics.turnoverRate.length).toFixed(2)
    },
    
    // Date range helpers
    dateRangeLabel: (state) => {
      const presets = {
        today: 'Bugun',
        yesterday: 'Kecha',
        thisWeek: 'Bu hafta',
        lastWeek: 'O\'tgan hafta',
        thisMonth: 'Bu oy',
        lastMonth: 'O\'tgan oy',
        custom: 'Maxsus'
      }
      return presets[state.dateRange.preset] || 'Custom'
    }
  },

  actions: {
    // ==================== DASHBOARD ====================
    
    async fetchDashboardStats(params = {}) {
      this.dashboardLoading = true
      this.error = null
      try {
        const response = await analyticsService.getDashboardStats({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.dashboardStats = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.dashboardLoading = false
      }
    },

    async fetchDashboard(params = {}) {
      return this.fetchDashboardStats(params)
    },

    // ==================== PRODUCTION ====================
    
    async fetchProductionAnalytics(params = {}) {
      this.productionLoading = true
      this.error = null
      try {
        const response = await analyticsService.getProductionAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        this.productionAnalytics = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.productionLoading = false
      }
    },

    async fetchDailyOutput(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getDailyOutput({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.productionAnalytics.dailyOutput = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEfficiencyMetrics(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getEfficiencyMetrics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.productionAnalytics.efficiency = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchLinePerformance(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getLinePerformance({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.productionAnalytics.linePerformance = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== SALES ====================
    
    async fetchSalesAnalytics(params = {}) {
      this.salesLoading = true
      this.error = null
      try {
        const response = await analyticsService.getSalesAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        this.salesAnalytics = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.salesLoading = false
      }
    },

    async fetchDailySales(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getDailySales({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.salesAnalytics.dailySales = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTopProducts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getTopProducts({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.salesAnalytics.topProducts = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTopCustomers(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getTopCustomers({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.salesAnalytics.topCustomers = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSalesByRegion(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getSalesByRegion({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.salesAnalytics.salesByRegion = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== FINANCE ====================
    
    async fetchFinanceAnalytics(params = {}) {
      this.financeLoading = true
      this.error = null
      try {
        const response = await analyticsService.getFinanceAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        this.financeAnalytics = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.financeLoading = false
      }
    },

    async fetchRevenueExpenses(params = {}) {
      this.loading = true
      this.error = null
      try {
        const [revenueRes, expensesRes] = await Promise.all([
          analyticsService.getRevenue({
            ...params,
            start_date: this.dateRange.start,
            end_date: this.dateRange.end
          }),
          analyticsService.getExpenses({
            ...params,
            start_date: this.dateRange.start,
            end_date: this.dateRange.end
          })
        ])
        this.financeAnalytics.revenue = revenueRes.data
        this.financeAnalytics.expenses = expensesRes.data
        return { revenue: revenueRes, expenses: expensesRes }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCashFlow(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getCashFlow({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.financeAnalytics.cashFlow = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchFinancialStatements(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getFinancialStatements({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.financeAnalytics.balanceSheet = response.data.balanceSheet
        this.financeAnalytics.incomeStatement = response.data.incomeStatement
        this.financeAnalytics.cashFlowStatement = response.data.cashFlowStatement
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== WAREHOUSE ====================
    
    async fetchWarehouseAnalytics(params = {}) {
      this.warehouseLoading = true
      this.error = null
      try {
        const response = await analyticsService.getWarehouseAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        this.warehouseAnalytics = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.warehouseLoading = false
      }
    },

    async fetchStockLevels(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getStockLevels(params)
        this.warehouseAnalytics.stockLevels = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchInventoryAge(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getInventoryAge(params)
        this.warehouseAnalytics.inventoryAge = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== HR ====================
    
    async fetchHRAnalytics(params = {}) {
      this.hrLoading = true
      this.error = null
      try {
        const response = await analyticsService.getHRAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        this.hrAnalytics = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.hrLoading = false
      }
    },

    async fetchAttendanceAnalytics(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getAttendanceAnalytics({
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.hrAnalytics.attendance = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== CUSTOM REPORTS ====================
    
    async generateReport(type, params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.generateReport(type, {
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCustomReports() {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getCustomReports()
        this.customReports = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveCustomReport(data) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.saveCustomReport(data)
        this.customReports.unshift(response.data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== COMPARISONS ====================
    
    async comparePeriods(period1, period2, metric) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.comparePeriods({
          period1,
          period2,
          metric
        })
        this.comparisons.periodComparison = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async compareCategories(categories, metric) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.compareCategories({
          categories,
          metric,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end
        })
        this.comparisons.categoryComparison = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== FORECASTS ====================
    
    async fetchSalesForecast(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getSalesForecast(params)
        this.forecasts.salesForecast = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProductionForecast(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getProductionForecast(params)
        this.forecasts.productionForecast = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchDemandForecast(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.getDemandForecast(params)
        this.forecasts.demandForecast = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== EXPORT ====================
    
    async exportData(type, format, params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await analyticsService.exportData(type, format, {
          ...params,
          start_date: this.dateRange.start,
          end_date: this.dateRange.end,
          ...this.filters
        })
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== DATE RANGE ====================
    
    setDateRange(start, end, preset = 'custom') {
      this.dateRange = { start, end, preset }
    },

    setDatePreset(preset) {
      const now = new Date()
      let start, end
      
      switch (preset) {
        case 'today':
          start = end = now.toISOString().split('T')[0]
          break
        case 'yesterday':
          const yesterday = new Date(now)
          yesterday.setDate(yesterday.getDate() - 1)
          start = end = yesterday.toISOString().split('T')[0]
          break
        case 'thisWeek':
          start = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0]
          end = new Date().toISOString().split('T')[0]
          break
        case 'lastWeek':
          const lastWeekEnd = new Date(now.setDate(now.getDate() - now.getDay() - 1))
          const lastWeekStart = new Date(lastWeekEnd)
          lastWeekStart.setDate(lastWeekEnd.getDate() - 6)
          start = lastWeekStart.toISOString().split('T')[0]
          end = lastWeekEnd.toISOString().split('T')[0]
          break
        case 'thisMonth':
          start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
          end = new Date().toISOString().split('T')[0]
          break
        case 'lastMonth':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
          end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
          break
      }
      
      this.dateRange = { start, end, preset }
    },

    // ==================== FILTERS ====================
    
    setFilter(key, value) {
      this.filters[key] = value
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        department: null,
        category: null,
        product: null,
        customer: null,
        region: null
      }
    },

    // Reset
    reset() {
      this.dashboardStats = {
        production: {},
        sales: {},
        finance: {},
        warehouse: {},
        hr: {}
      }
      this.productionAnalytics = {
        dailyOutput: [],
        efficiency: [],
        defectRate: [],
        linePerformance: []
      }
      this.salesAnalytics = {
        dailySales: [],
        topProducts: [],
        topCustomers: [],
        salesByRegion: []
      }
      this.financeAnalytics = {
        revenue: [],
        expenses: [],
        profit: [],
        cashFlow: []
      }
      this.warehouseAnalytics = {
        stockLevels: [],
        turnoverRate: [],
        fastMoving: [],
        slowMoving: []
      }
      this.hrAnalytics = {
        attendance: [],
        productivity: [],
        turnover: []
      }
      this.customReports = []
      this.comparisons = {}
      this.forecasts = {}
      this.error = null
    }
  }
})