package handler

import (
	"net/http"
	"strings"

	"github.com/BimaPDev/MixMatch/internal/service"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware creates the guard
func AuthMiddleware(authSvc *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Get the Header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		// 2. Parse "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid header format"})
			return
		}
		tokenString := parts[1]

		// 3. Verify with Service
		userID, err := authSvc.ValidateToken(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// 4. Set User ID in Context (So the next handler can use it!)
		c.Set("user_id", userID)

		// 5. Allow request to proceed
		c.Next()
	}
}
