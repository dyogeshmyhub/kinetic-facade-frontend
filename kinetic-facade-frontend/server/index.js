/* global process, Buffer */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import nodemailer from 'nodemailer'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { Pool } = pg
const app = express()
const port = Number(process.env.API_PORT || 4000)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sessions = new Map()
const localUsers = new Map()
let nextLocalUserId = 1
let databaseAvailable = true

const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
])
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }))
app.use(express.json())

async function query(text, params) {
  return pool.query(text, params)
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function passwordsMatch(password, storedHash) {
  const [salt, expected] = storedHash.split(':')
  const actual = crypto.scryptSync(password, salt, 64).toString('hex')
  return expected && crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))
}

function createVerificationCode() {
  return String(crypto.randomInt(100000, 1000000))
}

function hashVerificationCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex')
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { userId, expiresAt: Date.now() + 8 * 60 * 60 * 1000 })
  return token
}

function getSessionUserId(request) {
  const token = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice(7)
    : null
  const session = token && sessions.get(token)
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token)
    return null
  }
  return session.userId
}

function publicUser(user) {
  return { id: user.id, fullName: user.full_name, email: user.email, emailVerified: user.email_verified }
}

async function sendVerificationEmail(email, fullName, code) {
  const smtpFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM']
  if (!smtpFields.every((field) => process.env[field])) return false
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Kinetic Facade email verification',
    text: `Hello ${fullName}, your Kinetic Facade verification code is ${code}. It expires in 10 minutes.`,
  })
  return true
}

async function initializeDatabase() {
  const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf8')
  await query(schema)
}

app.get('/api/health', async (_request, response) => {
  try {
    await query('SELECT 1')
    response.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    response.status(503).json({ status: 'degraded', database: 'unavailable', message: error.message })
  }
})

app.post('/api/auth/register', async (request, response) => {
  const fullName = String(request.body.fullName || '').trim()
  const email = String(request.body.email || '').trim().toLowerCase()
  const password = String(request.body.password || '')
  if (fullName.length < 2 || fullName.length > 120) return response.status(400).json({ error: 'Please enter your full name.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ error: 'Please enter a valid email address.' })
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return response.status(400).json({ error: 'Password must be at least 8 characters and include a number.' })

  if (!databaseAvailable) {
    if ([...localUsers.values()].some((user) => user.email === email)) return response.status(409).json({ error: 'An account already exists. Please log in.' })
    const user = { id: nextLocalUserId++, full_name: fullName, email, password_hash: hashPassword(password), email_verified: true }
    localUsers.set(user.id, user)
    return response.status(201).json({ message: 'Account created successfully. You can now log in.', user: publicUser(user) })
  }

  try {
    const existing = await query('SELECT id, email_verified FROM users WHERE email = $1', [email])
    if (existing.rowCount) return response.status(409).json({ error: 'An account already exists. Please log in.' })
    const result = await query('INSERT INTO users (full_name, email, password_hash, email_verified, verification_code_hash, verification_expires_at) VALUES ($1, $2, $3, TRUE, NULL, NULL) RETURNING id, full_name, email, email_verified', [fullName, email, hashPassword(password)])
    response.status(201).json({ message: 'Account created successfully. You can now log in.', user: publicUser(result.rows[0]) })
  } catch (error) {
    response.status(503).json({ error: 'Registration is temporarily unavailable.', message: error.message })
  }
})

app.post('/api/auth/verify', async (request, response) => {
  const email = String(request.body.email || '').trim().toLowerCase()
  if (!email) return response.status(400).json({ error: 'Please provide an email address.' })
  const user = !databaseAvailable
    ? [...localUsers.values()].find((item) => item.email === email)
    : null
  if (user) return response.json({ message: 'Email verification is not required. You can log in immediately.', user: publicUser(user) })

  try {
    const result = await query('SELECT id, full_name, email, email_verified FROM users WHERE email = $1', [email])
    if (!result.rowCount) return response.status(404).json({ error: 'Please register first.' })
    response.json({ message: 'Email verification is not required. You can log in immediately.', user: publicUser(result.rows[0]) })
  } catch (error) {
    response.status(503).json({ error: 'Verification is temporarily unavailable.', message: error.message })
  }
})

app.post('/api/auth/login', async (request, response) => {
  const email = String(request.body.email || '').trim().toLowerCase()
  const password = String(request.body.password || '')
  if (!databaseAvailable) {
    const user = [...localUsers.values()].find((item) => item.email === email)
    if (!user) return response.status(401).json({ error: 'Please register first, then log in.' })
    if (!passwordsMatch(password, user.password_hash)) return response.status(401).json({ error: 'Incorrect email or password.' })
    return response.json({ token: createSession(user.id), user: publicUser(user) })
  }
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email])
    if (!result.rowCount) return response.status(401).json({ error: 'Please register first, then log in.' })
    const user = result.rows[0]
    if (!passwordsMatch(password, user.password_hash)) return response.status(401).json({ error: 'Incorrect email or password.' })
    response.json({ token: createSession(user.id), user: publicUser(user) })
  } catch (error) {
    response.status(503).json({ error: 'Login is temporarily unavailable.', message: error.message })
  }
})

app.get('/api/auth/me', async (request, response) => {
  const userId = getSessionUserId(request)
  if (!userId) return response.status(401).json({ error: 'Your session has expired. Please log in again.' })
  if (!databaseAvailable) {
    const user = localUsers.get(userId)
    return user ? response.json({ user: publicUser(user) }) : response.status(401).json({ error: 'Please log in again.' })
  }
  try {
    const result = await query('SELECT id, full_name, email, email_verified FROM users WHERE id = $1', [userId])
    if (!result.rowCount) return response.status(401).json({ error: 'Please log in again.' })
    response.json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    response.status(503).json({ error: 'Profile is temporarily unavailable.', message: error.message })
  }
})

app.patch('/api/auth/profile', async (request, response) => {
  const userId = getSessionUserId(request)
  if (!userId) return response.status(401).json({ error: 'Your session has expired. Please log in again.' })
  const fullName = String(request.body.fullName || '').trim()
  if (fullName.length < 2 || fullName.length > 120) return response.status(400).json({ error: 'Please enter a valid full name.' })
  if (!databaseAvailable) {
    const user = localUsers.get(userId)
    if (!user) return response.status(401).json({ error: 'Please log in again.' })
    user.full_name = fullName
    return response.json({ user: publicUser(user) })
  }
  try {
    const result = await query('UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, full_name, email, email_verified', [fullName, userId])
    response.json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    response.status(503).json({ error: 'Profile update failed.', message: error.message })
  }
})

app.post('/api/auth/logout', (request, response) => {
  const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : null
  if (token) sessions.delete(token)
  response.json({ message: 'Logged out successfully.' })
})

app.get('/api/dashboard', async (_request, response) => {
  try {
    const [system, motorResult, alarmResult] = await Promise.all([
      query('SELECT status, active_step FROM system_state WHERE id = 1'),
      query('SELECT id, name, status, speed, temperature AS temp FROM motors ORDER BY id'),
      query('SELECT id, event_time AS time, level, message, resolved FROM alarms ORDER BY id DESC'),
    ])
    response.json({ system: system.rows[0], motors: motorResult.rows, alarms: alarmResult.rows })
  } catch (error) {
    response.status(503).json({ error: 'Dashboard data unavailable', message: error.message })
  }
})

app.post('/api/system/action', async (request, response) => {
  const { action } = request.body
  const nextStatus = { start: 'Running', stop: 'Stopped', reset: 'Standby' }[action]
  if (!nextStatus) return response.status(400).json({ error: 'Action must be start, stop, or reset' })

  try {
    const result = await query(
      'UPDATE system_state SET status = $1, active_step = CASE WHEN $1 = \'Standby\' THEN 0 ELSE active_step END, updated_at = NOW() WHERE id = 1 RETURNING status, active_step',
      [nextStatus],
    )
    response.json(result.rows[0])
  } catch (error) {
    response.status(503).json({ error: 'System action failed', message: error.message })
  }
})

app.patch('/api/motors/:id', async (request, response) => {
  const speed = Number(request.body.speed)
  const id = Number(request.params.id)
  if (!Number.isInteger(id) || !Number.isInteger(speed) || speed < 0 || speed > 100) {
    return response.status(400).json({ error: 'Motor id and speed 0-100 are required' })
  }

  try {
    const result = await query(
      'UPDATE motors SET speed = $1, status = CASE WHEN $1 = 0 THEN \'Idle\' ELSE \'Running\' END, updated_at = NOW() WHERE id = $2 RETURNING id, name, status, speed, temperature AS temp',
      [speed, id],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'Motor not found' })
    response.json(result.rows[0])
  } catch (error) {
    response.status(503).json({ error: 'Motor update failed', message: error.message })
  }
})

app.post('/api/motors/sync', async (_request, response) => {
  try {
    const result = await query('SELECT id, name, status, speed, temperature AS temp FROM motors ORDER BY id')
    response.json({ motors: result.rows, syncedAt: new Date().toISOString() })
  } catch (error) {
    response.status(503).json({ error: 'Motor sync failed', message: error.message })
  }
})

app.post('/api/alarms/:id/acknowledge', async (request, response) => {
  try {
    const result = await query(
      'UPDATE alarms SET resolved = TRUE WHERE id = $1 RETURNING id, event_time AS time, level, message, resolved',
      [Number(request.params.id)],
    )
    if (!result.rowCount) return response.status(404).json({ error: 'Alarm not found' })
    response.json(result.rows[0])
  } catch (error) {
    response.status(503).json({ error: 'Alarm acknowledgement failed', message: error.message })
  }
})

app.post('/api/sequences/run', async (_request, response) => {
  try {
    const result = await query(
      'UPDATE system_state SET active_step = (active_step + 1) % 5, updated_at = NOW() WHERE id = 1 RETURNING status, active_step',
    )
    response.json({ ...result.rows[0], running: true })
  } catch (error) {
    response.status(503).json({ error: 'Sequence command failed', message: error.message })
  }
})

app.use((error, _request, response, next) => {
  void next
  console.error(error)
  response.status(500).json({ error: 'Unexpected server error' })
})

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`API server listening on http://localhost:${port}`)))
  .catch((error) => {
    databaseAvailable = false
    console.warn(`PostgreSQL unavailable: ${error.message}`)
    console.warn('API is running in degraded mode. Start PostgreSQL to enable persistence.')
    app.listen(port, () => console.log(`API degraded mode listening on http://localhost:${port}`))
  })
