export const navItems = ['Overview', 'Motors', 'Sequences', 'Automation', 'Scheduler', 'Environment', 'Devices', 'Alarms', 'Reports', 'Settings']

export const metrics = [
  { label: 'System Status', value: 'Online', trend: '+2.4% vs yesterday' },
  { label: 'Active Motors', value: '12', trend: '3 operating at peak' },
  { label: 'Current Sequence', value: 'A-01', trend: 'Cycle 18 of 24' },
  { label: 'Cycle Time', value: '00:42', trend: 'Stable performance' },
]

export const powerFlowData = [
  { label: '06:00', value: 112 },
  { label: '08:00', value: 128 },
  { label: '10:00', value: 121 },
  { label: '12:00', value: 143 },
  { label: '14:00', value: 151 },
  { label: '16:00', value: 166 },
  { label: '18:00', value: 159 },
  { label: '20:00', value: 174 },
  { label: '22:00', value: 168 },
  { label: '00:00', value: 146 },
  { label: '02:00', value: 151 },
  { label: '04:00', value: 158 },
]

export const energyByMonth = [
  { label: 'Apr', value: 118 },
  { label: 'May', value: 126 },
  { label: 'Jun', value: 121 },
  { label: 'Jul', value: 139 },
  { label: 'Aug', value: 132 },
  { label: 'Sep', value: 148 },
]

export const operatingMix = [
  { label: 'Active movement', value: 54, color: '#16805f' },
  { label: 'Standby', value: 28, color: '#16839d' },
  { label: 'Maintenance', value: 12, color: '#c98512' },
  { label: 'Offline', value: 6, color: '#c44949' },
]

export const chartData = powerFlowData.map(({ value }) => value)

export const alarmHistory = [
  { time: '08:42', level: 'Critical', message: 'Motor B overload at Orion Components Factory', resolved: true },
  { time: '09:18', level: 'Warning', message: 'Anomaly: sensor drift at Genome Valley Assembly', resolved: true },
  { time: '11:05', level: 'Info', message: 'Sequence resumed', resolved: true },
  { time: '13:42', level: 'Warning', message: 'Wind load spike', resolved: false },
  { time: '15:10', level: 'Critical', message: 'Safety lock check required', resolved: false },
  { time: '16:40', level: 'Info', message: 'Power stable after transfer', resolved: true },
  { time: '17:52', level: 'Warning', message: 'Maintenance review due at Medchal Automation Plant', resolved: false },
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
  { id: 1, name: 'Motor A', motorType: 'Industrial', status: 'Running', health: 'Normal', anomalyStatus: 'Normal', anomalyDetail: 'No anomaly detected', position: 72, speed: 78, temp: 56, site: 'Orion Components Factory', building: 'Orion Components Factory', block: 'A', floor: 3, facade: 'East', panel: 'E-01', latitude: 17.4218, longitude: 78.3792 },
  { id: 2, name: 'Motor B', motorType: 'Industrial', status: 'Idle', health: 'Warning', anomalyStatus: 'Warning', anomalyDetail: 'Load imbalance detected', position: 48, speed: 34, temp: 42, site: 'Genome Valley Assembly', building: 'Genome Valley Assembly', block: 'A', floor: 4, facade: 'South', panel: 'S-02', latitude: 17.5295, longitude: 78.3731 },
  { id: 3, name: 'Motor C', motorType: 'Residential', status: 'Running', health: 'Normal', anomalyStatus: 'Normal', anomalyDetail: 'No anomaly detected', position: 88, speed: 62, temp: 51, site: 'Lakeview Residential Complex', building: 'Lakeview Residential Complex', block: 'B', floor: 6, facade: 'West', panel: 'W-03', latitude: 17.4487, longitude: 78.3905 },
  { id: 4, name: 'Motor D', motorType: 'Industrial', status: 'Standby', health: 'Critical', anomalyStatus: 'Critical', anomalyDetail: 'Temperature anomaly detected', position: 20, speed: 18, temp: 68, site: 'Medchal Automation Plant', building: 'Medchal Automation Plant', block: 'B', floor: 2, facade: 'North', panel: 'N-04', latitude: 17.6291, longitude: 78.4817 },
]

export const healthItems = [
  { label: 'Power', value: '94.8%', color: '#16805f' },
  { label: 'Network', value: 'Stable', color: '#16839d' },
  { label: 'Load', value: '81%', color: '#c98512' },
]
