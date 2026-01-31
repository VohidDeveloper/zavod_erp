/**
 * Number Utilities
 * Helper functions for number formatting and calculations
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format number as currency (UZS)
 * @param {number} value - Amount to format
 * @param {string} currency - Currency code (default: UZS)
 * @param {string} locale - Locale code (default: uz-UZ)
 * @returns {string} Formatted currency
 */
export function formatCurrency(value, currency = 'UZS', locale = 'uz-UZ') {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  const options = {
    style: 'currency',
    currency,
  }
  
  // UZS doesn't need decimals
  if (currency === 'UZS') {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  }
  
  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @param {string} locale - Locale code (default: uz-UZ)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export function formatNumber(value, locale = 'uz-UZ', decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format number with custom decimal places
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export function formatDecimal(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// ============================================================================
// COMPACT FORMATTING
// ============================================================================

/**
 * Format number in compact notation (1K, 1M, etc.)
 * @param {number} value - Number to format
 * @param {string} locale - Locale code (default: uz-UZ)
 * @returns {string} Compact number
 */
export function formatCompact(value, locale = 'uz-UZ') {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

// ============================================================================
// PERCENTAGE FORMATTING
// ============================================================================

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${value.toFixed(decimals)}%`
}

/**
 * Format percentage from decimal (0.5 -> 50%)
 * @param {number} value - Decimal value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercentFromDecimal(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage
 */
export function calculatePercent(value, total) {
  if (!total || total === 0) return 0
  return (value / total) * 100
}

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Round number to decimal places
 * @param {number} value - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded number
 */
export function round(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return 0
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Clamp number between min and max
 * @param {number} value - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Check if number is in range
 * @param {number} value - Number to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if in range
 */
export function inRange(value, min, max) {
  return value >= min && value <= max
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ============================================================================
// ARRAY CALCULATIONS
// ============================================================================

/**
 * Sum array of numbers
 * @param {Array} array - Array of numbers or objects
 * @param {string} key - Key to sum (if array of objects)
 * @returns {number} Sum
 */
export function sum(array, key = null) {
  if (!array || array.length === 0) return 0
  
  if (key) {
    return array.reduce((total, item) => total + (Number(item[key]) || 0), 0)
  }
  
  return array.reduce((total, num) => total + (Number(num) || 0), 0)
}

/**
 * Average of array
 * @param {Array} array - Array of numbers or objects
 * @param {string} key - Key to average (if array of objects)
 * @returns {number} Average
 */
export function average(array, key = null) {
  if (!array || array.length === 0) return 0
  return sum(array, key) / array.length
}

/**
 * Get minimum value from array
 * @param {Array} array - Array of numbers or objects
 * @param {string} key - Key to find min (if array of objects)
 * @returns {number} Minimum value
 */
export function min(array, key = null) {
  if (!array || array.length === 0) return 0
  
  if (key) {
    return Math.min(...array.map(item => Number(item[key]) || 0))
  }
  
  return Math.min(...array.map(num => Number(num) || 0))
}

/**
 * Get maximum value from array
 * @param {Array} array - Array of numbers or objects
 * @param {string} key - Key to find max (if array of objects)
 * @returns {number} Maximum value
 */
export function max(array, key = null) {
  if (!array || array.length === 0) return 0
  
  if (key) {
    return Math.max(...array.map(item => Number(item[key]) || 0))
  }
  
  return Math.max(...array.map(num => Number(num) || 0))
}

// ============================================================================
// GROWTH & CHANGE CALCULATIONS
// ============================================================================

/**
 * Calculate growth percentage
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Growth percentage
 */
export function calculateGrowth(current, previous) {
  if (!previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Format growth with sign
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted growth
 */
export function formatGrowth(current, previous, decimals = 1) {
  const growth = calculateGrowth(current, previous)
  const sign = growth > 0 ? '+' : ''
  return `${sign}${growth.toFixed(decimals)}%`
}

/**
 * Calculate change (difference)
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Change
 */
export function calculateChange(current, previous) {
  return current - previous
}

/**
 * Format change with sign
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} Formatted change
 */
export function formatChange(current, previous) {
  const change = calculateChange(current, previous)
  const sign = change > 0 ? '+' : ''
  return `${sign}${formatNumber(change)}`
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Check if value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * Parse number from string
 * @param {string} value - String to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number
 */
export function parseNumber(value, defaultValue = 0) {
  const parsed = parseFloat(value)
  return isValidNumber(parsed) ? parsed : defaultValue
}

// Export all as default
export default {
  formatCurrency,
  formatNumber,
  formatDecimal,
  formatCompact,
  formatPercent,
  formatPercentFromDecimal,
  calculatePercent,
  round,
  clamp,
  inRange,
  random,
  sum,
  average,
  min,
  max,
  calculateGrowth,
  formatGrowth,
  calculateChange,
  formatChange,
  isValidNumber,
  parseNumber,
}