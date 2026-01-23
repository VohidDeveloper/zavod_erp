// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed'
}

// Permissions
export const PERMISSIONS = {
  // Warehouse
  READ_WAREHOUSE: 'read:warehouse',
  CREATE_WAREHOUSE_RECEIPT: 'create:warehouse-receipt',
  UPDATE_WAREHOUSE_RECEIPT: 'update:warehouse-receipt',
  DELETE_WAREHOUSE_RECEIPT: 'delete:warehouse-receipt',
  CREATE_WAREHOUSE_REQUEST: 'create:warehouse-request',
  APPROVE_WAREHOUSE_REQUEST: 'approve:warehouse-request',
  
  // Production
  READ_PRODUCTION: 'read:production',
  CREATE_PRODUCTION_SHIFT: 'create:production-shift',
  UPDATE_PRODUCTION_SHIFT: 'update:production-shift',
  DELETE_PRODUCTION_SHIFT: 'delete:production-shift',
  RECORD_PRODUCTION_OUTPUT: 'record:production-output',
  
  // Sales
  READ_SALES: 'read:sales',
  CREATE_CUSTOMER: 'create:customer',
  UPDATE_CUSTOMER: 'update:customer',
  DELETE_CUSTOMER: 'delete:customer',
  CREATE_ORDER: 'create:order',
  UPDATE_ORDER: 'update:order',
  DELETE_ORDER: 'delete:order',
  APPROVE_ORDER: 'approve:order',
  
  // Finance
  READ_FINANCE: 'read:finance',
  CREATE_TRANSACTION: 'create:transaction',
  UPDATE_TRANSACTION: 'update:transaction',
  DELETE_TRANSACTION: 'delete:transaction',
  APPROVE_TRANSACTION: 'approve:transaction',
  
  // HR
  READ_HR: 'read:hr',
  CREATE_EMPLOYEE: 'create:employee',
  UPDATE_EMPLOYEE: 'update:employee',
  DELETE_EMPLOYEE: 'delete:employee',
  CALCULATE_SALARY: 'calculate:salary',
  APPROVE_SALARY: 'approve:salary',
  
  // Maintenance
  READ_MAINTENANCE: 'read:maintenance',
  CREATE_MAINTENANCE_REQUEST: 'create:maintenance-request',
  UPDATE_MAINTENANCE_REQUEST: 'update:maintenance-request',
  APPROVE_MAINTENANCE_REQUEST: 'approve:maintenance-request',
  CREATE_MAINTENANCE_SCHEDULE: 'create:maintenance-schedule',
  
  // Analytics
  READ_ANALYTICS: 'read:analytics',
  CREATE_CUSTOM_REPORT: 'create:custom-report',
  EXPORT_REPORT: 'export:report',
  
  // Settings
  READ_SETTINGS: 'read:settings',
  READ_USERS: 'read:users',
  CREATE_USER: 'create:user',
  UPDATE_USER: 'update:user',
  DELETE_USER: 'delete:user',
  READ_ROLES: 'read:roles',
  CREATE_ROLE: 'create:role',
  UPDATE_ROLE: 'update:role',
  DELETE_ROLE: 'delete:role',
  READ_SYSTEM_SETTINGS: 'read:system-settings',
  UPDATE_SYSTEM_SETTINGS: 'update:system-settings'
}

// Roles
export const ROLES = {
  ADMIN: 'admin',
  DIRECTOR: 'director',
  WAREHOUSE_MANAGER: 'warehouse_manager',
  PRODUCTION_MANAGER: 'production_manager',
  SALES_MANAGER: 'sales_manager',
  ACCOUNTANT: 'accountant',
  HR_MANAGER: 'hr_manager',
  OPERATOR: 'operator',
  VIEWER: 'viewer'
}

// Status values
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress'
}

// Order statuses
export const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PRODUCTION: 'in_production',
  READY: 'ready',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
}

// Shift types
export const SHIFT_TYPES = {
  DAY: 'day',
  NIGHT: 'night',
  FULL: 'full'
}

// Quality grades
export const QUALITY_GRADES = {
  A: 'A',
  B: 'B',
  C: 'C',
  REJECT: 'reject'
}

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer'
}

// Units of measurement
export const UNITS = {
  KG: 'kg',
  TON: 'ton',
  PIECE: 'piece',
  METER: 'meter',
  LITER: 'liter'
}

// Raw material types
export const RAW_MATERIAL_TYPES = {
  PVC_RESIN: 'pvc_resin',
  STABILIZER: 'stabilizer',
  PLASTICIZER: 'plasticizer',
  FILLER: 'filler',
  PIGMENT: 'pigment',
  ADDITIVE: 'additive'
}

// Product types
export const PRODUCT_TYPES = {
  PIPE: 'pipe',
  FITTING: 'fitting',
  SHEET: 'sheet',
  PROFILE: 'profile'
}

// Maintenance types
export const MAINTENANCE_TYPES = {
  PREVENTIVE: 'preventive',
  CORRECTIVE: 'corrective',
  EMERGENCY: 'emergency'
}

// Priority levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd.MM.yyyy',
  DISPLAY_TIME: 'dd.MM.yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_TIME: "yyyy-MM-dd'T'HH:mm",
  API: "yyyy-MM-dd'T'HH:mm:ss"
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#06B6D4',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  GRAY: '#6B7280'
}

// Status colors
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  completed: 'blue',
  cancelled: 'red',
  in_progress: 'blue'
}

// Order status colors
export const ORDER_STATUS_COLORS = {
  draft: 'gray',
  pending: 'yellow',
  confirmed: 'blue',
  in_production: 'purple',
  ready: 'green',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red'
}

// Payment status colors
export const PAYMENT_STATUS_COLORS = {
  pending: 'yellow',
  partial: 'orange',
  paid: 'green',
  overdue: 'red',
  cancelled: 'gray'
}

// Quality grade colors
export const QUALITY_GRADE_COLORS = {
  A: 'green',
  B: 'yellow',
  C: 'orange',
  reject: 'red'
}

// Priority colors
export const PRIORITY_COLORS = {
  low: 'gray',
  medium: 'yellow',
  high: 'orange',
  urgent: 'red'
}

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  EXCEL: 10 * 1024 * 1024 // 10MB
}

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Uzbek translations for statuses
export const STATUS_LABELS_UZ = {
  active: 'Faol',
  inactive: 'Nofaol',
  pending: 'Kutilmoqda',
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
  completed: 'Tugallangan',
  cancelled: 'Bekor qilingan',
  in_progress: 'Jarayonda',
  draft: 'Qoralama',
  confirmed: 'Tasdiqlangan',
  in_production: 'Ishlab chiqarilmoqda',
  ready: 'Tayyor',
  shipped: 'Yuborilgan',
  delivered: 'Yetkazilgan',
  partial: 'Qisman',
  paid: 'To\'langan',
  overdue: 'Muddati o\'tgan'
}

// Days of week
export const DAYS_OF_WEEK = [
  { value: 1, label: 'Dushanba' },
  { value: 2, label: 'Seshanba' },
  { value: 3, label: 'Chorshanba' },
  { value: 4, label: 'Payshanba' },
  { value: 5, label: 'Juma' },
  { value: 6, label: 'Shanba' },
  { value: 0, label: 'Yakshanba' }
]

// Months
export const MONTHS = [
  { value: 1, label: 'Yanvar' },
  { value: 2, label: 'Fevral' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Aprel' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Iyun' },
  { value: 7, label: 'Iyul' },
  { value: 8, label: 'Avgust' },
  { value: 9, label: 'Sentabr' },
  { value: 10, label: 'Oktabr' },
  { value: 11, label: 'Noyabr' },
  { value: 12, label: 'Dekabr' }
]

export default {
  API_BASE_URL,
  STORAGE_KEYS,
  PERMISSIONS,
  ROLES,
  STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  SHIFT_TYPES,
  QUALITY_GRADES,
  TRANSACTION_TYPES,
  UNITS,
  RAW_MATERIAL_TYPES,
  PRODUCT_TYPES,
  MAINTENANCE_TYPES,
  PRIORITY,
  DATE_FORMATS,
  PAGINATION,
  CHART_COLORS,
  STATUS_COLORS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  QUALITY_GRADE_COLORS,
  PRIORITY_COLORS,
  FILE_SIZE_LIMITS,
  ALLOWED_FILE_TYPES,
  NOTIFICATION_TYPES,
  STATUS_LABELS_UZ,
  DAYS_OF_WEEK,
  MONTHS
}