// src/services/transactionService.js
import { api } from '../store/authStore'

// Transaction API functions
export const transactionService = {
  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions', transactionData)
      return {
        success: true,
        data: response.data,
        transaction: response.data.transaction
      }
    } catch (error) {
      console.error('Create transaction error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create transaction'
      }
    }
  },

  // Get all transactions for current user
  async getTransactions(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      // Add filters if provided
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.type) params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.limit) params.append('limit', filters.limit)
      if (filters.offset) params.append('offset', filters.offset)

      const response = await api.get(`/transactions?${params}`)
      return {
        success: true,
        data: response.data,
        transactions: response.data.transactions || [],
        total: response.data.total || 0
      }
    } catch (error) {
      console.error('Get transactions error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch transactions'
      }
    }
  },

  // Update transaction
  async updateTransaction(transactionId, updateData) {
    try {
      const response = await api.put(`/transactions/${transactionId}`, updateData)
      return {
        success: true,
        data: response.data,
        transaction: response.data.transaction
      }
    } catch (error) {
      console.error('Update transaction error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update transaction'
      }
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId) {
    try {
      await api.delete(`/transactions/${transactionId}`)
      return {
        success: true
      }
    } catch (error) {
      console.error('Delete transaction error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete transaction'
      }
    }
  },

  // Get transaction analytics/overview
  async getTransactionOverview(period = 'month') {
    try {
      const response = await api.get(`/analytics/overview?period=${period}`)
      return {
        success: true,
        data: response.data,
        overview: response.data.overview || {}
      }
    } catch (error) {
      console.error('Get overview error:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch overview',
        overview: {
          totalIncome: 0,
          totalExpenses: 0,
          netFlow: 0,
          transactionCount: 0
        }
      }
    }
  }
}

export default transactionService