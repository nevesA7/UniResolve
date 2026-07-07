export function StatusBadge({ status }) {
  const config = {
    open: {
      label: 'Aberta',
      className: 'badge-open',
      dot: 'bg-blue-400',
    },
    analysis: {
      label: 'Em Análise',
      className: 'badge-analysis',
      dot: 'bg-amber-400',
    },
    resolved: {
      label: 'Resolvida',
      className: 'badge-resolved',
      dot: 'bg-emerald-400',
    },
    closed: {
      label: 'Encerrada',
      className: 'badge-closed',
      dot: 'bg-gray-500',
    },
  }

  const s = config[status] || config.open

  return (
    <span className={s.className}>
      <span className={`status-dot ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const config = {
    critical: { label: 'Crítica', className: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-950 text-red-400 border border-red-900' },
    high: { label: 'Alta', className: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-950 text-orange-400 border border-orange-900' },
    medium: { label: 'Média', className: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-950 text-yellow-400 border border-yellow-900' },
    low: { label: 'Baixa', className: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700' },
  }
  const p = config[priority] || config.medium
  return <span className={p.className}>{p.label}</span>
}

export function CategoryBadge({ category }) {
  const config = {
    infraestrutura: 'bg-blue-950 text-blue-300 border-blue-900',
    tecnologia: 'bg-purple-950 text-purple-300 border-purple-900',
    limpeza: 'bg-green-950 text-green-300 border-green-900',
    seguranca: 'bg-red-950 text-red-300 border-red-900',
    academico: 'bg-amber-950 text-amber-300 border-amber-900',
    biblioteca: 'bg-teal-950 text-teal-300 border-teal-900',
    estacionamento: 'bg-orange-950 text-orange-300 border-orange-900',
    outros: 'bg-gray-800 text-gray-400 border-gray-700',
  }

  const labels = {
    infraestrutura: 'Infraestrutura',
    tecnologia: 'Tecnologia & TI',
    limpeza: 'Limpeza & Higiene',
    seguranca: 'Segurança',
    academico: 'Acadêmico',
    biblioteca: 'Biblioteca',
    estacionamento: 'Estacionamento',
    outros: 'Outros',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config[category] || config.outros}`}>
      {labels[category] || category}
    </span>
  )
}
