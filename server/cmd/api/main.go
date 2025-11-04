package main

import (
	"log"
	"net"
	"net/http"
	"os"

	"github.com/joho/godotenv"

	"github.com/BimaPDev/MixMatch/internal/handlers"
	"github.com/BimaPDev/MixMatch/internal/storage"
)

func getenv(k, d string) string { if v := os.Getenv(k); v != "" { return v }; return d }

// find all non-loopback IPv4 addresses (Wi-Fi/Ethernet)
func lanIPs() []string {
	var out []string
	ifaces, _ := net.Interfaces()
	for _, iface := range ifaces {
		// Skip down or loopback interfaces
		if iface.Flags&net.FlagUp == 0 || iface.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, _ := iface.Addrs()
		for _, a := range addrs {
			var ip net.IP
			switch v := a.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}
			if ip == nil || ip.IsLoopback() {
				continue
			}
			ip = ip.To4()
			if ip == nil {
				continue // not IPv4
			}
			out = append(out, ip.String())
		}
	}
	return out
}

func main() {
	_ = godotenv.Load("server/.env")

	portNum := getenv("PORT", "8090") // keep raw number for printing
	addr := ":" + portNum             // serve on all interfaces

	media  := getenv("MEDIA_DIR", "./media")
	remove := getenv("PYTHON_REMOVER_URL", "http://127.0.0.1:8000/remove_bg")
	dbPath := getenv("DB_PATH", "./mixmatch.db")

	if err := os.MkdirAll(media, 0o755); err != nil { log.Fatal(err) }
	store, err := storage.Open(dbPath)
	if err != nil { log.Fatal(err) }

	mux := http.NewServeMux()
	mux.HandleFunc("/api/preview",        handlers.PreviewHandler(remove))                 // POST
	mux.HandleFunc("/api/upload",         handlers.UploadMultipart(media, remove, store))  // POST
	mux.HandleFunc("/api/upload_base64",  handlers.UploadBase64(media, store))             // POST
	mux.HandleFunc("/api/items",          handlers.ListHandler(store))                     // GET
	mux.HandleFunc("/api/items/",         handlers.DeleteHandler(media, store))            // DELETE /api/items/{id}
	mux.Handle("/media/", http.StripPrefix("/media/", http.FileServer(http.Dir(media))))

	// Pretty startup banner with URLs
	log.Println("────────────────────────────────────────────")
	log.Printf("MixMatch API listening on port %s\n", portNum)
	log.Printf("Local:    http://localhost:%s\n", portNum)
	for _, ip := range lanIPs() {
		log.Printf("On LAN:  http://%s:%s\n", ip, portNum)
	}
	log.Println("Endpoints:")
	log.Printf("  GET  /api/items\n  POST /api/preview\n  POST /api/upload\n  POST /api/upload_base64\n  DEL  /api/items/{id}\n")
	log.Println("────────────────────────────────────────────")

	// simple access logger
	logged := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		mux.ServeHTTP(w, r)
	})

	log.Fatal(http.ListenAndServe(addr, logged))
}
