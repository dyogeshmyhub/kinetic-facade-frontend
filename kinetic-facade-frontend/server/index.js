/* global process */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pg from 'pg'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { Pool } = pg
const app = express()
const port = Number(process.env.API_PORT || 4000)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

async function query(text, params) {
  return pool.query(text, params)
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
    console.warn(`PostgreSQL unavailable: ${error.message}`)
    console.warn('API is running in degraded mode. Start PostgreSQL to enable persistence.')
    app.listen(port, () => console.log(`API degraded mode listening on http://localhost:${port}`))
  })
