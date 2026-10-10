import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Inbox, AlertCircle, CheckCircle2, Clock, Timer, Siren, ArrowRight } from 'lucide-react'
import { categories } from '../data/occurrences'
import { OccurrenceCard } from '../components/ui/OccurrenceCard'
import { StatusDonut, CategoryBars } from '../components/ui/Charts'
import { useOccurrences } from '../store/OccurrencesContext'
import { brand } from '../config/brand'
import { priorityRank } from '../lib/format'

const statusFilters = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abertas' },
  { value: 'analysis', label: 'Em Análise' },
  { value: 'resolved', label: 'Resolvidas' },
]

const DAY = 86400000

function averageResolution(list) {
  const done = list.filter(o => o.status === 'resolved' || o.status === 'closed')
  if (done.length === 0) return null
  const total = done.reduce((sum, o) => sum + (new Date(o.updatedAt) - new Date(o.createdAt)), 0)
  return total / done.length / DAY
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { occurrences, role, roleInfo, currentUser } = useOccurrences()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [scopeChoice, setScopeChoice] = useState('all')

  const isStudent = role === 'student'
  const scope = isStudent ? scopeChoice : 'all'

  const base = useMemo(
    () => (scope === 'mine' ? occurrences.filter(o => o.author.matricula === currentUser.matricula) : occurrences),
    [occurrences, scope, currentUser.matricula]
  )

  const stats = useMemo(() => ({
    open: base.filter(o => o.status === 'open').length,
    analysis: base.filter(o => o.status === 'analysis').length,
    resolved: base.filter(o => o.status === 'resolved' || o.status === 'closed').length,
    total: base.length,
  }), [base])

  const avgDays = useMemo(() => averageResolution(base), [base])

  const critical = useMemo(
    () => base.filter(o => o.priority === 'critical' && (o.status === 'open' || o.status === 'analysis')),
    [base]
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = base.filter(o => {
      if (statusFilter === 'resolved') {
        if (o.status !== 'resolved' && o.status !== 'closed') return false
      } else if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false
      if (term && !o.title.toLowerCase().includes(term) &&
          !o.location.toLowerCase().includes(term) &&
          !o.id.toLowerCase().includes(term)) return false
      return true
    })
    return [...list].sort((a, b) =>
      sort === 'priority'
        ? priorityRank[a.priority] - priorityRank[b.priority] || new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [base, search, statusFilter, categoryFilter, sort])

  const summaryCards = [
    { label: 'Abertas', value: stats.open, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-950/50 border-blue-900/50', filter: 'open' },
    { label: 'Em Análise', value: stats.analysis, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-900/50', filter: 'analysis' },
    { label: 'Resolvidas', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-900/50', filter: 'resolved' },
    { label: 'Total', value: stats.total, icon: Inbox, color: 'text-gray-400', bg: 'bg-surface-card border-surface-border', filter: 'all' },
  ]

  const subtitle = isStudent
    ? `${brand.campus} · ${scope === 'mine' ? 'Suas ocorrências' : 'Todas as ocorrências do campus'}`
    : `${brand.campus} · ${roleInfo.label === 'Admin' ? 'Visão geral do campus' : 'Fila de atendimento'}`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
            {isStudent ? 'Dashboard' : 'Painel de gestão'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <button onClick={() => navigate('/nova')} className="btn-primary text-sm py-2 px-3 sm:px-4">
          <Plus size={15} />
          <span className="hidden sm:inline">Nova ocorrência</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </motion.div>

      {critical.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
          <Link
            to={`/ocorrencia/${critical[0].id}`}
            className="flex items-center gap-3 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 hover:bg-red-950/60 transition-colors"
          >
            <Siren size={16} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-200 flex-1 min-w-0">
              {critical.length === 1
                ? '1 ocorrência crítica aguardando resolução: '
                : `${critical.length} ocorrências críticas aguardando resolução. Mais recente: `}
              <span className="text-red-100 font-medium">{critical[0].title}</span>
            </p>
            <ArrowRight size={14} className="text-red-400 shrink-0" />
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
        {summaryCards.map(({ label, value, icon: Icon, color, bg, filter }, i) => (
          <motion.button
            type="button"
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setStatusFilter(filter)}
            aria-pressed={statusFilter === filter}
            className={`card border ${bg} p-3 sm:p-4 text-left transition-shadow ${
              statusFilter === filter ? 'ring-1 ring-uj-500' : ''
            }`}
          >
            <Icon size={14} className={`${color} mb-2`} />
            <p className="text-xl sm:text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{label}</p>
          </motion.button>
        ))}
      </div>

      <div className="card px-4 py-3 mb-6 flex items-center gap-3">
        <Timer size={15} className="text-gray-500 shrink-0" />
        <p className="text-xs sm:text-sm text-gray-400">
          Tempo médio de resolução:{' '}
          <span className="text-gray-100 font-medium">
            {avgDays === null ? 'sem dados ainda' : `${avgDays.toFixed(1).replace('.', ',')} dias`}
          </span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="card p-4">
          <h2 className="text-xs font-semibold text-gray-300 mb-4">Por status</h2>
          <StatusDonut occurrences={base} />
        </div>
        <div className="card p-4">
          <h2 className="text-xs font-semibold text-gray-300 mb-4">Principais categorias</h2>
          <CategoryBars occurrences={base} />
        </div>
      </div>

      {isStudent && (
        <div role="group" aria-label="Escopo da lista" className="inline-flex p-0.5 rounded-lg bg-surface-card border border-surface-border mb-3">
          {[{ v: 'mine', l: 'Minhas' }, { v: 'all', l: 'Todas do campus' }].map(o => (
            <button
              key={o.v}
              type="button"
              onClick={() => setScopeChoice(o.v)}
              aria-pressed={scope === o.v}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                scope === o.v ? 'bg-uj-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            aria-label="Buscar ocorrências"
            placeholder="Buscar por título, local ou protocolo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-8 text-sm"
          />
        </div>
        <select
          aria-label="Ordenar"
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="input-field text-sm w-auto"
        >
          <option value="recent">Mais recentes</option>
          <option value="priority">Prioridade</option>
        </select>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {statusFilters.map(f => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            aria-pressed={statusFilter === f.value}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
              statusFilter === f.value
                ? 'bg-uj-600 text-white'
                : 'bg-surface-card border border-surface-border text-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {[{ id: 'all', label: 'Todas' }, ...categories].map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategoryFilter(c.id)}
            aria-pressed={categoryFilter === c.id}
            className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0 ${
              categoryFilter === c.id
                ? 'bg-gray-700 text-white'
                : 'bg-surface-card border border-surface-border text-gray-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-14 card">
            <Inbox size={28} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Nenhuma ocorrência encontrada</p>
            <p className="text-gray-600 text-xs mt-1">
              {scope === 'mine' && base.length === 0
                ? 'Você ainda não registrou nada. Que tal começar agora?'
                : 'Ajuste os filtros ou registre uma nova.'}
            </p>
          </div>
        ) : (
          filtered.map((o, i) => <OccurrenceCard key={o.id} occurrence={o} index={i} />)
        )}
      </div>

      <p className="text-xs text-gray-600 text-center mt-5" aria-live="polite">
        {filtered.length} ocorrência{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
