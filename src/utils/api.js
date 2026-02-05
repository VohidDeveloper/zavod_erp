import axios from 'axios'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
            { refresh_token: refreshToken }
          )

          const { access_token } = response.data
          localStorage.setItem('access_token', access_token)

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data)
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data)
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data)
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return data.detail || 'Noto\'g\'ri so\'rov'
      case 401:
        return 'Autentifikatsiya xatosi. Iltimos, qaytadan kiring.'
      case 403:
        return 'Sizda bu amalni bajarish uchun ruxsat yo\'q'
      case 404:
        return 'Ma\'lumot topilmadi'
      case 422:
        // FastAPI validation error
        if (data.detail && Array.isArray(data.detail)) {
          return data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        }
        return data.detail || 'Ma\'lumotlarni tekshirishda xatolik'
      case 500:
        return 'Server xatosi. Iltimos, keyinroq urinib ko\'ring.'
      default:
        return data.detail || data.message || 'Noma\'lum xato'
    }
  } else if (error.request) {
    // Request made but no response
    return 'Serverga ulanishda xatolik. Internet aloqangizni tekshiring.'
  } else {
    // Something else happened
    return error.message || 'Noma\'lum xato yuz berdi'
  }
}

export default api