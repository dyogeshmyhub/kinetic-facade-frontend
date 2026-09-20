function BarChart({ data, title, eyebrow, unit }) {
  const chart = { left: 28, top: 16, width: 420, height: 164 }
  const maxValue = Math.ceil(Math.max(...data.map(({ value }) => value)) / 20) * 20
  const barWidth = chart.width / data.length - 16

  return (
    <section className="panel analytics-chart-panel">
      <div className="panel__header">
        <div><div className="panel__eyebrow">{eyebrow}</div><h2>{title}</h2></div>
        <span className="chart-unit">{unit}</span>
      </div>
      <svg viewBox="0 0 470 220" className="analytics-chart" role="img" aria-label={title}>
        {[0, 0.5, 1].map((ratio) => {
          const y = chart.top + chart.height * ratio
          return <line key={ratio} className="chart__grid-line" x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} />
        })}
        {data.map(({ label, value }, index) => {
          const height = (value / maxValue) * chart.height
          const x = chart.left + index * (chart.width / data.length) + 8
          const y = chart.top + chart.height - height
          return <g key={label}><rect className="bar-chart__bar" x={x} y={y} width={barWidth} height={height} rx="3"><title>{`${label}: ${value} ${unit}`}</title></rect><text className="chart__axis-label chart__axis-label--x" x={x + barWidth / 2} y="204">{label}</text><text className="bar-chart__value" x={x + barWidth / 2} y={y - 7}>{value}</text></g>
        })}
      </svg>
    </section>
  )
}

function DonutChart({ data, title, eyebrow }) {
  const radius = 62
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="panel analytics-chart-panel">
      <div className="panel__header"><div><div className="panel__eyebrow">{eyebrow}</div><h2>{title}</h2></div></div>
      <div className="donut-chart-layout">
        <div className="donut-chart" role="img" aria-label={title}>
          <svg viewBox="0 0 180 180">
            <circle className="donut-chart__track" cx="90" cy="90" r={radius} />
            {data.map(({ label, value, color }, index) => {
              const segment = (value / total) * circumference
              const offset = data.slice(0, index).reduce((sum, item) => sum + (item.value / total) * circumference, 0)
              return <circle key={label} className="donut-chart__segment" cx="90" cy="90" r={radius} stroke={color} strokeDasharray={`${segment} ${circumference - segment}`} strokeDashoffset={-offset} />
            })}
          </svg>
          <div className="donut-chart__center"><strong>{total}%</strong><span>utilization</span></div>
        </div>
        <div className="chart-legend">{data.map(({ label, value, color }) => <div className="chart-legend__item" key={label}><span className="chart-legend__swatch" style={{ backgroundColor: color }} /><span>{label}</span><strong>{value}%</strong></div>)}</div>
      </div>
    </section>
  )
}

export { BarChart, DonutChart }