import { MapPin } from 'lucide-react'

function MotorLocation({ motor, onViewOnMap }) {
  return <div className="motor-location">
    <div className="motor-location__heading"><span><MapPin size={13} /> M-{String(motor.id).padStart(2, '0')} location</span><small>Demo coordinates</small></div>
    <div className="motor-location__details">
      <span>Building <b>{motor.building}</b></span>
      <span>Block <b>{motor.block}</b></span>
      <span>Floor <b>{motor.floor}</b></span>
      <span>Facade <b>{motor.facade}</b></span>
      <span>Panel <b>{motor.panel}</b></span>
    </div>
    <div className="motor-location__coordinates"><span>{motor.latitude.toFixed(4)}° N</span><span>{motor.longitude.toFixed(4)}° E</span></div>
    {onViewOnMap && <button className="btn btn--ghost motor-location__map-button" type="button" onClick={() => onViewOnMap(motor.id)}><MapPin size={13} /> View on map</button>}
  </div>
}

export default MotorLocation
