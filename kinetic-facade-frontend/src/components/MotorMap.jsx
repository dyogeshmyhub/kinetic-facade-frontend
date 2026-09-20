import { useState } from 'react'
import { MapPin } from 'lucide-react'

const markerColors = { Normal: '#16805f', Warning: '#c98512', Critical: '#c44949', Offline: '#334155' }

function getMotorHealth(motor) {
  return motor.health || (motor.status === 'Offline' ? 'Offline' : 'Normal')
}

function MotorMap({ motors, focusedMotorId }) {
  const [selectedMotorId, setSelectedMotorId] = useState(motors[0]?.id || null)
  const activeMotorId = focusedMotorId && motors.some((motor) => motor.id === focusedMotorId) ? focusedMotorId : selectedMotorId
  const selectedMotor = motors.find((motor) => motor.id === activeMotorId) || motors[0]

  if (!motors.length) return <section className="panel motor-map-panel" id="motor-map"><div className="panel__eyebrow">Physical distribution / Demo map</div><h2>No motors match these filters</h2></section>

  const latitudeValues = motors.map((motor) => motor.latitude)
  const longitudeValues = motors.map((motor) => motor.longitude)
  const minLat = Math.min(...latitudeValues, 17.384)
  const maxLat = Math.max(...latitudeValues, 17.488)
  const minLon = Math.min(...longitudeValues, 78.486)
  const maxLon = Math.max(...longitudeValues, 78.488)
  const positionFor = (motor) => ({
    x: 86 + ((motor.longitude - minLon) / Math.max(maxLon - minLon, 0.001)) * 430,
    y: 220 - ((motor.latitude - minLat) / Math.max(maxLat - minLat, 0.001)) * 135,
  })

  return <section className="panel motor-map-panel" id="motor-map">
    <div className="panel__header"><div><div className="panel__eyebrow">Physical distribution / Demo map</div><h2>Building and facade map</h2></div><span className="chart-unit">{motors.length} motors</span></div>
    <p className="map-disclaimer">Demo coordinates for interface testing. They do not represent the actual building.</p>
    <div className="motor-map-layout">
      <div className="motor-map" role="img" aria-label="Demo building map showing motor locations">
        <div className="motor-map__building"><span>Main facade footprint</span><small>Blocks A / B</small></div>
        <svg viewBox="0 0 600 280" aria-hidden="true">
          <path className="motor-map__road" d="M25 248 H575" />
          {motors.map((motor) => {
            const point = positionFor(motor)
            const health = getMotorHealth(motor)
            const active = motor.id === selectedMotor?.id
            return <g key={motor.id} className={`motor-marker ${active ? 'motor-marker--active' : ''}`} onClick={() => setSelectedMotorId(motor.id)} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedMotorId(motor.id) }}>
              <circle cx={point.x} cy={point.y} r={active ? 13 : 10} fill={markerColors[health]} opacity=".2" />
              <circle cx={point.x} cy={point.y} r="6" fill={markerColors[health]} />
              <text x={point.x + 11} y={point.y + 4}>{`M-${String(motor.id).padStart(2, '0')}`}</text>
            </g>
          })}
        </svg>
        <div className="motor-map__legend">{Object.entries(markerColors).map(([label, color]) => <span key={label}><i style={{ backgroundColor: color }} />{label}</span>)}</div>
      </div>
      {selectedMotor && <div className="motor-map__details"><div className="panel__eyebrow">Selected motor</div><h3>M-{String(selectedMotor.id).padStart(2, '0')}</h3><div className="map-status"><i style={{ backgroundColor: markerColors[getMotorHealth(selectedMotor)] }} />{getMotorHealth(selectedMotor)} / {selectedMotor.status}</div><dl><div><dt>Building</dt><dd>{selectedMotor.building}</dd></div><div><dt>Floor / facade</dt><dd>{selectedMotor.floor} / {selectedMotor.facade}</dd></div><div><dt>Block / panel</dt><dd>{selectedMotor.block} / {selectedMotor.panel}</dd></div><div><dt>Coordinates</dt><dd>{selectedMotor.latitude.toFixed(4)}, {selectedMotor.longitude.toFixed(4)}</dd></div><div><dt>Current position</dt><dd>{selectedMotor.position ?? selectedMotor.speed}%</dd></div><div><dt>Motor health</dt><dd>{getMotorHealth(selectedMotor)}</dd></div></dl><div className="map-detail-note"><MapPin size={14} /> Marker selection is simulated locally.</div></div>}
    </div>
  </section>
}

export default MotorMap
