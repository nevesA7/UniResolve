import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { mockOccurrences, mockUser } from '../data/occurrences'
import { roles, staffUsers } from '../config/brand'
import { statusLabels } from '../lib/format'

const STORAGE_KEY = 'uniresolve:v1'

const defaultSettings = { emailNotifications: true, accent: 'blue' }

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data.occurrences)) {
        return {
          occurrences: data.occurrences,
          role: roles[data.role] ? data.role : 'student',
          settings: { ...defaultSettings, ...(data.settings || {}) },
        }
      }
    }
  } catch {
    // armazenamento indisponível ou corrompido: cai no padrão
  }
  return { occurrences: mockOccurrences, role: 'student', settings: defaultSettings }
}

function nextProtocol(occurrences) {
  const year = new Date().getFullYear()
  const max = occurrences
    .filter(o => o.id.startsWith(`OC-${year}-`))
    .reduce((m, o) => Math.max(m, parseInt(o.id.split('-')[2], 10) || 0), 0)
  return `OC-${year}-${String(max + 1).padStart(3, '0')}`
}

function applyStatus(occurrence, next, now) {
  const kept = occurrence.timeline
    .filter(step => step.status !== 'pending')
    .map(step => (step.status === 'current' ? { ...step, status: 'done' } : step))

  const extra = {
    open: [{ label: 'Ocorrência reaberta', date: now, status: 'current' }],
    analysis: [
      { label: 'Em análise pela equipe', date: now, status: 'current' },
      { label: 'Resolvido', date: null, status: 'pending' },
    ],
    resolved: [{ label: 'Resolvido', date: now, status: 'done' }],
    closed: [{ label: 'Encerrada', date: now, status: 'done' }],
  }[next]

  return { ...occurrence, status: next, updatedAt: now, timeline: [...kept, ...extra] }
}

const OccurrencesContext = createContext(null)

export function OccurrencesProvider({ children }) {
  const [state, setState] = useState(load)
  const { occurrences, role, settings } = state
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // cota cheia ou modo privado: o app segue funcionando em memória
    }
  }, [state])

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', settings.accent)
  }, [settings.accent])

  const currentUser = useMemo(() => {
    if (role === 'student') return { ...mockUser, role }
    return { ...staffUsers[role], role }
  }, [role])

  const setRole = useCallback(r => setState(s => ({ ...s, role: r })), [])
  const updateSettings = useCallback(
    patch => setState(s => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  )

  const addOccurrence = useCallback(data => {
    const now = new Date().toISOString()
    const created = {
      id: nextProtocol(stateRef.current.occurrences),
      ...data,
      status: 'open',
      createdAt: now,
      updatedAt: now,
      author:
        stateRef.current.role === 'student'
          ? { name: mockUser.name, matricula: mockUser.matricula, curso: mockUser.curso }
          : { name: staffUsers[stateRef.current.role].name, matricula: '', curso: staffUsers[stateRef.current.role].setor },
      comments: [],
      timeline: [
        { label: 'Ocorrência aberta', date: now, status: 'done' },
        { label: 'Aguardando triagem', date: null, status: 'current' },
        { label: 'Resolvido', date: null, status: 'pending' },
      ],
    }
    setState(s => ({ ...s, occurrences: [created, ...s.occurrences] }))
    return created
  }, [])

  const addComment = useCallback(
    (id, text) => {
      const now = new Date().toISOString()
      setState(s => ({
        ...s,
        occurrences: s.occurrences.map(o => {
          if (o.id !== id) return o
          const nextId = o.comments.reduce((m, c) => Math.max(m, c.id), 0) + 1
          const author = s.role === 'student' ? mockUser.name : staffUsers[s.role].name
          return {
            ...o,
            comments: [...o.comments, { id: nextId, author, role: s.role, text, createdAt: now }],
          }
        }),
      }))
    },
    []
  )

  const changeStatus = useCallback(
    (id, next) => {
      const now = new Date().toISOString()
      setState(s => {
        if (!roles[s.role].canManage) return s
        return {
          ...s,
          occurrences: s.occurrences.map(o => {
            if (o.id !== id || o.status === next) return o
            const updated = applyStatus(o, next, now)
            const nextId = o.comments.reduce((m, c) => Math.max(m, c.id), 0) + 1
            updated.comments = [
              ...o.comments,
              {
                id: nextId,
                author: staffUsers[s.role].name,
                role: 'system',
                text: `Status alterado para ${statusLabels[next]}.`,
                createdAt: now,
              },
            ]
            return updated
          }),
        }
      })
    },
    []
  )

  const resetData = useCallback(() => {
    setState({ occurrences: mockOccurrences, role: 'student', settings: defaultSettings })
  }, [])

  const value = useMemo(
    () => ({
      occurrences,
      role,
      roleInfo: roles[role],
      currentUser,
      settings,
      setRole,
      updateSettings,
      addOccurrence,
      addComment,
      changeStatus,
      resetData,
    }),
    [occurrences, role, currentUser, settings, setRole, updateSettings, addOccurrence, addComment, changeStatus, resetData]
  )

  return <OccurrencesContext.Provider value={value}>{children}</OccurrencesContext.Provider>
}

export function useOccurrences() {
  const ctx = useContext(OccurrencesContext)
  if (!ctx) throw new Error('useOccurrences precisa estar dentro de OccurrencesProvider')
  return ctx
}
