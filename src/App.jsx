import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Learn from './pages/Learn'
import Quiz from './pages/Quiz'
import Review from './pages/Review'
import './styles/app.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-center"><div className="spinner" /></div>
  if (user) return <Navigate to="/" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/learn/:dayId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/quiz/:dayId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
