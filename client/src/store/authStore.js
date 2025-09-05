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
  (error) => Promise.reject(error)
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fiscalflow-token')
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

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data

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

      // Register
      register: async (email, password, name) => {
        set({ isLoading: true, error: null })
        try {
          const response = await api.post('/auth/register', { email, password, name })
          const { token, user } = response.data

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

      // Logout
      logout: () => {
        localStorage.removeItem('fiscalflow-token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      // Verify token
      verifyToken: async () => {
        const token = localStorage.getItem('fiscalflow-token')
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false })
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

      // Get profile
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
      // Only persist token + user, NOT isAuthenticated
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)

// Export API instance for use elsewhere
export { api }
export default useAuthStore
