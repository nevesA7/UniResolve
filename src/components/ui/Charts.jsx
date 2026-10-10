import { categories } from '../../data/occurrences'

export const statusColors = {
  open: '#60a5fa',
  analysis: '#fbbf24',
  resolved: '#34d399',
  closed: '#6b7280',
}

const statusNames = {
  open: 'Abertas',
  analysis: 'Em análise',
  resolved: 'Resolvidas',
  closed: 'Encerradas',
}

const categoryColors = {
  blue: '#60a5fa',
  purple: '#c084fc',
  green: '#4ade80',
  red: '#f87171',
  amber: '#fbbf24',
  teal: '#2dd4bf',
  orange: '#fb923c',
  gray: '#9ca3af',
}

export function StatusDonut({ occurrences }) {
  const total = occurrences.length
  const counts = Object.keys(statusColors).map(key => ({
    key,
    value: occurrences.filter(o => o.status === key).length,
  }))

  const radius = 42
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" role="img"
          aria-label={`Distribuição por status: ${counts.map(c => `${c.value} ${statusNames[c.key].toLowerCase()}`).join(', ')}`}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1F2937" strokeWidth="11" />
          {total > 0 && counts.filter(c => c.value > 0).map(c => {
            const length = (c.value / total) * circumference
            const el = (
              <circle
                key={c.key}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={statusColors[c.key]}
                strokeWidth="11"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                style={{ transition: 'stroke-dasharray 0.4s ease' }}
              />
            )
            offset += length
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-xl text-white leading-none">{total}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">total</span>
        </div>
      </div>
      <ul className="space-y-1.5 flex-1 min-w-0">
        {counts.map(c => (
          <li key={c.key} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[c.key] }} />
            <span className="text-gray-400 flex-1 truncate">{statusNames[c.key]}</span>
            <span className="text-gray-200 font-medium tabular-nums">{c.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CategoryBars({ occurrences }) {
  const rows = categories
    .map(c => ({ ...c, value: occurrences.filter(o => o.category === c.id).length }))
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
  const max = Math.max(1, ...rows.map(r => r.value))

  if (rows.length === 0) {
    return <p className="text-xs text-gray-600 py-6 text-center">Sem dados para exibir.</p>
  }

  return (
    <ul className="space-y-2.5">
      {rows.map(r => (
        <li key={r.id}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400 truncate">{r.label}</span>
            <span className="text-gray-300 font-medium tabular-nums ml-2">{r.value}</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.value / max) * 100}%`,
                background: categoryColors[r.color] || categoryColors.gray,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
