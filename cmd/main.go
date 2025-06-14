package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"

	"github.com/domenez-dev/Insecure-mail/internal/config"
	"github.com/domenez-dev/Insecure-mail/internal/database"
	"github.com/domenez-dev/Insecure-mail/internal/routes"
	"github.com/domenez-dev/Insecure-mail/internal/services"
)

func main() {
	// Load env vars
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system envs")
	}

	// Initialize config, DB, and Mailgun
	cfg := config.LoadConfig()
	db := database.InitDB(cfg)
	services.InitGmail()

	// Start scheduler
	services.StartScheduler(db)

	// Initialize HTML templates
	engine := html.New("./web/templates", ".html")

	// Start Fiber app with template engine
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Static files
	app.Static("/static", "./web/static")

	// Register routes
	routes.Register(app, db, cfg)

	// Start server
	port := cfg.Port
	if port == "" {
		port = "3000"
	}
	log.Fatal(app.Listen(":" + port))
}
