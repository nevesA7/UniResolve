import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send, X, ImageIcon, Check } from 'lucide-react'
import { categories, locations } from '../data/occurrences'
import { useToastContext } from '../hooks/ToastContext'
import { useOccurrences } from '../store/OccurrencesContext'
import { brand } from '../config/brand'
import { resizeImage } from '../lib/format'
import { CategoryBadge, PriorityBadge } from '../components/ui/StatusBadge'

const priorities = [
  { value: 'low', label: 'Baixa', hint: 'Sem impacto imediato' },
  { value: 'medium', label: 'Média', hint: 'Atrapalha, mas dá para contornar' },
  { value: 'high', label: 'Alta', hint: 'Afeta aulas ou serviços' },
  { value: 'critical', label: 'Crítica', hint: 'Risco à segurança de pessoas' },
]

const steps = ['Problema', 'Detalhes', 'Revisão']
const MAX_IMAGE_MB = 5

function FieldError({ id, message }) {
  if (!message) return null
  return <p id={id} role="alert" className="text-xs text-red-400 mt-1">{message}</p>
}

export default function NovaOcorrencia() {
  const navigate = useNavigate()
  const { addToast } = useToastContext()
  const { addOccurrence, role, currentUser } = useOccurrences()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    priority: 'medium',
    description: '',
  })
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleImage(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImageError('')
    if (!file.type.startsWith('image/')) {
      setImageError('Envie um arquivo de imagem (PNG ou JPG).')
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`A foto passa de ${MAX_IMAGE_MB}MB. Escolha uma menor.`)
      return
    }
    try {
      setImage(await resizeImage(file))
    } catch (err) {
      setImageError(err.message)
    }
  }

  function validate(forStep) {
    const errs = {}
    if (forStep === 0) {
      if (form.title.trim().length < 5) errs.title = 'Informe um título com pelo menos 5 caracteres'
      if (!form.category) errs.category = 'Selecione uma categoria'
    }
    if (forStep === 1) {
      if (!form.location) errs.location = 'Selecione o local'
      if (form.description.trim().length < 20) errs.description = 'Descreva o problema com pelo menos 20 caracteres'
    }
    return errs
  }

  function next() {
    const errs = validate(step)
    setErrors(errs)
    if (Object.keys(errs).length === 0) setStep(s => s + 1)
  }

  function submit() {
    const errs = { ...validate(0), ...validate(1) }
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setStep(Object.keys(validate(0)).length ? 0 : 1)
      return
    }
    const created = addOccurrence({
      title: form.title.trim(),
      category: form.category,
      location: form.location,
      priority: form.priority,
      description: form.description.trim(),
      imageUrl: image,
    })
    addToast({
      title: 'Ocorrência registrada!',
      description: `Protocolo ${created.id}. Você pode acompanhar o andamento na página da ocorrência.`,
      type: 'success',
    })
    navigate(`/ocorrencia/${created.id}`)
  }

  const categoryLabel = categories.find(c => c.id === form.category)?.label

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar ao dashboard"
            className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-white">Nova Ocorrência</h1>
            <p className="text-sm text-gray-500">{brand.campus}</p>
          </div>
        </div>

        {role !== 'student' && (
          <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-900/50 rounded-lg px-3 py-2 mb-5">
            Você está na visão {currentUser.setor}. A ocorrência será registrada em nome de {currentUser.name}.
          </p>
        )}

        <ol className="flex items-center gap-2 mb-8" aria-label="Etapas do formulário">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-2 flex-1 last:flex-none" aria-current={i === step ? 'step' : undefined}>
              <span
                className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${
                  i < step ? 'bg-emerald-600 text-white' : i === step ? 'bg-uj-600 text-white' : 'bg-surface-card border border-surface-border text-gray-500'
                }`}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className={`text-xs ${i === step ? 'text-gray-100 font-medium' : 'text-gray-500'}`}>{label}</span>
              {i < steps.length - 1 && <span className="flex-1 h-px bg-surface-border" />}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
            className="space-y-5"
          >
            {step === 0 && (
              <>
                <div>
                  <label htmlFor="title" className="label">Título <span className="text-red-500">*</span></label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={120}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    placeholder="Ex: Ar-condicionado com defeito na Sala A204"
                    className={`input-field ${errors.title ? 'border-red-700' : ''}`}
                  />
                  <FieldError id="title-error" message={errors.title} />
                </div>

                <div>
                  <label htmlFor="category" className="label">Categoria <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    className={`input-field ${errors.category ? 'border-red-700' : ''}`}
                  >
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <FieldError id="category-error" message={errors.category} />
                </div>

                <fieldset>
                  <legend className="label">Prioridade</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {priorities.map(p => (
                      <label
                        key={p.value}
                        className={`cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors ${
                          form.priority === p.value
                            ? 'border-uj-500 bg-uj-600/10'
                            : 'border-surface-border bg-surface-card hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.value}
                          checked={form.priority === p.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="block text-sm text-gray-100 font-medium">{p.label}</span>
                        <span className="block text-[11px] text-gray-500 leading-snug mt-0.5">{p.hint}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label htmlFor="location" className="label">Local <span className="text-red-500">*</span></label>
                  <select
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    aria-invalid={!!errors.location}
                    aria-describedby={errors.location ? 'location-error' : undefined}
                    className={`input-field ${errors.location ? 'border-red-700' : ''}`}
                  >
                    <option value="">Selecione o local...</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <FieldError id="location-error" message={errors.location} />
                </div>

                <div>
                  <label htmlFor="description" className="label">
                    Descrição <span className="text-red-500">*</span>
                    <span className="float-right text-gray-600 font-normal">{form.description.length} / 500</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    maxLength={500}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : undefined}
                    placeholder="Descreva o problema com detalhes. Informe quando começou e o impacto nas atividades."
                    className={`input-field resize-none ${errors.description ? 'border-red-700' : ''}`}
                  />
                  <FieldError id="description-error" message={errors.description} />
                </div>

                <div>
                  <span className="label">Foto (opcional)</span>
                  {image ? (
                    <div className="relative rounded-xl overflow-hidden border border-surface-border">
                      <img src={image} alt="Pré-visualização da foto anexada" className="w-full max-h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        aria-label="Remover foto"
                        className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-300 hover:text-white"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-surface-border rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                      <ImageIcon size={24} className="text-gray-600" />
                      <span className="text-sm text-gray-500">Clique para adicionar uma foto</span>
                      <span className="text-xs text-gray-600">PNG ou JPG até {MAX_IMAGE_MB}MB</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImage} />
                    </label>
                  )}
                  <FieldError id="image-error" message={imageError} />
                </div>
              </>
            )}

            {step === 2 && (
              <div className="card p-5 space-y-4">
                <p className="text-sm text-gray-400">Confira os dados antes de registrar.</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {form.category && <CategoryBadge category={form.category} />}
                  <PriorityBadge priority={form.priority} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Título</p>
                  <p className="text-sm text-gray-100">{form.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Local</p>
                  <p className="text-sm text-gray-100">{form.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Descrição</p>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{form.description}</p>
                </div>
                {image && <img src={image} alt="Foto anexada" className="w-full max-h-40 object-cover rounded-lg border border-surface-border" />}
                <p className="text-[11px] text-gray-600">Categoria: {categoryLabel}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 pt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary px-4 py-3 justify-center">
              <ArrowLeft size={15} /> Voltar
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary flex-1 justify-center py-3 text-base">
              Continuar <ArrowRight size={15} />
            </button>
          ) : (
            <button type="button" onClick={submit} className="btn-primary flex-1 justify-center py-3 text-base">
              <Send size={15} /> Registrar ocorrência
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
