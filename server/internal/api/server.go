package api

import (
	"net/http"

	"github.com/BimaPDev/MixMatch/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// NewRouter initializes the HTTP router
func NewRouter(h *handlers.Handler) http.Handler {
	r := chi.NewRouter()

	// Global Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Health Check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("MixMatch API is running!"))
	})

	// Register Routes
	r.Post("/signup", h.CreateUser)
	r.Post("/upload", h.UploadClothing)

	return r
}
