import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, MessageSquare, Zap, Shield, BarChart3, MapPin, ChevronRight } from 'lucide-react'

const steps = [
  { number: '01', title: 'Registre a ocorrência', desc: 'Descreva o problema, informe o local e a categoria. Leva menos de dois minutos.' },
  { number: '02', title: 'Acompanhe em tempo real', desc: 'Receba atualizações sobre cada etapa do processo de resolução.' },
  { number: '03', title: 'Problema resolvido', desc: 'A equipe responsável resolve e você é notificado quando concluído.' },
]

const features = [
  { icon: Zap, title: 'Resposta ágil', desc: 'Ocorrências triadas automaticamente por prioridade e encaminhadas ao setor competente.' },
  { icon: Shield, title: 'Transparência total', desc: 'Acompanhe o status e veja quem está trabalhando na resolução do seu chamado.' },
  { icon: BarChart3, title: 'Histórico completo', desc: 'Todas as ocorrências registradas, com timeline detalhada de cada ação tomada.' },
  { icon: MessageSquare, title: 'Comunicação direta', desc: 'Comentários e atualizações em tempo real entre alunos e equipes responsáveis.' },
]

const stats = [
  { value: '94%', label: 'Taxa de resolução' },
  { value: '48h', label: 'Tempo médio' },
  { value: '1.2k+', label: 'Chamados' },
  { value: '4.8★', label: 'Satisfação' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface text-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-uj-600 flex items-center justify-center shrink-0">
              <BookOpen size={14} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-sm">UniResolve</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-1.5">· Campus Paralela</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-sm py-1.5 px-3 sm:px-4">
            Entrar <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-uj-600/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-uj-600/10 border border-uj-600/20 rounded-full px-3 py-1 text-xs text-uj-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-uj-400 animate-pulse-slow shrink-0" />
              <span className="truncate">Unijorge · Campus Paralela, Salvador — BA</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4">
              Relate problemas.{' '}
              <br className="hidden sm:block" />
              <span className="text-uj-400">Acompanhe soluções.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed px-2">
              O canal oficial de comunicação entre estudantes e a gestão da Unijorge.
              Registre ocorrências e acompanhe cada etapa da resolução.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-primary px-6 py-3 text-base w-full sm:w-auto justify-center">
                Acessar plataforma <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/nova')} className="btn-secondary px-6 py-3 text-base w-full sm:w-auto justify-center">
                Registrar ocorrência
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-surface-border rounded-xl overflow-hidden"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-surface-card px-4 py-5 text-center">
                <p className="font-display font-bold text-xl sm:text-2xl text-white mb-1">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 border-t border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-uj-400 uppercase tracking-widest mb-2">Como funciona</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Simples do início ao fim</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5"
              >
                <div className="text-3xl font-display font-bold text-uj-600/20 mb-3 select-none">{step.number}</div>
                <h3 className="font-semibold text-white mb-1.5 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium text-uj-400 uppercase tracking-widest mb-2">Benefícios</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Um campus melhor para todos</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-4 flex gap-3 hover:border-gray-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-uj-600/10 border border-uj-600/20 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-uj-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 border-t border-surface-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <MapPin size={13} className="text-gray-600 shrink-0" />
            <span className="text-xs sm:text-sm text-gray-500">Av. Luís Viana, 6775 — Paralela, Salvador-BA</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-white mb-3">
            Sua voz faz o campus melhorar
          </h2>
          <p className="text-gray-400 mb-7 text-sm">
            Cada ocorrência registrada contribui para um ambiente universitário mais seguro, funcional e agradável.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary mx-auto px-8 py-3 text-base">
            Começar agora <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <footer className="border-t border-surface-border px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={13} className="text-gray-600" />
            <span className="text-xs text-gray-500">UniResolve · Centro Universitário Jorge Amado</span>
          </div>
          <p className="text-xs text-gray-600">Projeto Design Thinking · Campus Paralela · 2025</p>
        </div>
      </footer>
    </div>
  )
}
