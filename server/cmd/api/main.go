package main

import (
	"context"
	"log"
	"net/http"

	// External Libraries
	"github.com/jackc/pgx/v5/pgxpool"

	// Internal Modules
	"github.com/BimaPDev/MixMatch/db"
	"github.com/BimaPDev/MixMatch/internal/api" // <--- Imports the file we created in Step 1
	"github.com/BimaPDev/MixMatch/internal/handlers"
)

func main() {
	// 1. Connect to Postgres (Port 5433)
	dbSource := "postgresql://root:secret@localhost:5433/mixmatch?sslmode=disable"

	pool, err := pgxpool.New(context.Background(), dbSource)
	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}
	defer pool.Close()
	log.Println("Connected to PostgreSQL on port 5433!")

	// 2. Setup Database Store
	store := db.New(pool)

	// 3. Setup Handlers
	h := handlers.NewHandler(store)

	// 4. Setup Router
	// We call the function from the "api" package we imported
	r := api.NewRouter(h)

	// 5. Start Server
	log.Println("Server running on port 8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
