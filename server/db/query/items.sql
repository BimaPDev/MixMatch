-- name: ListItems :many
SELECT * FROM items
ORDER BY created_at DESC
LIMIT 20;

-- name: ListItemsByCategory :many
SELECT * FROM items
WHERE category = $1
ORDER BY created_at DESC;