import { Bell, CircleHelp, Power, RotateCcw, Square } from 'lucide-react'

function Topbar({ title, systemState, onStart, onStop, onReset, onRequestReset }) {
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
        <button className="icon-button" type="button" aria-label="Notifications"><Bell size={16} /><span className="icon-button__dot" /></button>
        <button className="icon-button" type="button" aria-label="Help"><CircleHelp size={16} /></button>
      </div>
      <div className="topbar__actions">
        <button className="btn btn--success" type="button" onClick={onStart} disabled={systemState === 'Running'}><Power size={14} /> Start</button>
        <button className="btn btn--warning" type="button" onClick={onStop} disabled={systemState === 'Stopped'}><Square size={13} /> Stop</button>
        <button className="btn btn--danger" type="button" onClick={onRequestReset || onReset}><RotateCcw size={14} /> Reset</button>
      </div>
    </header>
  )
}

export default Topbar
