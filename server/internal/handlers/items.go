package handlers

import (
	"encoding/json"
	"net/http"
	// Adjust import path if needed
)

// ListItems returns the most recent 20 items
func (h *Handler) ListItems(w http.ResponseWriter, r *http.Request) {
	items, err := h.queries.ListItems(r.Context())
	if err != nil {
		http.Error(w, "Failed to fetch items", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}
