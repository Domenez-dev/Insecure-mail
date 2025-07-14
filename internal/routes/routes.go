package routes

import (
	"github.com/domenez-dev/Insecure-mail/internal/config"
	"github.com/domenez-dev/Insecure-mail/internal/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/ansrivas/fiberprometheus/v2"
	"gorm.io/gorm"
)

func Register(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	// Prometheus Metrics
	prometheus := fiberprometheus.New("insecure-mail")
	prometheus.RegisterAt(app, "/metrics")
	app.Use(prometheus.Middleware)


	// Health checks
	app.Get("/health", handlers.HealthCheck)
	app.Get("/db/ping", handlers.DbPing(db, cfg))

	// Public routes
	public := app.Group("/")
	{
		public.Get("/", handlers.HomePage)
		public.Get("/about", handlers.AboutPage)
		public.Get("/login", handlers.LoginPage)

		// registration routes
		public.Get("/register", handlers.RegisterPage)
		public.Post("/register/send-otp", handlers.SendOTP)
		public.Post("/register/verify", handlers.VerifyAndRegister)

		public.Get("/confirmation", handlers.ConfirmationPage)
		public.Get("/unsubscribe", handlers.UnsubscribePage)
	}

	// Subscriber routes (authenticated)
	subscriber := app.Group("/subscriber")
	{
		subscriber.Get("/dashboard", handlers.SubscriberDashboard)
		subscriber.Get("/emails", handlers.SubscriberEmails)
		subscriber.Get("/emails/:id", handlers.SubscriberEmailView)
		subscriber.Get("/account", handlers.SubscriberAccount)
		subscriber.Get("/plans", handlers.SubscriberPlans)
		subscriber.Get("/payment", handlers.SubscriberPayment)
		subscriber.Get("/payment/success", handlers.SubscriberPaymentSuccess)
	}

	// Admin routes (authenticated)
	admin := app.Group("/admin")
	{
		admin.Get("/dashboard", handlers.AdminDashboard)
		admin.Get("/subscribers", handlers.AdminSubscribers)
		admin.Get("/subscribers/:id", handlers.AdminSubscriberDetail)
		admin.Get("/newsletters", handlers.AdminNewsletters)
		admin.Get("/newsletters/new", handlers.AdminNewsletterCreate)
		admin.Get("/newsletters/preview", handlers.AdminNewsletterPreview)
		admin.Get("/logs", handlers.AdminSendLogs)
		admin.Get("/payments", handlers.AdminPayments)
	}

	// Error handlers
	app.Use(handlers.NotFoundHandler)
}
