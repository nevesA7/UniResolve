import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react'

function Toast({ toast, onRemove }) {
  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" />,
    info: <Info size={16} className="text-blue-400 shrink-0" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 bg-surface-card border border-surface-border rounded-xl px-4 py-3 shadow-2xl min-w-[300px] max-w-sm"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-100">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-gray-400 mt-0.5">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}
