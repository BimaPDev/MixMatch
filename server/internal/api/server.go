package api

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/BimaPDev/MixMatch/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewRouter(h *handlers.Handler) http.Handler {
	r := chi.NewRouter()

	// 1. Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// 2. Health Check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("MixMatch API is running!"))
	})

	// 3. API Routes
	r.Post("/signup", h.CreateUser)
	r.Post("/upload", h.UploadClothing)
	r.Get("/items", h.ListItems) // <--- New Route

	// 4. Serve Static Images (CRITICAL FOR WARDROBE)
	// This allows http://IP:8080/media/uploads/shirt.jpg to work
	workDir, _ := os.Getwd()
	filesDir := filepath.Join(workDir, "media")
	FileServer(r, "/media", http.Dir(filesDir))

	return r
}

// FileServer conveniently sets up a http.FileServer handler
func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
