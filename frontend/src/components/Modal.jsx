import { useEffect } from 'react'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) {
  // ESC tugmasini bosganda modal yopish
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden' // Scroll ni o'chirish
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full mx-4'
  }

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative bg-white rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-md
          w-full ${sizeClasses[size]} max-h-[95vh] flex flex-col
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// Modal Header komponenti
export function ModalHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      {children}
    </div>
  )
}

// Modal Body komponenti
export function ModalBody({ children, className = '' }) {
  return (
    <div className={`flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0 ${className}`}>
      {children}
    </div>
  )
}

// Modal Footer komponenti
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex-shrink-0 p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 ${className}`}>
      {children}
    </div>
  )
}

// Confirmation Modal komponenti
export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Tasdiqlash", 
  message, 
  confirmText = "Tasdiqlash", 
  cancelText = "Bekor qilish",
  confirmVariant = "danger",
  loading = false
}) {
  const confirmClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-600 hover:bg-green-700"
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </ModalHeader>
      
      <ModalBody>
        <p className="text-gray-600">{message}</p>
      </ModalBody>
      
      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto ${confirmClasses[confirmVariant]} disabled:opacity-50 text-white font-semibold py-3 px-5 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kutilmoqda...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

// Toast Notification komponenti
export function Toast({ type, message, isVisible, onClose }) {
  const typeClasses = {
    success: "bg-green-600 text-white border border-green-700",
    error: "bg-red-600 text-white border border-red-700", 
    warning: "bg-yellow-500 text-white border border-yellow-600",
    info: "bg-blue-500 text-white border border-blue-600"
  }

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-[999999]">
      <div className={`
        ${typeClasses[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        {icons[type]}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-black/10 p-1 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
