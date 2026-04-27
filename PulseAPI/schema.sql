CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_segments (
  segment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  criteria TEXT,
  created_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE campaigns (
  campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  channel TEXT,
  start_date TEXT,
  end_date TEXT,
  owner_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE analytics_reports (
  report_id INTEGER PRIMARY KEY AUTOINCREMENT,
  campaign_id INTEGER REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
  segment_id INTEGER REFERENCES customer_segments(segment_id) ON DELETE CASCADE,
  metrics_data TEXT NOT NULL,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_conversations (
  conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
