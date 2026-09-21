const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(path, options = {}, token) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...options,
    })
  } catch {
    throw new Error('Authentication service is offline. Start the API with npm.cmd run server, then try again.')
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || `Request failed with ${response.status}`)
  return body
}

export function registerUser(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function verifyEmail(email, code) {
  return request('/auth/verify', { method: 'POST', body: JSON.stringify({ email, code }) })
}

export function loginUser(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function loadCurrentUser(token) {
  return request('/auth/me', {}, token)
}

export function updateProfile(token, fullName) {
  return request('/auth/profile', { method: 'PATCH', body: JSON.stringify({ fullName }) }, token)
}

export function logoutUser(token) {
  return request('/auth/logout', { method: 'POST' }, token)
}
