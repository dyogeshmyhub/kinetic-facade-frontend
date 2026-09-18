import { navItems } from '../data/dashboardData'
import { Activity, Bell, ChevronLeft, ChevronRight, FileBarChart, Gauge, Layers3, Settings, Waves } from 'lucide-react'

const navIcons = {
  Overview: Activity,
  Motors: Gauge,
  Sequences: Layers3,
  Alarms: Bell,
  Reports: FileBarChart,
  Settings,
}

function Sidebar({ activeItem, onNavigate, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark"><Waves size={18} /></div>
        <div className="sidebar__brand-copy"><strong>Kinetic Facade</strong><span>Control System</span></div>
      </div>
      <div className="sidebar__label">Workspace</div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className={`sidebar__item ${activeItem === item ? 'sidebar__item--active' : ''}`}
            onClick={() => onNavigate(item)}
            aria-current={activeItem === item ? 'page' : undefined}
          >
            {(() => { const Icon = navIcons[item]; return <Icon size={17} strokeWidth={1.8} /> })()}
            <span className="sidebar__item-label">{item}</span>
            {item === 'Alarms' && <span className="sidebar__count">05</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar__card">
        <div className="sidebar__card-label">Data retention</div>
        <div className="sidebar__card-value">12 <small>months</small></div>
        <div className="sidebar__card-text">Audit enabled</div>
      </div>
      <button className="sidebar__collapse" type="button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}

export default Sidebar
