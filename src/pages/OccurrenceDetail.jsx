import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, CheckCircle, Circle, Clock } from 'lucide-react'
import { mockOccurrences } from '../data/occurrences'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/StatusBadge'

function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function TimelineStep({ step, isLast }) {
  const icons = {
    done: <CheckCircle size={16} className="text-emerald-400" />,
    current: <Clock size={16} className="text-amber-400 animate-pulse-slow" />,
    pending: <Circle size={16} className="text-gray-600" />,
  }

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-0.5">{icons[step.status]}</div>
        {!isLast && <div className={`w-px flex-1 mt-1.5 ${step.status === 'done' ? 'bg-emerald-900' : 'bg-surface-border'}`} />}
      </div>
      <div className={`pb-5 ${isLast ? '' : ''}`}>
        <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-200'}`}>
          {step.label}
        </p>
        {step.date && (
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(step.date)}</p>
        )}
      </div>
    </div>
  )
}

function Comment({ comment }) {
  const isStaff = comment.role === 'staff' || comment.role === 'admin'

  return (
    <div className="flex gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
        isStaff ? 'bg-uj-600/20 border border-uj-600/30 text-uj-400' : 'bg-gray-800 text-gray-400'
      }`}>
        {comment.author.split(' ').map(n => n[0]).slice(0, 2).join('')}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-300">{comment.author}</span>
          {isStaff && (
            <span className="text-[10px] bg-uj-600/15 text-uj-400 border border-uj-600/20 px-1.5 py-0.5 rounded">
              {comment.role === 'admin' ? 'Administração' : 'Equipe UJ'}
            </span>
          )}
          <span className="text-xs text-gray-600">{formatDate(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{comment.text}</p>
      </div>
    </div>
  )
}

export default function OccurrenceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const occurrence = mockOccurrences.find(o => o.id === id)

  if (!occurrence) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Ocorrência não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Voltar ao dashboard
        </button>

        {/* Header */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono text-gray-500">{occurrence.id}</span>
            <StatusBadge status={occurrence.status} />
            <PriorityBadge priority={occurrence.priority} />
          </div>
          <h1 className="font-display font-bold text-xl text-white mb-4">{occurrence.title}</h1>

          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={13} className="text-gray-600 shrink-0" />
              <span>{occurrence.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={13} className="text-gray-600 shrink-0" />
              <span>{formatDate(occurrence.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <User size={13} className="text-gray-600 shrink-0" />
              <span>{occurrence.author.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border">
            <CategoryBadge category={occurrence.category} />
            <p className="text-sm text-gray-400 leading-relaxed mt-3">{occurrence.description}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border text-xs text-gray-600">
            <span className="font-medium text-gray-500">Aluno:</span> {occurrence.author.name} · {occurrence.author.matricula} · {occurrence.author.curso}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Timeline */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={14} className="text-gray-500" /> Timeline
            </h2>
            <div>
              {occurrence.timeline.map((step, i) => (
                <TimelineStep
                  key={i}
                  step={step}
                  isLast={i === occurrence.timeline.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-500" />
              Comentários
              {occurrence.comments.length > 0 && (
                <span className="ml-auto text-xs text-gray-500">{occurrence.comments.length}</span>
              )}
            </h2>

            {occurrence.comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sem comentários ainda</p>
              </div>
            ) : (
              <div className="space-y-5">
                {occurrence.comments.map(c => (
                  <Comment key={c.id} comment={c} />
                ))}
              </div>
            )}

            {occurrence.status !== 'resolved' && (
              <div className="mt-5 pt-4 border-t border-surface-border">
                <textarea
                  rows={2}
                  placeholder="Adicionar comentário..."
                  className="input-field text-sm resize-none"
                />
                <button className="btn-secondary w-full justify-center mt-2 text-sm py-1.5">
                  Comentar
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
