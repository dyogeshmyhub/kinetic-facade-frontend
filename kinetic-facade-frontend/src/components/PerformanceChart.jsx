import { powerFlowData } from '../data/dashboardData'

function PerformanceChart() {
  const plot = { left: 42, top: 18, width: 530, height: 156 }
  const minValue = 90
  const maxValue = 180
  const points = powerFlowData.map(({ value }, index) => {
    const x = plot.left + (index / (powerFlowData.length - 1)) * plot.width
    const y = plot.top + plot.height - ((value - minValue) / (maxValue - minValue)) * plot.height
    return { x, y, value }
  })
  const pointString = points.map(({ x, y }) => `${x},${y}`).join(' ')
  const areaPath = `M ${points[0].x} ${plot.top + plot.height} L ${pointString} L ${points[points.length - 1].x} ${plot.top + plot.height} Z`
  const yTicks = [90, 120, 150, 180]

  return (
    <section className="panel panel--chart">
      <div className="panel__header">
        <div>
          <div className="panel__eyebrow">Performance / last 24 hours</div>
          <h2>Power Flow</h2>
        </div>
        <div className="panel__delta">+12.8%</div>
      </div>

      <svg viewBox="0 0 600 220" className="chart" role="img" aria-label="Power flow over the last 24 hours, measured in kilowatts">
        <defs>
          <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#55b9c7" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#55b9c7" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        {yTicks.map((tick) => {
          const y = plot.top + plot.height - ((tick - minValue) / (maxValue - minValue)) * plot.height
          return <g key={tick}><line className="chart__grid-line" x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} /><text className="chart__axis-label" x="4" y={y + 4}>{tick}</text></g>
        })}
        <path className="chart__area" d={areaPath} fill="url(#lineFill)" />
        <polyline className="chart__line" points={pointString} fill="none" stroke="#16839d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map(({ x, y, value }, index) => <circle key={powerFlowData[index].label} className="chart__point" cx={x} cy={y} r="3.5"><title>{`${powerFlowData[index].label}: ${value} kW`}</title></circle>)}
        {powerFlowData.map(({ label }, index) => index % 2 === 0 && <text key={label} className="chart__axis-label chart__axis-label--x" x={points[index].x} y="204">{label}</text>)}
        <text className="chart__unit-label" x="570" y="14">kW</text>
      </svg>
    </section>
  )
}

export default PerformanceChart
