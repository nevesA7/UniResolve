import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './hooks/ToastContext'
import { OccurrencesProvider } from './store/OccurrencesContext'
import { AppLayout } from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import NovaOcorrencia from './pages/NovaOcorrencia'
import OccurrenceDetail from './pages/OccurrenceDetail'
import Profile from './pages/Profile'

export default function App() {
  return (
    <OccurrencesProvider>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nova" element={<NovaOcorrencia />} />
            <Route path="/ocorrencia/:id" element={<OccurrenceDetail />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
    </OccurrencesProvider>
  )
}
