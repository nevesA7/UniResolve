import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, User, LogOut, Bell, BookOpen, ChevronRight } from 'lucide-react'
import { mockUser } from '../../data/occurrences'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/nova', icon: Plus, label: 'Nova Ocorrência' },
  { to: '/perfil', icon: User, label: 'Meu Perfil' },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-surface-border bg-surface-card">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-uj-600 flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm tracking-tight">UJResolve</span>
            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Campus Paralela</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-uj-600/15 text-uj-400 font-medium'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-surface-hover'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-uj-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {label}
                {isActive && <ChevronRight size={12} className="ml-auto text-uj-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-surface-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-uj-600/20 border border-uj-600/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-uj-400">
              {mockUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate">{mockUser.name.split(' ')[0]}</p>
            <p className="text-[10px] text-gray-500 truncate">{mockUser.matricula}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            title="Sair"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
