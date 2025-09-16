import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type, message, duration = 5000) => {
    const id = Date.now() + Math.random()
    const toast = { id, type, message, isVisible: true }
    
    setToasts(prev => [...prev, toast])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((message, duration) => {
    showToast('success', message, duration)
  }, [showToast])

  const error = useCallback((message, duration) => {
    showToast('error', message, duration)
  }, [showToast])

  const warning = useCallback((message, duration) => {
    showToast('warning', message, duration)
  }, [showToast])

  const info = useCallback((message, duration) => {
    showToast('info', message, duration)
  }, [showToast])

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
}
