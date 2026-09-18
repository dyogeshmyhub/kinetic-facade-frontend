import { ShieldCheck } from 'lucide-react'
import { healthItems } from '../data/dashboardData'

function SystemHealth() {
  return (
    <section className="panel">
      <div className="panel__header"><div><div className="panel__eyebrow">Diagnostics</div><h2>System health</h2></div><span className="health-status">Nominal</span></div>

      <div className="health-list">
        {healthItems.map((item) => (
          <div key={item.label}>
            <div className="health-row">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar__fill"
                style={{
                  width: item.value.includes('%') ? item.value.replace('%', '') + '%' : '80%',
                  background: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="health-summary"><span>Uptime <strong>99.84%</strong></span><span><ShieldCheck size={13} /> Safety <strong>24 / 24</strong></span></div>
    </section>
  )
}

export default SystemHealth
