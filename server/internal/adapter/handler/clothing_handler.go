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

// DTO (Data Transfer Object) - Defines what the user MUST send
type uploadRequest struct {
	UserID   string `json:"user_id" binding:"required,uuid"`
	ImageURL string `json:"image_url" binding:"required,url"`
	Category string `json:"category" binding:"required"`
}

// POST /upload
//func (h *ClothingHandler) UploadItem(c *gin.Context) {
//	var req uploadRequest
//
//	// 1. Validation (Gin checks if it's a valid UUID and URL automatically)
//	if err := c.ShouldBindJSON(&req); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//
//	// 2. Call the Service
//	// We parse the UUID string to a real UUID object
//	uid, _ := uuid.Parse(req.UserID)
//
//	item, err := h.svc.UploadItem(c.Request.Context(), uid, req.ImageURL, req.Category)
//	if err != nil {
//		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//		return
//	}
//
//	// 3. Return Success
//	c.JSON(http.StatusCreated, item)
//}

// POST /upload
func (h *ClothingHandler) UploadItem(c *gin.Context) {
	// 1. Parse Fields
	userIDStr := c.PostForm("user_id")
	category := c.PostForm("category")

	if userIDStr == "" || category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id and category are required"})
		return
	}

	uid, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id format"})
		return
	}

	// 2. Receive File
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image file is required"})
		return
	}

	// 3. Prepare the Folder Path: ./uploads/{userID}/
	// We use userIDStr to create a unique folder for this user
	uploadDir := filepath.Join("uploads", userIDStr)

	// Create the directory if it doesn't exist
	// 0755 means "Read/Write/Execute for owner, Read/Execute for others"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user directory"})
		return
	}

	// 4. Save the File
	filename := uuid.New().String() + ".jpg"
	savePath := filepath.Join(uploadDir, filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	// 5. Generate the URL
	// Since we mapped /static -> ./uploads in main.go,
	// the URL structure matches the folder structure.
	// URL: http://host.../static/{userID}/{filename}
	fileURL := "http://host.docker.internal:8080/static/" + userIDStr + "/" + filename

	// 6. Call Service
	item, err := h.svc.UploadItem(c.Request.Context(), uid, fileURL, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, item)
}

// GET /wardrobe?user_id=...
func (h *ClothingHandler) GetWardrobe(c *gin.Context) {
	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id query parameter is required"})
		return
	}

	uid, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id format"})
		return
	}

	items, err := h.svc.GetWardrobe(c.Request.Context(), uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, items)
}
