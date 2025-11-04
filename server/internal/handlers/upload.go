package handlers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/BimaPDev/MixMatch/internal/storage"
	"github.com/disintegration/imaging"
)

type Item struct {
	ID        string    `json:"id"`
	URL       string    `json:"url"`
	ThumbURL  string    `json:"thumb_url"`
	CreatedAt time.Time `json:"created_at"`
}

type uploadB64Req struct{ PngBase64 string `json:"png_base64"` }

func UploadMultipart(mediaDir, removerURL string, store *storage.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost { http.Error(w, "method not allowed", 405); return }

		f, fh, err := r.FormFile("image")
		if err != nil { http.Error(w, "image required", 400); return }
		defer f.Close()

		var buf bytes.Buffer
		mw := multipart.NewWriter(&buf)
		part, _ := mw.CreateFormFile("image", fh.Filename)
		if _, err := io.Copy(part, f); err != nil { http.Error(w, "read error", 400); return }
		_ = mw.Close()

		resp, err := http.Post(removerURL, mw.FormDataContentType(), &buf)
		if err != nil || resp.StatusCode != 200 { http.Error(w, "remover error", 502); return }
		defer resp.Body.Close()
		png, _ := io.ReadAll(resp.Body)

		writeSaved(mediaDir, store, w, png)
	}
}

func UploadBase64(mediaDir string, store *storage.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost { http.Error(w, "method not allowed", 405); return }

		var req uploadB64Req
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.PngBase64 == "" {
			http.Error(w, "png_base64 required", 400); return
		}
		png, err := base64.StdEncoding.DecodeString(req.PngBase64)
		if err != nil { http.Error(w, "bad base64", 400); return }
		writeSaved(mediaDir, store, w, png)
	}
}

func writeSaved(mediaDir string, store *storage.Store, w http.ResponseWriter, png []byte) {
	id := time.Now().UTC().Format("20060102150405")
	full := filepath.Join(mediaDir, id+".png")
	thumb := filepath.Join(mediaDir, id+"_thumb.png")

	if err := os.WriteFile(full, png, 0o644); err != nil { http.Error(w, "save error", 500); return }

	img, err := imaging.Decode(bytes.NewReader(png))
	if err == nil {
		t := imaging.Fit(img, 512, 512, imaging.Lanczos)
		_ = imaging.Save(t, thumb)
	} else {
		_ = os.WriteFile(thumb, png, 0o644)
	}

	now := time.Now().UTC()
	if err := store.InsertItem(id, full, thumb, now); err != nil { http.Error(w, "db error", 500); return }

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(Item{
		ID:        id,
		URL:       "/media/" + id + ".png",
		ThumbURL:  "/media/" + id + "_thumb.png",
		CreatedAt: now,
	})
}
