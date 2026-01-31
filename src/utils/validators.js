import * as yup from 'yup'

// ============================================================================
// YUP CONFIGURATION & LOCALE
// ============================================================================

// Set Uzbek locale messages
yup.setLocale({
  mixed: {
    default: 'Noto\'g\'ri qiymat',
    required: '${path} to\'ldirilishi shart',
    oneOf: '${path} quyidagilardan biri bo\'lishi kerak: ${values}',
    notOneOf: '${path} quyidagilardan biri bo\'lmasligi kerak: ${values}',
    notType: 'Noto\'g\'ri format',
  },
  string: {
    length: '${path} ${length} ta belgidan iborat bo\'lishi kerak',
    min: '${path} kamida ${min} ta belgidan iborat bo\'lishi kerak',
    max: '${path} ko\'pi bilan ${max} ta belgidan iborat bo\'lishi kerak',
    matches: '${path} formati noto\'g\'ri',
    email: 'Noto\'g\'ri email format',
    url: 'Noto\'g\'ri URL format',
    trim: '${path} boshida va oxirida bo\'sh joy bo\'lmasligi kerak',
    lowercase: '${path} kichik harflardan iborat bo\'lishi kerak',
    uppercase: '${path} katta harflardan iborat bo\'lishi kerak',
  },
  number: {
    min: '${path} kamida ${min} bo\'lishi kerak',
    max: '${path} ko\'pi bilan ${max} bo\'lishi kerak',
    lessThan: '${path} ${less} dan kichik bo\'lishi kerak',
    moreThan: '${path} ${more} dan katta bo\'lishi kerak',
    positive: '${path} musbat son bo\'lishi kerak',
    negative: '${path} manfiy son bo\'lishi kerak',
    integer: '${path} butun son bo\'lishi kerak',
  },
  date: {
    min: '${path} ${min} dan kech bo\'lmasligi kerak',
    max: '${path} ${max} dan erta bo\'lmasligi kerak',
  },
  array: {
    min: 'Kamida ${min} ta element bo\'lishi kerak',
    max: 'Ko\'pi bilan ${max} ta element bo\'lishi kerak',
  },
})

// ============================================================================
// CUSTOM YUP METHODS
// ============================================================================

/**
 * Phone number validation (Uzbekistan format)
 */
yup.addMethod(yup.string, 'phone', function (message = 'Noto\'g\'ri telefon raqami') {
  return this.matches(
    /^(\+998|998)?[\s\-]?[0-9]{2}[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
    message
  )
})

/**
 * TIN validation (Tax Identification Number - 9 digits)
 */
yup.addMethod(yup.string, 'tin', function (message = 'TIN 9 ta raqamdan iborat bo\'lishi kerak') {
  return this.matches(/^\d{9}$/, message)
})

/**
 * INPS validation (Company registration - 14 digits)
 */
yup.addMethod(yup.string, 'inps', function (message = 'INPS 14 ta raqamdan iborat bo\'lishi kerak') {
  return this.matches(/^\d{14}$/, message)
})

/**
 * Card number validation
 */
yup.addMethod(yup.string, 'cardNumber', function (message = 'Noto\'g\'ri karta raqami') {
  return this.test('cardNumber', message, function (value) {
    if (!value) return true
    
    // Remove spaces and dashes
    const cleaned = value.replace(/[\s\-]/g, '')
    
    // Check if 16 digits
    if (!/^\d{16}$/.test(cleaned)) return false
    
    // Luhn algorithm
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10)
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  })
})

/**
 * Username validation (alphanumeric, underscore, hyphen)
 */
yup.addMethod(yup.string, 'username', function (message = 'Foydalanuvchi nomi faqat harflar, raqamlar, _ va - dan iborat bo\'lishi mumkin') {
  return this.matches(/^[a-zA-Z0-9_-]+$/, message)
})

/**
 * Strong password validation
 */
yup.addMethod(yup.string, 'strongPassword', function (message = 'Parol juda zaif') {
  return this
    .min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .matches(/[a-z]/, 'Parol kamida bitta kichik harf o\'z ichiga olishi kerak')
    .matches(/[A-Z]/, 'Parol kamida bitta katta harf o\'z ichiga olishi kerak')
    .matches(/[0-9]/, 'Parol kamida bitta raqam o\'z ichiga olishi kerak')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Parol kamida bitta maxsus belgi o\'z ichiga olishi kerak')
})

/**
 * Only letters validation (Uzbek and Latin)
 */
yup.addMethod(yup.string, 'onlyLetters', function (message = 'Faqat harflar kiritish mumkin') {
  return this.matches(/^[a-zA-Z\u0400-\u04FF\s]+$/, message)
})

/**
 * Only numbers validation
 */
yup.addMethod(yup.string, 'onlyNumbers', function (message = 'Faqat raqamlar kiritish mumkin') {
  return this.matches(/^\d+$/, message)
})

/**
 * Postal code validation
 */
yup.addMethod(yup.string, 'postalCode', function (message = 'Noto\'g\'ri pochta indeksi') {
  return this.matches(/^\d{6}$/, message)
})

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

export const validators = {
  // Basic validators
  required: (field = 'Maydon') => yup.string().required(`${field} to\'ldirilishi shart`),
  
  email: () => yup.string().email('Noto\'g\'ri email format').required('Email to\'ldirilishi shart'),
  
  phone: () => yup.string().phone().required('Telefon raqami to\'ldirilishi shart'),
  
  tin: () => yup.string().tin().required('TIN to\'ldirilishi shart'),
  
  inps: () => yup.string().inps().required('INPS to\'ldirilishi shart'),
  
  cardNumber: () => yup.string().cardNumber().required('Karta raqami to\'ldirilishi shart'),
  
  username: () => yup.string().username().min(3).max(20).required('Foydalanuvchi nomi to\'ldirilishi shart'),
  
  // Password validators
  password: () => yup.string().min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak').required('Parol to\'ldirilishi shart'),
  
  strongPassword: () => yup.string().strongPassword().required('Parol to\'ldirilishi shart'),
  
  confirmPassword: (passwordField = 'password') => 
    yup.string()
      .oneOf([yup.ref(passwordField)], 'Parollar mos kelmadi')
      .required('Parolni tasdiqlash majburiy'),
  
  // Number validators
  positiveNumber: (field = 'Qiymat') => 
    yup.number()
      .positive(`${field} musbat bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  nonNegativeNumber: (field = 'Qiymat') =>
    yup.number()
      .min(0, `${field} manfiy bo\'lmasligi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  integer: (field = 'Qiymat') =>
    yup.number()
      .integer(`${field} butun son bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  minValue: (min, field = 'Qiymat') =>
    yup.number()
      .min(min, `${field} kamida ${min} bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  maxValue: (max, field = 'Qiymat') =>
    yup.number()
      .max(max, `${field} ko\'pi bilan ${max} bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  range: (min, max, field = 'Qiymat') =>
    yup.number()
      .min(min, `${field} kamida ${min} bo\'lishi kerak`)
      .max(max, `${field} ko\'pi bilan ${max} bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  // String validators
  minLength: (min, field = 'Maydon') =>
    yup.string()
      .min(min, `${field} kamida ${min} ta belgidan iborat bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  maxLength: (max, field = 'Maydon') =>
    yup.string()
      .max(max, `${field} ko\'pi bilan ${max} ta belgidan iborat bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  exactLength: (length, field = 'Maydon') =>
    yup.string()
      .length(length, `${field} ${length} ta belgidan iborat bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  onlyLetters: (field = 'Maydon') =>
    yup.string()
      .onlyLetters()
      .required(`${field} to\'ldirilishi shart`),
  
  onlyNumbers: (field = 'Maydon') =>
    yup.string()
      .onlyNumbers()
      .required(`${field} to\'ldirilishi shart`),
  
  // Date validators
  date: (field = 'Sana') =>
    yup.date()
      .typeError('Noto\'g\'ri sana formati')
      .required(`${field} to\'ldirilishi shart`),
  
  futureDate: (field = 'Sana') =>
    yup.date()
      .min(new Date(), `${field} kelajakdagi sana bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  pastDate: (field = 'Sana') =>
    yup.date()
      .max(new Date(), `${field} o\'tmishdagi sana bo\'lishi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  dateRange: (minDate, maxDate, field = 'Sana') =>
    yup.date()
      .min(minDate, `${field} ${minDate} dan kech bo\'lmasligi kerak`)
      .max(maxDate, `${field} ${maxDate} dan erta bo\'lmasligi kerak`)
      .required(`${field} to\'ldirilishi shart`),
  
  // Array validators
  arrayRequired: (field = 'Ro\'yxat') =>
    yup.array().min(1, `Kamida bitta ${field} bo\'lishi kerak`),
  
  arrayMin: (min, field = 'Element') =>
    yup.array().min(min, `Kamida ${min} ta ${field} bo\'lishi kerak`),
  
  arrayMax: (max, field = 'Element') =>
    yup.array().max(max, `Ko\'pi bilan ${max} ta ${field} bo\'lishi kerak`),
  
  // URL validator
  url: () => yup.string().url('Noto\'g\'ri URL format').required('URL to\'ldirilishi shart'),
  
  // File validators
  file: (field = 'Fayl') =>
    yup.mixed().required(`${field} to\'ldirilishi shart`),
  
  // Boolean validator
  boolean: () => yup.boolean(),
  
  accepted: (field = 'Shartlar') =>
    yup.boolean().oneOf([true], `${field}ni qabul qilish majburiy`),
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Login schema
 */
export const loginSchema = yup.object({
  username: validators.required('Foydalanuvchi nomi'),
  password: validators.required('Parol'),
})

/**
 * Registration schema
 */
export const registerSchema = yup.object({
  first_name: validators.onlyLetters('Ism'),
  last_name: validators.onlyLetters('Familiya'),
  username: validators.username(),
  email: validators.email(),
  phone: validators.phone(),
  password: validators.strongPassword(),
  confirm_password: validators.confirmPassword(),
})

/**
 * Profile update schema
 */
export const profileSchema = yup.object({
  first_name: validators.onlyLetters('Ism'),
  last_name: validators.onlyLetters('Familiya'),
  email: validators.email(),
  phone: validators.phone(),
})

/**
 * Change password schema
 */
export const changePasswordSchema = yup.object({
  old_password: validators.required('Eski parol'),
  new_password: validators.strongPassword(),
  confirm_password: validators.confirmPassword('new_password'),
})

/**
 * Receipt schema (Warehouse)
 */
export const receiptSchema = yup.object({
  supplier_id: validators.required('Yetkazib beruvchi'),
  raw_material_id: validators.required('Xom-ashyo'),
  quantity: validators.positiveNumber('Miqdor'),
  unit_price: validators.positiveNumber('Narx'),
  batch_number: validators.required('Partiya raqami'),
  expiry_date: validators.futureDate('Yaroqlilik muddati').nullable(),
})

/**
 * Customer schema (Sales)
 */
export const customerSchema = yup.object({
  name: validators.required('Nomi'),
  phone: validators.phone(),
  email: validators.email().nullable(),
  tin: validators.tin().nullable(),
  address: yup.string().nullable(),
  type: validators.required('Turi'),
})

/**
 * Order schema (Sales)
 */
export const orderSchema = yup.object({
  customer_id: validators.required('Mijoz'),
  delivery_date: validators.futureDate('Yetkazish sanasi').nullable(),
  items: validators.arrayMin(1, 'mahsulot'),
  notes: yup.string().max(500).nullable(),
})

/**
 * Employee schema (HR)
 */
export const employeeSchema = yup.object({
  first_name: validators.onlyLetters('Ism'),
  last_name: validators.onlyLetters('Familiya'),
  phone: validators.phone(),
  email: validators.email().nullable(),
  position: validators.required('Lavozim'),
  department: validators.required('Bo\'lim'),
  hire_date: validators.pastDate('Ishga qabul sanasi'),
  salary: validators.positiveNumber('Maosh'),
})

/**
 * Transaction schema (Finance)
 */
export const transactionSchema = yup.object({
  type: validators.required('Turi'),
  amount: validators.positiveNumber('Summa'),
  description: validators.required('Tavsif'),
  category: validators.required('Kategoriya'),
  date: validators.date('Sana'),
  payment_method: validators.required('To\'lov usuli'),
})

/**
 * Shift schema (Production)
 */
export const shiftSchema = yup.object({
  line_id: validators.required('Liniya'),
  operator_id: validators.required('Operator'),
  shift_type: validators.required('Smena turi'),
  start_time: validators.date('Boshlanish vaqti'),
  notes: yup.string().max(500).nullable(),
})

/**
 * Maintenance request schema
 */
export const maintenanceRequestSchema = yup.object({
  machine_id: validators.required('Uskunа'),
  type: validators.required('Turi'),
  priority: validators.required('Muhimlik'),
  description: validators.required('Tavsif'),
  scheduled_date: validators.futureDate('Rejalashtirilgan sana').nullable(),
})

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validate data against schema
 * @param {Object} schema - Yup schema
 * @param {Object} data - Data to validate
 * @returns {Promise<Object>} { valid: boolean, errors: Object }
 */
export async function validate(schema, data) {
  try {
    await schema.validate(data, { abortEarly: false })
    return { valid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach(err => {
      if (!errors[err.path]) {
        errors[err.path] = err.message
      }
    })
    return { valid: false, errors }
  }
}

/**
 * Validate single field
 * @param {Object} schema - Yup schema
 * @param {string} field - Field name
 * @param {*} value - Field value
 * @returns {Promise<string|null>} Error message or null
 */
export async function validateField(schema, field, value) {
  try {
    await yup.reach(schema, field).validate(value)
    return null
  } catch (error) {
    return error.message
  }
}

/**
 * Check if value matches pattern
 * @param {*} value - Value to check
 * @param {RegExp} pattern - Regular expression pattern
 * @returns {boolean} Match result
 */
export function matchesPattern(value, pattern) {
  if (!value) return false
  return pattern.test(value)
}

/**
 * Export yup for custom validations
 */
export { yup }

export default validators