package handlers

import (
	"github.com/domenez-dev/Insecure-mail/internal/config"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Health check handlers
func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}

func DbPing(db *gorm.DB, cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		sqlDB, err := db.DB()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get database instance",
			})
		}

		if err := sqlDB.Ping(); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Database ping failed",
			})
		}

		return c.JSON(fiber.Map{
			"status":   "Database connection OK",
			"database": cfg.DBName,
		})
	}
}

// Error handler
func NotFoundHandler(c *fiber.Ctx) error {
	return c.Status(404).Render("errors/404", fiber.Map{})
}
