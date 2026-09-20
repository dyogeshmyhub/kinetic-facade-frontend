export const automationModes = ['Manual', 'Automatic', 'Energy Saving', 'Weather Protection', 'Scheduled']

export const automationState = {
  mode: 'Automatic',
  condition: 'High sunlight detected',
  position: 62,
  rule: 'Increase shading toward 62% closed',
  lastAction: 'Simulated shading adjustment at 14:02',
}

export const automationLog = [
  { time: '14:02', event: 'High sunlight detected', action: 'Simulated shading adjustment', result: 'Position target 62%' },
  { time: '12:00', event: 'Scheduled midday profile', action: 'Simulated facade set', result: 'Position target 50%' },
  { time: '08:00', event: 'Morning light rising', action: 'Simulated facade opening', result: 'Position target 100%' },
  { time: '06:10', event: 'Night cycle complete', action: 'Simulated night position', result: 'Position target 20%' },
]
