// src/components/settings/CurrencySelector.jsx
import { useState } from 'react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { getCurrenciesGrouped, getCurrencyConfig } from '../../utils/currency'

const CurrencySelector = ({ 
  selectedCurrency, 
  onCurrencyChange, 
  size = 'default',
  showFlag = true,
  groupByRegion = true 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const currencies = getCurrenciesGrouped()
  const selectedConfig = getCurrencyConfig(selectedCurrency)

  // Size variants
  const sizeClasses = {
    small: {
      button: 'px-3 py-2 text-sm',
      dropdown: 'text-sm',
      flag: 'text-sm'
    },
    default: {
      button: 'px-4 py-2',
      dropdown: 'text-base',
      flag: 'text-base'
    },
    large: {
      button: 'px-6 py-3 text-lg',
      dropdown: 'text-lg',
      flag: 'text-lg'
    }
  }

  const currentSize = sizeClasses[size]

  const handleCurrencySelect = (currencyCode) => {
    onCurrencyChange(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Currency Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${currentSize.button}
          w-full flex items-center justify-between
          bg-white border border-gray-300 rounded-md shadow-sm
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition-colors duration-200
        `}
      >
        <div className="flex items-center space-x-2">
          {showFlag && (
            <span className={currentSize.flag}>{selectedConfig.flag}</span>
          )}
          <span className="font-medium">{selectedConfig.symbol}</span>
          <span className="text-gray-600">{selectedConfig.code}</span>
          <span className="hidden sm:block text-gray-500 text-sm">
            {selectedConfig.name}
          </span>
        </div>
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
            {groupByRegion ? (
              // Grouped by region
              Object.entries(currencies).map(([region, regionCurrencies]) => (
                <div key={region}>
                  {/* Region Header */}
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        {region}
                      </span>
                    </div>
                  </div>
                  
                  {/* Region Currencies */}
                  {regionCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50
                        border-b border-gray-50 last:border-b-0 transition-colors duration-150
                        ${selectedCurrency === currency.code ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {showFlag && (
                            <span className={`${currentSize.flag} flex-shrink-0`}>
                              {currency.flag}
                            </span>
                          )}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {currency.symbol}
                              </span>
                              <span className="font-mono text-sm text-gray-600">
                                {currency.code}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {currency.name}
                            </div>
                          </div>
                        </div>
                        
                        {selectedCurrency === currency.code && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))
            ) : (
              // Flat list
              Object.values(currencies).flat().map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50
                    border-b border-gray-50 last:border-b-0 transition-colors duration-150
                    ${selectedCurrency === currency.code ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {showFlag && (
                        <span className={currentSize.flag}>{currency.flag}</span>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span className="font-mono text-sm text-gray-600">{currency.code}</span>
                        </div>
                        <div className="text-sm text-gray-500">{currency.name}</div>
                      </div>
                    </div>
                    {selectedCurrency === currency.code && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))
            )}
            
            {/* Footer note */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                💡 More currencies coming soon
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CurrencySelector