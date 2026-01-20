import { format, parseISO } from 'date-fns'

/**
 * Format number with thousand separators
 */
export function formatNumber(value, locale = 'uz-UZ') {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Format currency
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
 * Format date
 */
export function formatDate(date, formatStr = 'dd.MM.yyyy') {
  if (!date) return '-'
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, formatStr)
  } catch (error) {
    console.error('Date format error:', error)
    return '-'
  }
}

/**
 * Format datetime
 */
export function formatDateTime(date) {
  return formatDate(date, 'dd.MM.yyyy HH:mm')
}

/**
 * Format time
 */
export function formatTime(date) {
  return formatDate(date, 'HH:mm')
}

/**
 * Format percent
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '-'
  return `${value.toFixed(decimals)}%`
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
 * Truncate string
 */
export function truncate(str, length = 50, suffix = '...') {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  // Format: +998 (90) 123-45-67
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/)
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
  }
  return phone
}

/**
 * Format status badge
 */
export function getStatusBadgeClass(status) {
  const statusMap = {
    active: 'badge-success',
    inactive: 'badge-secondary',
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    sufficient: 'badge-success',
    low: 'badge-warning',
    critical: 'badge-danger',
  }
  return statusMap[status] || 'badge-secondary'
}

/**
 * Format status text (translate)
 */
export function getStatusText(status) {
  const statusMap = {
    active: 'Faol',
    inactive: 'Faol emas',
    pending: 'Kutilmoqda',
    approved: 'Tasdiqlangan',
    rejected: 'Rad etilgan',
    completed: 'Yakunlangan',
    cancelled: 'Bekor qilingan',
    sufficient: 'Yetarli',
    low: 'Kam',
    critical: 'Kritik',
    preparing: 'Tayyorlanmoqda',
    in_transit: 'Yo\'lda',
    delivered: 'Yetkazildi',
    paid: 'To\'langan',
    partial: 'Qisman',
    unpaid: 'To\'lanmagan',
  }
  return statusMap[status] || status
}