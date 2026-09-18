import { Search } from 'lucide-react'
import { useState } from 'react'

function AlarmHistory({ alarms, onAcknowledge }) {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('All')
  const filteredAlarms = alarms.filter((alert) => {
    const matchesQuery = `${alert.message} ${alert.level} ${alert.time}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (level === 'All' || alert.level === level)
  })

  return (
    <section className="panel">
      <div className="panel__header panel__header--split">
        <div><div className="panel__eyebrow">Event log</div><h2>Alarm history</h2></div>
        <div className="panel__tag">Saved 12 months</div>
      </div>

      <div className="alarm-filters">
        <label className="search-field"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" /></label>
        <select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filter alarm severity">
          <option>All</option><option>Critical</option><option>Warning</option><option>Info</option>
        </select>
      </div>

      <div className="alarm-list">
        {filteredAlarms.map((alert) => (
          <div key={`${alert.time}-${alert.message}`} className="alarm-row">
            <span className="alarm-row__time">{alert.time}</span>
            <span
              className={`alarm-row__level alarm-row__level--${
                alert.level === 'Critical'
                  ? 'critical'
                  : alert.level === 'Warning'
                    ? 'warning'
                    : 'info'
              }`}
            >
              {alert.level}
            </span>
            <span className="alarm-row__message">{alert.message}</span>
            {alert.resolved ? (
              <span className="alarm-row__status resolved">Closed</span>
            ) : (
              <button className="alarm-row__action" type="button" onClick={() => onAcknowledge(alert.id)}>Acknowledge</button>
            )}
          </div>
        ))}
        {!filteredAlarms.length && <div className="alarm-empty">No events match the current filter.</div>}
      </div>
    </section>
  )
}

export default AlarmHistory
