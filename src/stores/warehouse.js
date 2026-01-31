import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWarehouseStore = defineStore('warehouse', () => {
  // State
  const receipts = ref([])
  const issues = ref([])
  const transfers = ref([])
  const inventory = ref([])
  const stats = ref({
    totalReceipts: 0,
    totalIssues: 0,
    totalTransfers: 0,
    totalValue: 0,
    lowStockItems: 0,
    inStock: 0,
    outOfStock: 0
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  // Mock data
  const mockReceipts = [
    {
      id: 1,
      receipt_number: 'RCP-001',
      receipt_date: '2024-01-29',
      supplier: { id: 1, name: 'Polimerplast' },
      warehouse: { id: 1, name: 'Asosiy ombor' },
      status: 'completed',
      total_amount: 5000000,
      items: [
        { id: 1, product: { name: 'Plastik granula (HDPE)' }, quantity: 100, unit: 'kg', unit_price: 50000 }
      ]
    },
    {
      id: 2,
      receipt_number: 'RCP-002',
      receipt_date: '2024-01-28',
      supplier: { id: 2, name: 'Plastik Savdo' },
      warehouse: { id: 2, name: 'Xomashyo ombori' },
      status: 'pending',
      total_amount: 3500000,
      items: [
        { id: 2, product: { name: 'Plastik granula (LDPE)' }, quantity: 70, unit: 'kg', unit_price: 50000 }
      ]
    }
  ]
  
  const mockStats = {
    totalReceipts: 45,
    totalIssues: 38,
    totalTransfers: 12,
    totalValue: 125000000,
    lowStockItems: 8,
    inStock: 45,
    outOfStock: 3
  }
  
  const mockInventory = [
    {
      id: 1,
      product: { id: 1, name: 'Plastik granula (HDPE)', code: 'HDPE-001' },
      warehouse: { id: 1, name: 'Asosiy ombor' },
      quantity: 1500,
      unit: 'kg',
      min_quantity: 500,
      max_quantity: 3000,
      status: 'in_stock'
    },
    {
      id: 2,
      product: { id: 2, name: 'Plastik granula (LDPE)', code: 'LDPE-001' },
      warehouse: { id: 2, name: 'Xomashyo ombori' },
      quantity: 450,
      unit: 'kg',
      min_quantity: 500,
      max_quantity: 2000,
      status: 'low_stock'
    },
    {
      id: 3,
      product: { id: 3, name: 'Plastik granula (PP)', code: 'PP-001' },
      warehouse: { id: 2, name: 'Xomashyo ombori' },
      quantity: 0,
      unit: 'kg',
      min_quantity: 500,
      max_quantity: 2000,
      status: 'out_of_stock'
    }
  ]
  
  // Actions
  
  /**
   * Fetch warehouse statistics
   */
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/warehouse/stats')
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
   * Fetch receipts
   */
  async function fetchReceipts(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/warehouse/receipts', { params })
      await new Promise(resolve => setTimeout(resolve, 300))
      receipts.value = mockReceipts
      return receipts.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create receipt
   */
  async function createReceipt(data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/warehouse/receipts', data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newReceipt = {
        id: receipts.value.length + 1,
        ...data,
        created_at: new Date().toISOString()
      }
      
      receipts.value.unshift(newReceipt)
      return newReceipt
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update receipt
   */
  async function updateReceipt(id, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/warehouse/receipts/${id}`, data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = receipts.value.findIndex(r => r.id === id)
      if (index > -1) {
        receipts.value[index] = {
          ...receipts.value[index],
          ...data,
          updated_at: new Date().toISOString()
        }
      }
      
      return receipts.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete receipt
   */
  async function deleteReceipt(id) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/warehouse/receipts/${id}`)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = receipts.value.findIndex(r => r.id === id)
      if (index > -1) {
        receipts.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch inventory
   */
  async function fetchInventory(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/warehouse/inventory', { params })
      await new Promise(resolve => setTimeout(resolve, 300))
      inventory.value = mockInventory
      return inventory.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch issues
   */
  async function fetchIssues(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      issues.value = []
      return issues.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch transfers
   */
  async function fetchTransfers(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      transfers.value = []
      return transfers.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get receipt by ID
   */
  function getReceiptById(id) {
    return receipts.value.find(r => r.id === id)
  }
  
  /**
   * Get inventory by product ID
   */
  function getInventoryByProductId(productId) {
    return inventory.value.filter(i => i.product.id === productId)
  }
  
  /**
   * Reset store
   */
  function reset() {
    receipts.value = []
    issues.value = []
    transfers.value = []
    inventory.value = []
    stats.value = {
      totalReceipts: 0,
      totalIssues: 0,
      totalTransfers: 0,
      totalValue: 0,
      lowStockItems: 0,
      inStock: 0,
      outOfStock: 0
    }
    loading.value = false
    error.value = null
  }
  
  return {
    // State
    receipts,
    issues,
    transfers,
    inventory,
    stats,
    loading,
    error,
    
    // Actions
    fetchStats,
    fetchReceipts,
    createReceipt,
    updateReceipt,
    deleteReceipt,
    fetchInventory,
    fetchIssues,
    fetchTransfers,
    
    // Getters
    getReceiptById,
    getInventoryByProductId,
    
    // Reset
    reset
  }
})