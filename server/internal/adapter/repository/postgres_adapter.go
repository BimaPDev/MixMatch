package repository

import (
	"context"

	"github.com/BimaPDev/MixMatch/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// PostgresAdapter implements port.ClothingRepository
type PostgresAdapter struct {
	q *Queries // This comes from the generated sqlc code
}

func NewPostgresAdapter(db *pgxpool.Pool) *PostgresAdapter {
	return &PostgresAdapter{
		q: New(db), // "New" is the function sqlc generated in db.go
	}
}

// CreateItem converts Domain -> DB
func (a *PostgresAdapter) CreateItem(ctx context.Context, item *domain.ClothingItem) error {
	params := CreateClothingItemParams{
		ID:               item.ID,
		UserID:           item.UserID, // Ensure UserID types match (UUID)
		ImageUrl:         item.ImageURL,
		Category:         item.Category,
		ProcessingStatus: item.ProcessingStatus,
	}

	// Call the generated sqlc method
	_, err := a.q.CreateClothingItem(ctx, params)
	return err
}

// ListItemsByUser converts DB -> Domain
func (a *PostgresAdapter) ListItemsByUser(ctx context.Context, userID uuid.UUID) ([]*domain.ClothingItem, error) {
	// 1. Get data from DB
	dbItems, err := a.q.ListClothingByUser(ctx, userID) // Assuming you have this query
	if err != nil {
		return nil, err
	}

	// 2. Map DB Structs -> Domain Structs
	domainItems := make([]*domain.ClothingItem, len(dbItems))
	for i, dbItem := range dbItems {
		domainItems[i] = &domain.ClothingItem{
			ID:               dbItem.ID,
			UserID:           dbItem.UserID,
			ImageURL:         dbItem.ImageUrl,
			Category:         dbItem.Category,
			ProcessingStatus: dbItem.ProcessingStatus,
			CreatedAt:        dbItem.CreatedAt.Time,
		}
	}

	return domainItems, nil
}

// GetItem retrieves a single item by ID
func (a *PostgresAdapter) GetItem(ctx context.Context, id uuid.UUID) (*domain.ClothingItem, error) {
	// 1. Call the generated sqlc query
	dbItem, err := a.q.GetClothingItem(ctx, id)
	if err != nil {
		return nil, err
	}

	// 2. Map DB Result -> Domain Object
	return &domain.ClothingItem{
		ID:               dbItem.ID,
		UserID:           dbItem.UserID,
		ImageURL:         dbItem.ImageUrl, // Note: Check if sqlc generated ImageUrl or ImageURL
		Category:         dbItem.Category,
		ProcessingStatus: dbItem.ProcessingStatus,
		CreatedAt:        dbItem.CreatedAt.Time,
	}, nil
}
