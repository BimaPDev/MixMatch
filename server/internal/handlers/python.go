package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

type AIResponse struct {
	Category   string   `json:"category"`
	Color      string   `json:"color"`
	Confidence float64  `json:"confidence"`
	Weather    []string `json:"weather_suitability"`
}

// SendToPythonAI streams the file to your Python microservice
func SendToPythonAI(file multipart.File, filename string) (*AIResponse, error) {
	// 1. Prepare Buffer
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// 2. Create form field "file"
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, err
	}

	// 3. Copy file data
	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}
	writer.Close()

	// 4. Request to Python (Internal Docker DNS)
	// If running locally without docker, change to localhost:5000
	req, err := http.NewRequest("POST", "http://localhost:5000/internal/analyze", body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// 5. Execute
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("AI Service Unavailable: %v", err)
	}
	defer resp.Body.Close()

	// 6. Decode
	var aiResult AIResponse
	if err := json.NewDecoder(resp.Body).Decode(&aiResult); err != nil {
		return nil, err
	}

	return &aiResult, nil
}
