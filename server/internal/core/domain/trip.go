package domain

import (
	"time"

	"github.com/google/uuid"
)

type Trip struct {
	ID uuid.UUID `json:"id"`
	UserID uuid.UUID `json:"user_id"`
	Name string    `json:"name"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	CreatedAt time.Time `json:"create_at"`
}