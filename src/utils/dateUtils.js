import { 
    format, 
    parseISO, 
    isValid,
    addDays,
    subDays,
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    isToday,
    isPast,
    formatDistanceToNow
  } from 'date-fns'
  import { uz } from 'date-fns/locale'
  
  export function parseDate(dateString) {
    if (!dateString) return null
    try {
      if (dateString instanceof Date) return dateString
      return parseISO(dateString)
    } catch (error) {
      return null
    }
  }
  
  export function formatDate(date, formatStr = 'dd.MM.yyyy') {
    if (!date) return '-'
    try {
      const parsedDate = parseDate(date)
      if (!isValid(parsedDate)) return '-'
      return format(parsedDate, formatStr, { locale: uz })
    } catch (error) {
      return '-'
    }
  }
  
  export function formatDateTime(date) {
    return formatDate(date, 'dd.MM.yyyy HH:mm')
  }
  
  export function formatTime(date) {
    return formatDate(date, 'HH:mm')
  }
  
  export function getRelativeTime(date) {
    if (!date) return '-'
    try {
      const parsedDate = parseDate(date)
      if (!isValid(parsedDate)) return '-'
      return formatDistanceToNow(parsedDate, { addSuffix: true, locale: uz })
    } catch (error) {
      return '-'
    }
  }
  
  export function getDateRange(type = 'today') {
    const now = new Date()
    
    const ranges = {
      today: { start: startOfDay(now), end: endOfDay(now) },
      yesterday: { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) },
      thisWeek: { start: startOfWeek(now, { locale: uz }), end: endOfWeek(now, { locale: uz }) },
      thisMonth: { start: startOfMonth(now), end: endOfMonth(now) },
      last7Days: { start: startOfDay(subDays(now, 7)), end: endOfDay(now) },
      last30Days: { start: startOfDay(subDays(now, 30)), end: endOfDay(now) }
    }
    
    return ranges[type] || ranges.today
  }
  
  export function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return null
    const start = parseDate(startDate)
    const end = parseDate(endDate)
    if (!isValid(start) || !isValid(end)) return null
    
    return {
      days: differenceInDays(end, start),
      hours: differenceInHours(end, start),
      minutes: differenceInMinutes(end, start)
    }
  }
  
  export function formatDuration(startDate, endDate) {
    const duration = calculateDuration(startDate, endDate)
    if (!duration) return '-'
    
    if (duration.days > 0) return `${duration.days} kun`
    if (duration.hours > 0) return `${duration.hours} soat`
    return `${duration.minutes} daqiqa`
  }
  
  export function checkIsToday(date) {
    const parsed = parseDate(date)
    return parsed ? isToday(parsed) : false
  }
  
  export function checkIsPast(date) {
    const parsed = parseDate(date)
    return parsed ? isPast(parsed) : false
  }
  
  export function addDaysToDate(date, days) {
    const parsed = parseDate(date)
    return parsed ? addDays(parsed, days) : null
  }
  
  export function formatForInput(date) {
    return formatDate(date, 'yyyy-MM-dd')
  }