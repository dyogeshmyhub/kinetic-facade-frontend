import './App.css'
import { useEffect, useState } from 'react'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import { loadCurrentUser, logoutUser } from './api/authApi'

function App() {
  const [session, setSession] = useState(() => {
    const token = window.localStorage.getItem('kinetic-facade-session')
    return { token, user: null, loading: Boolean(token) }
  })

  useEffect(() => {
    if (!session.token) return undefined
    loadCurrentUser(session.token)
      .then(({ user }) => setSession({ token: session.token, user, loading: false }))
      .catch(() => {
        window.localStorage.removeItem('kinetic-facade-session')
        setSession({ token: null, user: null, loading: false })
      })
    return undefined
  }, [session.token])

  const handleAuthenticated = ({ token, user }) => {
    window.localStorage.setItem('kinetic-facade-session', token)
    setSession({ token, user, loading: false })
  }

  const handleLogout = async () => {
    if (session.token) await logoutUser(session.token).catch(() => {})
    window.localStorage.removeItem('kinetic-facade-session')
    setSession({ token: null, user: null, loading: false })
  }

  if (session.loading) return <div className="auth-loading">Checking secure session...</div>
  if (!session.user) return <AuthPage onAuthenticated={handleAuthenticated} />
  return <Dashboard user={session.user} token={session.token} onLogout={handleLogout} onProfileUpdate={(user) => setSession((current) => ({ ...current, user }))} />
}

export default App
