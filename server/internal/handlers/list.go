package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/BimaPDev/MixMatch/internal/storage"
)

func ListHandler(store *storage.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet { http.Error(w, "method not allowed", 405); return }

		limit := atoiDefault(r.URL.Query().Get("limit"), 60)
		offset := atoiDefault(r.URL.Query().Get("offset"), 0)

		// Try DB first
		recs, err := store.ListItems(limit, offset)
		if err == nil {
			out := make([]Item, 0, len(recs))
			for _, it := range recs {
				out = append(out, Item{
					ID:        it.ID,
					URL:       "/media/" + it.ID + ".png",
					ThumbURL:  "/media/" + it.ID + "_thumb.png",
					CreatedAt: it.CreatedAt,
				})
			}
			w.Header().Set("Content-Type", "application/json")
			_ = json.NewEncoder(w).Encode(out)
			return
		}

		// Fallback: no DB? Build list from filesystem (thumbs define items)
		items := make([]Item, 0, 60)
		entries, fsErr := os.ReadDir("./media")
		if fsErr == nil {
			for _, e := range entries {
				name := e.Name()
				if strings.HasSuffix(name, "_thumb.png") {
					id := strings.TrimSuffix(name, "_thumb.png")
					items = append(items, Item{
						ID:       id,
						URL:      "/media/" + id + ".png",
						ThumbURL: "/media/" + name,
						// CreatedAt omitted in fs mode
					})
					if len(items) >= limit { break }
				}
			}
		}

		// Always return JSON (even if empty) so the app never crashes
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(items)
	}
}

func atoiDefault(s string, d int) int {
	n, err := strconv.Atoi(s)
	if err != nil { return d }
	return n
}
