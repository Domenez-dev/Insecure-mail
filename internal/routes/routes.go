package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"github.com/domenez-dev/Insecure-mail/internal/config"
)

func Register(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	// Health checks
	app.Get("/health", healthCheck)
	app.Get("/db/ping", dbPing(db, cfg))

	// Public routes
	public := app.Group("/")
	{
		public.Get("/", homePage)
		public.Get("/about", aboutPage)
		public.Get("/login", loginPage)
		public.Get("/register", registerPage)
		public.Get("/confirmation", confirmationPage)
		public.Get("/unsubscribe", unsubscribePage)
	}

	// Subscriber routes (authenticated)
	subscriber := app.Group("/subscriber")
	{
		subscriber.Get("/dashboard", subscriberDashboard)
		subscriber.Get("/emails", subscriberEmails)
		subscriber.Get("/emails/:id", subscriberEmailView)
		subscriber.Get("/account", subscriberAccount)
		subscriber.Get("/plans", subscriberPlans)
		subscriber.Get("/payment", subscriberPayment)
		subscriber.Get("/payment/success", subscriberPaymentSuccess)
	}

	// Admin routes (authenticated)
	admin := app.Group("/admin")
	{
		admin.Get("/dashboard", adminDashboard)
		admin.Get("/subscribers", adminSubscribers)
		admin.Get("/subscribers/:id", adminSubscriberDetail)
		admin.Get("/newsletters", adminNewsletters)
		admin.Get("/newsletters/new", adminNewsletterCreate)
		admin.Get("/newsletters/preview", adminNewsletterPreview)
		admin.Get("/logs", adminSendLogs)
		admin.Get("/payments", adminPayments)
	}

	// Error handlers
	app.Use(notFoundHandler)
}

// Health check handlers
func healthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}

func dbPing(db *gorm.DB, cfg *config.Config) fiber.Handler {
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
			"status": "Database connection OK",
			"database": cfg.DBName,
		})
	}
}

// Public page handlers
func homePage(c *fiber.Ctx) error {
    return c.Render("index", fiber.Map{
        "CurrentPath": c.Path(),
        "CurrentYear": time.Now().Year(),
        // Add other data as needed
    })
}

func aboutPage(c *fiber.Ctx) error {
	return c.Render("about", fiber.Map{})
}

func loginPage(c *fiber.Ctx) error {
	return c.Render("login", fiber.Map{})
}

func registerPage(c *fiber.Ctx) error {
	return c.Render("register", fiber.Map{})
}

func confirmationPage(c *fiber.Ctx) error {
	return c.Render("confirmation", fiber.Map{})
}

func unsubscribePage(c *fiber.Ctx) error {
	return c.Render("unsubscribe", fiber.Map{})
}

// Subscriber page handlers
func subscriberDashboard(c *fiber.Ctx) error {
	return c.Render("subscriber/dashboard", fiber.Map{})
}

func subscriberEmails(c *fiber.Ctx) error {
	return c.Render("subscriber/emails", fiber.Map{})
}

func subscriberEmailView(c *fiber.Ctx) error {
	return c.Render("subscriber/email_view", fiber.Map{
		"ID": c.Params("id"),
	})
}

func subscriberAccount(c *fiber.Ctx) error {
	return c.Render("subscriber/account", fiber.Map{})
}

func subscriberPlans(c *fiber.Ctx) error {
	return c.Render("subscriber/plans", fiber.Map{})
}

func subscriberPayment(c *fiber.Ctx) error {
	return c.Render("subscriber/payment", fiber.Map{})
}

func subscriberPaymentSuccess(c *fiber.Ctx) error {
	return c.Render("subscriber/payment_success", fiber.Map{})
}

// Admin page handlers
func adminDashboard(c *fiber.Ctx) error {
	return c.Render("admin/dashboard", fiber.Map{})
}

func adminSubscribers(c *fiber.Ctx) error {
	return c.Render("admin/subscribers", fiber.Map{})
}

func adminSubscriberDetail(c *fiber.Ctx) error {
	return c.Render("admin/subscriber_detail", fiber.Map{
		"ID": c.Params("id"),
	})
}

func adminNewsletters(c *fiber.Ctx) error {
	return c.Render("admin/newsletters", fiber.Map{})
}

func adminNewsletterCreate(c *fiber.Ctx) error {
	return c.Render("admin/newsletter_create", fiber.Map{})
}

func adminNewsletterPreview(c *fiber.Ctx) error {
	return c.Render("admin/newsletter_preview", fiber.Map{})
}

func adminSendLogs(c *fiber.Ctx) error {
	return c.Render("admin/send_logs", fiber.Map{})
}

func adminPayments(c *fiber.Ctx) error {
	return c.Render("admin/payments", fiber.Map{})
}

// Error handler
func notFoundHandler(c *fiber.Ctx) error {
	return c.Status(404).Render("errors/404", fiber.Map{})
}
