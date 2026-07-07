import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge, PriorityBadge, CategoryBadge } from './StatusBadge'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function OccurrenceCard({ occurrence, index = 0 }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      onClick={() => navigate(`/ocorrencia/${occurrence.id}`)}
      className="card p-4 cursor-pointer hover:border-gray-700 hover:bg-surface-hover transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-mono text-gray-500">{occurrence.id}</span>
            <StatusBadge status={occurrence.status} />
            <PriorityBadge priority={occurrence.priority} />
          </div>
          <h3 className="text-sm font-medium text-gray-100 leading-snug mb-2 group-hover:text-white transition-colors">
            {occurrence.title}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <CategoryBadge category={occurrence.category} />
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={11} />
              {occurrence.location}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} />
              {formatDate(occurrence.createdAt)}
            </span>
          </div>
        </div>
        <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
      </div>
    </motion.div>
  )
}
