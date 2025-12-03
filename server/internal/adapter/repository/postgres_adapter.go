package repository

import (
	"context"
	"time"

	"github.com/BimaPDev/MixMatch/internal/core/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
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
			ID:                dbItem.ID,
			UserID:            dbItem.UserID,
			ImageURL:          dbItem.ImageUrl,
			ProcessedImageURL: dbItem.ProcessedImageUrl.String,
			Category:          dbItem.Category,
			ProcessingStatus:  dbItem.ProcessingStatus,
			CreatedAt:         dbItem.CreatedAt,
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
		CreatedAt:        dbItem.CreatedAt,
	}, nil
}

func (a *PostgresAdapter) CreateUser(ctx context.Context, user *domain.User) (*domain.User, error) {
	params := CreateUserParams{
		ID:           user.ID,
		Email:        user.Email,
		PasswordHash: user.PasswordHash,
	}
	dbUser, err := a.q.CreateUser(ctx, params)
	if err != nil {
		return nil, err
	}
	// Convert DB -> Domain
	return &domain.User{
		ID:    dbUser.ID,
		Email: dbUser.Email,
	}, nil
}

func (a *PostgresAdapter) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	dbUser, err := a.q.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	return &domain.User{
		ID:           dbUser.ID,
		Email:        dbUser.Email,
		PasswordHash: dbUser.PasswordHash,
	}, nil
}

func (a *PostgresAdapter) CreateShareLink(ctx context.Context, userID uuid.UUID, slug string, expiresAt time.Time) error {
	params := CreateShareLinkParams{
		UserID:    userID,
		Slug:      slug,
		ExpiresAt: pgtype.Timestamptz{Time: expiresAt, Valid: true}, // This line is now valid!
	}

	// Note: The SQL returns a row, so use QueryRow or ignore the return if you just want error
	_, err := a.q.CreateShareLink(ctx, params)
	return err
}

// Trip Adapter
func (a *PostgresAdapter) CreateTrip(ctx context.Context, trip *domain.Trip) error {
    params := CreateTripParams{
        ID:        trip.ID,
        UserID:    trip.UserID,
        Name:      trip.Name,
        StartDate: trip.StartDate,
        EndDate:   trip.EndDate,
    }
    _, err := a.q.CreateTrip(ctx, params)
    return err
}

// Trip List
func (a *PostgresAdapter) listTrips(ctx context.Context, userID uuid.UUID) ([]*domain.Trip, error) {
	dbTrips, err := a.q.ListTrips(ctx. UserID)
	if err != nil{
		return nil, err
	}

	domainTrips := make([]*domain.Trip, len(dbTrips))

	for i, dbTrip := range dbTrips() {
		
	}
}
