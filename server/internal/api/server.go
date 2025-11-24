package api

import (
	"github.com/BimaPDev/MixMatch/db"
	"github.com/BimaPDev/MixMatch/internal/handlers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
}

func NewServer(store *db.Queries) *Server {
	h := handlers.NewHandler(store)
	router := gin.Default()

	// --- 1. Add CORS Middleware (CRITICAL for React Native) ---
	// This allows your app to upload files without "Network Error"
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	router.Use(cors.New(config))

	// --- User Routes ---
	router.POST("/users", h.CreateUser)
	router.GET("/users/:id", h.GetUser)

	// --- Item Routes ---
	router.POST("/items", h.CreateItem)
	router.GET("/items", h.ListItems)

	// --- 2. Add The AI Route ---
	// This matches the React Native call: api.analyzeItem()
	router.POST("/wardrobe/analyze", h.AnalyzeItem)

	return &Server{router: router}
}

func (s *Server) Start(address string) error {
	return s.router.Run(address)
}
