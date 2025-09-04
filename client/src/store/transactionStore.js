// src/store/transactionStore.js
import { create } from 'zustand'
import { transactionService } from '../services/transactionService'
import { formatCurrency } from '../utils/currency'


const useTransactionStore = create((set, get) => ({
  // State
  transactions: [],
  overview: {
    totalIncome: 0,
    totalExpenses: 0,
    netFlow: 0,
    transactionCount: 0
  },
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all transactions
  fetchTransactions: async (filters = {}) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await transactionService.getTransactions(filters)
      
      if (result.success) {
        set({ 
          transactions: result.transactions,
          isLoading: false,
          lastUpdated: new Date().toISOString()
        })
      } else {
        set({ 
          error: result.error,
          isLoading: false 
        })
      }
    } catch (error) {
  console.error('Failed to fetch transactions:', error)
  set({ 
    error: 'Failed to fetch transactions',
    isLoading: false 
  })
}
  },

  // Fetch transaction overview/stats
  fetchOverview: async (period = 'month') => {
    try {
      const result = await transactionService.getTransactionOverview(period)
      
      if (result.success) {
        set({ overview: result.overview })
      } else {
        // Use fallback data if API fails
        set({ 
          overview: result.overview || {
            totalIncome: 0,
            totalExpenses: 0,
            netFlow: 0,
            transactionCount: 0
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error)
      // Keep existing overview data on error
    }
  },

  // Add new transaction
  addTransaction: async (transactionData) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await transactionService.createTransaction(transactionData)
      
      if (result.success) {
        // Add new transaction to the list
        const currentTransactions = get().transactions
        set({ 
          transactions: [result.transaction, ...currentTransactions],
          isLoading: false
        })
        
        // Refresh overview
        get().fetchOverview()
        
        return { success: true, transaction: result.transaction }
      } else {
        set({ 
          error: result.error,
          isLoading: false 
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
  console.error('Failed to add transaction:', error) // Now it's "used"
  const errorMsg = 'Failed to add transaction'
  set({ 
    error: errorMsg,
    isLoading: false 
  })
  return { success: false, error: errorMsg }
}
  },

  // Update transaction
  updateTransaction: async (transactionId, updateData) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await transactionService.updateTransaction(transactionId, updateData)
      
      if (result.success) {
        // Update transaction in the list
        const currentTransactions = get().transactions
        const updatedTransactions = currentTransactions.map(t => 
          t.id === transactionId ? result.transaction : t
        )
        
        set({ 
          transactions: updatedTransactions,
          isLoading: false
        })
        
        // Refresh overview
        get().fetchOverview()
        
        return { success: true, transaction: result.transaction }
      } else {
        set({ 
          error: result.error,
          isLoading: false 
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
  console.error('Failed to update transaction:', error)
  const errorMsg = 'Failed to update transaction'
  set({ 
    error: errorMsg,
    isLoading: false 
  })
  return { success: false, error: errorMsg }
}
  },

  // Delete transaction
  deleteTransaction: async (transactionId) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await transactionService.deleteTransaction(transactionId)
      
      if (result.success) {
        // Remove transaction from the list
        const currentTransactions = get().transactions
        const filteredTransactions = currentTransactions.filter(t => t.id !== transactionId)
        
        set({ 
          transactions: filteredTransactions,
          isLoading: false
        })
        
        // Refresh overview
        get().fetchOverview()
        
        return { success: true }
      } else {
        set({ 
          error: result.error,
          isLoading: false 
        })
        return { success: false, error: result.error }
      }
    } catch (error) {
  console.error('Failed to delete transaction:', error)
  const errorMsg = 'Failed to delete transaction'
  set({ 
    error: errorMsg,
    isLoading: false 
  })
  return { success: false, error: errorMsg }
}
  },

  // Get formatted overview for display
  getFormattedOverview: (currency = 'USD') => {
    const { overview } = get()
    return {
      totalIncome: formatCurrency(overview.totalIncome, currency),
      totalExpenses: formatCurrency(overview.totalExpenses, currency),
      netFlow: formatCurrency(overview.netFlow, currency),
      transactionCount: overview.transactionCount
    }
  },

  // Get recent transactions (last 10)
  getRecentTransactions: (limit = 10) => {
    const { transactions } = get()
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  },

  // Refresh all data
  refreshData: async () => {
    const { fetchTransactions, fetchOverview } = get()
    await Promise.all([
      fetchTransactions(),
      fetchOverview()
    ])
  }
}))

export default useTransactionStore