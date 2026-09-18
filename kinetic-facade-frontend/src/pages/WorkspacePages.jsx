import PerformanceChart from '../components/PerformanceChart'
import SystemHealth from '../components/SystemHealth'
import MotorControl from '../components/MotorControl'
import AlarmHistory from '../components/AlarmHistory'
import SequenceBuilder from '../components/SequenceBuilder'
import MetricCard from '../components/MetricCard'
import { metrics, summaryCards } from '../data/dashboardData'
import { Download } from 'lucide-react'

export function OverviewPage({ motorState, onSpeedChange, onSync, alarms, onAcknowledge, activeStep, isSequenceRunning, onRunSequence }) {
  return (
    <>
      <div className="metrics-grid">
        {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="summary-strip">
        {summaryCards.map((card) => (
          <div key={card.label} className="summary-card">
            <div className="summary-card__label">{card.label}</div>
            <div className="summary-card__value">{card.value}</div>
            <div className={`summary-card__trend summary-card__trend--${card.tone}`}>{card.trend}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid dashboard-grid--top">
        <PerformanceChart />
        <SystemHealth />
      </div>
      <div className="dashboard-grid dashboard-grid--middle">
        <MotorControl motorState={motorState} onSpeedChange={onSpeedChange} onSync={onSync} />
        <AlarmHistory alarms={alarms} onAcknowledge={onAcknowledge} />
      </div>
      <SequenceBuilder activeStep={activeStep} isRunning={isSequenceRunning} onRun={onRunSequence} />
    </>
  )
}

export function MotorsPage({ motorState, onSpeedChange, onSync }) {
  return (
    <WorkspaceFrame eyebrow="Actuator network" title="Motor control center" description="Command, tune, and inspect every kinetic facade actuator from one operational view.">
      <div className="dashboard-grid dashboard-grid--middle workspace-grid-single">
        <MotorControl motorState={motorState} onSpeedChange={onSpeedChange} onSync={onSync} />
        <SystemHealth />
      </div>
    </WorkspaceFrame>
  )
}

export function SequencesPage({ activeStep, isSequenceRunning, onRunSequence }) {
  return (
    <WorkspaceFrame eyebrow="Automation" title="Sequence operations" description="Run validated facade movement cycles with safety checkpoints and operator visibility.">
      <SequenceBuilder activeStep={activeStep} isRunning={isSequenceRunning} onRun={onRunSequence} />
      <div className="workspace-info-grid">
        <InfoTile label="Safety interlocks" value="24 / 24" detail="All checks passing" tone="success" />
        <InfoTile label="Current cycle" value="18 of 24" detail="A-01 facade opening" tone="primary" />
        <InfoTile label="Next inspection" value="02:18:40" detail="Scheduled maintenance window" tone="warning" />
      </div>
    </WorkspaceFrame>
  )
}

export function AlarmsPage({ alarms, onAcknowledge }) {
  const openCount = alarms.filter((alarm) => !alarm.resolved).length
  return (
    <WorkspaceFrame eyebrow="Event management" title="Alarm history" description="Review, acknowledge, and audit facade events retained for the full 12-month operating window.">
      <div className="workspace-info-grid">
        <InfoTile label="Open alarms" value={String(openCount).padStart(2, '0')} detail="Requires operator review" tone="danger" />
        <InfoTile label="Retention" value="12 months" detail="Audit history enabled" tone="primary" />
        <InfoTile label="Last event" value="21:07" detail="Cooling fan review" tone="warning" />
      </div>
      <AlarmHistory alarms={alarms} onAcknowledge={onAcknowledge} />
    </WorkspaceFrame>
  )
}

export function ReportsPage() {
  const exportReport = () => {
    const report = ['KINETIC FACADE CONTROL - SEPTEMBER 2026', '', 'Facade uptime,99.84%', 'Completed cycles,1248', 'Energy efficiency,+8.6%', 'Unresolved events,03'].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([report], { type: 'text/csv' }))
    link.download = 'kinetic-facade-operations-september-2026.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <WorkspaceFrame eyebrow="Operational intelligence" title="Reports and performance" description="Export-ready operational summaries for maintenance, energy, safety, and facade performance reviews.">
      <div className="dashboard-grid dashboard-grid--top">
        <PerformanceChart />
        <section className="panel report-panel">
          <div className="panel__eyebrow">Monthly summary</div>
          <h2>September 2026</h2>
          <div className="report-list">
            <ReportRow label="Facade uptime" value="99.84%" />
            <ReportRow label="Completed cycles" value="1,248" />
            <ReportRow label="Energy efficiency" value="+8.6%" />
            <ReportRow label="Unresolved events" value="03" />
          </div>
          <button className="btn btn--primary" type="button" onClick={exportReport}><Download size={14} /> Export operations report</button>
        </section>
      </div>
    </WorkspaceFrame>
  )
}

export function SettingsPage({ systemState, onReset }) {
  return (
    <WorkspaceFrame eyebrow="Control configuration" title="System settings" description="Configure operating policies, audit behavior, and control-room preferences.">
      <section className="panel settings-panel">
        <div className="settings-row"><div><strong>Operating mode</strong><span>Current command authority</span></div><span className="panel__tag">Operator assisted</span></div>
        <div className="settings-row"><div><strong>System state</strong><span>Live equipment connection</span></div><span className={`settings-value settings-value--${systemState.toLowerCase()}`}>{systemState}</span></div>
        <div className="settings-row"><div><strong>Alarm retention</strong><span>Historical events and acknowledgements</span></div><span className="settings-value">12 months</span></div>
        <div className="settings-row"><div><strong>Automatic audit logging</strong><span>Record every operator command</span></div><span className="settings-value settings-value--success">Enabled</span></div>
        <button className="btn btn--danger" type="button" onClick={onReset}>Reset control state</button>
      </section>
    </WorkspaceFrame>
  )
}

function WorkspaceFrame({ eyebrow, title, description, children }) {
  return (
    <section className="workspace-page">
      <div className="workspace-heading">
        <div className="panel__eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}

function InfoTile({ label, value, detail, tone }) {
  return <div className={`info-tile info-tile--${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function ReportRow({ label, value }) {
  return <div className="report-row"><span>{label}</span><strong>{value}</strong></div>
}
