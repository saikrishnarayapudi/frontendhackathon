import React, { useMemo, useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserForm from './pages/UserForm.jsx'
import Recommendations from './pages/Recommendations.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { defaultIdeas } from './data/recommendations.js'
import { generateRecommendations } from './utils/recommendationEngine.js'
import useLocalStorage from './hooks/useLocalStorage.js'

export const AppContext = React.createContext()

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem('pve:currentUser')
  return currentUser ? children : <Navigate to="/login" replace />
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = localStorage.getItem('pve:currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      const users = JSON.parse(localStorage.getItem('pve:users') || '[]')
      if (users.length === 0) {
        const demoUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'demo123',
          role: 'user'
        }
        localStorage.setItem('pve:users', JSON.stringify([demoUser]))
      }
    }
  }, [])

  const [form, setForm] = useLocalStorage('pve:form', {
    city: '',
    locality: '',
    area: '',
    type: 'Apartment',
    rooms: '',
    budget: '',
    amenities: [],
  })

  const [properties, setProperties] = useLocalStorage('pve:properties', [])
  const [ideas, setIdeas] = useLocalStorage('pve:ideas', defaultIdeas)
  const [saved, setSaved] = useLocalStorage('pve:saved', [])

  const recommendations = useMemo(() => {
    return generateRecommendations(form, ideas)
  }, [form, ideas])

  const logout = () => {
    localStorage.removeItem('pve:currentUser')
    setUser(null)
    navigate('/login')
  }

  const context = {
    form,
    setForm,
    properties,
    setProperties,
    ideas,
    setIdeas,
    saved,
    setSaved,
    recommendations,
    navigate,
    user,
    setUser,
    logout,
  }

  const showSidebar = user && !['/login'].includes(location.pathname)

  return (
    <AppContext.Provider value={context}>
      <div className="min-h-screen flex bg-slate-50">
        {showSidebar && <Sidebar />}
        <main className="flex-1 relative">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  )
}