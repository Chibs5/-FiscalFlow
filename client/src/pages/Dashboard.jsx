// src/pages/Dashboard.jsx
import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
import AddTransactionForm from '../components/transactions/AddTransactionForm'

const Dashboard = () => {
  const { user, logout, getProfile } = useAuthStore()

  useEffect(() => {
    // Fetch the latest user profile when component mounts
    getProfile()
  }, [getProfile])

  const handleLogout = () => {
    logout()
  }

  const handleTransactionAdded = () => {
    console.log('Transaction added successfully! Dashboard notified.')
    // Later we'll refresh transaction data here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">FiscalFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                🎉 Welcome to FiscalFlow!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your personal finance tracker is ready to go
              </p>
              
              {/* User Info Card */}
              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Profile</h3>
                <div className="space-y-2 text-left text-sm">
                  <p><strong>Name:</strong> {user?.name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Subscription:</strong> {user?.subscriptionTier}</p>
                  <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Start tracking your finances by adding your first transaction below 👇
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Management Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Add Transaction Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    💰 Transaction Management
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Add your income and expenses to start tracking your financial flow.
                </p>
                
                {/* Add Transaction Form Component */}
                <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
              </div>
            </div>

            {/* Quick Stats Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  📊 Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600 font-medium">Total Income</p>
                    <p className="text-2xl font-bold text-green-700">K0.00</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700">K0.00</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-600 font-medium">Net Flow</p>
                    <p className="text-2xl font-bold text-blue-700">K0.00</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    💡 Stats will update as you add transactions
                  </p>
                </div>
              </>
            </div>
          </div>

          {/* Recent Transactions Placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                📋 Recent Transactions
              </h3>
              <span className="text-sm text-gray-500">Coming next...</span>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">🔄</p>
              <p>Your transactions will appear here</p>
              <p className="text-sm">Add your first transaction to get started!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard