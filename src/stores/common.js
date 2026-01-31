import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommonStore = defineStore('common', () => {
  // Toast notifications
  const toasts = ref([])
  
  // Loading state
  const globalLoading = ref(false)
  const loading = ref(false)
  
  // Sidebar state
  const sidebarOpen = ref(true)
  
  // Modal state
  const activeModal = ref(null)
  
  // Breadcrumbs
  const breadcrumbs = ref([])
  
  // Page title
  const pageTitle = ref('')
  
  // Common data
  const suppliers = ref([])
  const warehouses = ref([])
  const products = ref([])
  const rawMaterials = ref([])
  const units = ref([])
  const currencies = ref([])
  
  // Mock data
  const mockSuppliers = [
    { id: 1, name: 'Polimerplast', phone: '+998 90 123-45-67', inn: '123456789', address: 'Toshkent sh.' },
    { id: 2, name: 'Plastik Savdo', phone: '+998 91 234-56-78', inn: '234567890', address: 'Samarqand sh.' },
    { id: 3, name: 'Toshkent Polimer', phone: '+998 93 345-67-89', inn: '345678901', address: 'Andijon sh.' },
    { id: 4, name: 'Xorazm Plastmassa', phone: '+998 95 456-78-90', inn: '456789012', address: 'Urganch sh.' }
  ]
  
  const mockWarehouses = [
    { id: 1, name: 'Asosiy ombor', code: 'WH-01', location: 'Bino A', capacity: 5000 },
    { id: 2, name: 'Xomashyo ombori', code: 'WH-02', location: 'Bino B', capacity: 3000 },
    { id: 3, name: 'Tayyor mahsulot ombori', code: 'WH-03', location: 'Bino C', capacity: 4000 }
  ]
  
  const mockProducts = [
    { id: 1, name: 'Plastik granula (HDPE)', code: 'HDPE-001', unit: 'kg', category: 'Xomashyo' },
    { id: 2, name: 'Plastik granula (LDPE)', code: 'LDPE-001', unit: 'kg', category: 'Xomashyo' },
    { id: 3, name: 'Plastik granula (PP)', code: 'PP-001', unit: 'kg', category: 'Xomashyo' },
    { id: 4, name: 'Plastik qop (buyuk)', code: 'BAG-L-001', unit: 'dona', category: 'Tayyor mahsulot' },
    { id: 5, name: 'Plastik qop (o\'rta)', code: 'BAG-M-001', unit: 'dona', category: 'Tayyor mahsulot' },
    { id: 6, name: 'Plastik qop (kichik)', code: 'BAG-S-001', unit: 'dona', category: 'Tayyor mahsulot' }
  ]
  
  const mockUnits = [
    { id: 1, name: 'kg', label: 'Kilogram' },
    { id: 2, name: 'ton', label: 'Tonna' },
    { id: 3, name: 'dona', label: 'Dona' },
    { id: 4, name: 'qop', label: 'Qop' },
    { id: 5, name: 'litr', label: 'Litr' },
    { id: 6, name: 'metr', label: 'Metr' }
  ]
  
  const mockCurrencies = [
    { id: 1, code: 'UZS', name: 'O\'zbek so\'mi', symbol: 'so\'m' },
    { id: 2, code: 'USD', name: 'AQSH dollari', symbol: '$' },
    { id: 3, code: 'EUR', name: 'Yevro', symbol: '€' }
  ]
  
  // Toast Actions
  function showToast(toast) {
    const id = Date.now()
    toasts.value.push({
      id,
      type: 'info',
      duration: 3000,
      ...toast
    })
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
    
    return id
  }
  
  function showSuccess(message, title = 'Muvaffaqiyatli') {
    return showToast({ type: 'success', title, message })
  }
  
  function showError(message, title = 'Xatolik') {
    return showToast({ type: 'error', title, message, duration: 5000 })
  }
  
  function showWarning(message, title = 'Ogohlantirish') {
    return showToast({ type: 'warning', title, message })
  }
  
  function showInfo(message, title = 'Ma\'lumot') {
    return showToast({ type: 'info', title, message })
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function clearToasts() {
    toasts.value = []
  }
  
  // UI Actions
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  function setSidebarOpen(open) {
    sidebarOpen.value = open
  }
  
  function openModal(modalName) {
    activeModal.value = modalName
  }
  
  function closeModal() {
    activeModal.value = null
  }
  
  function setBreadcrumbs(items) {
    breadcrumbs.value = items
  }
  
  function setPageTitle(title) {
    pageTitle.value = title
    document.title = `${title} - S Promax Plast`
  }
  
  function setGlobalLoading(isLoading) {
    globalLoading.value = isLoading
  }
  
  // Data Fetch Actions
  async function fetchSuppliers() {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/suppliers')
      await new Promise(resolve => setTimeout(resolve, 300))
      suppliers.value = mockSuppliers
      return suppliers.value
    } catch (error) {
      showError('Yetkazib beruvchilarni yuklashda xatolik')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchWarehouses() {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      warehouses.value = mockWarehouses
      return warehouses.value
    } catch (error) {
      showError('Omborlarni yuklashda xatolik')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchProducts() {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      products.value = mockProducts
      return products.value
    } catch (error) {
      showError('Mahsulotlarni yuklashda xatolik')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchRawMaterials() {
    loading.value = true
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/raw-materials')
      await new Promise(resolve => setTimeout(resolve, 300))
      // Filter products where category is 'Xomashyo'
      rawMaterials.value = mockProducts.filter(p => p.category === 'Xomashyo')
      return rawMaterials.value
    } catch (error) {
      showError('Xom ashyolarni yuklashda xatolik')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  async function fetchUnits() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      units.value = mockUnits
      return units.value
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCurrencies() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      currencies.value = mockCurrencies
      return currencies.value
    } finally {
      loading.value = false
    }
  }
  
  // Fetch all common data at once
  async function fetchAll() {
    loading.value = true
    try {
      await Promise.all([
        fetchSuppliers(),
        fetchWarehouses(),
        fetchProducts(),
        fetchRawMaterials(),
        fetchUnits(),
        fetchCurrencies()
      ])
    } finally {
      loading.value = false
    }
  }
  
  // Getters
  function getSupplierById(id) {
    return suppliers.value.find(s => s.id === id)
  }
  
  function getWarehouseById(id) {
    return warehouses.value.find(w => w.id === id)
  }
  
  function getProductById(id) {
    return products.value.find(p => p.id === id)
  }
  
  function getRawMaterialById(id) {
    return rawMaterials.value.find(r => r.id === id)
  }
  
  function getUnitById(id) {
    return units.value.find(u => u.id === id)
  }
  
  function getCurrencyById(id) {
    return currencies.value.find(c => c.id === id)
  }
  
  // Reset
  function reset() {
    toasts.value = []
    globalLoading.value = false
    loading.value = false
    activeModal.value = null
    breadcrumbs.value = []
    pageTitle.value = ''
    suppliers.value = []
    warehouses.value = []
    products.value = []
    rawMaterials.value = []
    units.value = []
    currencies.value = []
  }
  
  return {
    // State
    toasts,
    globalLoading,
    loading,
    sidebarOpen,
    activeModal,
    breadcrumbs,
    pageTitle,
    suppliers,
    warehouses,
    products,
    rawMaterials,
    units,
    currencies,
    
    // Toast Actions
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts,
    
    // UI Actions
    toggleSidebar,
    setSidebarOpen,
    openModal,
    closeModal,
    setBreadcrumbs,
    setPageTitle,
    setGlobalLoading,
    
    // Data Actions
    fetchSuppliers,
    fetchWarehouses,
    fetchProducts,
    fetchRawMaterials,
    fetchUnits,
    fetchCurrencies,
    fetchAll,
    
    // Getters
    getSupplierById,
    getWarehouseById,
    getProductById,
    getRawMaterialById,
    getUnitById,
    getCurrencyById,
    
    // Reset
    reset
  }
})