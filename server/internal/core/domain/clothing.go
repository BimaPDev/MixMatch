package domain

import (
	"time"

	"github.com/google/uuid"
)

type ClothingItem struct {
	ID                uuid.UUID `json:"id"`
	UserID            uuid.UUID `json:"user_id"`
	ImageURL          string    `json:"image_url"`
	ProcessedImageURL string    `json:"processed_image_url"`
	Category          string    `json:"category"`          // e.g. "top", "bottom"
	ProcessingStatus  string    `json:"processing_status"` // "pending", "completed", "failed"
	CreatedAt         time.Time `json:"created_at"`
}
