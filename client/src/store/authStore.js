// src/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fiscalflow-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('fiscalflow-token')
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Login function
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post('/auth/login', {
            email,
            password,
          })

          const { token, user } = response.data

          // Store token in localStorage
          localStorage.setItem('fiscalflow-token', token)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          localStorage.removeItem('fiscalflow-token')
          return { success: false, error: errorMessage }
        }
      },

      // Register function
      register: async (email, password, name) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post('/auth/register', {
            email,
            password,
            name,
          })

          const { token, user } = response.data

          // Store token in localStorage
          localStorage.setItem('fiscalflow-token', token)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          return { success: true }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Registration failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          localStorage.removeItem('fiscalflow-token')
          return { success: false, error: errorMessage }
        }
      },

      // Logout function
      logout: () => {
        localStorage.removeItem('fiscalflow-token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // Verify token and get user profile
      verifyToken: async () => {
        const token = localStorage.getItem('fiscalflow-token')
        
        if (!token) {
          return false
        }

        set({ isLoading: true })
        
        try {
          const response = await api.get('/auth/verify')
          
          set({
            user: response.data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return true
        } catch {
          localStorage.removeItem('fiscalflow-token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          return false
        }
      },

      // Get user profile
      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile')
          set({ user: response.data.user })
          return response.data.user
        } catch (error) {
          console.error('Failed to get profile:', error)
          return null
        }
      },
    }),
    {
      name: 'fiscalflow-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Export the API instance for use in other components
export { api }
export default useAuthStore