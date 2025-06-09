package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"

	"github.com/Domenez-dev/Insecure-mail/internal/config"
	"github.com/Domenez-dev/Insecure-mail/internal/database"
	"github.com/Domenez-dev/Insecure-mail/internal/routes"
	"github.com/Domenez-dev/Insecure-mail/internal/services"
)

func main() {
	// Load env vars
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system envs")
	}

	// Initialize config, DB, and Mailgun
	cfg := config.LoadConfig()
	db := database.InitDB(cfg)
	services.InitMailgun(cfg)

	// Start scheduler
	services.StartScheduler(db)

	// Start Fiber app
	app := fiber.New()

	// Static files and templates
	app.Static("/static", "./web/static")
	app.Static("/admin", "./web/templates/admin.html") // Serve admin manually if needed
	app.Static("/", "./web/templates/index.html")       // For frontend landing

	// Register routes
	routes.Register(app, db, cfg)

	// Start server
	port := cfg.Port
	if port == "" {
		port = "3000"
	}
	log.Fatal(app.Listen(":" + port))
}
