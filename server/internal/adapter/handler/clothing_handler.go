package handler

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/BimaPDev/MixMatch/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ClothingHandler struct {
	svc *service.ClothingService
}

// Constructor
func NewClothingHandler(svc *service.ClothingService) *ClothingHandler {
	return &ClothingHandler{
		svc: svc,
	}
}

// POST /upload
func (h *ClothingHandler) UploadItem(c *gin.Context) {
	// 1. Get User ID from Context (Set by Middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	// 2. Parse Category (Still from form)
	category := c.PostForm("category")
	if category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "category is required"})
		return
	}

	// 3. Receive File
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image file is required"})
		return
	}

	// 4. Prepare the Folder Path: ./uploads/{userID}/
	userIDStr := uid.String()
	uploadDir := filepath.Join("uploads", userIDStr)

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user directory"})
		return
	}

	// 5. Save the File
	filename := uuid.New().String() + ".jpg"
	savePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	// 6. Generate the URL
	// URL: http://host.../static/{userID}/{filename}
	fileURL := "http://host.docker.internal:8080/static/" + userIDStr + "/" + filename

	// 7. Call Service
	item, err := h.svc.UploadItem(c.Request.Context(), uid, fileURL, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, item)
}

// GET /wardrobe
func (h *ClothingHandler) GetWardrobe(c *gin.Context) {
	// 1. Get User ID from Context (Set by Middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	uid, ok := userID.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	// 2. Call Service
	items, err := h.svc.GetWardrobe(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}
