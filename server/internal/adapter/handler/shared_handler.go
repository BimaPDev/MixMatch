package handler

import (
	"net/http"

	"github.com/BimaPDev/MixMatch/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ShareHandler struct {
	svc *service.ShareService
}

func NewShareHandler(svc *service.ShareService) *ShareHandler {
	return &ShareHandler{svc: svc}
}

func (h *ShareHandler) GenerateLink(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
	}

	slug, err := h.svc.CreateShareLink(c.Request.Context(), userID.(uuid.UUID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate link"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"share_url": "mixmatch://share/" + slug,
		"web_url":   "https://mixmatch.app/s/" + slug,
	})
}
