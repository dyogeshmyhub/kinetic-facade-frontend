const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error || `API request failed with ${response.status}`)
  }
  return response.json()
}

export function loadDashboard() {
  return request('/dashboard')
}

export function runSystemAction(action) {
  return request('/system/action', { method: 'POST', body: JSON.stringify({ action }) })
}

export function updateMotor(id, speed) {
  return request(`/motors/${id}`, { method: 'PATCH', body: JSON.stringify({ speed }) })
}

export function syncMotors() {
  return request('/motors/sync', { method: 'POST' })
}

export function acknowledgeAlarm(id) {
  return request(`/alarms/${id}/acknowledge`, { method: 'POST' })
}

export function runSequence() {
  return request('/sequences/run', { method: 'POST' })
}
