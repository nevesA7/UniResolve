import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Inbox, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { mockOccurrences, categories } from '../data/occurrences'
import { OccurrenceCard } from '../components/ui/OccurrenceCard'

const statusFilters = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abertas' },
  { value: 'analysis', label: 'Em Análise' },
  { value: 'resolved', label: 'Resolvidas' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const stats = useMemo(() => ({
    open: mockOccurrences.filter(o => o.status === 'open').length,
    analysis: mockOccurrences.filter(o => o.status === 'analysis').length,
    resolved: mockOccurrences.filter(o => o.status === 'resolved').length,
    total: mockOccurrences.length,
  }), [])

  const filtered = useMemo(() => {
    return mockOccurrences.filter(o => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false
      if (search && !o.title.toLowerCase().includes(search.toLowerCase()) &&
          !o.location.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, statusFilter, categoryFilter])

  const summaryCards = [
    { label: 'Abertas', value: stats.open, icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-950/50 border-blue-900/50' },
    { label: 'Em Análise', value: stats.analysis, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-900/50' },
    { label: 'Resolvidas', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-900/50' },
    { label: 'Total', value: stats.total, icon: Inbox, color: 'text-gray-400', bg: 'bg-surface-card border-surface-border' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-white">Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Campus Paralela · Suas ocorrências</p>
        </div>
        <button onClick={() => navigate('/nova')} className="btn-primary text-sm py-2 px-3 sm:px-4">
          <Plus size={15} />
          <span className="hidden sm:inline">Nova ocorrência</span>
          <span className="sm:hidden">Nova</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {summaryCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card border ${bg} p-3 sm:p-4`}
          >
            <Icon size={14} className={`${color} mb-2`} />
            <p className="text-xl sm:text-2xl font-display font-bold text-white">{value}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por título ou local..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-8 text-sm"
        />
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
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
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0 ${
            categoryFilter === 'all'
              ? 'bg-gray-700 text-white'
              : 'bg-surface-card border border-surface-border text-gray-500'
          }`}
        >
          Todas
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
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
            <p className="text-gray-600 text-xs mt-1">Ajuste os filtros ou registre uma nova.</p>
          </div>
        ) : (
          filtered.map((o, i) => <OccurrenceCard key={o.id} occurrence={o} index={i} />)
        )}
      </div>

      <p className="text-xs text-gray-600 text-center mt-5">
        {filtered.length} ocorrência{filtered.length !== 1 ? 's' : ''} exibida{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
