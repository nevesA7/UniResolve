import { Outlet } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { RoleSwitcher } from '../ui/RoleSwitcher'
import { brand } from '../../config/brand'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto pb-20 md:pb-0">
        <div className="md:hidden sticky top-0 z-40 glass border-b border-surface-border px-4 py-2.5 flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md bg-uj-600 flex items-center justify-center">
              <BookOpen size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">{brand.name}</span>
          </div>
          <div className="flex-1">
            <RoleSwitcher compact />
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
