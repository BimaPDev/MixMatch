-- name: CreateShareLink :one
INSERT INTO shared_wardrobes (user_id, slug, expires_at)
VALUES ($1, $2, $3) -- Changed from NOW()... to $3 so Go can control it
RETURNING *;

-- name: GetUserBySlug :one
SELECT user_id FROM shared_wardrobes
WHERE slug = $1 AND expires_at > NOW();