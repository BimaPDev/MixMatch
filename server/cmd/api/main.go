package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	// UPDATE THESE PATHS to match your go.mod name
	"github.com/BimaPDev/MixMatch/internal/adapter/handler"
	"github.com/BimaPDev/MixMatch/internal/adapter/repository"
	"github.com/BimaPDev/MixMatch/internal/service"
	"github.com/BimaPDev/MixMatch/queue"
)

func main() {
	// 1. Setup Database
	dbURL := "postgres://user:password@127.0.0.1:5433/MixMatch?sslmode=disable"
	dbPool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbPool.Close()

	// 2. Setup RabbitMQ
	amqpURL := "amqp://user:password@127.0.0.1:5672/"
	mqAdapter, err := queue.NewRabbitMQAdapter(amqpURL)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer mqAdapter.Close()

	// 3. Setup Core Layers (Repo -> Service -> Handler)
	repoAdapter := repository.NewPostgresAdapter(dbPool)
	clothingService := service.NewClothingService(repoAdapter, mqAdapter)
	clothingHandler := handler.NewClothingHandler(clothingService)

	// 4. Setup Router
	r := gin.Default()
	r.Static("/static", "./uploads")

	// Routes
	r.POST("/upload", clothingHandler.UploadItem)
	r.GET("/wardrobe", clothingHandler.GetWardrobe)

	// 5. Graceful Shutdown (Professional touch)
	// This ensures requests finish before the server kills them
	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	log.Println("Server started on :8080")

	// Wait for interrupt signal (CTRL+C)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exiting")
}
