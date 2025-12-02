package service

import (
	"context"
	"time"

	"github.com/BimaPDev/MixMatch/internal/core/port"
	"github.com/google/uuid"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type ShareService struct {
	repo port.ShareRepository
}

func NewShareService(repo port.ShareRepository) *ShareService {
	return &ShareService{repo: repo}
}

func (s *ShareService) CreateShareLink(ctx context.Context, userID uuid.UUID) (string, error) {
	// 1. Generate a short, unique 6-character code (e.g., "xY8z2A")
	slug, err := gonanoid.New(6)
	if err != nil {
		return "", err
	}

	// 2. Save it to DB
	expiresAt := time.Now().Add(24 * time.Hour)
	err = s.repo.CreateShareLink(ctx, userID, slug, expiresAt)
	if err != nil {
		return "", err
	}

	return slug, nil
}
