import { debounce, throttle, cloneDeep } from 'lodash-es'

// Re-export lodash functions for direct use
export { debounce, throttle }

// ============================================================================
// FUNCTION UTILITIES
// ============================================================================

/**
 * Create debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export function createDebounce(func, wait = 300) {
  return debounce(func, wait)
}

/**
 * Create throttled function
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Throttled function
 */
export function createThrottle(func, wait = 300) {
  return throttle(func, wait)
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise}
 */
export async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    await sleep(delay)
    return retry(fn, retries - 1, delay * 2)
  }
}

/**
 * Memoize function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export function memoize(fn) {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// ============================================================================
// OBJECT & ARRAY UTILITIES
// ============================================================================

/**
 * Deep clone object (using lodash)
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  return cloneDeep(obj)
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export function isEmpty(obj) {
  if (!obj) return true
  return Object.keys(obj).length === 0
}

/**
 * Check if value is null or undefined
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isNil(value) {
  return value === null || value === undefined
}

/**
 * Omit keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to omit
 * @returns {Object} New object without specified keys
 */
export function omit(obj, keys) {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Pick keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object} New object with only specified keys
 */
export function pick(obj, keys) {
  const result = {}
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} sources - Source objects
 * @returns {Object} Merged object
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Get nested property from object
 * @param {Object} obj - Object to search
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Property value or default
 */
export function get(obj, path, defaultValue = undefined) {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

/**
 * Set nested property in object
 * @param {Object} obj - Object to modify
 * @param {string} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export function set(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const nested = keys.reduce((o, key) => {
    if (!o[key]) o[key] = {}
    return o[key]
  }, obj)
  nested[lastKey] = value
  return obj
}

/**
 * Check if value is object
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key]
    if (!result[group]) result[group] = []
    result[group].push(item)
    return result
  }, {})
}

/**
 * Sort array by key
 * @param {Array} array - Array to sort
 * @param {string|Function} key - Key or function to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key]
    const bVal = typeof key === 'function' ? key(b) : b[key]
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    }
    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
  })
}

/**
 * Filter array by search term across multiple keys
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export function filterBySearch(array, searchTerm, keys) {
  if (!searchTerm) return array
  
  const term = searchTerm.toLowerCase().trim()
  return array.filter(item => {
    return keys.some(key => {
      const value = get(item, key, '')
      return String(value).toLowerCase().includes(term)
    })
  })
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
export function chunk(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array with duplicates
 * @param {string} key - Key to check uniqueness (optional)
 * @returns {Array} Array without duplicates
 */
export function unique(array, key = null) {
  if (!key) return [...new Set(array)]
  
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

/**
 * Get random item from array
 * @param {Array} array - Source array
 * @returns {*} Random item
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Flatten nested array
 * @param {Array} array - Nested array
 * @param {number} depth - Depth to flatten (default: Infinity)
 * @returns {Array} Flattened array
 */
export function flatten(array, depth = Infinity) {
  return array.flat(depth)
}

/**
 * Get intersection of arrays
 * @param {Array} arrays - Arrays to intersect
 * @returns {Array} Intersection
 */
export function intersection(...arrays) {
  return arrays.reduce((a, b) => a.filter(c => b.includes(c)))
}

/**
 * Get difference of arrays
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Difference
 */
export function difference(array1, array2) {
  return array1.filter(x => !array2.includes(x))
}

// ============================================================================
// FILE & DOWNLOAD UTILITIES
// ============================================================================

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Download filename
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  downloadFile(url, filename)
  setTimeout(() => window.URL.revokeObjectURL(url), 100)
}

/**
 * Download JSON as file
 * @param {Object} data - Data to download
 * @param {string} filename - Download filename
 */
export function downloadJSON(data, filename = 'data.json') {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  downloadBlob(blob, filename)
}

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} Extension
 */
export function getFileExtension(filename) {
  if (!filename) return ''
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

/**
 * Get filename without extension
 * @param {string} filename - Filename
 * @returns {string} Filename without extension
 */
export function getFilenameWithoutExtension(filename) {
  if (!filename) return ''
  return filename.replace(/\.[^/.]+$/, '')
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} File content
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Format bytes to human readable size
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  if (!bytes) return '-'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

// ============================================================================
// BROWSER UTILITIES
// ============================================================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Get query parameters from URL
 * @returns {Object} Query parameters
 */
export function getQueryParams() {
  const params = {}
  const searchParams = new URLSearchParams(window.location.search)
  for (const [key, value] of searchParams) {
    params[key] = value
  }
  return params
}

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parameters object
 */
export function parseQueryString(queryString) {
  const params = {}
  const searchParams = new URLSearchParams(queryString)
  for (const [key, value] of searchParams) {
    params[key] = value
  }
  return params
}

/**
 * Validate URL
 * @param {string} string - String to validate
 * @returns {boolean} Is valid URL
 */
export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * Open URL in new tab
 * @param {string} url - URL to open
 */
export function openInNewTab(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Scroll to element
 * @param {string|Element} target - Element or selector
 * @param {Object} options - Scroll options
 */
export function scrollToElement(target, options = {}) {
  const element = typeof target === 'string' ? document.querySelector(target) : target
  if (!element) return
  
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    ...options,
  })
}

/**
 * Get scroll position
 * @returns {Object} Scroll position {x, y}
 */
export function getScrollPosition() {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  }
}

/**
 * Detect if mobile device
 * @returns {boolean} Is mobile
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detect if touch device
 * @returns {boolean} Is touch device
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// ============================================================================
// ID & RANDOM UTILITIES
// ============================================================================

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`
}

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate random color
 * @returns {string} Hex color
 */
export function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

// Export all as default
export default {
  debounce,
  throttle,
  createDebounce,
  createThrottle,
  sleep,
  retry,
  memoize,
  deepClone,
  isEmpty,
  isNil,
  omit,
  pick,
  deepMerge,
  get,
  set,
  isObject,
  groupBy,
  sortBy,
  filterBySearch,
  chunk,
  unique,
  randomItem,
  shuffle,
  flatten,
  intersection,
  difference,
  downloadFile,
  downloadBlob,
  downloadJSON,
  getFileExtension,
  getFilenameWithoutExtension,
  readFileAsText,
  readFileAsDataURL,
  formatBytes,
  copyToClipboard,
  getQueryParams,
  buildQueryString,
  parseQueryString,
  isValidUrl,
  openInNewTab,
  scrollToElement,
  getScrollPosition,
  isMobile,
  isTouchDevice,
  generateId,
  generateUUID,
  randomColor,
}