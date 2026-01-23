import { defineStore } from 'pinia'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    customers: [],
    orders: [],
    products: [],
    deliveries: [],
    loading: false,
    error: null
  }),

  getters: {
    // Active customers
    activeCustomers: (state) => {
      return state.customers.filter(c => c.status === 'active')
    },
    
    // Total customers
    totalCustomers: (state) => state.customers.length,
    
    // Pending orders
    pendingOrders: (state) => {
      return state.orders.filter(o => o.status === 'pending')
    },
    
    // Completed orders
    completedOrders: (state) => {
      return state.orders.filter(o => o.status === 'completed')
    },
    
    // Total sales
    totalSales: (state) => {
      return state.orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    },
    
    // Today's sales
    todaySales: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.orders
        .filter(o => o.date === today)
        .reduce((sum, o) => sum + o.totalAmount, 0)
    },
    
    // Top customers
    topCustomers: (state) => {
      const customerSales = {}
      
      state.orders.forEach(order => {
        if (!customerSales[order.customerId]) {
          customerSales[order.customerId] = 0
        }
        customerSales[order.customerId] += order.totalAmount
      })
      
      return Object.entries(customerSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([customerId, total]) => ({
          customer: state.customers.find(c => c.id == customerId),
          totalSales: total
        }))
    }
  },

  actions: {
    // Customers
    async fetchCustomers(params = {}) {
      this.loading = true
      this.error = null

      try {
        this.customers = [
          {
            id: 1,
            name: 'Customer A',
            phone: '+998901234567',
            email: 'customer.a@example.com',
            address: 'Tashkent, Uzbekistan',
            status: 'active'
          },
          {
            id: 2,
            name: 'Customer B',
            phone: '+998901234568',
            email: 'customer.b@example.com',
            address: 'Samarkand, Uzbekistan',
            status: 'active'
          }
        ]
        return this.customers
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCustomer(id) {
      this.loading = true
      try {
        const customer = this.customers.find(c => c.id === id)
        return customer
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createCustomer(data) {
      this.loading = true
      try {
        const customer = { id: Date.now(), status: 'active', ...data }
        this.customers.push(customer)
        return customer
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(id, data) {
      this.loading = true
      try {
        const index = this.customers.findIndex(c => c.id === id)
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...data }
        }
        return this.customers[index]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(id) {
      this.loading = true
      try {
        const index = this.customers.findIndex(c => c.id === id)
        if (index !== -1) {
          this.customers.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Orders
    async fetchOrders(params = {}) {
      this.loading = true
      try {
        this.orders = [
          {
            id: 1,
            orderNo: 'ORD-001',
            date: '2024-01-23',
            customerId: 1,
            customerName: 'Customer A',
            totalAmount: 5000000,
            status: 'pending'
          },
          {
            id: 2,
            orderNo: 'ORD-002',
            date: '2024-01-22',
            customerId: 2,
            customerName: 'Customer B',
            totalAmount: 3000000,
            status: 'completed'
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

    async fetchOrder(id) {
      this.loading = true
      try {
        const order = this.orders.find(o => o.id === id)
        return order
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
          orderNo: `ORD-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
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

    async updateOrder(id, data) {
      this.loading = true
      try {
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...data }
        }
        return this.orders[index]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(id) {
      this.loading = true
      try {
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Products
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        this.products = [
          { id: 1, name: 'Product A', price: 50000, unit: 'dona', stock: 1000 },
          { id: 2, name: 'Product B', price: 45000, unit: 'dona', stock: 800 }
        ]
        return this.products
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deliveries
    async fetchDeliveries(params = {}) {
      this.loading = true
      try {
        this.deliveries = [
          {
            id: 1,
            deliveryNo: 'DEL-001',
            orderId: 1,
            date: '2024-01-24',
            status: 'scheduled'
          }
        ]
        return this.deliveries
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})