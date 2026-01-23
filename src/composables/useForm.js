import { ref, reactive, computed } from 'vue'
import { useNotifications } from './useNotifications'

export function useForm(initialValues = {}, options = {}) {
  const {
    validationRules = {},
    onSubmit = null,
    resetOnSubmit = false
  } = options

  const { error: showError, success: showSuccess } = useNotifications()

  const formData = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const isSubmitting = ref(false)
  const isValid = ref(true)

  // Check if form has been modified
  const isDirty = computed(() => {
    return Object.keys(formData).some(key => {
      return JSON.stringify(formData[key]) !== JSON.stringify(initialValues[key])
    })
  })

  // Check if any fields have been touched
  const hasBeenTouched = computed(() => {
    return Object.values(touched).some(value => value === true)
  })

  // Set field value
  const setFieldValue = (field, value) => {
    formData[field] = value
    if (touched[field]) {
      validateField(field)
    }
  }

  // Set multiple values
  const setValues = (values) => {
    Object.keys(values).forEach(key => {
      if (key in formData) {
        formData[key] = values[key]
      }
    })
  }

  // Set field as touched
  const setFieldTouched = (field, isTouched = true) => {
    touched[field] = isTouched
  }

  // Set field error
  const setFieldError = (field, error) => {
    errors[field] = error
  }

  // Clear field error
  const clearFieldError = (field) => {
    delete errors[field]
  }

  // Clear all errors
  const clearErrors = () => {
    Object.keys(errors).forEach(key => {
      delete errors[key]
    })
  }

  // Validate single field
  const validateField = (field) => {
    const rules = validationRules[field]
    if (!rules) {
      clearFieldError(field)
      return true
    }

    const value = formData[field]

    // Required validation
    if (rules.required && !value) {
      setFieldError(field, rules.requiredMessage || 'Bu maydon to\'ldirilishi shart')
      return false
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      setFieldError(field, rules.minLengthMessage || `Kamida ${rules.minLength} ta belgi bo'lishi kerak`)
      return false
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      setFieldError(field, rules.maxLengthMessage || `Maksimal ${rules.maxLength} ta belgi bo'lishi mumkin`)
      return false
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      setFieldError(field, rules.patternMessage || 'Noto\'g\'ri format')
      return false
    }

    // Email validation
    if (rules.email && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(value)) {
        setFieldError(field, rules.emailMessage || 'Noto\'g\'ri email')
        return false
      }
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, formData)
      if (customError) {
        setFieldError(field, customError)
        return false
      }
    }

    clearFieldError(field)
    return true
  }

  // Validate all fields
  const validate = () => {
    let valid = true
    Object.keys(validationRules).forEach(field => {
      if (!validateField(field)) {
        valid = false
      }
    })
    isValid.value = valid
    return valid
  }

  // Handle submit
  const handleSubmit = async (customSubmit = null) => {
    // Mark all fields as touched
    Object.keys(formData).forEach(key => {
      touched[key] = true
    })

    // Validate form
    if (!validate()) {
      showError('Formada xatolar mavjud')
      return
    }

    isSubmitting.value = true

    try {
      const submitFn = customSubmit || onSubmit
      if (submitFn) {
        await submitFn(formData)
        if (resetOnSubmit) {
          reset()
        }
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle server validation errors
        Object.keys(error.response.data.errors).forEach(key => {
          setFieldError(key, error.response.data.errors[key][0])
        })
      }
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // Reset form
  const reset = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = initialValues[key]
    })
    clearErrors()
    Object.keys(touched).forEach(key => {
      touched[key] = false
    })
    isValid.value = true
  }

  return {
    // State
    formData,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    hasBeenTouched,
    
    // Methods
    setFieldValue,
    setValues,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    clearErrors,
    validateField,
    validate,
    handleSubmit,
    reset
  }
}