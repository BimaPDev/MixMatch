CREATE TABLE users (
  id           UUID PRIMARY KEY,
  email        VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
  id           UUID PRIMARY KEY,
  user_id      VARCHAR NOT NULL,
  image_url    VARCHAR NOT NULL,
  category     VARCHAR NOT NULL DEFAULT '',
  color        VARCHAR NOT NULL DEFAULT '',
  confidence   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);