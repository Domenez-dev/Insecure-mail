// Add these routes to your internal/routes/routes.go file

package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"github.com/domenez-dev/Insecure-mail/internal/config"
	"github.com/domenez-dev/Insecure-mail/internal/models"
)

func Register(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	// Existing health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Database connection test
	app.Get("/db/ping", func(c *fiber.Ctx) error {
		sqlDB, err := db.DB()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get database instance",
				"details": err.Error(),
			})
		}

		if err := sqlDB.Ping(); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Database ping failed",
				"details": err.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"status": "Database connection OK",
			"database": cfg.DBName,
		})
	})

	// Check if tables exist and their structure
	app.Get("/db/tables", func(c *fiber.Ctx) error {
		tables := []string{}

		// Get list of tables
		if err := db.Raw("SHOW TABLES").Scan(&tables).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to get tables",
				"details": err.Error(),
			})
		}

		// Check if our expected tables exist
		expectedTables := []string{"subscribers", "newsletters", "email_sents", "payments", "admin_users"}
		tableStatus := make(map[string]bool)

		for _, expected := range expectedTables {
			found := false
			for _, actual := range tables {
				if actual == expected {
					found = true
					break
				}
			}
			tableStatus[expected] = found
		}

		return c.JSON(fiber.Map{
			"all_tables": tables,
			"expected_tables_status": tableStatus,
		})
	})

	// Test GORM operations with a sample record
	app.Get("/db/test-operations", func(c *fiber.Ctx) error {
		// Test creating a subscriber
		testSubscriber := models.Subscriber{
			Email: "test@example.com",
			Name:  "Test User",
		}

		// Create
		if err := db.Create(&testSubscriber).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create test subscriber",
				"details": err.Error(),
			})
		}

		// Read
		var foundSubscriber models.Subscriber
		if err := db.First(&foundSubscriber, testSubscriber.ID).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to read test subscriber",
				"details": err.Error(),
			})
		}

		// Count total subscribers
		var count int64
		db.Model(&models.Subscriber{}).Count(&count)

		// Clean up - delete test record
		db.Delete(&testSubscriber)

		return c.JSON(fiber.Map{
			"status": "GORM operations successful",
			"test_record_created": testSubscriber.ID,
			"test_record_found": foundSubscriber.Email,
			"total_subscribers": count - 1, // -1 because we deleted the test record
		})
	})

	// Get database stats
	app.Get("/db/stats", func(c *fiber.Ctx) error {
		stats := make(map[string]int64)

		// Count records in each table using temporary variables
		var subscriberCount, newsletterCount, emailSentCount, paymentCount, adminUserCount int64

		db.Model(&models.Subscriber{}).Count(&subscriberCount)
		db.Model(&models.Newsletter{}).Count(&newsletterCount)
		db.Model(&models.EmailSent{}).Count(&emailSentCount)
		db.Model(&models.Payment{}).Count(&paymentCount)
		db.Model(&models.AdminUser{}).Count(&adminUserCount)

		stats["subscribers"] = subscriberCount
		stats["newsletters"] = newsletterCount
		stats["email_sents"] = emailSentCount
		stats["payments"] = paymentCount
		stats["admin_users"] = adminUserCount

		return c.JSON(fiber.Map{
			"record_counts": stats,
		})
	})
}
