package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"

	"github.com/BimaPDev/MixMatch/db"
	"github.com/BimaPDev/MixMatch/internal/services"
)

// Handler struct needs access to the SQLC queries
type Handler struct {
	queries *db.Queries
}

// NewHandler creates a new instance of the handler with database access
func NewHandler(q *db.Queries) *Handler {
	return &Handler{queries: q}
}

// UploadClothing handles the full flow: Upload -> AI Analyze -> Save to Disk -> Save to DB
func (h *Handler) UploadClothing(w http.ResponseWriter, r *http.Request) {
	// 1. Parse Multipart Form (Max 10MB)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "File too large", http.StatusBadRequest)
		return
	}

	// 2. Retrieve the file from the form data
	file, header, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// ---------------------------------------------------------
	// STEP 3: Call the Python "Specialist" Service
	// ---------------------------------------------------------
	// We pass the file to the AI service first.
	// Note: This reads the file stream to the end.
	fmt.Println("Sending to Python for analysis...")
	aiResult, err := services.SendToPythonService(header.Filename, file)

	// Prepare default values in case AI fails
	category := "Unknown"
	color := "Unknown"
	confidence := 0.0

	if err != nil {
		// We don't stop the upload if AI fails, we just log it and use defaults
		fmt.Printf("AI Service Warning: %v\n", err)
	} else {
		// Safely extract data from the JSON map
		if cat, ok := aiResult["category"].(string); ok {
			category = cat
		}
		if col, ok := aiResult["color"].(string); ok {
			color = col
		}
		// JSON numbers often come in as float64
		if conf, ok := aiResult["confidence"].(float64); ok {
			confidence = conf
		}
	}

	// ---------------------------------------------------------
	// STEP 4: Save File to Local Disk
	// ---------------------------------------------------------
	// Since we read the file to send it to Python, we must reset the pointer to the start
	file.Seek(0, 0)

	// Generate a unique ID for the filename to prevent overwrites
	fileExt := filepath.Ext(header.Filename)
	uniqueFileName := uuid.New().String() + fileExt

	// Define storage path (server/media/uploads)
	storagePath := filepath.Join("media", "uploads", uniqueFileName)

	// Ensure the directory exists
	if err := os.MkdirAll(filepath.Dir(storagePath), os.ModePerm); err != nil {
		http.Error(w, "Server storage error", http.StatusInternalServerError)
		return
	}

	// Create the empty file on disk
	dst, err := os.Create(storagePath)
	if err != nil {
		http.Error(w, "Unable to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file data to the disk file
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	// ---------------------------------------------------------
	// STEP 5: Save Metadata to Database
	// ---------------------------------------------------------
	// We use the SQLC generated method "CreateItem"
	newItem, err := h.queries.CreateItem(r.Context(), db.CreateItemParams{
		ID:         uuid.New(),
		UserID:     "user_placeholder_123", // TODO: Get this from your Auth middleware
		ImageUrl:   storagePath,            // Or the URL: "http://localhost:8080/media/..."
		Category:   category,
		Color:      color,
		Confidence: confidence, // Ensure you ran the migration from the previous step!
	})

	if err != nil {
		fmt.Printf("Database Error: %v\n", err)
		http.Error(w, "Failed to save to database", http.StatusInternalServerError)
		return
	}

	// ---------------------------------------------------------
	// STEP 6: Return Success JSON
	// ---------------------------------------------------------
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newItem)
}
