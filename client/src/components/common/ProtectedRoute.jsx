// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  // Show loading spinner while verifying token
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  // Render the protected component
  return children
}

export default ProtectedRoute
