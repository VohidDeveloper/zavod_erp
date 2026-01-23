import { formatDate, formatDateTime, formatTime, getRelativeTime } from './dateUtils'
import { formatNumber, formatCurrency, formatPercent, formatCompact } from './numberUtils'
import { truncate, formatPhone } from './stringUtils'
import { 
  STATUS_LABELS_UZ, 
  STATUS_COLORS, 
  ORDER_STATUS_COLORS, 
  PAYMENT_STATUS_COLORS,
  QUALITY_GRADE_COLORS,
  PRIORITY_COLORS
} from './constants'

/**
 * Format status with label
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
 * Get order status color
 */
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

/**
 * Format full name
 */
export function formatFullName(firstName, lastName, middleName = '') {
  const parts = [lastName, firstName, middleName].filter(Boolean)
  return parts.join(' ')
}

/**
 * Format short name (initials)
 */
export function formatShortName(firstName, lastName) {
  if (!firstName || !lastName) return '-'
  return `${firstName.charAt(0)}.${lastName.charAt(0)}.`
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
  
  return parts.join(', ') || '-'
}

/**
 * Format tin (tax identification number)
 */
export function formatTIN(tin) {
  if (!tin) return '-'
  return String(tin).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

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
 * Format price with currency
 */
export function formatPrice(price, currency = 'UZS') {
  return formatCurrency(price, currency)
}

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
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format batch number
 */
export function formatBatchNumber(batchNumber) {
  if (!batchNumber) return '-'
  return `#${batchNumber}`
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

/**
 * Format machine name
 */
export function formatMachineName(machine) {
  if (!machine) return '-'
  return `${machine.name} (${machine.code})`
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

// Re-export utilities
export {
  formatDate,
  formatDateTime,
  formatTime,
  getRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatCompact,
  truncate,
  formatPhone
}