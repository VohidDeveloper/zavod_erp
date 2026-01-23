/**
 * Deep clone object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
  
  /**
   * Debounce function
   */
  export function debounce(func, wait = 300) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  /**
   * Throttle function
   */
  export function throttle(func, limit = 300) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
  
  /**
   * Generate unique ID
   */
  export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * Check if object is empty
   */
  export function isEmpty(obj) {
    if (obj == null) return true
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
    return Object.keys(obj).length === 0
  }
  
  /**
   * Group array by key
   */
  export function groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key]
      if (!result[group]) {
        result[group] = []
      }
      result[group].push(item)
      return result
    }, {})
  }
  
  /**
   * Sort array by key
   */
  export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  }
  
  /**
   * Remove duplicates from array
   */
  export function unique(array, key = null) {
    if (!key) {
      return [...new Set(array)]
    }
    
    const seen = new Set()
    return array.filter(item => {
      const k = item[key]
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }
  
  /**
   * Calculate sum of array values
   */
  export function sum(array, key = null) {
    if (!key) {
      return array.reduce((acc, val) => acc + (Number(val) || 0), 0)
    }
    return array.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)
  }
  
  /**
   * Calculate average
   */
  export function average(array, key = null) {
    if (array.length === 0) return 0
    return sum(array, key) / array.length
  }
  
  /**
   * Get nested object property safely
   */
  export function getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.')
    let result = obj
    
    for (const key of keys) {
      if (result == null) return defaultValue
      result = result[key]
    }
    
    return result !== undefined ? result : defaultValue
  }
  
  /**
   * Set nested object property
   */
  export function setNestedValue(obj, path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = obj
    
    for (const key of keys) {
      if (!(key in current)) {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[lastKey] = value
    return obj
  }
  
  /**
   * Capitalize first letter
   */
  export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  
  /**
   * Convert to title case
   */
  export function titleCase(str) {
    if (!str) return ''
    return str.split(' ').map(capitalize).join(' ')
  }
  
  /**
   * Sleep/delay function
   */
  export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * Copy to clipboard
   */
  export async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Copy failed:', error)
      return false
    }
  }
  
  /**
   * Download file
   */
  export function downloadFile(data, filename, type = 'text/plain') {
    const blob = new Blob([data], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  /**
   * Convert file to base64
   */
  export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  /**
   * Format bytes to human readable
   */
  export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
  
  /**
   * Random number between min and max
   */
  export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  /**
   * Random color
   */
  export function randomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  }