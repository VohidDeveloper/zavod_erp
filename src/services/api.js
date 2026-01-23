import axios from 'axios'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add language
    const language = localStorage.getItem('language') || 'uz'
    config.headers['Accept-Language'] = language

    // Add timestamp for cache busting
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
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
    return response.data
  },
  (error) => {
    // Handle errors
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          if (router.currentRoute.value.name !== 'login') {
            router.push('/login')
          }
          break

        case 403:
          // Forbidden - no permission
          console.error('Permission denied:', data.message)
          break

        case 404:
          // Not found
          console.error('Resource not found:', error.config.url)
          break

        case 422:
          // Validation error
          console.error('Validation error:', data.errors)
          break

        case 429:
          // Too many requests
          console.error('Too many requests. Please try again later.')
          break

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error:', data.message || 'Internal server error')
          break

        default:
          console.error('API Error:', data.message || 'Unknown error')
      }

      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server')
      return Promise.reject({ message: 'No response from server' })
    } else {
      // Error in request setup
      console.error('Request error:', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

// API methods
export const apiClient = {
  // GET request
  get(url, params = {}) {
    return api.get(url, { params })
  },

  // POST request
  post(url, data = {}) {
    return api.post(url, data)
  },

  // PUT request
  put(url, data = {}) {
    return api.put(url, data)
  },

  // PATCH request
  patch(url, data = {}) {
    return api.patch(url, data)
  },

  // DELETE request
  delete(url, data = {}) {
    return api.delete(url, { data })
  },

  // Upload file
  upload(url, formData, onProgress) {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      }
    })
  },

  // Download file
  download(url, filename, params = {}) {
    return api.get(url, {
      params,
      responseType: 'blob'
    }).then((response) => {
      const blob = new Blob([response])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(link.href)
    })
  }
}

export default api