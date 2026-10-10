import { roles } from '../../config/brand'
import { useOccurrences } from '../../store/OccurrencesContext'

export function RoleSwitcher({ compact = false }) {
  const { role, setRole } = useOccurrences()

  return (
    <div>
      {!compact && (
        <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1.5 px-0.5">Visão de demonstração</p>
      )}
      <div role="group" aria-label="Alternar visão" className="flex p-0.5 rounded-lg bg-surface border border-surface-border">
        {Object.values(roles).map(r => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            aria-pressed={role === r.id}
            title={r.description}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              role === r.id ? 'bg-uj-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}
