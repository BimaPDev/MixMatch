package service

import (
	"context"
	"time"

	"github.com/BimaPDev/MixMatch/internal/core/domain"
	"github.com/BimaPDev/MixMatch/internal/core/port"
	"github.com/google/uuid"
)

type ClothingService struct {
	repo  port.ClothingRepository
	queue port.AIQueue
}

// Constructor (Dependency Injection)
func NewClothingService(repo port.ClothingRepository, queue port.AIQueue) *ClothingService {
	return &ClothingService{
		repo:  repo,
		queue: queue,
	}
}

// UploadItem handles the entire flow of adding a new piece of clothing
func (s *ClothingService) UploadItem(ctx context.Context, userID uuid.UUID, imageURL string, category string) (*domain.ClothingItem, error) {
	// 1. Prepare the Domain Object
	item := &domain.ClothingItem{
		ID:               uuid.New(),
		UserID:           userID,
		ImageURL:         imageURL,
		Category:         category,
		ProcessingStatus: "pending",
		CreatedAt:        time.Now(),
	}

	// 2. Save to Database (using the Interface)
	err := s.repo.CreateItem(ctx, item)
	if err != nil {
		return nil, err
	}

	// 3. Send to RabbitMQ (Fire and Forget logic, or handle error depending on strictness)
	// If Queue fails, do we fail the request? Or just log it?
	// For now, let's return an error so the user knows something went wrong.
	err = s.queue.PublishImageJob(ctx, item.ID, item.ImageURL)
	if err != nil {
		// potential rollback logic could go here
		return nil, err
	}

	return item, nil
}
