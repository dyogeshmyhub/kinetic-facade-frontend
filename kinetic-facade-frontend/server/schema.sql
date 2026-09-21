CREATE TABLE IF NOT EXISTS system_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  status VARCHAR(20) NOT NULL DEFAULT 'Running',
  active_step INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS motors (
  id INTEGER PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL,
  speed INTEGER NOT NULL CHECK (speed BETWEEN 0 AND 100),
  temperature INTEGER NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alarms (
  id SERIAL PRIMARY KEY,
  event_time VARCHAR(10) NOT NULL,
  level VARCHAR(20) NOT NULL,
  message VARCHAR(200) NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_code_hash TEXT,
  verification_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO system_state (id, status, active_step)
VALUES (1, 'Running', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO motors (id, name, status, speed, temperature)
VALUES
  (1, 'Motor A', 'Running', 78, 56),
  (2, 'Motor B', 'Idle', 34, 42),
  (3, 'Motor C', 'Running', 62, 51),
  (4, 'Motor D', 'Standby', 18, 39)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alarms (event_time, level, message, resolved)
SELECT * FROM (VALUES
  ('08:42', 'Critical', 'Motor B overload', TRUE),
  ('09:18', 'Warning', 'Sensor drift detected', TRUE),
  ('11:05', 'Info', 'Sequence resumed', TRUE),
  ('13:42', 'Warning', 'Wind load spike', FALSE),
  ('15:10', 'Critical', 'Safety lock check required', FALSE),
  ('16:40', 'Info', 'Power stable after transfer', TRUE),
  ('17:52', 'Warning', 'Maintenance review due', FALSE),
  ('18:12', 'Info', 'Manual override enabled', TRUE),
  ('19:00', 'Warning', 'Load imbalance', FALSE),
  ('19:48', 'Critical', 'Emergency stop cleared', TRUE),
  ('20:15', 'Info', 'Night cycle initialized', TRUE),
  ('21:07', 'Warning', 'Cooling fan review', FALSE)
) AS seed(event_time, level, message, resolved)
WHERE NOT EXISTS (SELECT 1 FROM alarms);
