// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import useAuthStore from './store/authStore'

function App() {
  const { isAuthenticated, verifyToken, isLoading } = useAuthStore()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      if (!hasInitialized) {
        await verifyToken()
        setHasInitialized(true)
      }
    }
    initializeAuth()
  }, [hasInitialized, verifyToken])

  // Show loading screen while initializing
  if (!hasInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FiscalFlow...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
        />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* 404 fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <a
                  href="/"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Go back home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
