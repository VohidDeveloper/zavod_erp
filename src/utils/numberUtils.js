/**
 * Format number with thousand separators
 */
export function formatNumber(value, locale = 'uz-UZ') {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return new Intl.NumberFormat(locale).format(value)
  }
  
  /**
   * Format as currency
   */
  export function formatCurrency(value, currency = 'UZS', locale = 'uz-UZ') {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  /**
   * Format as percentage
   */
  export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) return '-'
    return `${value.toFixed(decimals)}%`
  }
  
  /**
   * Round to decimals
   */
  export function round(value, decimals = 2) {
    if (isNaN(value)) return 0
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  
  /**
   * Clamp number between min and max
   */
  export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }
  
  /**
   * Calculate percentage
   */
  export function calculatePercent(part, total) {
    if (!total || total === 0) return 0
    return (part / total) * 100
  }
  
  /**
   * Calculate percentage change
   */
  export function calculatePercentChange(oldValue, newValue) {
    if (!oldValue || oldValue === 0) return 0
    return ((newValue - oldValue) / oldValue) * 100
  }
  
  /**
   * Parse number from string
   */
  export function parseNumber(value) {
    if (typeof value === 'number') return value
    if (!value) return 0
    
    // Remove spaces and replace comma with dot
    const cleaned = String(value).replace(/\s/g, '').replace(/,/g, '.')
    const parsed = parseFloat(cleaned)
    
    return isNaN(parsed) ? 0 : parsed
  }
  
  /**
   * Format compact number (1K, 1M, etc.)
   */
  export function formatCompact(value) {
    if (value === null || value === undefined || isNaN(value)) return '-'
    
    const abs = Math.abs(value)
    
    if (abs >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B'
    }
    if (abs >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    }
    if (abs >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    
    return value.toString()
  }
  
  /**
   * Add numbers safely (avoid floating point errors)
   */
  export function add(...numbers) {
    return numbers.reduce((sum, num) => {
      return Math.round((sum + num) * 100) / 100
    }, 0)
  }
  
  /**
   * Subtract numbers safely
   */
  export function subtract(a, b) {
    return Math.round((a - b) * 100) / 100
  }
  
  /**
   * Multiply numbers safely
   */
  export function multiply(...numbers) {
    return numbers.reduce((product, num) => {
      return Math.round(product * num * 100) / 100
    }, 1)
  }
  
  /**
   * Divide numbers safely
   */
  export function divide(a, b) {
    if (b === 0) return 0
    return Math.round((a / b) * 100) / 100
  }
  
  /**
   * Get random number between min and max
   */
  export function random(min = 0, max = 100) {
    return Math.random() * (max - min) + min
  }
  
  /**
   * Get random integer between min and max
   */
  export function randomInt(min = 0, max = 100) {
    return Math.floor(random(min, max + 1))
  }
  
  /**
   * Check if number is in range
   */
  export function inRange(value, min, max) {
    return value >= min && value <= max
  }
  
  /**
   * Sum array of numbers
   */
  export function sum(numbers) {
    return numbers.reduce((total, num) => add(total, num), 0)
  }
  
  /**
   * Average of numbers
   */
  export function average(numbers) {
    if (numbers.length === 0) return 0
    return divide(sum(numbers), numbers.length)
  }
  
  /**
   * Min value
   */
  export function min(numbers) {
    return Math.min(...numbers)
  }
  
  /**
   * Max value
   */
  export function max(numbers) {
    return Math.max(...numbers)
  }