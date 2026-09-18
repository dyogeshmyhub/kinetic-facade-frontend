import { Activity, Clock3, Gauge, ShieldCheck, TrendingUp, Wind, Zap } from 'lucide-react'

const metricIcons = {
  'System Status': Activity,
  'Active Motors': Gauge,
  'Current Sequence': TrendingUp,
  'Cycle Time': Clock3,
  'Facade Opening': Activity,
  'Wind Load': Wind,
  'Safety Index': ShieldCheck,
  'Peak Demand': Zap,
}

function MetricCard({ metric }) {
  const Icon = metricIcons[metric.label] || Activity

  return (
    <div className="metric-card">
      <div className="metric-card__topline"><span className="metric-card__icon"><Icon size={15} /></span><span className="metric-card__signal"><span /><span /><span /></span></div>
      <div className="metric-card__label">{metric.label}</div>
      <div className="metric-card__value">{metric.value}</div>
      <div className="metric-card__trend">{metric.trend}</div>
    </div>
  )
}

export default MetricCard
