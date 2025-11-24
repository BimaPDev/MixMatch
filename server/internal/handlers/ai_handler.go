package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AnalyzeItem handles the image upload and talks to Python
func (h *Handler) AnalyzeItem(ctx *gin.Context) {
	// 1. Get file from Request
	fileHeader, err := ctx.FormFile("image")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	// 2. Open the file stream
	file, err := fileHeader.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to open file"})
		return
	}
	defer file.Close()

	// 3. Call the Service Layer (Python Bridge)
	// We pass the filename so Python knows the extension (jpg/png)
	aiResult, err := service.SendToPythonAI(file, fileHeader.Filename)
	if err != nil {
		// If Python is down or errors out
		ctx.JSON(http.StatusBadGateway, gin.H{"error": "AI Service Error: " + err.Error()})
		return
	}

	// 4. Return the Analysis to React Native
	// React Native will use this data to pre-fill the "Add Item" form
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    aiResult,
	})
}
