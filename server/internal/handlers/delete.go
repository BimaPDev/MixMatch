package handlers

import (
	"net/http"
	"os"
	"strings"

	"github.com/BimaPDev/MixMatch/internal/storage"
)

func DeleteHandler(mediaDir string, store *storage.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete { http.Error(w, "method not allowed", 405); return }

		id := strings.TrimPrefix(r.URL.Path, "/api/items/")
		it, err := store.GetItem(id)
		if err != nil { http.Error(w, "not found", 404); return }

		_ = os.Remove(it.FilePath)
		_ = os.Remove(it.ThumbPath)
		_ = store.DeleteItem(id)

		w.WriteHeader(204)
	}
}
