import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/utils/constants'

export const useUIStore = defineStore('ui', {
  state: () => ({
    // Sidebar
    sidebarCollapsed: localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true',
    sidebarMobileOpen: false,

    // Theme
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',

    // Language
    language: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'uz',

    // Loading states
    globalLoading: false,
    loadingMessage: '',

    // Modals
    modals: {},

    // Toasts/Notifications
    notifications: [],

    // Page metadata
    pageTitle: '',
    breadcrumbs: [],

    // Filters visibility
    filtersVisible: true,
  }),

  getters: {
    /**
     * Check if sidebar is collapsed
     */
    isSidebarCollapsed: (state) => state.sidebarCollapsed,

    /**
     * Check if mobile sidebar is open
     */
    isMobileSidebarOpen: (state) => state.sidebarMobileOpen,

    /**
     * Get current theme
     */
    currentTheme: (state) => state.theme,

    /**
     * Check if dark mode
     */
    isDarkMode: (state) => state.theme === 'dark',

    /**
     * Get current language
     */
    currentLanguage: (state) => state.language,

    /**
     * Check if modal is open
     */
    isModalOpen: (state) => (modalId) => {
      return state.modals[modalId]?.isOpen || false
    },

    /**
     * Get modal data
     */
    getModalData: (state) => (modalId) => {
      return state.modals[modalId]?.data || null
    },

    /**
     * Get all notifications
     */
    allNotifications: (state) => state.notifications,

    /**
     * Get page title
     */
    getPageTitle: (state) => state.pageTitle,

    /**
     * Get breadcrumbs
     */
    getBreadcrumbs: (state) => state.breadcrumbs,
  },

  actions: {
    /**
     * Toggle sidebar
     */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, this.sidebarCollapsed)
    },

    /**
     * Set sidebar collapsed state
     */
    setSidebarCollapsed(collapsed) {
      this.sidebarCollapsed = collapsed
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed)
    },

    /**
     * Toggle mobile sidebar
     */
    toggleMobileSidebar() {
      this.sidebarMobileOpen = !this.sidebarMobileOpen
    },

    /**
     * Close mobile sidebar
     */
    closeMobileSidebar() {
      this.sidebarMobileOpen = false
    },

    /**
     * Set theme
     */
    setTheme(theme) {
      this.theme = theme
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
      
      // Apply theme to document
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
      this.setTheme(this.theme === 'light' ? 'dark' : 'light')
    },

    /**
     * Set language
     */
    setLanguage(language) {
      this.language = language
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language)
    },

    /**
     * Show global loading
     */
    showLoading(message = 'Yuklanmoqda...') {
      this.globalLoading = true
      this.loadingMessage = message
    },

    /**
     * Hide global loading
     */
    hideLoading() {
      this.globalLoading = false
      this.loadingMessage = ''
    },

    /**
     * Open modal
     */
    openModal(modalId, data = null) {
      this.modals[modalId] = {
        isOpen: true,
        data,
      }
    },

    /**
     * Close modal
     */
    closeModal(modalId) {
      if (this.modals[modalId]) {
        this.modals[modalId].isOpen = false
        // Clear data after animation
        setTimeout(() => {
          if (this.modals[modalId]) {
            this.modals[modalId].data = null
          }
        }, 300)
      }
    },

    /**
     * Close all modals
     */
    closeAllModals() {
      Object.keys(this.modals).forEach(modalId => {
        this.closeModal(modalId)
      })
    },

    /**
     * Add notification
     */
    addNotification(notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        ...notification,
      })

      // Auto remove after timeout
      if (notification.timeout !== false) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.timeout || 3000)
      }

      return id
    },

    /**
     * Remove notification
     */
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * Clear all notifications
     */
    clearNotifications() {
      this.notifications = []
    },

    /**
     * Set page title
     */
    setPageTitle(title) {
      this.pageTitle = title
      document.title = title ? `${title} - S PROMAX PLAST` : 'S PROMAX PLAST'
    },

    /**
     * Set breadcrumbs
     */
    setBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = breadcrumbs
    },

    /**
     * Toggle filters visibility
     */
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible
    },

    /**
     * Set filters visibility
     */
    setFiltersVisible(visible) {
      this.filtersVisible = visible
    },

    /**
     * Initialize UI from storage
     */
    initUI() {
      // Apply theme
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    },
  },
})