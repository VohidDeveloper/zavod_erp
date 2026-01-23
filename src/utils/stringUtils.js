/**
 * Truncate string
 */
export function truncate(str, length = 50, suffix = '...') {
    if (!str || str.length <= length) return str
    return str.substring(0, length) + suffix
  }
  
  /**
   * Capitalize first letter
   */
  export function capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  
  /**
   * Title case
   */
  export function titleCase(str) {
    if (!str) return ''
    return str.split(' ').map(capitalize).join(' ')
  }
  
  /**
   * Uppercase
   */
  export function upper(str) {
    return str ? str.toUpperCase() : ''
  }
  
  /**
   * Lowercase
   */
  export function lower(str) {
    return str ? str.toLowerCase() : ''
  }
  
  /**
   * Trim whitespace
   */
  export function trim(str) {
    return str ? str.trim() : ''
  }
  
  /**
   * Slugify string
   */
  export function slugify(str) {
    if (!str) return ''
    
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  /**
   * Remove extra spaces
   */
  export function removeExtraSpaces(str) {
    if (!str) return ''
    return str.replace(/\s+/g, ' ').trim()
  }
  
  /**
   * Escape HTML
   */
  export function escapeHtml(str) {
    if (!str) return ''
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    
    return str.replace(/[&<>"']/g, m => map[m])
  }
  
  /**
   * Pluralize word
   */
  export function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural
  }
  
  /**
   * Pad start
   */
  export function padStart(str, length, char = '0') {
    return String(str).padStart(length, char)
  }
  
  /**
   * Pad end
   */
  export function padEnd(str, length, char = '0') {
    return String(str).padEnd(length, char)
  }
  
  /**
   * Reverse string
   */
  export function reverse(str) {
    return str ? str.split('').reverse().join('') : ''
  }
  
  /**
   * Count words
   */
  export function wordCount(str) {
    if (!str) return 0
    return str.trim().split(/\s+/).length
  }
  
  /**
   * Count characters
   */
  export function charCount(str, includeSpaces = true) {
    if (!str) return 0
    return includeSpaces ? str.length : str.replace(/\s/g, '').length
  }
  
  /**
   * Extract numbers from string
   */
  export function extractNumbers(str) {
    if (!str) return []
    return str.match(/\d+/g) || []
  }
  
  /**
   * Remove numbers from string
   */
  export function removeNumbers(str) {
    if (!str) return ''
    return str.replace(/\d+/g, '')
  }
  
  /**
   * Is empty or whitespace
   */
  export function isBlank(str) {
    return !str || str.trim().length === 0
  }
  
  /**
   * Contains substring
   */
  export function contains(str, substring, caseSensitive = false) {
    if (!str || !substring) return false
    
    if (caseSensitive) {
      return str.includes(substring)
    }
    
    return str.toLowerCase().includes(substring.toLowerCase())
  }
  
  /**
   * Starts with
   */
  export function startsWith(str, prefix, caseSensitive = false) {
    if (!str || !prefix) return false
    
    if (caseSensitive) {
      return str.startsWith(prefix)
    }
    
    return str.toLowerCase().startsWith(prefix.toLowerCase())
  }
  
  /**
   * Ends with
   */
  export function endsWith(str, suffix, caseSensitive = false) {
    if (!str || !suffix) return false
    
    if (caseSensitive) {
      return str.endsWith(suffix)
    }
    
    return str.toLowerCase().endsWith(suffix.toLowerCase())
  }
  
  /**
   * Repeat string
   */
  export function repeat(str, count) {
    return str ? str.repeat(count) : ''
  }
  
  /**
   * Format phone number
   */
  export function formatPhone(phone) {
    if (!phone) return '-'
    
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/)
    
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
    
    return phone
  }
  
  /**
   * Mask string (for passwords, cards, etc.)
   */
  export function mask(str, visibleChars = 4, maskChar = '*') {
    if (!str) return ''
    
    if (str.length <= visibleChars) return str
    
    const visible = str.slice(-visibleChars)
    const masked = maskChar.repeat(str.length - visibleChars)
    
    return masked + visible
  }
  
  /**
   * Generate random string
   */
  export function randomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }