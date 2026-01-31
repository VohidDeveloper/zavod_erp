import { format, parseISO, formatDistanceToNow, formatRelative } from 'date-fns'
import { uz } from 'date-fns/locale'
import { 
  STATUS_LABELS_UZ, 
  STATUS_COLORS, 
  ORDER_STATUS_COLORS, 
  PAYMENT_STATUS_COLORS,
  QUALITY_GRADE_COLORS,
  PRIORITY_COLORS
} from './constants'

// ============================================================================
// PARSING & VALIDATION
// ============================================================================

/**
 * Parse date string or object to Date
 */
function parseDate(date) {
  if (!date) return null
  try {
    if (date instanceof Date) return date
    if (typeof date === 'string') return parseISO(date)
    return null
  } catch (error) {
    console.error('Date parsing error:', error)
    return null
  }
}

// ============================================================================
// DATE & TIME FORMATTERS
// ============================================================================

/**
 * Format date
 */
export function formatDate(date, formatStr = 'dd.MM.yyyy') {
  const parsed = parseDate(date)
  if (!parsed) return '-'
  
  try {
    return format(parsed, formatStr, { locale: uz })
  } catch (error) {
    console.error('Date formatting error:', error)
    return '-'
  }
}

/**
 * Format datetime
 */
export function formatDateTime(date, formatStr = 'dd.MM.yyyy HH:mm') {
  return formatDate(date, formatStr)
}

/**
 * Format time only
 */
export function formatTime(date, formatStr = 'HH:mm') {
  return formatDate(date, formatStr)
}

/**
 * Get relative time (e.g., "2 soat oldin")
 */
export function getRelativeTime(date) {
  const parsed = parseDate(date)
  if (!parsed) return '-'
  
  try {
    return formatDistanceToNow(parsed, { addSuffix: true, locale: uz })
  } catch (error) {
    console.error('Relative time error:', error)
    return '-'
  }
}

/**
 * Format time ago (alias for getRelativeTime)
 */
export function formatTimeAgo(date) {
  return getRelativeTime(date)
}

/**
 * Format relative date
 */
export function formatRelativeDate(date) {
  const dateObj = parseDate(date)
  if (!dateObj) return '-'
  
  try {
    return formatRelative(dateObj, new Date(), { locale: uz })
  } catch (error) {
    console.error('Relative date formatting error:', error)
    return '-'
  }
}

/**
 * Format date range
 */
export function formatDateRange(startDate, endDate) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  
  if (start === '-' || end === '-') return '-'
  return `${start} - ${end}`
}

// ============================================================================
// NUMBER FORMATTERS
// ============================================================================

/**
 * Format number with locale
 */
export function formatNumber(value, locale = 'uz-UZ', decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format number with custom decimals
 */
export function formatDecimal(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return new Intl.NumberFormat('uz-UZ', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Format compact number (1000 -> 1K)
 */
export function formatCompact(value) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  return new Intl.NumberFormat('uz-UZ', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}

/**
 * Format compact number (alias)
 */
export function formatCompactNumber(value) {
  return formatCompact(value)
}

/**
 * Format currency
 */
export function formatCurrency(value, currency = 'UZS', locale = 'uz-UZ') {
  if (value === null || value === undefined || isNaN(value)) return '-'
  
  const options = { style: 'currency', currency }
  
  if (currency === 'UZS') {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  }
  
  return new Intl.NumberFormat(locale, options).format(value)
}

/**
 * Format price (alias for formatCurrency)
 */
export function formatPrice(price, currency = 'UZS') {
  return formatCurrency(price, currency)
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${value.toFixed(decimals)}%`
}

/**
 * Format percentage from decimal (0.5 -> 50%)
 */
export function formatPercentFromDecimal(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format number with unit
 */
export function formatWithUnit(value, unit) {
  if (value === null || value === undefined) return '-'
  return `${formatNumber(value)} ${unit}`
}

/**
 * Format weight (auto-convert kg/ton)
 */
export function formatWeight(kg) {
  if (kg === null || kg === undefined || isNaN(kg)) return '-'
  
  if (kg >= 1000) {
    return `${formatDecimal(kg / 1000, 2)} ton`
  }
  return `${formatDecimal(kg, 2)} kg`
}

// ============================================================================
// BUSINESS-SPECIFIC FORMATTERS
// ============================================================================

/**
 * Format status with Uzbek label
 */
export function formatStatus(status) {
  return STATUS_LABELS_UZ[status] || status
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
  return STATUS_COLORS[status] || 'gray'
}

/**
 * Get status badge class (Tailwind CSS)
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
  }
  
  return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
}

/**
 * Get order status color
 */

export function getStatusText(status) {
  return STATUS_LABELS_UZ[status] || status
}

export function getOrderStatusColor(status) {
  return ORDER_STATUS_COLORS[status] || 'gray'
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status) {
  return PAYMENT_STATUS_COLORS[status] || 'gray'
}

/**
 * Get quality grade color
 */
export function getQualityGradeColor(grade) {
  return QUALITY_GRADE_COLORS[grade] || 'gray'
}

/**
 * Get priority color
 */
export function getPriorityColor(priority) {
  return PRIORITY_COLORS[priority] || 'gray'
}

// ============================================================================
// NAME & CONTACT FORMATTERS
// ============================================================================

/**
 * Format full name
 */
export function formatFullName(firstName, lastName, middleName = '') {
  const parts = [lastName, firstName, middleName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '-'
}

/**
 * Format short name (initials)
 */
export function formatShortName(firstName, lastName) {
  if (!firstName || !lastName) return '-'
  return `${firstName.charAt(0)}.${lastName.charAt(0)}.`
}

/**
 * Format name (first name + last name initial)
 */
export function formatName(firstName, lastName) {
  if (!firstName && !lastName) return '-'
  if (!lastName) return firstName
  return `${firstName} ${lastName.charAt(0)}.`
}

/**
 * Format employee name
 */
export function formatEmployeeName(employee) {
  if (!employee) return '-'
  return formatFullName(employee.first_name, employee.last_name, employee.middle_name)
}

/**
 * Format customer name
 */
export function formatCustomerName(customer) {
  if (!customer) return '-'
  return customer.company_name || formatFullName(customer.first_name, customer.last_name)
}

/**
 * Format phone number (Uzbekistan format)
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`
  }
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Format TIN (Tax Identification Number)
 */
export function formatTIN(tin) {
  if (!tin) return '-'
  return String(tin).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

/**
 * Format INPS (company registration number)
 */
export function formatINPS(inps) {
  if (!inps) return '-'
  return inps
}

/**
 * Format address
 */
export function formatAddress(address) {
  if (!address) return '-'
  
  const parts = []
  if (address.region) parts.push(address.region)
  if (address.district) parts.push(address.district)
  if (address.street) parts.push(address.street)
  if (address.building) parts.push(address.building)
  
  return parts.length > 0 ? parts.join(', ') : '-'
}

// ============================================================================
// WAREHOUSE & PRODUCTION FORMATTERS
// ============================================================================

/**
 * Format warehouse stock
 */
export function formatStock(quantity, unit = 'kg') {
  if (quantity === null || quantity === undefined) return '-'
  return `${formatNumber(quantity)} ${unit}`
}

/**
 * Format production output
 */
export function formatOutput(quantity, unit = 'kg', target = null) {
  if (quantity === null || quantity === undefined) return '-'
  
  let result = `${formatNumber(quantity)} ${unit}`
  
  if (target) {
    const percent = (quantity / target) * 100
    result += ` (${formatPercent(percent)})`
  }
  
  return result
}

/**
 * Format quality percentage
 */
export function formatQuality(passed, total) {
  if (!total || total === 0) return '-'
  const percent = (passed / total) * 100
  return formatPercent(percent)
}

/**
 * Format efficiency
 */
export function formatEfficiency(actual, planned) {
  if (!planned || planned === 0) return '-'
  const percent = (actual / planned) * 100
  return formatPercent(percent)
}

/**
 * Format batch number
 */
export function formatBatchNumber(batchNumber) {
  if (!batchNumber) return '-'
  return `#${batchNumber}`
}

/**
 * Format machine name
 */
export function formatMachineName(machine) {
  if (!machine) return '-'
  return `${machine.name} (${machine.code})`
}

// ============================================================================
// SALES & FINANCE FORMATTERS
// ============================================================================

/**
 * Format total amount
 */
export function formatTotal(items, key = 'amount') {
  if (!items || items.length === 0) return formatCurrency(0)
  
  const total = items.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
  return formatCurrency(total)
}

/**
 * Format discount
 */
export function formatDiscount(discount, type = 'percent') {
  if (!discount) return '-'
  
  if (type === 'percent') {
    return formatPercent(discount)
  } else {
    return formatCurrency(discount)
  }
}

/**
 * Format order number
 */
export function formatOrderNumber(orderNumber) {
  if (!orderNumber) return '-'
  return `ORD-${String(orderNumber).padStart(6, '0')}`
}

/**
 * Format invoice number
 */
export function formatInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber) return '-'
  return `INV-${String(invoiceNumber).padStart(6, '0')}`
}

/**
 * Format shift number
 */
export function formatShiftNumber(shiftNumber) {
  if (!shiftNumber) return '-'
  return `Smena #${shiftNumber}`
}

// ============================================================================
// STRING FORMATTERS
// ============================================================================

/**
 * Truncate string
 */
export function truncate(str, length = 50, suffix = '...') {
  if (!str || str.length <= length) return str || ''
  return str.substring(0, length) + suffix
}

/**
 * Truncate in middle
 */
export function truncateMiddle(str, maxLength = 30) {
  if (!str || str.length <= maxLength) return str || ''
  
  const startLength = Math.ceil((maxLength - 3) / 2)
  const endLength = Math.floor((maxLength - 3) / 2)
  
  return str.substring(0, startLength) + '...' + str.substring(str.length - endLength)
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Title case (all words capitalized)
 */
export function titleCase(str) {
  if (!str) return ''
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

// ============================================================================
// UTILITY FORMATTERS
// ============================================================================

/**
 * Format duration in hours
 */
export function formatDurationHours(hours) {
  if (!hours) return '-'
  
  if (hours < 1) {
    return `${Math.round(hours * 60)} daqiqa`
  }
  
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  
  if (m === 0) {
    return `${h} soat`
  }
  
  return `${h} soat ${m} daqiqa`
}

/**
 * Format file size
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  if (!bytes) return '-'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value) {
  return value ? 'Ha' : 'Yo\'q'
}

/**
 * Format array as comma separated list
 */
export function formatList(items, key = null, limit = 3) {
  if (!items || items.length === 0) return '-'
  
  const values = key ? items.map(item => item[key]) : items
  const visible = values.slice(0, limit)
  const remaining = values.length - limit
  
  let result = visible.join(', ')
  if (remaining > 0) {
    result += ` +${remaining}`
  }
  
  return result
}

/**
 * Format range
 */
export function formatRange(min, max, unit = '') {
  if (min === null && max === null) return '-'
  if (min === null) return `<= ${max} ${unit}`.trim()
  if (max === null) return `>= ${min} ${unit}`.trim()
  if (min === max) return `${min} ${unit}`.trim()
  return `${min} - ${max} ${unit}`.trim()
}

/**
 * Format change (increase/decrease)
 */
export function formatChange(current, previous) {
  if (!previous || previous === 0) return '-'
  
  const change = ((current - previous) / previous) * 100
  const sign = change > 0 ? '+' : ''
  
  return `${sign}${formatPercent(change)}`
}

/**
 * Format variance
 */
export function formatVariance(actual, planned) {
  if (!planned || planned === 0) return '-'
  
  const variance = actual - planned
  const percent = (variance / planned) * 100
  const sign = variance > 0 ? '+' : ''
  
  return `${sign}${formatNumber(variance)} (${sign}${formatPercent(percent)})`
}

/**
 * Format card number with mask
 */
export function formatCardNumberMask(cardNumber) {
  if (!cardNumber) return '-'
  
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 16) return cardNumber
  
  return `**** **** **** ${cleaned.slice(-4)}`
}

/**
 * Format card number
 */
export function formatCardNumber(cardNumber) {
  if (!cardNumber) return '-'
  
  const cleaned = cardNumber.replace(/\D/g, '')
  const chunks = cleaned.match(/.{1,4}/g) || []
  
  return chunks.join(' ')
}

/**
 * Format email with mask
 */
export function formatEmailMask(email) {
  if (!email) return '-'
  
  const [name, domain] = email.split('@')
  if (!domain) return email
  
  if (name.length <= 3) return email
  
  const masked = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
  return `${masked}@${domain}`
}

/**
 * Format account number with mask
 */
export function formatAccountMask(account) {
  if (!account) return '-'
  
  if (account.length <= 8) return account
  
  const start = account.slice(0, 4)
  const end = account.slice(-4)
  const middle = '*'.repeat(account.length - 8)
  
  return `${start}${middle}${end}`
}

// Export all formatters as default
export default {
  // Date & Time
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  formatTimeAgo,
  formatRelativeDate,
  formatDateRange,
  
  // Numbers
  formatNumber,
  formatDecimal,
  formatCompact,
  formatCompactNumber,
  formatCurrency,
  formatPrice,
  formatPercent,
  formatPercentFromDecimal,
  formatWithUnit,
  formatWeight,
  
  // Status & Colors
  formatStatus,
  getStatusColor,
  getStatusBadgeClass,
  getOrderStatusColor,
  getPaymentStatusColor,
  getQualityGradeColor,
  getPriorityColor,
  getStatusText,
  
  // Names & Contacts
  formatFullName,
  formatShortName,
  formatName,
  formatEmployeeName,
  formatCustomerName,
  formatPhone,
  formatTIN,
  formatINPS,
  formatAddress,
  
  // Warehouse & Production
  formatStock,
  formatOutput,
  formatQuality,
  formatEfficiency,
  formatBatchNumber,
  formatMachineName,
  
  // Sales & Finance
  formatTotal,
  formatDiscount,
  formatOrderNumber,
  formatInvoiceNumber,
  formatShiftNumber,
  
  // Strings
  truncate,
  truncateMiddle,
  capitalize,
  titleCase,
  
  // Utilities
  formatDurationHours,
  formatFileSize,
  formatBoolean,
  formatList,
  formatRange,
  formatChange,
  formatVariance,
  formatCardNumber,
  formatCardNumberMask,
  formatEmailMask,
  formatAccountMask,
}