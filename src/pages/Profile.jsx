import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, BookOpen, MapPin, Clock, Mail, Hash, GraduationCap, Shield, Bell, Globe, Palette, RotateCcw, Building2 } from 'lucide-react'
import { useOccurrences } from '../store/OccurrencesContext'
import { useToastContext } from '../hooks/ToastContext'
import { StatusBadge } from '../components/ui/StatusBadge'
import { accents, brand } from '../config/brand'
import { initials } from '../lib/format'

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? 'bg-uj-600' : 'bg-gray-700'}`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}
      />
    </button>
  )
}

export default function Profile() {
  const { occurrences, role, roleInfo, currentUser, settings, updateSettings, resetData } = useOccurrences()
  const { addToast } = useToastContext()
  const [confirmReset, setConfirmReset] = useState(false)

  const mine = occurrences.filter(o => o.author.name === currentUser.name)
  const isStudent = role === 'student'

  const infoItems = isStudent
    ? [
        { icon: Hash, label: 'Matrícula', value: currentUser.matricula },
        { icon: GraduationCap, label: 'Curso', value: currentUser.curso },
        { icon: BookOpen, label: 'Período', value: currentUser.periodo },
        { icon: Clock, label: 'Turno', value: currentUser.turno },
        { icon: MapPin, label: 'Campus', value: `${brand.campus}, ${brand.city}` },
        { icon: Mail, label: 'E-mail', value: currentUser.email },
      ]
    : [
        { icon: Building2, label: 'Setor', value: currentUser.setor },
        { icon: Shield, label: 'Perfil de acesso', value: roleInfo.label },
        { icon: MapPin, label: 'Campus', value: `${brand.campus}, ${brand.city}` },
        { icon: Mail, label: 'E-mail', value: currentUser.email },
      ]

  function handleReset() {
    resetData()
    setConfirmReset(false)
    addToast({ title: 'Dados restaurados', description: 'As ocorrências de exemplo voltaram ao estado original.', type: 'info' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-white mb-1">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mb-6">Dados e configurações</p>

        <div className="card p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-uj-600/15 border border-uj-600/25 flex items-center justify-center shrink-0">
              <span className="text-lg font-display font-bold text-uj-400">{initials(currentUser.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base text-white truncate">{currentUser.name}</h2>
              <p className="text-sm text-gray-400 truncate">{isStudent ? currentUser.curso : currentUser.setor}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400">{isStudent ? 'Aluno ativo' : roleInfo.label}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500">Registradas</p>
              <p className="text-2xl font-display font-bold text-white">{mine.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <User size={14} className="text-gray-500" /> {isStudent ? 'Dados acadêmicos' : 'Dados do setor'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="text-gray-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-200 truncate" title={value}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-gray-500" /> Minhas ocorrências
          </h3>
          {mine.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma ocorrência registrada.</p>
          ) : (
            <div className="space-y-1">
              {mine.map(o => (
                <Link
                  key={o.id}
                  to={`/ocorrencia/${o.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{o.title}</p>
                    <p className="text-xs text-gray-500 truncate">{o.location}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Configurações</h3>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
                <Bell size={14} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">Notificações por e-mail</p>
                <p className="text-xs text-gray-500">Receba atualizações sobre as ocorrências</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onChange={v => updateSettings({ emailNotifications: v })}
                label="Notificações por e-mail"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
                  <Palette size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-200">Cor de destaque</p>
                  <p className="text-xs text-gray-500">Muda botões, links e realces em todo o app</p>
                </div>
              </div>
              <div role="radiogroup" aria-label="Cor de destaque" className="flex flex-wrap gap-2 pl-11">
                {accents.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    role="radio"
                    aria-checked={settings.accent === a.id}
                    aria-label={a.label}
                    title={a.label}
                    onClick={() => updateSettings({ accent: a.id })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      settings.accent === a.id ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ background: a.swatch }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
                <Globe size={14} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">Idioma</p>
                <p className="text-xs text-gray-500">Português (Brasil)</p>
              </div>
              <span className="text-xs text-gray-400 bg-surface-hover border border-surface-border px-2 py-1 rounded shrink-0">PT-BR</span>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
                  <RotateCcw size={14} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200">Restaurar dados de exemplo</p>
                  <p className="text-xs text-gray-500">Apaga o que você criou e volta ao estado inicial</p>
                </div>
                {confirmReset ? (
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={handleReset} className="text-xs px-2.5 py-1 rounded-lg bg-red-900/60 border border-red-800 text-red-200">
                      Confirmar
                    </button>
                    <button type="button" onClick={() => setConfirmReset(false)} className="text-xs px-2.5 py-1 rounded-lg bg-surface border border-surface-border text-gray-400">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmReset(true)} className="btn-secondary text-xs px-3 py-1.5 shrink-0">
                    Restaurar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
