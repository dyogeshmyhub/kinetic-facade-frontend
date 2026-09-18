import { Gauge, RefreshCw, Thermometer } from 'lucide-react'

function MotorControl({ motorState, onSpeedChange, onSync }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <div><div className="panel__eyebrow">Actuator network</div><h2>Motor control</h2></div>
        <button className="btn btn--ghost" type="button" onClick={onSync}><RefreshCw size={14} /> Sync motors</button>
      </div>

      <div className="motor-list">
        {motorState.map((motor) => (
          <div key={motor.id} className="motor-card">
            <div className="motor-card__top">
              <div className="motor-card__identity"><span className="motor-card__icon"><Gauge size={16} /></span><div><div className="motor-card__name">{motor.name}</div><small>ACT-{String(motor.id).padStart(2, '0')} · Online</small></div></div>
              <span
                className={`motor-card__status ${
                  motor.status === 'Running'
                    ? 'motor-card__status--running'
                    : motor.status === 'Idle'
                      ? 'motor-card__status--idle'
                      : 'motor-card__status--standby'
                }`}
              >
                {motor.status}
              </span>
            </div>

            <div className="motor-card__meta">
              <span>Actuator output</span>
              <span>{motor.speed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={motor.speed}
              onChange={(event) => onSpeedChange(motor.id, Number(event.target.value))}
              aria-label={`${motor.name} speed`}
            />

            <div className="motor-card__meta motor-card__meta--bottom">
              <span><Thermometer size={12} /> Temperature</span>
              <span>{motor.temp}°C</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MotorControl
