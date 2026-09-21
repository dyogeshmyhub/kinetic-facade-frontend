import { useState } from 'react'
import { MapPin } from 'lucide-react'

const markerColors = { Normal: '#16805f', Warning: '#c98512', Critical: '#c44949', Offline: '#334155' }
const typeColors = {
  Industrial: '#0f6f8f',
  Residential: '#7c3aed',
}

function getMotorHealth(motor) {
  return motor.health || (motor.status === 'Offline' ? 'Offline' : 'Normal')
}

function getGoogleMapsEmbedUrl(motor) {
  const latitude = Number(motor.latitude)
  const longitude = Number(motor.longitude)
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`
}

function MotorMap({ motors, focusedMotorId }) {
  const [selectedMotorId, setSelectedMotorId] = useState(motors[0]?.id || null)
  const activeMotorId = focusedMotorId && motors.some((motor) => motor.id === focusedMotorId) ? focusedMotorId : selectedMotorId
  const selectedMotor = motors.find((motor) => motor.id === activeMotorId) || motors[0]

  if (!motors.length) return <section className="panel motor-map-panel" id="motor-map"><div className="panel__eyebrow">Physical distribution / Demo map</div><h2>No motors match these filters</h2></section>

  return <section className="panel motor-map-panel" id="motor-map">
    <div className="panel__header"><div><div className="panel__eyebrow">Physical distribution / Demo map</div><h2>Building and facade map</h2></div><span className="chart-unit">{motors.length} motors</span></div>
    <p className="map-disclaimer">Live map shown in-app for the selected site.</p>
    <div className="motor-map-layout motor-map-layout--single">
      <div className="motor-map__embed-wrap motor-map__embed-wrap--full">
        <iframe className="motor-map__embed" title={`Google map for ${selectedMotor.name}`} src={getGoogleMapsEmbedUrl(selectedMotor)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
      {selectedMotor && <div className="motor-map__details motor-map__details--full"><div className="panel__eyebrow">Selected motor</div><h3>M-{String(selectedMotor.id).padStart(2, '0')}</h3><div className="map-status"><i style={{ backgroundColor: typeColors[selectedMotor.motorType] || '#0f6f8f' }} />{selectedMotor.motorType}</div><dl><div><dt>Motor type</dt><dd>{selectedMotor.motorType}</dd></div><div><dt>Site</dt><dd>{selectedMotor.site}</dd></div><div><dt>Floor / facade</dt><dd>{selectedMotor.floor} / {selectedMotor.facade}</dd></div><div><dt>Block / panel</dt><dd>{selectedMotor.block} / {selectedMotor.panel}</dd></div><div><dt>Coordinates</dt><dd>{selectedMotor.latitude.toFixed(4)}, {selectedMotor.longitude.toFixed(4)}</dd></div><div><dt>Anomaly</dt><dd>{selectedMotor.anomalyStatus}: {selectedMotor.anomalyDetail}</dd></div></dl><div className="map-detail-note"><MapPin size={14} /> {selectedMotor.motorType === 'Industrial' ? 'Industrial site highlighted in blue.' : 'Residential site highlighted in purple.'}</div></div>}
    </div>
  </section>
}

export default MotorMap
