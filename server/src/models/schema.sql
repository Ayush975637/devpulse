-- server/src/db/schema.sql
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  github_id   INTEGER UNIQUE NOT NULL,
  username    VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(200),
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS snapshots (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_stars   INTEGER DEFAULT 0,
  top_languages JSONB,
  commits_by_day JSONB,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

CREATE TABLE IF NOT EXISTS repositories (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  github_id   INTEGER NOT NULL,
  name        VARCHAR(200) NOT NULL,
  language    VARCHAR(100),
  stars       INTEGER DEFAULT 0,
  forks       INTEGER DEFAULT 0,
  updated_at  TIMESTAMP,
  UNIQUE(user_id, github_id)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_user_date ON snapshots(user_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_repos_user_id ON repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);