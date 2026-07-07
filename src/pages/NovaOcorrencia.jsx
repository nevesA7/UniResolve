import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Send, X, ImageIcon } from 'lucide-react'
import { categories, locations } from '../data/occurrences'
import { useToastContext } from '../hooks/ToastContext'

const priorities = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

export default function NovaOcorrencia() {
  const navigate = useNavigate()
  const { addToast } = useToastContext()

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    priority: 'medium',
    description: '',
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Informe o título da ocorrência'
    if (!form.category) errs.category = 'Selecione uma categoria'
    if (!form.location) errs.location = 'Selecione o local'
    if (!form.description.trim() || form.description.length < 20)
      errs.description = 'Descreva o problema com pelo menos 20 caracteres'
    return errs
  }

  function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      addToast({
        title: 'Ocorrência registrada com sucesso!',
        description: `Protocolo gerado. Você pode acompanhar o status no dashboard.`,
        type: 'success',
      })
      navigate('/dashboard')
    }, 1200)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-white">Nova Ocorrência</h1>
            <p className="text-sm text-gray-500">Campus Paralela</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="label">Título <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Ar-condicionado com defeito na Sala A204"
              className={`input-field ${errors.title ? 'border-red-700 focus:ring-red-700' : ''}`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Categoria <span className="text-red-500">*</span></label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-red-700' : ''}`}
              >
                <option value="">Selecione...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="label">Prioridade</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="label">Local <span className="text-red-500">*</span></label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`input-field ${errors.location ? 'border-red-700' : ''}`}
            >
              <option value="">Selecione o local...</option>
              {locations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">
              Descrição <span className="text-red-500">*</span>
              <span className="ml-auto text-gray-600 font-normal float-right">{form.description.length} / 500</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={500}
              placeholder="Descreva o problema com o máximo de detalhes possível. Informe quando começou, o impacto nas atividades e qualquer tentativa anterior de solução."
              className={`input-field resize-none ${errors.description ? 'border-red-700' : ''}`}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Foto (opcional)</label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-surface-border">
                <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 w-7 h-7 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-300 hover:text-white"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-surface-border rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                <ImageIcon size={24} className="text-gray-600" />
                <span className="text-sm text-gray-500">Clique para adicionar uma foto</span>
                <span className="text-xs text-gray-600">PNG, JPG até 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <>
                  <Send size={15} /> Registrar ocorrência
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
