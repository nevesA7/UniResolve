import { createContext, useContext } from 'react'
import { useToast } from './useToast'
import { ToastContainer } from '../components/ui/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const { toasts, addToast, removeToast } = useToast()

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  return useContext(ToastContext)
}
