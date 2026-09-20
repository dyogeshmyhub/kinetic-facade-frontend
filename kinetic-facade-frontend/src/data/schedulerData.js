export const schedules = [
  { id: 1, name: 'Morning open', time: '08:00', days: 'Mon-Fri', action: 'Open facade', position: '100%', speed: '65%', enabled: true, next: 'Tomorrow, 08:00' },
  { id: 2, name: 'Midday shading', time: '12:00', days: 'Every day', action: 'Set facade', position: '50%', speed: '45%', enabled: true, next: 'Today, 12:00' },
  { id: 3, name: 'Evening close', time: '17:30', days: 'Every day', action: 'Close facade', position: '20%', speed: '55%', enabled: true, next: 'Today, 17:30' },
  { id: 4, name: 'Night mode', time: '20:00', days: 'Every day', action: 'Night mode', position: '20%', speed: '35%', enabled: false, next: 'Paused' },
]
