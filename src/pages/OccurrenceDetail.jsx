import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, CheckCircle, Circle, Clock, Info, Wrench } from 'lucide-react'
import { StatusBadge, PriorityBadge, CategoryBadge } from '../components/ui/StatusBadge'
import { useOccurrences } from '../store/OccurrencesContext'
import { useToastContext } from '../hooks/ToastContext'
import { brand } from '../config/brand'
import { formatDateTime, initials, statusLabels } from '../lib/format'

function TimelineStep({ step, isLast }) {
  const icons = {
    done: <CheckCircle size={16} className="text-emerald-400" />,
    current: <Clock size={16} className="text-amber-400 animate-pulse-slow" />,
    pending: <Circle size={16} className="text-gray-600" />,
  }

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-0.5">{icons[step.status]}</div>
        {!isLast && <div className={`w-px flex-1 mt-1.5 ${step.status === 'done' ? 'bg-emerald-900' : 'bg-surface-border'}`} />}
      </div>
      <div className="pb-5">
        <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-200'}`}>
          {step.label}
        </p>
        {step.date && <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(step.date)}</p>}
      </div>
    </li>
  )
}

function Comment({ comment }) {
  if (comment.role === 'system') {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-surface rounded-lg px-3 py-2">
        <Info size={12} className="shrink-0" />
        <span className="flex-1">{comment.text}</span>
        <span className="text-gray-600 shrink-0">{formatDateTime(comment.createdAt)}</span>
      </div>
    )
  }

  const isStaff = comment.role === 'staff' || comment.role === 'admin'

  return (
    <div className="flex gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
        isStaff ? 'bg-uj-600/20 border border-uj-600/30 text-uj-400' : 'bg-gray-800 text-gray-400'
      }`}>
        {initials(comment.author)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-medium text-gray-300">{comment.author}</span>
          {isStaff && (
            <span className="text-[10px] bg-uj-600/15 text-uj-400 border border-uj-600/20 px-1.5 py-0.5 rounded">
              {comment.role === 'admin' ? 'Administração' : brand.teamLabel}
            </span>
          )}
          <span className="text-xs text-gray-600">{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line break-words">{comment.text}</p>
      </div>
    </div>
  )
}

const manageableStatuses = ['open', 'analysis', 'resolved', 'closed']

export default function OccurrenceDetail() {
  const { id } = useParams()
  const { occurrences, roleInfo, currentUser, addComment, changeStatus } = useOccurrences()
  const { addToast } = useToastContext()
  const [draft, setDraft] = useState('')

  const occurrence = occurrences.find(o => o.id === id)

  if (!occurrence) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-300 font-medium mb-1">Ocorrência não encontrada</p>
        <p className="text-sm text-gray-500 mb-5">O protocolo {id} não existe ou foi removido.</p>
        <Link to="/dashboard" className="btn-secondary inline-flex">Voltar ao dashboard</Link>
      </div>
    )
  }

  const canManage = roleInfo.canManage
  const isOwner = occurrence.author.matricula && occurrence.author.matricula === currentUser.matricula
  const showStudentData = occurrence.author.matricula && (canManage || isOwner)
  const isClosed = occurrence.status === 'resolved' || occurrence.status === 'closed'
  const canComment = !isClosed || canManage
  const visibleComments = occurrence.comments.filter(c => c.role !== 'system')

  function submitComment() {
    const text = draft.trim()
    if (!text) return
    addComment(occurrence.id, text)
    setDraft('')
  }

  function handleStatus(next) {
    if (next === occurrence.status) return
    changeStatus(occurrence.id, next)
    addToast({
      title: 'Status atualizado',
      description: `${occurrence.id} agora está como ${statusLabels[next]}.`,
      type: 'success',
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Voltar ao dashboard
        </Link>

        <div className="card p-4 sm:p-6 mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-mono text-gray-500">{occurrence.id}</span>
            <StatusBadge status={occurrence.status} />
            <PriorityBadge priority={occurrence.priority} />
          </div>
          <h1 className="font-display font-bold text-xl text-white mb-4">{occurrence.title}</h1>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={13} className="text-gray-600 shrink-0" />
              <span>{occurrence.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={13} className="text-gray-600 shrink-0" />
              <span>{formatDateTime(occurrence.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <User size={13} className="text-gray-600 shrink-0" />
              <span>{occurrence.author.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border">
            <CategoryBadge category={occurrence.category} />
            <p className="text-sm text-gray-400 leading-relaxed mt-3 whitespace-pre-line">{occurrence.description}</p>
            {occurrence.imageUrl && (
              <img
                src={occurrence.imageUrl}
                alt={`Foto anexada à ocorrência ${occurrence.id}`}
                className="mt-4 w-full max-h-72 object-cover rounded-lg border border-surface-border"
              />
            )}
          </div>

          {showStudentData && (
            <div className="mt-4 pt-4 border-t border-surface-border text-xs text-gray-600">
              <span className="font-medium text-gray-500">Matrícula:</span> {occurrence.author.matricula} · {occurrence.author.curso}
            </div>
          )}
        </div>

        {canManage && (
          <div className="card p-4 sm:p-5 mb-4">
            <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Wrench size={14} className="text-gray-500" /> Gerenciar andamento
            </h2>
            <div role="group" aria-label="Alterar status" className="flex flex-wrap gap-2">
              {manageableStatuses.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatus(s)}
                  aria-pressed={occurrence.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    occurrence.status === s
                      ? 'bg-uj-600 text-white'
                      : 'bg-surface border border-surface-border text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={14} className="text-gray-500" /> Timeline
            </h2>
            <ol>
              {occurrence.timeline.map((step, i) => (
                <TimelineStep key={i} step={step} isLast={i === occurrence.timeline.length - 1} />
              ))}
            </ol>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-500" />
              Comentários
              {visibleComments.length > 0 && (
                <span className="ml-auto text-xs text-gray-500">{visibleComments.length}</span>
              )}
            </h2>

            {occurrence.comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sem comentários ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {occurrence.comments.map(c => <Comment key={c.id} comment={c} />)}
              </div>
            )}

            {canComment ? (
              <div className="mt-5 pt-4 border-t border-surface-border">
                <label htmlFor="comment" className="sr-only">Adicionar comentário</label>
                <textarea
                  id="comment"
                  rows={2}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitComment()
                  }}
                  maxLength={400}
                  placeholder={`Comentar como ${currentUser.name.split(' ')[0]}...`}
                  className="input-field text-sm resize-none"
                />
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={!draft.trim()}
                  className="btn-secondary w-full justify-center mt-2 text-sm py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comentar
                </button>
              </div>
            ) : (
              <p className="mt-5 pt-4 border-t border-surface-border text-xs text-gray-600">
                Esta ocorrência foi encerrada, então os comentários estão fechados.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
