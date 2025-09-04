// src/utils/currency.js

/**
 * Global Currency System for FiscalFlow
 * Supports multiple currencies with proper formatting
 */

// Comprehensive currency configuration
export const SUPPORTED_CURRENCIES = {
  // Major Global Currencies
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolPosition: 'before', // $100.00
    flag: '🇺🇸',
    region: 'Americas'
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolPosition: 'before',
    flag: '🇪🇺',
    region: 'Europe'
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    symbolPosition: 'before',
    flag: '🇬🇧',
    region: 'Europe'
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    symbolPosition: 'before',
    flag: '🇯🇵',
    region: 'Asia',
    decimalPlaces: 0 // Yen doesn't use decimals
  },
  
  // African Currencies
  ZMW: {
    code: 'ZMW',
    name: 'Zambian Kwacha',
    symbol: 'K',
    symbolPosition: 'before',
    flag: '🇿🇲',
    region: 'Africa'
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    symbolPosition: 'before',
    flag: '🇿🇦',
    region: 'Africa'
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    symbolPosition: 'before',
    flag: '🇰🇪',
    region: 'Africa'
  },
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    symbolPosition: 'before',
    flag: '🇳🇬',
    region: 'Africa'
  },
  
  // Other Popular Currencies
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    symbolPosition: 'before',
    flag: '🇨🇦',
    region: 'Americas'
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    symbolPosition: 'before',
    flag: '🇦🇺',
    region: 'Oceania'
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolPosition: 'before',
    flag: '🇮🇳',
    region: 'Asia'
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    symbolPosition: 'before',
    flag: '🇨🇳',
    region: 'Asia'
  }
}

// Group currencies by region for better UX
export const CURRENCIES_BY_REGION = {
  Africa: ['ZMW', 'ZAR', 'KES', 'NGN'],
  Americas: ['USD', 'CAD'],
  Asia: ['JPY', 'INR', 'CNY'],
  Europe: ['EUR', 'GBP'],
  Oceania: ['AUD'],
  Popular: ['USD', 'EUR', 'GBP', 'ZMW'] // Most common selections
}

/**
 * Get currency configuration by code
 * @param {string} currencyCode - ISO currency code (e.g., 'USD', 'ZMW')
 * @returns {object} Currency configuration object
 */
export const getCurrencyConfig = (currencyCode) => {
  return SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD
}

/**
 * Format amount according to currency rules
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode, showSymbol = true) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0
  }

  const config = getCurrencyConfig(currencyCode)
  const decimalPlaces = config.decimalPlaces ?? 2
  
  // Format the number with appropriate decimal places
  const formattedNumber = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  })

  if (!showSymbol) {
    return formattedNumber
  }

  // Position symbol before or after based on currency rules
  if (config.symbolPosition === 'before') {
    return `${config.symbol}${formattedNumber}`
  } else {
    return `${formattedNumber} ${config.symbol}`
  }
}

/**
 * Format compact amounts (1K, 1M, 1B)
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} Compact formatted string
 */
export const formatCurrencyCompact = (amount, currencyCode) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0
  }

  const config = getCurrencyConfig(currencyCode)
  const absAmount = Math.abs(amount)
  let formatted = ''
  
  if (absAmount >= 1000000000) {
    formatted = (amount / 1000000000).toFixed(1) + 'B'
  } else if (absAmount >= 1000000) {
    formatted = (amount / 1000000).toFixed(1) + 'M'
  } else if (absAmount >= 1000) {
    formatted = (amount / 1000).toFixed(1) + 'K'
  } else {
    const decimalPlaces = config.decimalPlaces ?? 2
    formatted = amount.toFixed(decimalPlaces > 0 ? 1 : 0)
  }

  return `${config.symbol}${formatted}`
}

/**
 * Parse currency string back to number
 * @param {string} currencyString - String like "$1,234.56" or "K1234.56"
 * @param {string} currencyCode - Currency code for symbol detection
 * @returns {number} Parsed amount
 */
export const parseCurrency = (currencyString, currencyCode) => {
  if (!currencyString) return 0
  
  const config = getCurrencyConfig(currencyCode)
  
  // Remove currency symbol and commas, then parse
  const cleaned = currencyString.toString()
    .replace(config.symbol, '')
    .replace(/[,\s]/g, '')
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Get currency symbol only
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  return getCurrencyConfig(currencyCode).symbol
}

/**
 * Auto-detect user's likely currency based on location/timezone
 * @returns {string} Suggested currency code
 */
export const detectUserCurrency = () => {
  try {
    // Try to detect from timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // Zambian timezones → ZMW
    if (timezone.includes('Africa/Lusaka')) return 'ZMW'
    
    // Other common mappings
    if (timezone.includes('Europe/')) return 'EUR'
    if (timezone.includes('America/')) return 'USD'
    if (timezone.includes('Asia/Tokyo')) return 'JPY'
    if (timezone.includes('Asia/Shanghai')) return 'CNY'
    if (timezone.includes('Asia/Kolkata')) return 'INR'
    if (timezone.includes('Africa/Johannesburg')) return 'ZAR'
    if (timezone.includes('Africa/Nairobi')) return 'KES'
    if (timezone.includes('Africa/Lagos')) return 'NGN'
    
    // Default fallback
    return 'USD'
  } catch {
    return 'USD'
  }
}

/**
 * Validate currency amount input
 * @param {string} input - User input
 * @param {string} currencyCode - Currency code
 * @returns {object} Validation result
 */
export const validateCurrencyInput = (input, currencyCode) => {
  if (!input || input.trim() === '') {
    return { isValid: false, error: 'Amount is required' }
  }

  const amount = parseCurrency(input, currencyCode)
  
  if (amount < 0) {
    return { isValid: false, error: 'Amount cannot be negative' }
  }

  if (amount > 999999999.99) {
    return { isValid: false, error: 'Amount is too large' }
  }

  return { isValid: true, error: null, amount }
}

/**
 * Get all currencies as array for dropdowns
 * @returns {Array} Array of currency objects
 */
export const getCurrencyList = () => {
  return Object.values(SUPPORTED_CURRENCIES)
}

/**
 * Get currencies grouped by region for organized display
 * @returns {object} Currencies organized by region
 */
export const getCurrenciesGrouped = () => {
  const grouped = {}
  
  Object.entries(CURRENCIES_BY_REGION).forEach(([region, codes]) => {
    grouped[region] = codes.map(code => SUPPORTED_CURRENCIES[code])
  })
  
  return grouped
}