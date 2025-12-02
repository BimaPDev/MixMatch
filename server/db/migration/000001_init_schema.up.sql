CREATE TABLE users (
  id           UUID PRIMARY KEY,
  email        VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
  id           UUID PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url    VARCHAR NOT NULL,
  category     VARCHAR NOT NULL DEFAULT '',
  color        VARCHAR NOT NULL DEFAULT '',
  confidence   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  processed_image_url VARCHAR DEFAULT '',
  
  -- This is the column sqlc was complaining about:
  processing_status VARCHAR NOT NULL DEFAULT 'pending',
  
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shared_wardrobes (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    slug VARCHAR(10) NOT NULL UNIQUE, -- The short code e.g. "xY8z2A"
    expires_at TIMESTAMPTZ,           -- Optional: Link dies after 24 hours
    created_at TIMESTAMPTZ DEFAULT NOW()
);