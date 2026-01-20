// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// App Info
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'S PROMAX PLAST'
export const APP_VERSION = '0.0.1'

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// Date Formats
export const DATE_FORMAT = 'dd.MM.yyyy'
export const DATETIME_FORMAT = 'dd.MM.yyyy HH:mm'
export const TIME_FORMAT = 'HH:mm'

// Status
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Roles
export const ROLES = {
  SUPERADMIN: 'superadmin',
  DIRECTOR: 'director',
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  WAREHOUSE_MANAGER: 'warehouse_manager',
  OPERATOR: 'operator',
  SALES_MANAGER: 'sales_manager',
  HR_MANAGER: 'hr_manager',
  MAINTENANCE: 'maintenance',
}

// Permissions
export const PERMISSIONS = {
  // Warehouse
  READ_WAREHOUSE: 'read:warehouse',
  WRITE_WAREHOUSE: 'write:warehouse',
  APPROVE_REQUEST: 'approve:material_request',
  
  // Production
  READ_PRODUCTION: 'read:production',
  WRITE_PRODUCTION: 'write:production',
  
  // Sales
  READ_SALES: 'read:sales',
  WRITE_SALES: 'write:sales',
  
  // Finance
  READ_FINANCE: 'read:finance',
  WRITE_FINANCE: 'write:finance',
  
  // HR
  READ_HR: 'read:hr',
  WRITE_HR: 'write:hr',
  
  // Maintenance
  READ_MAINTENANCE: 'read:maintenance',
  WRITE_MAINTENANCE: 'write:maintenance',
  
  // Analytics
  READ_ANALYTICS: 'read:analytics',
  
  // Admin
  MANAGE_USERS: 'manage:users',
  MANAGE_ROLES: 'manage:roles',
}

// Stock Status
export const STOCK_STATUS = {
  SUFFICIENT: 'sufficient',
  LOW: 'low',
  CRITICAL: 'critical',
}

// Production Line Types
export const PRODUCTION_LINES = {
  DECOR_PLAST: 'Decor Plast',
  KLYONKA: 'Klyonka',
  SANTEXNIKA: 'Santexnika quvurlari',
  PVX_PANEL: 'PVX Panel',
  PROFIL: 'Profil',
  BETON: 'Beton',
}

// Shift Types
export const SHIFT_TYPES = {
  DAY: 'day',
  NIGHT: 'night',
}

// Quality Grades
export const QUALITY_GRADES = {
  A: 'A',
  B: 'B',
  C: 'C',
}

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CARD: 'card',
}

// Order Status
export const ORDER_STATUS = {
  PREPARING: 'preparing',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
}

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PARTIAL: 'partial',
  UNPAID: 'unpaid',
}