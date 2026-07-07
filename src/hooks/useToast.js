import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, description, type = 'success' }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, title, description, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
