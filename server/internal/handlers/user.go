package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/BimaPDev/MixMatch/db"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	user, err := h.queries.CreateUser(r.Context(), db.CreateUserParams{
		ID:           uuid.New(), // Use uuid.New() for Postgres
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
	})

	if err != nil {
		http.Error(w, "Failed to create user", http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
