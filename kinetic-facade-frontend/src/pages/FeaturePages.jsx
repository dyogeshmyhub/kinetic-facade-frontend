import { useState } from 'react'
import { Activity, CloudRain, Cpu, Gauge, Play, Plus, ShieldCheck, Sun, Trash2, Wifi } from 'lucide-react'
import { BarChart, DonutChart } from '../components/AnalyticsCharts'
import { environmentHistory, environmentSnapshot } from '../data/environmentData'
import { automationLog, automationModes, automationState } from '../data/automationData'
import { devices } from '../data/deviceData'
import { motorHealth, motorHealthTrend } from '../data/motorHealthData'
import { reportAlarmMix, reportEnergy, reportMotorPerformance, reportSummary } from '../data/reportData'
import { schedules as initialSchedules } from '../data/schedulerData'
import MotorLocation from '../components/MotorLocation'

function StatusPill({ value }) {
  const tone = value.toLowerCase().replace(/\s/g, '-')
  return <span className={`status-pill status-pill--${tone}`}><span />{value}</span>
}

function TrendChart({ data, title, unit, color = '#16839d' }) {
  const width = 600
  const height = 190
  const max = Math.max(...data.map((item) => item.value))
  const min = Math.min(...data.map((item) => item.value))
  const points = data.map((item, index) => {
    const x = 30 + (index / (data.length - 1)) * 535
    const y = 24 + 125 - ((item.value - min) / Math.max(max - min, 1)) * 125
    return { ...item, x, y }
  })
  return <section className="panel feature-chart"><div className="panel__header"><div><div className="panel__eyebrow">Simulated history</div><h2>{title}</h2></div><span className="chart-unit">{unit}</span></div><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title} over time`}><line className="chart__grid-line" x1="30" x2="565" y1="24" y2="24" /><line className="chart__grid-line" x1="30" x2="565" y1="86" y2="86" /><line className="chart__grid-line" x1="30" x2="565" y1="149" y2="149" /><polyline points={points.map(({ x, y }) => `${x},${y}`).join(' ')} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.map((point) => <g key={point.label}><circle cx={point.x} cy={point.y} r="4" fill={color} /><text className="chart__axis-label chart__axis-label--x" x={point.x} y="178">{point.label}</text><title>{point.label}: {point.value} {unit}</title></g>)}</svg></section>
}

function MetricStrip({ items }) {
  return <div className="feature-metrics">{items.map((item) => <div className="feature-metric" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail || 'Simulated demo value'}</small></div>)}</div>
}

export function EnvironmentPage() {
  const cards = [
    ['Temperature', `${environmentSnapshot.temperature} C`, 'Normal', Sun], ['Humidity', `${environmentSnapshot.humidity}%`, 'Normal', CloudRain], ['Light intensity', `${environmentSnapshot.light}%`, 'Normal', Sun], ['Wind speed', `${environmentSnapshot.wind} km/h`, 'Warning', Activity],
  ]
  return <WorkspaceFrame eyebrow="Sensor overview / Demo data" title="Environmental monitoring" description="Simulated conditions for shading decisions. ESP32 sensors are not connected yet."><div className="feature-card-grid">{cards.map(([label, value, status, Icon]) => <section className="panel feature-sensor" key={label}><div className="feature-sensor__icon"><Icon size={18} /></div><span>{label}</span><strong>{value}</strong><StatusPill value={status} /></section>)}</div><div className="feature-grid feature-grid--wide"><TrendChart data={environmentHistory.map(({ label, temperature }) => ({ label, value: temperature }))} title="Temperature history" unit="C" color="#c98512" /><TrendChart data={environmentHistory.map(({ label, light }) => ({ label, value: light }))} title="Light intensity" unit="%" /><section className="panel environmental-summary"><div className="panel__eyebrow">Environmental summary</div><h2>Shading recommendation</h2><div className="recommendation"><ShieldCheck size={20} /><div><strong>High sunlight detected</strong><span>Increase facade shading toward a 62% closed position.</span></div></div><div className="summary-pairs"><span>Rain status <b>{environmentSnapshot.rain}</b></span><span>Sunlight <b>{environmentSnapshot.sunlight}</b></span></div></section></div></WorkspaceFrame>
}

export function AutomationPage() {
  const [mode, setMode] = useState(automationState.mode)
  const [previewed, setPreviewed] = useState(false)
  return <WorkspaceFrame eyebrow="Rules engine / Simulation only" title="Automatic control" description="Evaluate environmental conditions and preview facade actions. Commands are simulated until an ESP32 control link is connected."><div className="automation-toolbar"><div><span className="panel__eyebrow">Operating mode</span><select value={mode} onChange={(event) => setMode(event.target.value)}>{automationModes.map((item) => <option key={item}>{item}</option>)}</select></div><StatusPill value="Normal" /></div><div className="feature-metrics"><div className="feature-metric"><span>Current condition</span><strong>{automationState.condition}</strong><small>Sensor simulation</small></div><div className="feature-metric"><span>Facade position</span><strong>{automationState.position}%</strong><small>Target shading position</small></div><div className="feature-metric"><span>Active rule</span><strong>{automationState.rule}</strong><small>Rule evaluation ready</small></div><div className="feature-metric"><span>Last action</span><strong>{previewed ? 'Preview generated just now' : automationState.lastAction}</strong><small>{previewed ? 'No motor command sent' : 'Preview only'}</small></div></div><section className="panel log-panel"><div className="panel__header"><div><div className="panel__eyebrow">Audit trail</div><h2>Automation activity</h2></div><button className="btn btn--ghost" type="button" onClick={() => setPreviewed(true)}><Play size={13} /> {previewed ? 'Rule preview ready' : 'Preview rule'}</button></div><div className="data-table">{automationLog.map((item) => <div className="data-row" key={`${item.time}-${item.event}`}><strong>{item.time}</strong><span>{item.event}</span><span>{item.action}</span><StatusPill value="Simulated" /><em>{item.result}</em></div>)}</div></section></WorkspaceFrame>
}

export function SchedulerPage() {
  const [scheduleRows, setScheduleRows] = useState(initialSchedules)
  const [showForm, setShowForm] = useState(false)
  const toggleSchedule = (id) => setScheduleRows((rows) => rows.map((row) => row.id === id ? { ...row, enabled: !row.enabled, next: row.enabled ? 'Paused' : `Today, ${row.time}` } : row))
  const deleteSchedule = (id) => setScheduleRows((rows) => rows.filter((row) => row.id !== id))
  return <WorkspaceFrame eyebrow="Facade operations / Demo schedule" title="Scheduler" description="Plan recurring facade positions and review their simulated next execution time."><div className="scheduler-actions"><div className="panel__eyebrow">{scheduleRows.filter((row) => row.enabled).length} active schedules</div><button className="btn btn--primary" type="button" onClick={() => setShowForm((value) => !value)}><Plus size={15} /> Add schedule</button></div>{showForm && <ScheduleForm onAdd={(schedule) => { setScheduleRows((rows) => [...rows, { ...schedule, id: Date.now(), next: `Today, ${schedule.time}` }]); setShowForm(false) }} />}{scheduleRows.map((schedule) => <section className="panel schedule-row" key={schedule.id}><div><strong>{schedule.name}</strong><span>{schedule.days} / {schedule.action}</span></div><b>{schedule.time}</b><span>{schedule.position} at {schedule.speed}</span><span>{schedule.next}</span><button className={`toggle ${schedule.enabled ? 'toggle--on' : ''}`} type="button" onClick={() => toggleSchedule(schedule.id)} aria-label={`Toggle ${schedule.name}`}><span /></button><button className="icon-button" type="button" onClick={() => deleteSchedule(schedule.id)} aria-label={`Delete ${schedule.name}`}><Trash2 size={14} /></button></section>)}</WorkspaceFrame>
}

function ScheduleForm({ onAdd }) {
  const [name, setName] = useState('New facade profile')
  const [time, setTime] = useState('10:00')
  return <form className="panel schedule-form" onSubmit={(event) => { event.preventDefault(); onAdd({ name, time, days: 'Every day', action: 'Set facade', position: '60%', speed: '50%', enabled: true }) }}><input value={name} onChange={(event) => setName(event.target.value)} aria-label="Schedule name" /><input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="Schedule time" /><button className="btn btn--primary" type="submit">Save schedule</button></form>
}

export function DevicesPage() {
  const online = devices.filter((device) => device.status === 'Online')
  const [selectedDevice, setSelectedDevice] = useState(null)
  return <WorkspaceFrame eyebrow="Controller network / Demo data" title="ESP32 devices" description="Monitor simulated controller nodes and their communication health. This data is ready to be replaced by a REST or WebSocket adapter."><MetricStrip items={[{ label: 'Online devices', value: `${online.length}/${devices.length}`, detail: 'Controller nodes' }, { label: 'Offline devices', value: String(devices.length - online.length), detail: 'Needs review' }, { label: 'Average response', value: '42 ms', detail: 'Online nodes' }, { label: 'Firmware baseline', value: 'v2.4.1', detail: 'Latest deployed' }]} /><div className="device-grid">{devices.map((device) => <section className="panel device-card" key={device.id}><div className="device-card__header"><div><div className="panel__eyebrow"><Cpu size={13} /> Controller node</div><h2>{device.id}</h2></div><StatusPill value={device.status} /></div><div className="device-card__signal"><Wifi size={15} /><strong>{device.signal}%</strong><span>Wi-Fi signal</span></div><div className="device-details"><span>IP address <b>{device.ip}</b></span><span>Uptime <b>{device.uptime}</b></span><span>Firmware <b>{device.firmware}</b></span><span>Last communication <b>{device.lastCommunication}</b></span><span>Connected motors <b>{device.motors}</b></span><span>Temperature <b>{device.temperature ? `${device.temperature} C` : 'Unavailable'}</b></span></div><button className="btn btn--ghost" type="button" onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}>{selectedDevice === device.id ? 'Hide device detail' : 'View device detail'}</button>{selectedDevice === device.id && <div className="device-detail"><strong>{device.id} communication detail</strong><span>Last packet: {device.lastCommunication} / Response: {device.response ? `${device.response} ms` : 'No response'}</span><span>Demo status: telemetry is simulated locally</span></div>}</section>)}</div></WorkspaceFrame>
}

export function MotorHealthPanel({ motorState = [], onViewOnMap }) {
  const locationById = Object.fromEntries(motorState.map((motor) => [motor.id, motor]))
  const visibleHealth = motorHealth.filter((motor) => locationById[Number(motor.id.replace(/\D/g, ''))])
  return <><section className="panel health-panel"><div className="panel__header"><div><div className="panel__eyebrow">Diagnostics / Simulated telemetry</div><h2>Motor health and location</h2></div><StatusPill value="Normal" /></div><div className="motor-health-grid">{visibleHealth.map((motor) => { const motorId = Number(motor.id.replace(/\D/g, '')); const locationMotor = locationById[motorId]; return <div className="motor-health-card" key={motor.id}><div className="device-card__header"><strong>{motor.id}</strong><StatusPill value={motor.health} /></div><div className="health-reading"><b>{motor.position}%</b><span>Position</span><b>{motor.temperature} C</b><span>Temperature</span></div><div className="health-bar"><span style={{ width: `${motor.position}%` }} /></div><div className="health-details"><span>Speed <b>{motor.speed}%</b></span><span>Current <b>{motor.current} A</b></span><span>Voltage <b>{motor.voltage} V</b></span><span>Direction <b>{motor.direction}</b></span><span>Runtime <b>{motor.runtime}</b></span><span>Cycles <b>{motor.cycles}</b></span><span>Faults <b>{motor.faults}</b></span></div><small className={`maintenance maintenance--${motor.health.toLowerCase()}`}>{motor.maintenance}</small>{locationMotor && <MotorLocation motor={{ ...locationMotor, position: motor.position }} onViewOnMap={onViewOnMap} />}</div> })}</div>{!visibleHealth.length && <p className="map-disclaimer">No motor health records match these filters.</p>}</section><TrendChart data={motorHealthTrend} title="Motor health score" unit="%" color="#16805f" /></>
}

export function ReportsAnalytics() {
  const [range, setRange] = useState('7 Days')
  return <WorkspaceFrame eyebrow="Operational intelligence / Demo data" title="Reports and performance" description="Review motor, energy, alarm, environmental, and system analytics. Values are simulated until live telemetry is available."><MetricStrip items={reportSummary.map((item) => ({ label: item.label, value: item.value, detail: 'Current period' }))} /><div className="report-filter"><span className="panel__eyebrow">Reporting period</span><div>{['Today', '7 Days', '30 Days', 'Custom Range'].map((item) => <button key={item} className={`filter-button ${range === item ? 'filter-button--active' : ''}`} type="button" onClick={() => setRange(item)}>{item}</button>)}</div></div><div className="analytics-grid"><BarChart data={reportMotorPerformance} title="Motor runtime" eyebrow="Motor performance report" unit="hrs" /><BarChart data={reportEnergy} title="Energy consumption" eyebrow={`${range} energy report`} unit="kWh" /><DonutChart data={reportAlarmMix} title="Alarm distribution" eyebrow="Alarm report" /></div><div className="report-domain-grid"><ReportDomain title="Environmental report" value="31 C / 64% RH" detail="Temperature and humidity history available" icon={Sun} /><ReportDomain title="System report" value="98.7% availability" detail="3/4 ESP32 nodes online, 246 automation events" icon={Gauge} /><ReportDomain title="Sequence executions" value="1,248 cycles" detail="Average speed 54%, average position 68%" icon={Activity} /></div></WorkspaceFrame>
}

function ReportDomain({ title, value, detail, icon: Icon }) {
  return <section className="panel report-domain"><Icon size={18} /><div><div className="panel__eyebrow">{title}</div><strong>{value}</strong><span>{detail}</span></div></section>
}

function WorkspaceFrame({ eyebrow, title, description, children }) {
  return <section className="workspace-page"><div className="workspace-heading"><div className="panel__eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>{children}</section>
}
