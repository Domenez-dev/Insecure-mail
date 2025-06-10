package routes

import (
    "github.com/gofiber/fiber/v2"
    "gorm.io/gorm"
    "github.com/domenez-dev/Insecure-mail/internal/config"
)

func Register(app *fiber.App, db *gorm.DB, cfg *config.Config) {
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok"})
    })
}
