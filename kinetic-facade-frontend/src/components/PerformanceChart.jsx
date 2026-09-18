import { chartData } from '../data/dashboardData'

function PerformanceChart() {
  const maxValue = 100
  const points = chartData
    .map((value, index) => {
      const x = (index / (chartData.length - 1)) * 100
      const y = 100 - (value / maxValue) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="panel panel--chart">
      <div className="panel__header">
        <div>
          <div className="panel__eyebrow">Performance</div>
          <h2>Power Flow</h2>
        </div>
        <div className="panel__delta">+12.8%</div>
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="chart"
        aria-label="Power flow chart"
      >
        <defs>
          <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#55b9c7" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#55b9c7" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path className="chart__area" d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#lineFill)" opacity="1" />
        <polyline
          className="chart__line"
          points={points}
          fill="none"
          stroke="#16839d"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </section>
  )
}

export default PerformanceChart
