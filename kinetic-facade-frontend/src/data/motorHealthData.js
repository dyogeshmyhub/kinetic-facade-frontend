export const motorHealth = [
  { id: 'Motor 01', position: 72, speed: 65, direction: 'Opening', current: 1.8, voltage: 24.1, temperature: 42, runtime: '86 h', cycles: 1240, faults: 0, health: 'Normal', maintenance: 'No maintenance required' },
  { id: 'Motor 02', position: 48, speed: 34, direction: 'Holding', current: 1.2, voltage: 24.0, temperature: 45, runtime: '91 h', cycles: 1380, faults: 1, health: 'Warning', maintenance: 'Maintenance approaching' },
  { id: 'Motor 03', position: 88, speed: 62, direction: 'Opening', current: 1.7, voltage: 24.2, temperature: 41, runtime: '79 h', cycles: 1102, faults: 0, health: 'Normal', maintenance: 'No maintenance required' },
  { id: 'Motor 04', position: 20, speed: 18, direction: 'Closing', current: 2.6, voltage: 23.7, temperature: 68, runtime: '104 h', cycles: 1688, faults: 4, health: 'Critical', maintenance: 'Maintenance required' },
]

export const motorHealthTrend = [
  { label: 'Mon', value: 96 }, { label: 'Tue', value: 94 }, { label: 'Wed', value: 91 },
  { label: 'Thu', value: 89 }, { label: 'Fri', value: 92 }, { label: 'Sat', value: 95 }, { label: 'Sun', value: 93 },
]
