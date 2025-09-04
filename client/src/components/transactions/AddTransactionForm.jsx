// src/components/transactions/AddTransactionForm.jsx
import { useState } from 'react'
import { PlusIcon, DollarSignIcon } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { getCurrencySymbol } from '../../utils/currency'
import { transactionService } from '../../services/transactionService'

const AddTransactionForm = ({ onTransactionAdded }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuthStore() // Get user for currency preference
  
  // Get user's currency or default to USD
  const userCurrency = user?.currency || 'USD'
  const currencySymbol = getCurrencySymbol(userCurrency)

  const [formData, setFormData] = useState({
    type: 'expense', // 'income' or 'expense'
    amount: '',
    description: '',
    category: 'Food & Dining', // Default category
    date: new Date().toISOString().split('T')[0] // Today's date
  })
  const [isLoading, setIsLoading] = useState(false)

  // Predefined categories for now (we'll make this dynamic later)
  const categories = {
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Other'
    ],
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Investment',
      'Gift',
      'Other'
    ]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare transaction data for API
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
        currency: userCurrency
      }

      console.log('Submitting transaction:', transactionData)
      
      // Call API to create transaction
      const result = await transactionService.createTransaction(transactionData)
      
      if (result.success) {
        // Reset form
        setFormData({
          type: 'expense',
          amount: '',
          description: '',
          category: 'Food & Dining',
          date: new Date().toISOString().split('T')[0]
        })
        
        // Close form
        setIsOpen(false)
        
        // Notify parent component to refresh data
        if (onTransactionAdded) {
          onTransactionAdded()
        }
        
        // Show success message
        alert(`Transaction added successfully! ${formData.type === 'income' ? 'Income' : 'Expense'} of ${currencySymbol}${formData.amount}`)
        
      } else {
        // Show error message
        alert(`Error: ${result.error}`)
        console.error('Transaction creation failed:', result.error)
      }
      
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Failed to add transaction. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset category when type changes
      ...(field === 'type' && { category: categories[value][0] })
    }))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Add Transaction
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <DollarSignIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Add New Transaction
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Expense</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mr-2 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Income</span>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ({userCurrency})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{currencySymbol}</span>
            </div>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="What was this transaction for?"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {categories[formData.type].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTransactionForm