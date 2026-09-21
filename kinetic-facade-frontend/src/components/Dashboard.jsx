import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { updateProfile } from '../api/authApi'
import { alarmHistory, motors } from '../data/dashboardData'
import {
  acknowledgeAlarm,
  loadDashboard,
  runSequence,
  runSystemAction,
  syncMotors,
  updateMotor,
} from '../api/dashboardApi'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import {
  AlarmsPage,
  MotorsPage,
  OverviewPage,
  SequencesPage,
  SettingsPage,
} from '../pages/WorkspacePages'
import { AutomationPage, DevicesPage, EnvironmentPage, ReportsAnalytics, SchedulerPage } from '../pages/FeaturePages'

const routes = {
  Overview: '/',
  Motors: '/motors',
  Sequences: '/sequences',
  Automation: '/automation',
  Scheduler: '/scheduler',
  Environment: '/environment',
  Devices: '/devices',
  Alarms: '/alarms',
  Reports: '/reports',
  Settings: '/settings',
}

const pageTitles = {
  Overview: 'Operations Dashboard',
  Motors: 'Motor Control Center',
  Sequences: 'Sequence Operations',
  Automation: 'Automatic Control',
  Scheduler: 'Facade Scheduler',
  Environment: 'Environmental Monitoring',
  Devices: 'ESP32 Devices',
  Alarms: 'Alarm History',
  Reports: 'Reports & Performance',
  Settings: 'System Settings',
}

function getAutomaticTheme() {
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'light' : 'dark'
}

function itemFromPath(pathname) {
  const entry = Object.entries(routes).find(([, path]) => path === pathname)
  return entry ? entry[0] : 'Overview'
}

function Dashboard({ user, token, onLogout, onProfileUpdate }) {
  const [activeItem, setActiveItem] = useState(() => itemFromPath(window.location.pathname))
  const [systemState, setSystemState] = useState('Running')
  const [motorState, setMotorState] = useState(motors)
  const [alarms, setAlarms] = useState(alarmHistory.map((alarm, index) => ({ ...alarm, id: index + 1 })))
  const [activeStep, setActiveStep] = useState(0)
  const [isSequenceRunning, setIsSequenceRunning] = useState(false)
  const [notice, setNotice] = useState('Live control link established')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [resetRequested, setResetRequested] = useState(false)
  const [themeMode, setThemeMode] = useState(() => window.localStorage.getItem('kinetic-facade-theme') || 'auto')
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const applyTheme = () => {
      const resolvedTheme = themeMode === 'auto' ? getAutomaticTheme() : themeMode
      document.documentElement.dataset.theme = resolvedTheme
    }

    applyTheme()
    const timer = window.setInterval(applyTheme, 60 * 1000)
    return () => window.clearInterval(timer)
  }, [themeMode])

  const handleThemeChange = (mode) => {
    setThemeMode(mode)
    window.localStorage.setItem('kinetic-facade-theme', mode)
  }

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice('Live control link established'), 2600)
  }

  useEffect(() => {
    loadDashboard()
      .then(({ system, motors: remoteMotors, alarms: remoteAlarms }) => {
        setSystemState(system.status)
        setActiveStep(system.active_step)
        setMotorState(remoteMotors.map((motor) => ({ ...motors.find((demoMotor) => demoMotor.id === motor.id), ...motor })))
        setAlarms(remoteAlarms)
        showNotice('PostgreSQL control link connected')
      })
      .catch(() => showNotice('Local simulation mode; API connection unavailable'))
  }, [])

  const changeSystemState = (action, message) => {
    const optimisticState = { start: 'Running', stop: 'Stopped', reset: 'Standby' }[action]
    setSystemState(optimisticState)
    if (action === 'reset') {
      setActiveStep(0)
      setIsSequenceRunning(false)
    }
    runSystemAction(action)
      .then(({ status, active_step: remoteStep }) => {
        setSystemState(status)
        setActiveStep(remoteStep)
      })
      .then(() => showNotice(message))
      .catch(() => showNotice(`${message}; local state retained`))
  }

  const handleNavigate = (item) => {
    setActiveItem(item)
    window.history.pushState({}, '', routes[item])
    showNotice(`${item} workspace opened`)
  }

  const handleReset = () => {
    setResetRequested(false)
    changeSystemState('reset', 'System reset completed; controls in standby')
  }

  const handleRunSequence = () => {
    setIsSequenceRunning(true)
    runSequence()
      .then(({ active_step: remoteStep }) => setActiveStep(remoteStep))
      .then(() => showNotice('Sequence command accepted and safety checks running'))
      .catch(() => {
        setActiveStep((step) => (step + 1) % 5)
        showNotice('Sequence running in local simulation mode')
      })
  }

  useEffect(() => {
    const handlePopState = () => setActiveItem(itemFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const sharedProps = {
    motorState,
    onSpeedChange: (id, speed) => {
      setMotorState((current) => current.map((motor) => motor.id === id ? { ...motor, speed, status: speed > 0 ? 'Running' : 'Idle' } : motor))
      updateMotor(id, speed).catch(() => showNotice('Motor changed locally; API update unavailable'))
    },
    onSync: () => syncMotors()
      .then(({ motors: remoteMotors }) => {
        setMotorState(remoteMotors)
        showNotice('Motor telemetry synchronized from PostgreSQL')
      })
      .catch(() => showNotice('Motor telemetry available from local state')),
    alarms,
    onAcknowledge: (id) => {
      setAlarms((current) => current.map((alarm) => alarm.id === id ? { ...alarm, resolved: true } : alarm))
      acknowledgeAlarm(id)
        .then(() => showNotice('Alarm acknowledged and saved to audit trail'))
        .catch(() => showNotice('Alarm acknowledged locally; API unavailable'))
    },
    activeStep,
    isSequenceRunning,
    onRunSequence: handleRunSequence,
  }

  const page = {
    Overview: <OverviewPage {...sharedProps} />,
    Motors: <MotorsPage {...sharedProps} />,
    Sequences: <SequencesPage {...sharedProps} />,
    Automation: <AutomationPage />,
    Scheduler: <SchedulerPage />,
    Environment: <EnvironmentPage />,
    Devices: <DevicesPage />,
    Alarms: <AlarmsPage {...sharedProps} />,
    Reports: <ReportsAnalytics />,
    Settings: <SettingsPage systemState={systemState} onReset={handleReset} />,
  }[activeItem]

  return (
    <div className={`dashboard-shell ${sidebarCollapsed ? 'dashboard-shell--collapsed' : ''}`}>
      <Sidebar activeItem={activeItem} onNavigate={handleNavigate} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((current) => !current)} />

      <main className="dashboard-main">
        <Topbar
          title={pageTitles[activeItem]}
          systemState={systemState}
          themeMode={themeMode}
          onThemeChange={handleThemeChange}
          onStart={() => changeSystemState('start', 'System start command accepted')}
          onStop={() => changeSystemState('stop', 'System stopped safely')}
          onReset={handleReset}
          onRequestReset={() => setResetRequested(true)}
          onNotify={() => showNotice('No new notifications; all events are up to date')}
          onHelp={() => showNotice('Help: use the sidebar to open a workspace or the reset control for safe standby')}
          user={user}
          onProfile={() => setProfileOpen(true)}
          onLogout={onLogout}
        />

        <div className="operation-banner" role="status">
          <span className="operation-banner__pulse" />
          <span>{notice}</span>
          <span className="operation-banner__mode">Operator mode / Auto logging</span>
        </div>

        {page}
      </main>

      {resetRequested && (
        <div className="modal-backdrop" role="presentation">
          <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <button className="modal-close" type="button" onClick={() => setResetRequested(false)} aria-label="Close reset confirmation"><X size={17} /></button>
            <div className="confirm-modal__icon"><AlertTriangle size={21} /></div>
            <div className="panel__eyebrow">Danger zone</div>
            <h2 id="reset-title">Reset control state?</h2>
            <p>This returns the sequence to its initial step and places the system in standby. The action will be recorded in the audit trail.</p>
            <div className="confirm-modal__actions">
              <button className="btn btn--ghost" type="button" onClick={() => setResetRequested(false)}>Cancel</button>
              <button className="btn btn--danger" type="button" onClick={handleReset}>Confirm reset</button>
            </div>
          </section>
        </div>
      )}
      {profileOpen && <ProfileDialog user={user} token={token} onClose={() => setProfileOpen(false)} onSaved={(updatedUser) => { onProfileUpdate(updatedUser); setProfileOpen(false); showNotice('Profile details updated') }} />}
    </div>
  )
}

function ProfileDialog({ user, token, onClose, onSaved }) {
  const [fullName, setFullName] = useState(user.fullName)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const saveProfile = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const result = await updateProfile(token, fullName)
      onSaved(result.user)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return <div className="modal-backdrop" role="presentation"><section className="confirm-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><button className="modal-close" type="button" onClick={onClose} aria-label="Close profile"><X size={17} /></button><div className="panel__eyebrow">Account settings</div><h2 id="profile-title">Your profile</h2><p>Update the details shown in your operator session.</p><form className="profile-form" onSubmit={saveProfile}><label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label><label>Email address<input value={user.email} readOnly /></label>{error && <div className="auth-message auth-message--error">{error}</div>}<div className="confirm-modal__actions"><button className="btn btn--ghost" type="button" onClick={onClose}>Cancel</button><button className="btn btn--primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button></div></form></section></div>
}

export default Dashboard
