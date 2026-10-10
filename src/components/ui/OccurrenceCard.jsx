import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight, MessageSquare, ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatusBadge, PriorityBadge, CategoryBadge } from './StatusBadge'
import { formatDate } from '../../lib/format'

export function OccurrenceCard({ occurrence, index = 0 }) {
  const commentCount = occurrence.comments.filter(c => c.role !== 'system').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 10) * 0.04, duration: 0.25 }}
    >
      <Link
        to={`/ocorrencia/${occurrence.id}`}
        className="card block p-4 hover:border-gray-700 hover:bg-surface-hover transition-all duration-150 group focus:outline-none focus-visible:ring-2 focus-visible:ring-uj-500"
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
              {commentCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500" title={`${commentCount} comentário(s)`}>
                  <MessageSquare size={11} />
                  {commentCount}
                </span>
              )}
              {occurrence.imageUrl && (
                <span className="flex items-center gap-1 text-xs text-gray-500" title="Com foto">
                  <ImageIcon size={11} />
                </span>
              )}
            </div>
          </div>
          <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0 mt-1" />
        </div>
      </Link>
    </motion.div>
  )
}
