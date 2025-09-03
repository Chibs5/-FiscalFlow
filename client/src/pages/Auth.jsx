// src/pages/Auth.jsx
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import useAuthStore from '../store/authStore'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated, isLoading, clearError } = useAuthStore()

  // Clear errors when switching between forms
  useEffect(() => {
    clearError()
  }, [isLogin, clearError])

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return isLogin ? (
    <LoginForm onToggleForm={toggleForm} />
  ) : (
    <RegisterForm onToggleForm={toggleForm} />
  )
}

export default Auth