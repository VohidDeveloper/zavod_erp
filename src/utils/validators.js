import * as yup from 'yup'

// Custom Yup methods
yup.addMethod(yup.string, 'phone', function(message) {
  return this.matches(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, 
    message || 'Noto\'g\'ri telefon raqami'
  )
})

yup.addMethod(yup.string, 'tin', function(message) {
  return this.matches(/^\d{9}$/, message || 'TIN 9 ta raqamdan iborat bo\'lishi kerak')
})

export const validators = {
  required: (field) => yup.string().required(`${field} majburiy`),
  email: () => yup.string().email('Noto\'g\'ri email format'),
  phone: () => yup.string().phone(),
  tin: () => yup.string().tin(),
  
  positiveNumber: (field) => yup.number()
    .positive(`${field} musbat bo\'lishi kerak`)
    .required(`${field} majburiy`),
    
  minValue: (min, field) => yup.number()
    .min(min, `${field} kamida ${min} bo\'lishi kerak`),
    
  maxValue: (max, field) => yup.number()
    .max(max, `${field} ko\'pi bilan ${max} bo\'lishi kerak`),
    
  minLength: (min, field) => yup.string()
    .min(min, `${field} kamida ${min} ta belgidan iborat bo\'lishi kerak`),
    
  maxLength: (max, field) => yup.string()
    .max(max, `${field} ko\'pi bilan ${max} ta belgidan iborat bo\'lishi kerak`),
    
  password: () => yup.string()
    .min(8, 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
    .matches(/[a-z]/, 'Parol kichik harflarni o\'z ichiga olishi kerak')
    .matches(/[A-Z]/, 'Parol katta harflarni o\'z ichiga olishi kerak')
    .matches(/[0-9]/, 'Parol raqamlarni o\'z ichiga olishi kerak'),
}

// Validation schemas
export const receiptSchema = yup.object({
  supplier_id: validators.required('Yetkazib beruvchi'),
  raw_material_id: validators.required('Xom-ashyo'),
  quantity: validators.positiveNumber('Miqdor'),
  unit_price: validators.positiveNumber('Narx'),
  batch_number: validators.required('Partiya raqami'),
})

export const customerSchema = yup.object({
  name: validators.required('Nomi'),
  phone: validators.phone(),
  email: validators.email(),
  tin: validators.tin(),
})

export const employeeSchema = yup.object({
  first_name: validators.required('Ism'),
  last_name: validators.required('Familiya'),
  phone: validators.phone(),
  email: validators.email(),
  position: validators.required('Lavozim'),
  department: validators.required('Bo\'lim'),
})

export const orderSchema = yup.object({
  customer_id: validators.required('Mijoz'),
  delivery_date: validators.required('Yetkazib berish sanasi'),
  items: yup.array().min(1, 'Kamida bitta mahsulot qo\'shing'),
})

export const shiftSchema = yup.object({
  production_line_id: validators.required('Liniya'),
  operator_id: validators.required('Operator'),
  shift_type: validators.required('Smena turi'),
  start_time: validators.required('Boshlanish vaqti'),
})

// Helper functions
export function validateField(schema, field, value) {
  try {
    schema.validateSyncAt(field, { [field]: value })
    return null
  } catch (error) {
    return error.message
  }
}

export async function validateForm(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false })
    return { valid: true, errors: {} }
  } catch (error) {
    const errors = {}
    error.inner.forEach(err => {
      errors[err.path] = err.message
    })
    return { valid: false, errors }
  }
}