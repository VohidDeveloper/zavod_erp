import axios from 'axios'
import router from '@/router'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token (FastAPI uses access_token)
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add language
    const language = localStorage.getItem('language') || 'uz'
    config.headers['Accept-Language'] = language

    // Add timestamp for cache busting (only for GET requests)
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
  async (error) => {
    const originalRequest = error.config

    // Handle errors
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - try to refresh token
          if (!originalRequest._retry) {
            originalRequest._retry = true

            try {
              const refreshToken = localStorage.getItem('refresh_token')
              if (refreshToken) {
                // Try to refresh token
                const response = await axios.post(
                  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
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
              
              if (router.currentRoute.value.name !== 'login') {
                router.push('/login')
              }
              return Promise.reject(refreshError)
            }
          }

          // If retry failed or no refresh token, logout
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          
          if (router.currentRoute.value.name !== 'login') {
            router.push('/login')
          }
          break

        case 403:
          // Forbidden - no permission
          console.error('Permission denied:', data.detail || data.message)
          break

        case 404:
          // Not found
          console.error('Resource not found:', error.config.url)
          break

        case 422:
          // FastAPI validation error
          console.error('Validation error:', data.detail)
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
          console.error('Server error:', data.detail || data.message || 'Internal server error')
          break

        default:
          console.error('API Error:', data.detail || data.message || 'Unknown error')
      }

      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server')
      return Promise.reject({ detail: 'No response from server', message: 'No response from server' })
    } else {
      // Error in request setup
      console.error('Request error:', error.message)
      return Promise.reject({ detail: error.message, message: error.message })
    }
  }
)

// API methods wrapper
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

// Export both for flexibility
export default api