import { defineStore } from 'pinia'

export const useWarehouseStore = defineStore('warehouse', {
  state: () => ({
    products: [],
    receipts: [],
    issues: [],
    inventory: [],
    suppliers: [],
    loading: false,
    error: null
  }),

  getters: {
    // Low stock products
    lowStockProducts: (state) => {
      return state.inventory.filter(item => item.quantity < item.minQuantity)
    },
    
    // Out of stock products
    outOfStockProducts: (state) => {
      return state.inventory.filter(item => item.quantity === 0)
    },
    
    // Total inventory value
    totalInventoryValue: (state) => {
      return state.inventory.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice)
      }, 0)
    },
    
    // Recent receipts
    recentReceipts: (state) => {
      return state.receipts.slice(0, 10)
    },
    
    // Recent issues
    recentIssues: (state) => {
      return state.issues.slice(0, 10)
    },
    
    // Active suppliers
    activeSuppliers: (state) => {
      return state.suppliers.filter(s => s.status === 'active')
    }
  },

  actions: {
    // Products
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        // Mock data
        this.products = [
          { id: 1, name: 'A-sifat', code: 'A001', category: 'Xom ashyo', unit: 'kg' },
          { id: 2, name: 'B-sifat', code: 'B001', category: 'Xom ashyo', unit: 'kg' }
        ]
        return this.products
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createProduct(data) {
      this.loading = true
      try {
        const product = { id: Date.now(), ...data }
        this.products.push(product)
        return product
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, data) {
      this.loading = true
      try {
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...data }
        }
        return this.products[index]
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id) {
      this.loading = true
      try {
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Receipts
    async fetchReceipts(params = {}) {
      this.loading = true
      try {
        this.receipts = [
          {
            id: 1,
            receiptNo: 'RCP-001',
            date: '2024-01-20',
            supplier: 'Supplier A',
            totalAmount: 5000000,
            status: 'completed'
          }
        ]
        return this.receipts
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createReceipt(data) {
      this.loading = true
      try {
        const receipt = { id: Date.now(), receiptNo: `RCP-${Date.now()}`, ...data }
        this.receipts.unshift(receipt)
        return receipt
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Issues
    async fetchIssues(params = {}) {
      this.loading = true
      try {
        this.issues = [
          {
            id: 1,
            issueNo: 'ISS-001',
            date: '2024-01-20',
            department: 'Production',
            totalAmount: 2000000,
            status: 'completed'
          }
        ]
        return this.issues
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createIssue(data) {
      this.loading = true
      try {
        const issue = { id: Date.now(), issueNo: `ISS-${Date.now()}`, ...data }
        this.issues.unshift(issue)
        return issue
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Inventory
    async fetchInventory(params = {}) {
      this.loading = true
      try {
        this.inventory = [
          {
            id: 1,
            productId: 1,
            productName: 'A-sifat',
            quantity: 1500,
            minQuantity: 1000,
            unitPrice: 5000,
            unit: 'kg'
          },
          {
            id: 2,
            productId: 2,
            productName: 'B-sifat',
            quantity: 800,
            minQuantity: 1000,
            unitPrice: 4500,
            unit: 'kg'
          }
        ]
        return this.inventory
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Suppliers
    async fetchSuppliers(params = {}) {
      this.loading = true
      try {
        this.suppliers = [
          { id: 1, name: 'Supplier A', contact: '+998901234567', status: 'active' },
          { id: 2, name: 'Supplier B', contact: '+998901234568', status: 'active' }
        ]
        return this.suppliers
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSupplier(data) {
      this.loading = true
      try {
        const supplier = { id: Date.now(), ...data }
        this.suppliers.push(supplier)
        return supplier
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})