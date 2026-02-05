//go:build !wasm && !js

package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	port := "8080"

	// Servir archivos estáticos desde /static/
	fs := http.FileServer(http.Dir("."))
	http.Handle("/static/", fs)

	// Servir presentation.html en la raíz
	http.HandleFunc("/presentation.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "presentation.html")
	})

	// Servir index.html desde templates/ en la raíz
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "templates/index.html")
		} else {
			http.NotFound(w, r)
		}
	})

	fmt.Printf("🚀 Servidor corriendo en http://localhost:%s\n", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
