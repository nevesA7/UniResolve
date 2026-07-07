import { motion } from 'framer-motion'
import { User, BookOpen, MapPin, Clock, Mail, Hash, GraduationCap, Shield, Bell, Moon, Globe } from 'lucide-react'
import { mockUser, mockOccurrences } from '../data/occurrences'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useNavigate } from 'react-router-dom'

const myOccurrences = mockOccurrences.filter(o => o.author.matricula === mockUser.matricula)

export default function Profile() {
  const navigate = useNavigate()

  const infoItems = [
    { icon: Hash, label: 'Matrícula', value: mockUser.matricula },
    { icon: GraduationCap, label: 'Curso', value: mockUser.curso },
    { icon: BookOpen, label: 'Período', value: mockUser.periodo },
    { icon: Clock, label: 'Turno', value: mockUser.turno },
    { icon: MapPin, label: 'Campus', value: mockUser.campus },
    { icon: Mail, label: 'E-mail', value: mockUser.email },
  ]

  const settings = [
    { icon: Bell, label: 'Notificações por e-mail', desc: 'Receba atualizações sobre suas ocorrências', checked: true },
    { icon: Moon, label: 'Modo escuro', desc: 'Interface no tema escuro (ativo)', checked: true },
    { icon: Globe, label: 'Idioma', desc: 'Português (Brasil)', checked: false, text: 'PT-BR' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-white mb-2">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mb-8">Dados acadêmicos e configurações</p>

        {/* Profile card */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-uj-600/15 border border-uj-600/25 flex items-center justify-center shrink-0">
              <span className="text-xl font-display font-bold text-uj-400">
                {mockUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">{mockUser.name}</h2>
              <p className="text-sm text-gray-400">{mockUser.curso}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400">Aluno ativo</span>
              </div>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-xs text-gray-500">Ocorrências abertas</p>
              <p className="text-2xl font-display font-bold text-white">{myOccurrences.length}</p>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <User size={14} className="text-gray-500" /> Dados acadêmicos
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm text-gray-200">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My occurrences */}
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-gray-500" /> Minhas ocorrências
          </h3>
          {myOccurrences.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma ocorrência registrada.</p>
          ) : (
            <div className="space-y-2">
              {myOccurrences.map(o => (
                <div
                  key={o.id}
                  onClick={() => navigate(`/ocorrencia/${o.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{o.title}</p>
                    <p className="text-xs text-gray-500">{o.location}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Configurações</h3>
          <div className="space-y-4">
            {settings.map(({ icon: Icon, label, desc, checked, text }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                {text ? (
                  <span className="text-xs text-gray-400 bg-surface-hover border border-surface-border px-2 py-1 rounded">{text}</span>
                ) : (
                  <div
                    className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${checked ? 'bg-uj-600' : 'bg-gray-700'}`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full mt-0.75 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'} mt-[3px] ml-[3px]`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
