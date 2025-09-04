// server/controllers/user/transactionController.js
const { supabase } = require('../../config/supabase')
const { validationResult } = require('express-validator')

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { type, amount, description, category, date, currency } = req.body
    const userId = req.user.id

    // First, find or create category
    let categoryId = null
    if (category) {
      // Look for existing category
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .eq('user_id', userId)
        .single()

      if (existingCategory) {
        categoryId = existingCategory.id
      } else {
        // Create new category for user
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert({
            name: category,
            type: type === 'income' ? 'income' : 'expense',
            user_id: userId,
            is_custom: true
          })
          .select('id')
          .single()

        if (categoryError) {
          console.error('Category creation error:', categoryError)
          // Continue without category if creation fails
        } else {
          categoryId = newCategory.id
        }
      }
    }

    // Create transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        category_id: categoryId,
        amount: parseFloat(amount),
        type,
        description,
        date,
        // Note: currency is stored in user profile, not transaction
        created_at: new Date().toISOString()
      })
      .select(`
        id,
        amount,
        type,
        description,
        date,
        created_at,
        categories(id, name, type)
      `)
      .single()

    if (error) {
      console.error('Transaction creation error:', error)
      return res.status(500).json({
        error: 'Failed to create transaction'
      })
    }

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        category: transaction.categories?.name || category,
        date: transaction.date,
        createdAt: transaction.created_at
      }
    })

  } catch (error) {
    console.error('Create transaction error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

// Get all transactions for user
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id
    const { 
      startDate, 
      endDate, 
      type, 
      category, 
      limit = 50, 
      offset = 0 
    } = req.query

    let query = supabase
      .from('transactions')
      .select(`
        id,
        amount,
        type,
        description,
        date,
        created_at,
        categories(id, name, type)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    // Apply filters
    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (category) {
      query = query.eq('categories.name', category)
    }

    // Apply pagination
    query = query.range(offset, offset + parseInt(limit) - 1)

    const { data: transactions, error, count } = await query

    if (error) {
      console.error('Get transactions error:', error)
      return res.status(500).json({
        error: 'Failed to fetch transactions'
      })
    }

    // Format transactions
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      category: transaction.categories?.name || 'Uncategorized',
      date: transaction.date,
      createdAt: transaction.created_at
    }))

    res.json({
      transactions: formattedTransactions,
      total: count || transactions.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { id } = req.params
    const { type, amount, description, category, date } = req.body
    const userId = req.user.id

    // Check if transaction belongs to user
    const { data: existingTransaction, error: checkError } = await supabase
      .from('transactions')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (checkError || !existingTransaction) {
      return res.status(404).json({
        error: 'Transaction not found'
      })
    }

    // Handle category (similar to create)
    let categoryId = null
    if (category) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .eq('user_id', userId)
        .single()

      if (existingCategory) {
        categoryId = existingCategory.id
      }
    }

    // Update transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({
        category_id: categoryId,
        amount: amount ? parseFloat(amount) : undefined,
        type,
        description,
        date,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        id,
        amount,
        type,
        description,
        date,
        updated_at,
        categories(id, name, type)
      `)
      .single()

    if (error) {
      console.error('Transaction update error:', error)
      return res.status(500).json({
        error: 'Failed to update transaction'
      })
    }

    res.json({
      message: 'Transaction updated successfully',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        category: transaction.categories?.name || category,
        date: transaction.date,
        updatedAt: transaction.updated_at
      }
    })

  } catch (error) {
    console.error('Update transaction error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Transaction delete error:', error)
      return res.status(500).json({
        error: 'Failed to delete transaction'
      })
    }

    res.json({
      message: 'Transaction deleted successfully'
    })

  } catch (error) {
    console.error('Delete transaction error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

// Get transaction overview/analytics
const getTransactionOverview = async (req, res) => {
  try {
    const userId = req.user.id
    const { period = 'month' } = req.query

    // Calculate date range based on period
    const now = new Date()
    let startDate
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])

    if (error) {
      console.error('Overview fetch error:', error)
      return res.status(500).json({
        error: 'Failed to fetch overview'
      })
    }

    // Calculate totals
    let totalIncome = 0
    let totalExpenses = 0
    const transactionCount = transactions.length

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount)
      if (transaction.type === 'income') {
        totalIncome += amount
      } else {
        totalExpenses += amount
      }
    })

    const netFlow = totalIncome - totalExpenses

    res.json({
      overview: {
        totalIncome,
        totalExpenses,
        netFlow,
        transactionCount
      },
      period,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    })

  } catch (error) {
    console.error('Get overview error:', error)
    res.status(500).json({
      error: 'Internal server error'
    })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionOverview
}