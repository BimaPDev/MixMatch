package services

import (
	"bytes"
	"encoding/json"
	"io"
	"mime/multipart"
	"net/http"
)

// SendToPythonService takes a file and sends it to your running Python app
func SendToPythonService(filename string, fileData io.Reader) (map[string]interface{}, error) {
	// 1. Create a buffer to hold the multipart form data
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// 2. Create the "file" field in the form
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return nil, err
	}
	// Copy the file data into the form field
	_, err = io.Copy(part, fileData)
	if err != nil {
		return nil, err
	}
	writer.Close() // Close writer to finalize the boundary

	// 3. Create the Request to Python (Running on port 5000)
	req, err := http.NewRequest("POST", "http://localhost:5001/analyze-clothing", body)
	if err != nil {
		return nil, err
	}
	// Important: Set the Content-Type to multipart/form-data with the boundary
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// 4. Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// 5. Decode the JSON response from Python
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
