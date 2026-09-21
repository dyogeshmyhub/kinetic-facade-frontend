import { Bell, CircleHelp, Clock3, LogOut, Moon, Power, RotateCcw, Square, Sun, UserRound } from 'lucide-react'

function Topbar({ title, systemState, themeMode, onThemeChange, onStart, onStop, onReset, onRequestReset, onNotify, onHelp, user, onProfile, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar__content">
        <div className="eyebrow">Kinetic Facade Control</div>
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__meta">
        <div className={`topbar__status topbar__status--${systemState.toLowerCase()}`}>
          <span className="topbar__status-dot" />
          System {systemState.toLowerCase()}
        </div>
        <div className="topbar__time">Last sync <strong>14:32 UTC</strong> · Operator assisted</div>
      </div>

      <div className="topbar__utility">
        <div className="theme-switcher" aria-label="Theme mode">
          <button className={themeMode === 'light' ? 'theme-switcher__button theme-switcher__button--active' : 'theme-switcher__button'} type="button" onClick={() => onThemeChange('light')} aria-label="Use light mode" aria-pressed={themeMode === 'light'} title="Light mode"><Sun size={14} /></button>
          <button className={themeMode === 'dark' ? 'theme-switcher__button theme-switcher__button--active' : 'theme-switcher__button'} type="button" onClick={() => onThemeChange('dark')} aria-label="Use dark mode" aria-pressed={themeMode === 'dark'} title="Dark mode"><Moon size={14} /></button>
          <button className={themeMode === 'auto' ? 'theme-switcher__button theme-switcher__button--active' : 'theme-switcher__button'} type="button" onClick={() => onThemeChange('auto')} aria-label="Use automatic day and night mode" aria-pressed={themeMode === 'auto'} title="Automatic day and night mode"><Clock3 size={14} /></button>
        </div>
        <button className="icon-button" type="button" onClick={onNotify} aria-label="Notifications"><Bell size={16} /><span className="icon-button__dot" /></button>
        <button className="icon-button" type="button" onClick={onHelp} aria-label="Help"><CircleHelp size={16} /></button>
      </div>
      <div className="topbar__actions">
        <button className="btn btn--success" type="button" onClick={onStart} disabled={systemState === 'Running'}><Power size={14} /> Start</button>
        <button className="btn btn--warning" type="button" onClick={onStop} disabled={systemState === 'Stopped'}><Square size={13} /> Stop</button>
        <button className="btn btn--danger" type="button" onClick={onRequestReset || onReset}><RotateCcw size={14} /> Reset</button>
        <button className="topbar__profile" type="button" onClick={onProfile} title="Edit profile"><UserRound size={15} /><span>{user.fullName}</span></button>
        <button className="icon-button" type="button" onClick={onLogout} aria-label="Log out" title="Log out"><LogOut size={15} /></button>
      </div>
    </header>
  )
}

export default Topbar
