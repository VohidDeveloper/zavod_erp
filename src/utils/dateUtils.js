import {
  format,
  parseISO,
  isValid,
  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMonths,
  differenceInYears,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  isWeekend,
  isSameDay,
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  isWithinInterval,
  formatDistanceToNow,
  formatRelative,
  formatDuration,
  intervalToDuration,
  min as minDate,
  max as maxDate,
} from 'date-fns'
import { uz } from 'date-fns/locale'

// ============================================================================
// PARSING & VALIDATION
// ============================================================================

/**
 * Parse date string or object to Date
 * @param {string|Date} date - Date to parse
 * @returns {Date|null} Parsed date or null
 */
export function parseDate(date) {
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

/**
 * Check if date is valid
 * @param {*} date - Date to validate
 * @returns {boolean} Is valid date
 */
export function isValidDate(date) {
  const parsed = parseDate(date)
  return parsed !== null && isValid(parsed)
}

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format date with custom format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
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
 * Format for API (ISO 8601)
 * @param {string|Date} date - Date to format
 * @returns {string} ISO formatted date
 */
export function formatForAPI(date) {
  const parsed = parseDate(date)
  if (!parsed) return null
  return format(parsed, 'yyyy-MM-dd')
}

/**
 * Format datetime for API
 * @param {string|Date} date - Date to format
 * @returns {string} ISO formatted datetime
 */
export function formatDateTimeForAPI(date) {
  const parsed = parseDate(date)
  if (!parsed) return null
  return format(parsed, "yyyy-MM-dd'T'HH:mm:ss")
}

/**
 * Format for input fields
 * @param {string|Date} date - Date to format
 * @returns {string} Input formatted date
 */
export function formatForInput(date) {
  return formatForAPI(date)
}

/**
 * Get current timestamp (ISO string)
 * @returns {string} Current timestamp
 */
export function getCurrentTimestamp() {
  return new Date().toISOString()
}

// ============================================================================
// RELATIVE DATES
// ============================================================================

/**
 * Get relative date label (Bugun, Kecha, etc.)
 * @param {string|Date} date - Date to format
 * @returns {string} Relative date label
 */
export function getRelativeDate(date) {
  const parsed = parseDate(date)
  if (!parsed) return ''
  
  if (isToday(parsed)) return 'Bugun'
  if (isYesterday(parsed)) return 'Kecha'
  if (isTomorrow(parsed)) return 'Ertaga'
  
  return format(parsed, 'dd.MM.yyyy', { locale: uz })
}

/**
 * Get time ago (e.g., "2 soat oldin")
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
export function getTimeAgo(date) {
  const parsed = parseDate(date)
  if (!parsed) return ''
  
  try {
    return formatDistanceToNow(parsed, { addSuffix: true, locale: uz })
  } catch (error) {
    console.error('Time ago error:', error)
    return ''
  }
}

/**
 * Format relative (e.g., "kecha soat 5:00 da")
 * @param {string|Date} date - Date to format
 * @param {Date} baseDate - Base date for comparison
 * @returns {string} Relative date string
 */
export function formatRelativeDate(date, baseDate = new Date()) {
  const parsed = parseDate(date)
  if (!parsed) return ''
  
  try {
    return formatRelative(parsed, baseDate, { locale: uz })
  } catch (error) {
    console.error('Relative date error:', error)
    return ''
  }
}

/**
 * Format duration between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted duration
 */
export function formatDurationBetween(startDate, endDate) {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  
  if (!start || !end) return ''
  
  try {
    const duration = intervalToDuration({ start, end })
    return formatDuration(duration, { locale: uz })
  } catch (error) {
    console.error('Duration formatting error:', error)
    return ''
  }
}

// ============================================================================
// DATE RANGES
// ============================================================================

/**
 * Get today's date range
 * @returns {{start: Date, end: Date}} Today's range
 */
export function getToday() {
  const now = new Date()
  return {
    start: startOfDay(now),
    end: endOfDay(now),
  }
}

/**
 * Get yesterday's date range
 * @returns {{start: Date, end: Date}} Yesterday's range
 */
export function getYesterday() {
  const yesterday = subDays(new Date(), 1)
  return {
    start: startOfDay(yesterday),
    end: endOfDay(yesterday),
  }
}

/**
 * Get this week's date range
 * @returns {{start: Date, end: Date}} This week's range
 */
export function getThisWeek() {
  const now = new Date()
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(now, { weekStartsOn: 1 }),
  }
}

/**
 * Get last week's date range
 * @returns {{start: Date, end: Date}} Last week's range
 */
export function getLastWeek() {
  const lastWeek = subDays(new Date(), 7)
  return {
    start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
    end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
  }
}

/**
 * Get this month's date range
 * @returns {{start: Date, end: Date}} This month's range
 */
export function getThisMonth() {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  }
}

/**
 * Get last month's date range
 * @returns {{start: Date, end: Date}} Last month's range
 */
export function getLastMonth() {
  const lastMonth = subMonths(new Date(), 1)
  return {
    start: startOfMonth(lastMonth),
    end: endOfMonth(lastMonth),
  }
}

/**
 * Get this year's date range
 * @returns {{start: Date, end: Date}} This year's range
 */
export function getThisYear() {
  const now = new Date()
  return {
    start: startOfYear(now),
    end: endOfYear(now),
  }
}

/**
 * Get last N days range
 * @param {number} days - Number of days
 * @returns {{start: Date, end: Date}} Date range
 */
export function getLastNDays(days) {
  const now = new Date()
  return {
    start: startOfDay(subDays(now, days - 1)),
    end: endOfDay(now),
  }
}

/**
 * Get custom date range
 * @param {string|Date} start - Start date
 * @param {string|Date} end - End date
 * @returns {{start: Date, end: Date}|null} Date range or null
 */
export function getDateRange(start, end) {
  const startDate = parseDate(start)
  const endDate = parseDate(end)
  
  if (!startDate || !endDate) return null
  
  return {
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  }
}

// ============================================================================
// DATE ARITHMETIC
// ============================================================================

/**
 * Add days to date
 * @param {string|Date} date - Base date
 * @param {number} days - Days to add
 * @returns {Date|null} New date
 */
export function addDaysToDate(date, days) {
  const parsed = parseDate(date)
  return parsed ? addDays(parsed, days) : null
}

/**
 * Subtract days from date
 * @param {string|Date} date - Base date
 * @param {number} days - Days to subtract
 * @returns {Date|null} New date
 */
export function subtractDaysFromDate(date, days) {
  const parsed = parseDate(date)
  return parsed ? subDays(parsed, days) : null
}

/**
 * Add months to date
 * @param {string|Date} date - Base date
 * @param {number} months - Months to add
 * @returns {Date|null} New date
 */
export function addMonthsToDate(date, months) {
  const parsed = parseDate(date)
  return parsed ? addMonths(parsed, months) : null
}

/**
 * Subtract months from date
 * @param {string|Date} date - Base date
 * @param {number} months - Months to subtract
 * @returns {Date|null} New date
 */
export function subtractMonthsFromDate(date, months) {
  const parsed = parseDate(date)
  return parsed ? subMonths(parsed, months) : null
}

/**
 * Add years to date
 * @param {string|Date} date - Base date
 * @param {number} years - Years to add
 * @returns {Date|null} New date
 */
export function addYearsToDate(date, years) {
  const parsed = parseDate(date)
  return parsed ? addYears(parsed, years) : null
}

/**
 * Subtract years from date
 * @param {string|Date} date - Base date
 * @param {number} years - Years to subtract
 * @returns {Date|null} New date
 */
export function subtractYearsFromDate(date, years) {
  const parsed = parseDate(date)
  return parsed ? subYears(parsed, years) : null
}

// ============================================================================
// DATE COMPARISONS
// ============================================================================

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is past
 */
export function isDatePast(date) {
  const parsed = parseDate(date)
  return parsed ? isPast(parsed) : false
}

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is future
 */
export function isDateFuture(date) {
  const parsed = parseDate(date)
  return parsed ? isFuture(parsed) : false
}

/**
 * Check if date is weekend
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is weekend
 */
export function isDateWeekend(date) {
  const parsed = parseDate(date)
  return parsed ? isWeekend(parsed) : false
}

/**
 * Check if two dates are same day
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} Are same day
 */
export function areSameDay(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? isSameDay(d1, d2) : false
}

/**
 * Check if two dates are same month
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} Are same month
 */
export function areSameMonth(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? isSameMonth(d1, d2) : false
}

/**
 * Check if two dates are same year
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} Are same year
 */
export function areSameYear(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? isSameYear(d1, d2) : false
}

/**
 * Check if date is before another date
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} Is before
 */
export function isDateBefore(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? isBefore(d1, d2) : false
}

/**
 * Check if date is after another date
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {boolean} Is after
 */
export function isDateAfter(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? isAfter(d1, d2) : false
}

/**
 * Check if date is within interval
 * @param {string|Date} date - Date to check
 * @param {string|Date} start - Interval start
 * @param {string|Date} end - Interval end
 * @returns {boolean} Is within interval
 */
export function isDateWithinInterval(date, start, end) {
  const d = parseDate(date)
  const s = parseDate(start)
  const e = parseDate(end)
  
  if (!d || !s || !e) return false
  
  return isWithinInterval(d, { start: s, end: e })
}

// ============================================================================
// DATE DIFFERENCES
// ============================================================================

/**
 * Get difference in days
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Days difference
 */
export function getDaysDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInDays(d1, d2) : 0
}

/**
 * Get difference in hours
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Hours difference
 */
export function getHoursDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInHours(d1, d2) : 0
}

/**
 * Get difference in minutes
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Minutes difference
 */
export function getMinutesDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInMinutes(d1, d2) : 0
}

/**
 * Get difference in seconds
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Seconds difference
 */
export function getSecondsDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInSeconds(d1, d2) : 0
}

/**
 * Get difference in months
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Months difference
 */
export function getMonthsDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInMonths(d1, d2) : 0
}

/**
 * Get difference in years
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Years difference
 */
export function getYearsDifference(date1, date2) {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  return d1 && d2 ? differenceInYears(d1, d2) : 0
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get min date from array
 * @param {Array} dates - Array of dates
 * @returns {Date|null} Minimum date
 */
export function getMinDate(dates) {
  const parsed = dates.map(parseDate).filter(Boolean)
  return parsed.length > 0 ? minDate(parsed) : null
}

/**
 * Get max date from array
 * @param {Array} dates - Array of dates
 * @returns {Date|null} Maximum date
 */
export function getMaxDate(dates) {
  const parsed = dates.map(parseDate).filter(Boolean)
  return parsed.length > 0 ? maxDate(parsed) : null
}

/**
 * Get age from birth date
 * @param {string|Date} birthDate - Birth date
 * @returns {number} Age in years
 */
export function getAge(birthDate) {
  return getYearsDifference(new Date(), birthDate)
}

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is today
 */
export function isDateToday(date) {
  const parsed = parseDate(date)
  return parsed ? isToday(parsed) : false
}

/**
 * Check if date is yesterday
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is yesterday
 */
export function isDateYesterday(date) {
  const parsed = parseDate(date)
  return parsed ? isYesterday(parsed) : false
}

/**
 * Check if date is tomorrow
 * @param {string|Date} date - Date to check
 * @returns {boolean} Is tomorrow
 */
export function isDateTomorrow(date) {
  const parsed = parseDate(date)
  return parsed ? isTomorrow(parsed) : false
}