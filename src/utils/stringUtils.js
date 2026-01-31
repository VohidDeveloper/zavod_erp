// ============================================================================
// CASE CONVERSIONS
// ============================================================================

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalize all words (Title Case)
 * @param {string} str - String to capitalize
 * @returns {string} Title cased string
 */
export function titleCase(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Convert to lowercase
 * @param {string} str - String to convert
 * @returns {string} Lowercase string
 */
export function lowercase(str) {
  if (!str) return ''
  return str.toLowerCase()
}

/**
 * Convert to uppercase
 * @param {string} str - String to convert
 * @returns {string} Uppercase string
 */
export function uppercase(str) {
  if (!str) return ''
  return str.toUpperCase()
}

/**
 * Convert camelCase to kebab-case
 * @param {string} str - CamelCase string
 * @returns {string} kebab-case string
 */
export function camelToKebab(str) {
  if (!str) return ''
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Convert kebab-case to camelCase
 * @param {string} str - kebab-case string
 * @returns {string} camelCase string
 */
export function kebabToCamel(str) {
  if (!str) return ''
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert snake_case to camelCase
 * @param {string} str - snake_case string
 * @returns {string} camelCase string
 */
export function snakeToCamel(str) {
  if (!str) return ''
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase to snake_case
 * @param {string} str - camelCase string
 * @returns {string} snake_case string
 */
export function camelToSnake(str) {
  if (!str) return ''
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}

/**
 * Convert string to PascalCase
 * @param {string} str - String to convert
 * @returns {string} PascalCase string
 */
export function toPascalCase(str) {
  if (!str) return ''
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase())
}

// ============================================================================
// STRING MANIPULATION
// ============================================================================

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated string
 */
export function truncate(str, length = 50, suffix = '...') {
  if (!str || str.length <= length) return str || ''
  return str.substring(0, length) + suffix
}

/**
 * Truncate in middle (for long filenames)
 * @param {string} str - String to truncate
 * @param {number} maxLength - Max length
 * @param {string} separator - Separator
 * @returns {string} Truncated string
 */
export function truncateMiddle(str, maxLength = 30, separator = '...') {
  if (!str || str.length <= maxLength) return str || ''
  
  const sepLen = separator.length
  const charsToShow = maxLength - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  
  return str.substring(0, frontChars) + separator + str.substring(str.length - backChars)
}

/**
 * Pad string to specified length
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} char - Padding character
 * @param {string} position - 'start' or 'end'
 * @returns {string} Padded string
 */
export function pad(str, length, char = ' ', position = 'end') {
  if (!str) str = ''
  const padding = char.repeat(Math.max(0, length - str.length))
  return position === 'start' ? padding + str : str + padding
}

/**
 * Repeat string n times
 * @param {string} str - String to repeat
 * @param {number} times - Number of times
 * @returns {string} Repeated string
 */
export function repeat(str, times) {
  if (!str) return ''
  return str.repeat(times)
}

/**
 * Reverse string
 * @param {string} str - String to reverse
 * @returns {string} Reversed string
 */
export function reverse(str) {
  if (!str) return ''
  return str.split('').reverse().join('')
}

/**
 * Slugify string (URL-friendly)
 * @param {string} str - String to slugify
 * @returns {string} Slug string
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
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
export function removeExtraSpaces(str) {
  if (!str) return ''
  return str.replace(/\s+/g, ' ').trim()
}

/**
 * Remove all spaces
 * @param {string} str - String to clean
 * @returns {string} String without spaces
 */
export function removeSpaces(str) {
  if (!str) return ''
  return str.replace(/\s/g, '')
}

/**
 * Strip HTML tags
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (!text) return ''
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Unescape HTML entities
 * @param {string} text - Text to unescape
 * @returns {string} Unescaped text
 */
export function unescapeHtml(text) {
  if (!text) return ''
  const tmp = document.createElement('div')
  tmp.innerHTML = text
  return tmp.textContent || tmp.innerText || ''
}

// ============================================================================
// STRING ANALYSIS
// ============================================================================

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} Is blank
 */
export function isBlank(str) {
  return !str || /^\s*$/.test(str)
}

/**
 * Check if string contains substring (case insensitive)
 * @param {string} str - String to search in
 * @param {string} substring - Substring to find
 * @returns {boolean} Contains substring
 */
export function contains(str, substring) {
  if (!str || !substring) return false
  return str.toLowerCase().includes(substring.toLowerCase())
}

/**
 * Check if string starts with prefix
 * @param {string} str - String to check
 * @param {string} prefix - Prefix to check
 * @param {boolean} caseInsensitive - Case insensitive check
 * @returns {boolean} Starts with prefix
 */
export function startsWith(str, prefix, caseInsensitive = false) {
  if (!str || !prefix) return false
  if (caseInsensitive) {
    return str.toLowerCase().startsWith(prefix.toLowerCase())
  }
  return str.startsWith(prefix)
}

/**
 * Check if string ends with suffix
 * @param {string} str - String to check
 * @param {string} suffix - Suffix to check
 * @param {boolean} caseInsensitive - Case insensitive check
 * @returns {boolean} Ends with suffix
 */
export function endsWith(str, suffix, caseInsensitive = false) {
  if (!str || !suffix) return false
  if (caseInsensitive) {
    return str.toLowerCase().endsWith(suffix.toLowerCase())
  }
  return str.endsWith(suffix)
}

/**
 * Count words in string
 * @param {string} str - String to count
 * @returns {number} Word count
 */
export function wordCount(str) {
  if (!str) return 0
  return str.trim().split(/\s+/).length
}

/**
 * Count characters (excluding spaces)
 * @param {string} str - String to count
 * @returns {number} Character count
 */
export function charCount(str) {
  if (!str) return 0
  return str.replace(/\s/g, '').length
}

/**
 * Count occurrences of substring
 * @param {string} str - String to search in
 * @param {string} substring - Substring to count
 * @returns {number} Occurrence count
 */
export function countOccurrences(str, substring) {
  if (!str || !substring) return 0
  return (str.match(new RegExp(substring, 'g')) || []).length
}

/**
 * Check if string is valid email
 * @param {string} str - String to validate
 * @returns {boolean} Is valid email
 */
export function isEmail(str) {
  if (!str) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(str)
}

/**
 * Check if string is valid URL
 * @param {string} str - String to validate
 * @returns {boolean} Is valid URL
 */
export function isUrl(str) {
  if (!str) return false
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string contains only letters
 * @param {string} str - String to check
 * @returns {boolean} Contains only letters
 */
export function isAlpha(str) {
  if (!str) return false
  return /^[a-zA-Z]+$/.test(str)
}

/**
 * Check if string contains only numbers
 * @param {string} str - String to check
 * @returns {boolean} Contains only numbers
 */
export function isNumeric(str) {
  if (!str) return false
  return /^\d+$/.test(str)
}

/**
 * Check if string contains only letters and numbers
 * @param {string} str - String to check
 * @returns {boolean} Contains only alphanumeric
 */
export function isAlphaNumeric(str) {
  if (!str) return false
  return /^[a-zA-Z0-9]+$/.test(str)
}

// ============================================================================
// STRING REPLACEMENT
// ============================================================================

/**
 * Replace all occurrences
 * @param {string} str - String to modify
 * @param {string} search - Text to search
 * @param {string} replace - Replacement text
 * @returns {string} Modified string
 */
export function replaceAll(str, search, replace) {
  if (!str) return ''
  return str.split(search).join(replace)
}

/**
 * Replace multiple patterns
 * @param {string} str - String to modify
 * @param {Object} replacements - Object with search:replace pairs
 * @returns {string} Modified string
 */
export function replaceMultiple(str, replacements) {
  if (!str) return ''
  let result = str
  Object.entries(replacements).forEach(([search, replace]) => {
    result = replaceAll(result, search, replace)
  })
  return result
}

// ============================================================================
// STRING EXTRACTION
// ============================================================================

/**
 * Extract text between two delimiters
 * @param {string} str - Source string
 * @param {string} start - Start delimiter
 * @param {string} end - End delimiter
 * @returns {string} Extracted text
 */
export function extractBetween(str, start, end) {
  if (!str) return ''
  const startIndex = str.indexOf(start)
  if (startIndex === -1) return ''
  
  const endIndex = str.indexOf(end, startIndex + start.length)
  if (endIndex === -1) return ''
  
  return str.substring(startIndex + start.length, endIndex)
}

/**
 * Extract numbers from string
 * @param {string} str - Source string
 * @returns {number[]} Array of numbers
 */
export function extractNumbers(str) {
  if (!str) return []
  return (str.match(/\d+/g) || []).map(Number)
}

/**
 * Extract email addresses from string
 * @param {string} str - Source string
 * @returns {string[]} Array of email addresses
 */
export function extractEmails(str) {
  if (!str) return []
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g
  return str.match(emailRegex) || []
}

/**
 * Extract URLs from string
 * @param {string} str - Source string
 * @returns {string[]} Array of URLs
 */
export function extractUrls(str) {
  if (!str) return []
  const urlRegex = /https?:\/\/[^\s]+/g
  return str.match(urlRegex) || []
}

// ============================================================================
// RANDOM & GENERATION
// ============================================================================

/**
 * Generate random string
 * @param {number} length - Length of string
 * @param {string} chars - Character set
 * @returns {string} Random string
 */
export function randomString(length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate random alphanumeric string
 * @param {number} length - Length of string
 * @returns {string} Random alphanumeric string
 */
export function randomAlphanumeric(length = 10) {
  return randomString(length)
}

/**
 * Generate random letters only
 * @param {number} length - Length of string
 * @returns {string} Random letters
 */
export function randomLetters(length = 10) {
  return randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
}

/**
 * Generate random numbers only
 * @param {number} length - Length of string
 * @returns {string} Random numbers
 */
export function randomNumbers(length = 10) {
  return randomString(length, '0123456789')
}

// ============================================================================
// COMPARISON
// ============================================================================

/**
 * Compare strings (case insensitive)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {boolean} Are equal
 */
export function equalsIgnoreCase(str1, str2) {
  if (!str1 && !str2) return true
  if (!str1 || !str2) return false
  return str1.toLowerCase() === str2.toLowerCase()
}

/**
 * Calculate Levenshtein distance (string similarity)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
export function levenshteinDistance(str1, str2) {
  if (!str1) return str2 ? str2.length : 0
  if (!str2) return str1.length
  
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Calculate string similarity (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score
 */
export function similarity(str1, str2) {
  if (!str1 && !str2) return 1
  if (!str1 || !str2) return 0
  
  const distance = levenshteinDistance(str1, str2)
  const maxLen = Math.max(str1.length, str2.length)
  
  return maxLen === 0 ? 1 : 1 - distance / maxLen
}