import { useState } from 'react'
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { loginUser, registerUser } from '../api/authApi'

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const resetFeedback = () => {
    setMessage('')
    setError('')
  }

  const switchMode = (nextMode) => {
    resetFeedback()
    setMode(nextMode)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetFeedback()
    setBusy(true)
    try {
      if (mode === 'register') {
        const result = await registerUser({ fullName, email, password })
        setMessage(result.message || 'Account created successfully. You can now log in.')
        setMode('login')
        setPassword('')
      } else {
        const result = await loginUser({ email, password })
        onAuthenticated(result)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'register' ? 'Create operator account' : 'Welcome back'
  const description = mode === 'register' ? 'Register before accessing the control workspace.' : 'Sign in to continue to the Kinetic Facade control workspace.'

  return <main className="auth-shell">
    <section className="auth-panel">
      <div className="auth-brand"><span className="auth-brand__mark"><ShieldCheck size={19} /></span><span>Kinetic Facade Control</span></div>
      <div className="auth-panel__content">
        <div className="auth-eyebrow">Secure operator access</div>
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>
        {message && <div className="auth-message auth-message--success" role="status">{message}</div>}
        {error && <div className="auth-message auth-message--error" role="alert">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && <label><span>Full name</span><div className="auth-input"><UserRound size={16} /><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required /></div></label>}
          <label><span>Email address</span><div className="auth-input"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div></label>
          <label><span>Password</span><div className="auth-input"><LockKeyhole size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required /></div>{mode === 'register' && <small>At least 8 characters with a number.</small>}</label>
          <button className="btn btn--primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Log in'} <ArrowRight size={15} /></button>
        </form>
        {mode === 'login' && <p className="auth-switch">Need an account? <button type="button" onClick={() => switchMode('register')}>Register first</button></p>}
        {mode === 'register' && <p className="auth-switch">Already registered? <button type="button" onClick={() => switchMode('login')}>Log in</button></p>}
      </div>
    </section>
    <aside className="auth-aside"><div className="auth-aside__kicker">Operations workspace</div><h2>Control every movement with confidence.</h2><p>Verified operator access keeps motor commands, alarm history, and site data inside the control room.</p><div className="auth-aside__status"><span /><div><strong>Protected session</strong><small>Encrypted password storage and expiring sessions</small></div></div></aside>
  </main>
}

export default AuthPage
