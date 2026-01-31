/**
 * Status Utilities
 * Helper functions for status badges, colors, and labels
 */

// ============================================================================
// STATUS BADGE CLASSES
// ============================================================================

/**
 * Get badge classes for status
 * @param {string} status - Status value
 * @returns {string} Tailwind CSS classes
 */
export function getStatusBadgeClass(status) {
    const statusMap = {
      // General statuses
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      draft: 'bg-gray-100 text-gray-600 border-gray-200',
      
      // Order statuses
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      returned: 'bg-red-100 text-red-800 border-red-200',
      
      // Payment statuses
      paid: 'bg-green-100 text-green-800 border-green-200',
      unpaid: 'bg-red-100 text-red-800 border-red-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
      
      // Production statuses
      planned: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      quality_check: 'bg-orange-100 text-orange-800 border-orange-200',
      finished: 'bg-green-100 text-green-800 border-green-200',
      on_hold: 'bg-gray-100 text-gray-800 border-gray-200',
      
      // Quality statuses
      passed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      
      // Priority levels
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200',
      
      // Warehouse statuses
      in_stock: 'bg-green-100 text-green-800 border-green-200',
      low_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200',
      ordered: 'bg-blue-100 text-blue-800 border-blue-200',
      
      // Maintenance statuses
      operational: 'bg-green-100 text-green-800 border-green-200',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      broken: 'bg-red-100 text-red-800 border-red-200',
      
      // Employee statuses
      working: 'bg-green-100 text-green-800 border-green-200',
      on_leave: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      terminated: 'bg-red-100 text-red-800 border-red-200',
    }
    
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  }
  
  /**
   * Get color for status
   * @param {string} status - Status value
   * @returns {string} Color name
   */
  export function getStatusColor(status) {
    const colorMap = {
      active: 'green',
      inactive: 'gray',
      pending: 'yellow',
      completed: 'blue',
      cancelled: 'red',
      draft: 'gray',
      new: 'blue',
      processing: 'yellow',
      shipped: 'purple',
      delivered: 'green',
      returned: 'red',
      paid: 'green',
      unpaid: 'red',
      partial: 'yellow',
      refunded: 'purple',
      planned: 'blue',
      in_progress: 'yellow',
      quality_check: 'orange',
      finished: 'green',
      on_hold: 'gray',
      passed: 'green',
      failed: 'red',
      review: 'yellow',
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
      in_stock: 'green',
      low_stock: 'yellow',
      out_of_stock: 'red',
      ordered: 'blue',
      operational: 'green',
      maintenance: 'yellow',
      broken: 'red',
      working: 'green',
      on_leave: 'yellow',
      terminated: 'red',
    }
    
    return colorMap[status?.toLowerCase()] || 'gray'
  }
  
  /**
   * Get label for status (Uzbek)
   * @param {string} status - Status value
   * @returns {string} Uzbek label
   */
  export function getStatusLabel(status) {
    const labelMap = {
      // General statuses
      active: 'Faol',
      inactive: 'Faol emas',
      pending: 'Kutilmoqda',
      completed: 'Tugatilgan',
      cancelled: 'Bekor qilingan',
      draft: 'Qoralama',
      
      // Order statuses
      new: 'Yangi',
      processing: 'Jarayonda',
      shipped: 'Yuborilgan',
      delivered: 'Yetkazilgan',
      returned: 'Qaytarilgan',
      
      // Payment statuses
      paid: 'To\'langan',
      unpaid: 'To\'lanmagan',
      partial: 'Qisman to\'langan',
      refunded: 'Qaytarilgan',
      
      // Production statuses
      planned: 'Rejalashtirilgan',
      in_progress: 'Jarayonda',
      quality_check: 'Sifat nazorati',
      finished: 'Tugatilgan',
      on_hold: 'To\'xtatilgan',
      
      // Quality statuses
      passed: 'O\'tkazilgan',
      failed: 'Rad etilgan',
      review: 'Ko\'rib chiqilmoqda',
      
      // Priority levels
      low: 'Past',
      medium: 'O\'rtacha',
      high: 'Yuqori',
      urgent: 'Juda muhim',
      
      // Warehouse statuses
      in_stock: 'Omborda',
      low_stock: 'Kam qolgan',
      out_of_stock: 'Tugagan',
      ordered: 'Buyurtma qilingan',
      
      // Maintenance statuses
      operational: 'Ishlamoqda',
      maintenance: 'Ta\'mir',
      broken: 'Buzilgan',
      
      // Employee statuses
      working: 'Ishlamoqda',
      on_leave: 'Ta\'tilda',
      terminated: 'Ishdan bo\'shatilgan',
    }
    
    return labelMap[status?.toLowerCase()] || status
  }
  
  // ============================================================================
  // ORDER STATUS UTILITIES
  // ============================================================================
  
  /**
   * Get order status badge class
   * @param {string} status - Order status
   * @returns {string} CSS classes
   */
  export function getOrderStatusBadgeClass(status) {
    return getStatusBadgeClass(status)
  }
  
  /**
   * Get order status color
   * @param {string} status - Order status
   * @returns {string} Color name
   */
  export function getOrderStatusColor(status) {
    return getStatusColor(status)
  }
  
  // ============================================================================
  // PAYMENT STATUS UTILITIES
  // ============================================================================
  
  /**
   * Get payment status badge class
   * @param {string} status - Payment status
   * @returns {string} CSS classes
   */
  export function getPaymentStatusBadgeClass(status) {
    return getStatusBadgeClass(status)
  }
  
  /**
   * Get payment status color
   * @param {string} status - Payment status
   * @returns {string} Color name
   */
  export function getPaymentStatusColor(status) {
    return getStatusColor(status)
  }
  
  // ============================================================================
  // PRIORITY UTILITIES
  // ============================================================================
  
  /**
   * Get priority badge class
   * @param {string} priority - Priority level
   * @returns {string} CSS classes
   */
  export function getPriorityBadgeClass(priority) {
    return getStatusBadgeClass(priority)
  }
  
  /**
   * Get priority color
   * @param {string} priority - Priority level
   * @returns {string} Color name
   */
  export function getPriorityColor(priority) {
    return getStatusColor(priority)
  }
  
  // ============================================================================
  // QUALITY GRADE UTILITIES
  // ============================================================================
  
  /**
   * Get quality grade badge class
   * @param {string} grade - Quality grade
   * @returns {string} CSS classes
   */
  export function getQualityGradeBadgeClass(grade) {
    const gradeMap = {
      A: 'bg-green-100 text-green-800 border-green-200',
      B: 'bg-blue-100 text-blue-800 border-blue-200',
      C: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      D: 'bg-orange-100 text-orange-800 border-orange-200',
      F: 'bg-red-100 text-red-800 border-red-200',
    }
    
    return gradeMap[grade] || 'bg-gray-100 text-gray-800 border-gray-200'
  }
  
  /**
   * Get quality grade color
   * @param {string} grade - Quality grade
   * @returns {string} Color name
   */
  export function getQualityGradeColor(grade) {
    const colorMap = {
      A: 'green',
      B: 'blue',
      C: 'yellow',
      D: 'orange',
      F: 'red',
    }
    
    return colorMap[grade] || 'gray'
  }
  
  // Export all as default
  export default {
    getStatusBadgeClass,
    getStatusColor,
    getStatusLabel,
    getOrderStatusBadgeClass,
    getOrderStatusColor,
    getPaymentStatusBadgeClass,
    getPaymentStatusColor,
    getPriorityBadgeClass,
    getPriorityColor,
    getQualityGradeBadgeClass,
    getQualityGradeColor,
  }