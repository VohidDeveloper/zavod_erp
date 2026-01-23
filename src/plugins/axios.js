import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to headers
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.status, error.message)
    }
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const authStore = useAuthStore()
      
      // Try to refresh token
      try {
        await authStore.refreshToken()
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        authStore.logout()
        router.push({ 
          name: 'login', 
          query: { redirect: router.currentRoute.value.fullPath } 
        })
        return Promise.reject(refreshError)
      }
    }
    
    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      router.push({ name: 'forbidden' })
    }
    
    // Handle 404 Not Found - Don't redirect
    if (error.response?.status === 404) {
      return Promise.reject(error)
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      router.push({ name: 'server-error' })
    }
    
    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      // Return validation errors for form handling
      return Promise.reject(error)
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      // You can show a toast notification here
    }
    
    return Promise.reject(error)
  }
)

// Helper methods
export const api = {
  // Standard methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Upload file with progress
  upload: (url, formData, onProgress) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(percent)
        }
      }
    })
  },
  
  // Download file
  download: async (url, filename, config = {}) => {
    const response = await apiClient.get(url, {
      ...config,
      responseType: 'blob'
    })
    
    // Create blob link to download
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(link.href)
    
    return response
  }
}

// Plugin install
export default {
  install(app) {
    // Make available globally
    app.config.globalProperties.$axios = apiClient
    app.config.globalProperties.$api = api
    app.provide('axios', apiClient)
    app.provide('api', api)
  }
}

export { apiClient }