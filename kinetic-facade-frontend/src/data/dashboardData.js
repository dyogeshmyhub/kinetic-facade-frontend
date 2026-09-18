export const navItems = ['Overview', 'Motors', 'Sequences', 'Alarms', 'Reports', 'Settings']

export const metrics = [
  { label: 'System Status', value: 'Online', trend: '+2.4% vs yesterday' },
  { label: 'Active Motors', value: '12', trend: '3 operating at peak' },
  { label: 'Current Sequence', value: 'A-01', trend: 'Cycle 18 of 24' },
  { label: 'Cycle Time', value: '00:42', trend: 'Stable performance' },
]

export const chartData = [42, 55, 50, 63, 68, 90, 86, 94, 88, 72, 76, 83]

export const alarmHistory = [
  { time: '08:42', level: 'Critical', message: 'Motor B overload', resolved: true },
  { time: '09:18', level: 'Warning', message: 'Sensor drift detected', resolved: true },
  { time: '11:05', level: 'Info', message: 'Sequence resumed', resolved: true },
  { time: '13:42', level: 'Warning', message: 'Wind load spike', resolved: false },
  { time: '15:10', level: 'Critical', message: 'Safety lock check required', resolved: false },
  { time: '16:40', level: 'Info', message: 'Power stable after transfer', resolved: true },
  { time: '17:52', level: 'Warning', message: 'Maintenance review due', resolved: false },
  { time: '18:12', level: 'Info', message: 'Manual override enabled', resolved: true },
  { time: '19:00', level: 'Warning', message: 'Load imbalance', resolved: false },
  { time: '19:48', level: 'Critical', message: 'Emergency stop cleared', resolved: true },
  { time: '20:15', level: 'Info', message: 'Night cycle initialized', resolved: true },
  { time: '21:07', level: 'Warning', message: 'Cooling fan review', resolved: false },
]

export const summaryCards = [
  { label: 'Facade Opening', value: '84%', trend: '+6% last hour', tone: 'up' },
  { label: 'Wind Load', value: '14.7 m/s', trend: 'Within threshold', tone: 'neutral' },
  { label: 'Safety Index', value: '99.2%', trend: 'Nominal', tone: 'up' },
  { label: 'Peak Demand', value: '162 kW', trend: '-4.1% from peak', tone: 'down' },
]

export const steps = [
  'Initialize facade frame',
  'Tension alignment check',
  'Start motor sequence',
  'Validate safety locks',
  'Complete cycle and report',
]

export const motors = [
  { id: 1, name: 'Motor A', status: 'Running', speed: 78, temp: 56 },
  { id: 2, name: 'Motor B', status: 'Idle', speed: 34, temp: 42 },
  { id: 3, name: 'Motor C', status: 'Running', speed: 62, temp: 51 },
  { id: 4, name: 'Motor D', status: 'Standby', speed: 18, temp: 39 },
]

export const healthItems = [
  { label: 'Power', value: '94.8%', color: '#16805f' },
  { label: 'Network', value: 'Stable', color: '#16839d' },
  { label: 'Load', value: '81%', color: '#c98512' },
]
