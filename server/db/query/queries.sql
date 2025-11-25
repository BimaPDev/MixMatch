-- name: CreateItem :one
INSERT INTO items (id, user_id, image_url, category, color, confidence) 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING *;