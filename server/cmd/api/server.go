package main

import (
	"context"
	"log"
	"net/http"

	"github.com/BimaPDev/MixMatch/internal/adapter/handler"
	"github.com/BimaPDev/MixMatch/internal/adapter/repository"
	"github.com/BimaPDev/MixMatch/internal/service"
	"github.com/BimaPDev/MixMatch/queue"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Server struct {
	router *gin.Engine
	http   *http.Server
	db     *pgxpool.Pool
	mq     *queue.RabbitMQAdapter
}

// NewServer initializes all dependencies
func NewServer() *Server {
	// 1. Config (Ideally load from env vars here)
	dbURL := "postgres://user:password@127.0.0.1:5433/MixMatch?sslmode=disable"
	amqpURL := "amqp://user:password@127.0.0.1:5672/"

	// 2. Setup Infrastructure
	dbPool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}

	mqAdapter, err := queue.NewRabbitMQAdapter(amqpURL)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	// 3. Setup Layers
	repoAdapter := repository.NewPostgresAdapter(dbPool)

	clothingService := service.NewClothingService(repoAdapter, mqAdapter)
	authService := service.NewAuthService(repoAdapter)

	clothingHandler := handler.NewClothingHandler(clothingService)
	authHandler := handler.NewAuthHandler(authService)

	shareService := service.NewShareService(repoAdapter)
	shareHandler := handler.NewShareHandler(shareService)

	// 4. Setup Router
	r := gin.Default()
	r.Static("/static", "./uploads")

	// Public Routes
	r.POST("/register", authHandler.Register)
	r.POST("/login", authHandler.Login)

	// Protected Routes
	protected := r.Group("/")
	protected.Use(handler.AuthMiddleware(authService))
	{
		protected.POST("/upload", clothingHandler.UploadItem)
		protected.GET("/wardrobe", clothingHandler.GetWardrobe)
	}
	protected.POST("/share/generate", shareHandler.GenerateLink)

	return &Server{
		router: r,
		db:     dbPool,
		mq:     mqAdapter,
		http: &http.Server{
			Addr:    ":8080",
			Handler: r,
		},
	}
}

// Run starts the HTTP server in a goroutine
func (s *Server) Run() {
	go func() {
		if err := s.http.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()
	log.Println("Server started on :8080")
}

// Shutdown cleans up resources
func (s *Server) Shutdown(ctx context.Context) error {
	// Close DB and MQ connections first
	s.db.Close()
	s.mq.Close()

	// Then stop HTTP
	return s.http.Shutdown(ctx)
}
