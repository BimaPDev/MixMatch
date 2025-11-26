-- name: CreateClothingItem :one
INSERT INTO items (
  id, user_id, image_url, category, processing_status
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetClothingItem :one
SELECT * FROM items
WHERE id = $1 LIMIT 1;

-- name: UpdateClothingStatus :exec
UPDATE items
SET processing_status = $2
WHERE id = $1;

-- name: ListClothingByUser :many
SELECT * FROM items
WHERE user_id = $1
ORDER BY created_at DESC;