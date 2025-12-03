-- name: CreateTrip :one
INSERT INTO trips (id, user_id, name, start_date, end_date)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListTrips :many
SELECT * FROM trips WHERE user_id = $1;