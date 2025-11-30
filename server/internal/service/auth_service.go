package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/BimaPDev/MixMatch/internal/core/domain"
	"github.com/BimaPDev/MixMatch/internal/core/port"
)

// Define the secret key for signing tokens (In production, use env var!)
var jwtSecret = []byte("super-secret-key-change-me")

type AuthService struct {
	repo port.UserRepository // We need a new interface for Users
}

func NewAuthService(repo port.UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

// 1. REGISTER
func (s *AuthService) Register(ctx context.Context, email, password string) (*domain.User, error) {
	// Hash the password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:           uuid.New(),
		Email:        email,
		PasswordHash: string(hashed),
	}

	return s.repo.CreateUser(ctx, user)
}

// 2. LOGIN
func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	// A. Find User
	user, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// B. Check Password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// C. Generate JWT Token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.String(),
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Expires in 3 days
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Method to check if the Token Is Valid
func (h *AuthService) ValidateToken(tokenString string) (uuid.UUID, error) {
	// Parsed the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected Signing Method")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return uuid.Nil, errors.New("Invalid Token")
	}

	// Extract the Claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			return uuid.Nil, errors.New("Invalid Token Claims")
		}
		return uuid.Parse(userIDStr)
	}
	return uuid.Nil, errors.New("Invalid Token")
}
