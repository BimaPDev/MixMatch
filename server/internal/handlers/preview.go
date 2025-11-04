package handlers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
)

type PreviewResp struct{ PngBase64 string `json:"png_base64"` }

func PreviewHandler(removerURL string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions { w.WriteHeader(204); return }
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
		pngBytes, _ := io.ReadAll(resp.Body)

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(PreviewResp{
			PngBase64: base64.StdEncoding.EncodeToString(pngBytes),
		})
	}
}
