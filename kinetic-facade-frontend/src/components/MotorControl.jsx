import { useState } from 'react'
import { ChevronDown, Gauge, RefreshCw, Thermometer } from 'lucide-react'
import MotorLocation from './MotorLocation'

function MotorControl({ motorState, onSpeedChange, onSync, onViewOnMap }) {
  const orderedMotors = [...motorState].sort((a, b) => Number(a.id) - Number(b.id))
  const [expandedMotorId, setExpandedMotorId] = useState(null)

  return (
    <section className="panel">
      <div className="panel__header">
        <div><div className="panel__eyebrow">Actuator network</div><h2>Motor control</h2></div>
        <button className="btn btn--ghost" type="button" onClick={onSync}><RefreshCw size={14} /> Sync motors</button>
      </div>

      <div className="motor-list">
        {orderedMotors.map((motor) => {
          const isExpanded = expandedMotorId === motor.id

          return (
            <div key={motor.id} className={`motor-card ${isExpanded ? 'motor-card--expanded' : ''}`}>
              <button type="button" className="motor-card__toggle" onClick={() => setExpandedMotorId(isExpanded ? null : motor.id)}>
                <div className="motor-card__top">
                  <div className="motor-card__identity"><span className="motor-card__icon"><Gauge size={16} /></span><div><div className="motor-card__name">{motor.name}</div><small>ACT-{String(motor.id).padStart(2, '0')} · {motor.motorType} · {motor.status}</small></div></div>
                  <div className="motor-card__header-actions">
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
                    <ChevronDown size={16} className={`motor-card__chevron ${isExpanded ? 'motor-card__chevron--open' : ''}`} />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="motor-card__details">
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
                  <div className={`motor-card__anomaly motor-card__anomaly--${motor.anomalyStatus?.toLowerCase() || 'normal'}`}><span>Anomaly status</span><strong>{motor.anomalyStatus || 'Normal'}</strong><small>{motor.anomalyDetail || 'No anomaly detected'}</small></div>
                  <MotorLocation motor={motor} onViewOnMap={onViewOnMap} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MotorControl
