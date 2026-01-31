import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSalesStore = defineStore('sales', () => {
  // State
  const customers = ref([])
  const orders = ref([])
  const invoices = ref([])
  const stats = ref({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    topCustomers: []
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  // Mock data
  const mockCustomers = [
    {
      id: 1,
      type: 'company',
      company_name: 'Plastik Savdo',
      inn: '123456789',
      oked: '12345',
      phone: '+998 90 123-45-67',
      email: 'info@plastiksavdo.uz',
      region: 'Toshkent',
      district: 'Yakkasaroy',
      address: 'Amir Temur ko\'chasi, 15',
      status: 'active',
      total_orders: 45,
      total_amount: 125000000,
      debt: 5000000,
      created_at: '2024-01-15T10:00:00',
      created_by: { name: 'Admin' }
    },
    {
      id: 2,
      type: 'individual',
      first_name: 'Alisher',
      last_name: 'Karimov',
      phone: '+998 91 234-56-78',
      email: 'alisher@example.com',
      region: 'Samarqand',
      district: 'Markaziy',
      address: 'Registon ko\'chasi, 5',
      status: 'active',
      total_orders: 23,
      total_amount: 45000000,
      debt: 0,
      created_at: '2024-01-20T14:30:00',
      created_by: { name: 'Manager' }
    },
    {
      id: 3,
      type: 'company',
      company_name: 'Xorazm Plastmassa',
      inn: '234567890',
      oked: '23456',
      phone: '+998 93 345-67-89',
      email: 'info@xorplast.uz',
      region: 'Xorazm',
      district: 'Urganch',
      address: 'Al-Xorazmiy ko\'chasi, 8',
      status: 'active',
      total_orders: 67,
      total_amount: 230000000,
      debt: 12000000,
      created_at: '2024-01-10T09:15:00',
      created_by: { name: 'Admin' }
    }
  ]
  
  const mockStats = {
    totalCustomers: 156,
    totalOrders: 845,
    totalRevenue: 3450000000,
    activeCustomers: 142,
    pendingOrders: 23,
    completedOrders: 789,
    cancelledOrders: 33,
    averageOrderValue: 4083431,
    topCustomers: [
      { id: 3, name: 'Xorazm Plastmassa', orders: 67, revenue: 230000000 },
      { id: 1, name: 'Plastik Savdo', orders: 45, revenue: 125000000 },
      { id: 2, name: 'Alisher Karimov', orders: 23, revenue: 45000000 }
    ]
  }
  
  const mockOrders = [
    {
      id: 1,
      order_number: 'ORD-001',
      customer_id: 1,
      customer: { name: 'Plastik Savdo', type: 'company' },
      order_date: '2024-01-29',
      status: 'pending',
      total_amount: 5000000,
      paid_amount: 0,
      items_count: 3
    }
  ]
  
  // Actions
  
  /**
   * Fetch sales statistics
   */
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/sales/stats')
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
   * Fetch customers
   */
  async function fetchCustomers(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/sales/customers', { params })
      await new Promise(resolve => setTimeout(resolve, 300))
      customers.value = mockCustomers
      return customers.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create customer
   */
  async function createCustomer(data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/sales/customers', data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newCustomer = {
        id: customers.value.length + 1,
        ...data,
        status: 'active',
        total_orders: 0,
        total_amount: 0,
        debt: 0,
        created_at: new Date().toISOString(),
        created_by: { name: 'Current User' }
      }
      
      customers.value.unshift(newCustomer)
      return newCustomer
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update customer
   */
  async function updateCustomer(id, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/sales/customers/${id}`, data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = customers.value.findIndex(c => c.id === id)
      if (index > -1) {
        customers.value[index] = {
          ...customers.value[index],
          ...data,
          updated_at: new Date().toISOString(),
          updated_by: { name: 'Current User' }
        }
      }
      
      return customers.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete customer
   */
  async function deleteCustomer(id) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/sales/customers/${id}`)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = customers.value.findIndex(c => c.id === id)
      if (index > -1) {
        customers.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch orders
   */
  async function fetchOrders(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      orders.value = mockOrders
      return orders.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create order
   */
  async function createOrder(data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newOrder = {
        id: orders.value.length + 1,
        order_number: `ORD-${String(orders.value.length + 1).padStart(3, '0')}`,
        ...data,
        order_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }
      
      orders.value.unshift(newOrder)
      return newOrder
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update order
   */
  async function updateOrder(id, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = orders.value.findIndex(o => o.id === id)
      if (index > -1) {
        orders.value[index] = {
          ...orders.value[index],
          ...data,
          updated_at: new Date().toISOString()
        }
      }
      
      return orders.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete order
   */
  async function deleteOrder(id) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = orders.value.findIndex(o => o.id === id)
      if (index > -1) {
        orders.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get customer by ID
   */
  function getCustomerById(id) {
    return customers.value.find(c => c.id === id)
  }
  
  /**
   * Get order by ID
   */
  function getOrderById(id) {
    return orders.value.find(o => o.id === id)
  }
  
  /**
   * Get customer orders
   */
  function getCustomerOrders(customerId) {
    return orders.value.filter(o => o.customer_id === customerId)
  }
  
  /**
   * Search customers
   */
  function searchCustomers(query) {
    if (!query) return customers.value
    
    const lowerQuery = query.toLowerCase()
    return customers.value.filter(customer => {
      if (customer.type === 'company') {
        return customer.company_name?.toLowerCase().includes(lowerQuery) ||
               customer.inn?.includes(query) ||
               customer.phone?.includes(query)
      } else {
        return customer.first_name?.toLowerCase().includes(lowerQuery) ||
               customer.last_name?.toLowerCase().includes(lowerQuery) ||
               customer.phone?.includes(query)
      }
    })
  }
  
  /**
   * Reset store
   */
  function reset() {
    customers.value = []
    orders.value = []
    invoices.value = []
    stats.value = {
      totalCustomers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      activeCustomers: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      topCustomers: []
    }
    loading.value = false
    error.value = null
  }
  
  return {
    // State
    customers,
    orders,
    invoices,
    stats,
    loading,
    error,
    
    // Actions
    fetchStats,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    
    // Getters
    getCustomerById,
    getOrderById,
    getCustomerOrders,
    searchCustomers,
    
    // Reset
    reset
  }
})