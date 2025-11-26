package port

import (
	"context"

	"github.com/google/uuid"
	"github.com/BimaPDev/MixMatch/internal/core/domain"
)

// RepositoryPort: Defines what the Service needs from the Database
// Notice we use domain.ClothingItem, not the sqlc struct!
type ClothingRepository interface {
	CreateItem(ctx context.Context, item *domain.ClothingItem) error
	GetItem(ctx context.Context, id uuid.UUID) (*domain.ClothingItem, error)
	ListItemsByUser(ctx context.Context, userID uuid.UUID) ([]*domain.ClothingItem, error)
}

// QueuePort: Defines what the Service needs from RabbitMQ
type AIQueue interface {
	PublishImageJob(ctx context.Context, imageID uuid.UUID, imageURL string) error
}
